/**
 * POST /api/cancel-order
 * Body: { orderId: string }
 * Header: Authorization: Bearer <supabase-access-token>
 *
 * Cancels a pre-order:
 *  - Deposit orders (one-off/subscription with £10 deposit): issues a full
 *    Stripe refund on the matching payment intent
 *  - Subscription orders (trial, no charge yet): cancels the Stripe subscription
 * Updates the pre_orders row to status='cancelled' and sends confirmation email.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripe';

const FROM = 'NECTA Labs <hello@nectalabs.com>';
const RESEND_API = 'https://api.resend.com';
const NOTIFY_EMAIL = 'hello@nectalabs.com';

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  await fetch(`${RESEND_API}/emails`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  }).catch(() => {});
}

export async function POST(req: NextRequest) {
  // ── 1. Authenticate ──────────────────────────────────────────────────────
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.slice(7);
  const { data: { user }, error: authError } = await adminClient().auth.getUser(token);
  if (authError || !user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userEmail = user.email;

  // ── 2. Find the order ────────────────────────────────────────────────────
  const { orderId } = await req.json() as { orderId?: string };
  if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });

  const db = adminClient();
  const { data: order, error: orderError } = await db
    .from('pre_orders')
    .select('*')
    .eq('id', orderId)
    .eq('email', userEmail) // security: only own orders
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  if (order.status === 'cancelled') {
    return NextResponse.json({ error: 'Order already cancelled' }, { status: 400 });
  }
  if (order.status === 'dispatched') {
    return NextResponse.json({ error: 'Order already dispatched — contact hello@nectalabs.com' }, { status: 400 });
  }

  const isSubscription = (order.format as string | null)?.startsWith('subscription') ?? false;
  const orderCreatedAt = new Date(order.created_at).getTime();

  // ── 3. Process Stripe cancellation / refund ──────────────────────────────
  let stripeAction = 'none';
  let refundAmount = 0;

  try {
    const customers = await stripe.customers.list({ email: userEmail, limit: 5 });
    if (customers.data.length > 0) {
      const customerId = customers.data[0].id;

      if (isSubscription) {
        // Cancel any trial subscriptions for this customer
        const subs = await stripe.subscriptions.list({ customer: customerId, status: 'trialing', limit: 10 });
        for (const sub of subs.data) {
          await stripe.subscriptions.cancel(sub.id);
          stripeAction = 'subscription_cancelled';
          console.log('[cancel-order] cancelled subscription:', sub.id);
        }
      }

      // Refund the £10 deposit if one exists (deposit checkout OR subscribe-with-deposit)
      const paymentIntents = await stripe.paymentIntents.list({ customer: customerId, limit: 20 });
      // Find a £10 succeeded PI created within 10 minutes of the order
      const depositPi = paymentIntents.data.find((pi) => {
        const piCreated = pi.created * 1000;
        const withinWindow = Math.abs(piCreated - orderCreatedAt) < 10 * 60 * 1000;
        return pi.status === 'succeeded' && pi.amount === 1000 && withinWindow;
      });

      if (depositPi) {
        // Check not already refunded
        const existingRefunds = await stripe.refunds.list({ payment_intent: depositPi.id, limit: 1 });
        if (existingRefunds.data.length === 0) {
          await stripe.refunds.create({ payment_intent: depositPi.id });
          refundAmount = 10;
          stripeAction = stripeAction === 'subscription_cancelled'
            ? 'subscription_cancelled_and_refunded'
            : 'refunded';
          console.log('[cancel-order] refunded £10 deposit:', depositPi.id);
        }
      }
    }
  } catch (err) {
    // Log but don't fail — still mark as cancelled and notify team
    console.error('[cancel-order] Stripe error:', err instanceof Error ? err.message : String(err));
  }

  // ── 4. Mark as cancelled in Supabase ────────────────────────────────────
  await db.from('pre_orders').update({ status: 'cancelled' }).eq('id', orderId);

  // ── 5. Send emails ───────────────────────────────────────────────────────
  const productLabel = `NECTA ${order.product_slug.charAt(0).toUpperCase() + order.product_slug.slice(1)}`;
  const refundNote = refundAmount > 0
    ? `Your £${refundAmount} deposit has been refunded and should appear within 3–5 business days.`
    : isSubscription
      ? 'Your subscription has been cancelled — no payment was taken.'
      : 'If a refund is owed, our team will process it within 1 business day.';

  const customerHtml = `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a2e;">
  <div style="background:#1a1a2e;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center;">
    <p style="margin:0;color:#fff;font-size:18px;font-weight:700;">NECTA Labs</p>
  </div>
  <div style="background:#f9f9fb;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e8e8ed;border-top:none;">
    <p style="font-size:15px;margin:0 0 12px;">Hi ${user.user_metadata?.full_name?.split(' ')[0] ?? userEmail.split('@')[0]},</p>
    <p style="font-size:15px;line-height:1.6;margin:0 0 12px;">
      Your pre-order for <strong>${productLabel}</strong> has been cancelled.
    </p>
    <p style="font-size:14px;color:#555;line-height:1.6;margin:0 0 20px;">${refundNote}</p>
    <p style="font-size:13px;color:#999;">Any questions? Reply to this email or contact <a href="mailto:hello@nectalabs.com" style="color:#1a1a2e;">hello@nectalabs.com</a>.</p>
  </div>
</div>`;

  const internalHtml = `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
  <h2 style="color:#1a1a2e;">Pre-order cancelled</h2>
  <p><strong>Customer:</strong> ${userEmail}</p>
  <p><strong>Product:</strong> ${productLabel}</p>
  <p><strong>Type:</strong> ${isSubscription ? 'Subscription' : 'One-off'}</p>
  <p><strong>Stripe action:</strong> ${stripeAction}</p>
  <p><strong>Refund:</strong> ${refundAmount > 0 ? `£${refundAmount} refunded automatically` : 'None (check manually if needed)'}</p>
</div>`;

  await Promise.all([
    sendEmail(userEmail, 'Your NECTA Labs pre-order has been cancelled', customerHtml),
    sendEmail(NOTIFY_EMAIL, `Pre-order cancelled: ${productLabel} (${userEmail})`, internalHtml),
  ]);

  return NextResponse.json({ ok: true, refundAmount, stripeAction });
}
