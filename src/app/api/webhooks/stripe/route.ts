/**
 * Stripe webhook handler.
 *
 * IMPORTANT: Set STRIPE_WEBHOOK_SECRET in Vercel environment variables to the
 * whsec_... secret from your Stripe dashboard → Developers → Webhooks.
 * The value in .env.local is a placeholder and will cause signature
 * verification to fail locally — use `stripe listen --forward-to localhost:PORT/api/webhooks/stripe`
 * to get a real local webhook secret for local testing.
 */

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sendTemplate, RESEND_TEMPLATES } from '@/lib/resendTemplates';

/** Derive a human-readable delivery frequency from session metadata. */
function deriveFrequency(size: string, metaFrequency: string): string {
  if (metaFrequency) return metaFrequency;
  if (size.includes('90-day')) return 'every 3 months';
  if (size.includes('14-day') || size.includes('30-day')) return 'monthly';
  return 'monthly';
}

/** Calculate next charge date based on billing frequency. */
function nextChargeDate(frequency: string): string {
  const d = new Date();
  if (frequency.includes('2 month') || frequency.includes('2month')) {
    d.setMonth(d.getMonth() + 2);
  } else if (frequency.includes('3 month') || frequency.includes('quarter')) {
    d.setMonth(d.getMonth() + 3);
  } else {
    d.setMonth(d.getMonth() + 1);
  }
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function POST(req: NextRequest) {
  console.log('[webhook] POST received');

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  console.log('[webhook] stripe-signature present:', !!sig);

  if (!sig) {
    console.error('[webhook] missing stripe-signature header');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    console.log('[webhook] signature verified — event type:', event.type, '| event id:', event.id);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    console.error('[webhook] signature verification failed:', message);
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('[webhook] checkout.session.completed — session id:', session.id, '| mode:', session.mode, '| payment_status:', session.payment_status);

    const email = session.customer_details?.email;
    const fullName = session.customer_details?.name ?? '';
    const firstName = fullName.split(' ')[0] || 'there';
    const amountPence = session.amount_total ?? 0;
    const amount = `£${(amountPence / 100).toFixed(2)}`;
    const productName = session.metadata?.productName ?? 'NECTA Infusion';
    const size = session.metadata?.size ?? '';
    const metaFrequency = session.metadata?.frequency ?? '';

    console.log('[webhook] customer email:', email ?? '(none)', '| product:', productName, '| size:', size, '| amount:', amount);

    if (!email) {
      console.warn('[webhook] no customer email found — skipping confirmation email');
      return NextResponse.json({ received: true });
    }

    if (session.mode === 'payment') {
      console.log('[webhook] mode=payment → sending order-confirmation email to:', email);
      try {
        const resendId = await sendTemplate(
          RESEND_TEMPLATES.ORDER_CONFIRMATION,
          email,
          {
            first_name: firstName,
            product_name: productName,
            order_total: amount,
            dispatch_date: 'within 5–7 working days',
          },
        );
        console.log('[webhook] order-confirmation email sent — resend id:', resendId);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[webhook] failed to send order-confirmation email:', message);
        // Return 200 so Stripe doesn't retry — email failure shouldn't block the webhook
      }

    } else if (session.mode === 'subscription') {
      const frequency = deriveFrequency(size, metaFrequency);
      const chargeDate = nextChargeDate(frequency);
      console.log('[webhook] mode=subscription → sending subscription-welcome email to:', email, '| frequency:', frequency, '| next charge:', chargeDate);
      try {
        const resendId = await sendTemplate(
          RESEND_TEMPLATES.SUBSCRIPTION_WELCOME,
          email,
          {
            first_name: firstName,
            product_name: productName,
            amount,
            next_billing_date: chargeDate,
            frequency,
          },
        );
        console.log('[webhook] subscription-welcome email sent — resend id:', resendId);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[webhook] failed to send subscription-welcome email:', message);
      }

    } else {
      console.warn('[webhook] unhandled session.mode:', session.mode, '— no email sent');
    }
  } else {
    console.log('[webhook] unhandled event type:', event.type, '— ignoring');
  }

  return NextResponse.json({ received: true });
}
