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
import { resend } from '@/lib/resend';
import { preOrderEmail, subscriptionWelcomeEmail } from '@/lib/emails';

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
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  console.log('[webhook] received request, sig present:', !!sig);

  if (!sig) {
    console.error('[webhook] missing stripe-signature header');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    console.log('[webhook] signature verified, event type:', event.type);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    console.error('[webhook] signature verification failed:', message);
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('[webhook] checkout.session.completed — session id:', session.id, 'mode:', session.mode);

    const email = session.customer_details?.email;
    const fullName = session.customer_details?.name ?? '';
    const firstName = fullName.split(' ')[0] || 'there';
    const amountPence = session.amount_total ?? 0;
    const amount = `£${(amountPence / 100).toFixed(2)}`;
    const productName = session.metadata?.productName ?? 'NECTA Infusion';
    const size = session.metadata?.size ?? '';
    const productSlug = (session.metadata?.productSlug ?? 'focus') as import('@/lib/emails').ProductSlug;
    const metaFrequency = session.metadata?.frequency ?? '';

    console.log('[webhook] customer email:', email ?? '(none)', '| product:', productName, '| size:', size);

    if (!email) {
      console.warn('[webhook] no customer email — skipping confirmation email');
      return NextResponse.json({ received: true });
    }

    if (session.mode === 'payment') {
      console.log('[webhook] sending one-off purchase confirmation to:', email);
      try {
        const { subject, html } = preOrderEmail({
          firstName,
          productName,
          size,
          amount,
          dispatchDate: 'within 5–7 working days',
        });
        const result = await resend.emails.send({
          from: 'NECTA Labs <hello@nectalabs.com>',
          to: [email],
          subject,
          html,
        });
        console.log('[webhook] pre-order email sent, resend id:', (result as { id?: string }).id ?? 'unknown');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[webhook] failed to send pre-order email:', message);
        // Return 200 so Stripe doesn't retry — email failure shouldn't block the webhook
      }

    } else if (session.mode === 'subscription') {
      const frequency = deriveFrequency(size, metaFrequency);
      const chargeDate = nextChargeDate(frequency);
      console.log('[webhook] sending subscription welcome to:', email, '| frequency:', frequency, '| next charge:', chargeDate);
      try {
        const { subject, html } = subscriptionWelcomeEmail({
          firstName,
          productName,
          productSlug,
          size,
          amount,
          nextChargeDate: chargeDate,
          frequency,
        });
        const result = await resend.emails.send({
          from: 'NECTA Labs <hello@nectalabs.com>',
          to: [email],
          subject,
          html,
        });
        console.log('[webhook] subscription welcome email sent, resend id:', (result as { id?: string }).id ?? 'unknown');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[webhook] failed to send subscription welcome email:', message);
      }
    }
  }

  return NextResponse.json({ received: true });
}
