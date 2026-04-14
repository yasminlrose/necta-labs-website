/**
 * Stripe webhook handler.
 *
 * IMPORTANT: Set STRIPE_WEBHOOK_SECRET in Vercel environment variables to the
 * whsec_... secret from your Stripe dashboard → Developers → Webhooks.
 * The value in .env.local is a placeholder and will cause signature
 * verification to fail locally — use `stripe listen --forward-to localhost:PORT/api/webhooks/stripe`
 * to get a real local webhook secret for local testing.
 *
 * Subscribed events (configure in Stripe dashboard → Webhooks):
 *   checkout.session.completed
 *   invoice.payment_succeeded
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { sendTemplate, RESEND_TEMPLATES } from '@/lib/resendTemplates';

/** Format a Unix timestamp as a human-readable UK date. */
function formatUnixDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Derive a human-readable delivery frequency from session metadata. */
function deriveFrequency(size: string, metaFrequency: string): string {
  if (metaFrequency) return metaFrequency;
  if (size.includes('90-day')) return 'every 3 months';
  if (size.includes('14-day') || size.includes('30-day')) return 'monthly';
  return 'monthly';
}

/** Fetch a Stripe customer's email and first name. */
async function getCustomerDetails(customerId: string): Promise<{ email: string | null; firstName: string }> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return { email: null, firstName: 'there' };
    const c = customer as Stripe.Customer;
    const firstName = (c.name ?? '').trim().split(/\s+/)[0] || 'there';
    return { email: c.email ?? null, firstName };
  } catch (err) {
    console.error('[webhook] getCustomerDetails failed:', err instanceof Error ? err.message : String(err));
    return { email: null, firstName: 'there' };
  }
}

export async function POST(req: NextRequest) {
  console.log('[webhook] POST received');

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    console.error('[webhook] missing stripe-signature header');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    console.log('[webhook] event verified:', event.type, event.id);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    console.error('[webhook] signature verification failed:', message);
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  // ── checkout.session.completed ──────────────────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('[webhook] checkout.session.completed — mode:', session.mode, '| payment_status:', session.payment_status);

    const productName = session.metadata?.productName ?? 'NECTA Infusion';
    const size = session.metadata?.size ?? '';
    const metaFrequency = session.metadata?.frequency ?? '';

    if (session.mode === 'payment') {
      // ── One-off payment ──────────────────────────────────────────────────────
      const email = session.customer_details?.email ?? null;
      if (!email) {
        console.warn('[webhook] no email for payment — skipping');
        return NextResponse.json({ received: true });
      }
      const rawName = session.customer_details?.name ?? '';
      const firstName = rawName.trim().split(/\s+/)[0] || 'there';
      const amountPence = session.amount_total ?? 0;
      const amount = `£${(amountPence / 100).toFixed(2)}`;

      try {
        const resendId = await sendTemplate(
          RESEND_TEMPLATES.ORDER_CONFIRMATION,
          email,
          { first_name: firstName, product_name: productName, order_total: amount, dispatch_date: 'October 2026' },
        );
        console.log('[webhook] order-confirmation sent — id:', resendId);
      } catch (err) {
        console.error('[webhook] order-confirmation failed:', err instanceof Error ? err.message : String(err));
      }

    } else if (session.mode === 'subscription') {
      // ── Subscription pre-order (trial_end = Oct 2026, no charge today) ───────
      const { email, firstName } = await getCustomerDetails(session.customer as string);

      if (!email) {
        console.warn('[webhook] no email for subscription — skipping welcome email');
        return NextResponse.json({ received: true });
      }

      // Get the actual recurring price amount and first charge date from Stripe
      let subscriptionAmount = '';
      let firstChargeDate = 'October 2026'; // safe fallback

      try {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string,
          { expand: ['items.data.price'] },
        );
        const price = subscription.items.data[0]?.price as Stripe.Price | undefined;
        if (price?.unit_amount) {
          subscriptionAmount = `£${(price.unit_amount / 100).toFixed(2)}`;
        }
        if (subscription.trial_end) {
          firstChargeDate = formatUnixDate(subscription.trial_end);
        }
        console.log('[webhook] subscription — amount:', subscriptionAmount, '| first charge:', firstChargeDate);
      } catch (err) {
        console.error('[webhook] failed to retrieve subscription details:', err instanceof Error ? err.message : String(err));
      }

      const frequency = deriveFrequency(size, metaFrequency);

      try {
        const resendId = await sendTemplate(
          RESEND_TEMPLATES.SUBSCRIPTION_WELCOME,
          email,
          {
            first_name:        firstName,
            product_name:      productName,
            amount:            subscriptionAmount,
            next_billing_date: firstChargeDate,
            frequency,
          },
        );
        console.log('[webhook] subscription-welcome sent — id:', resendId);
      } catch (err) {
        console.error('[webhook] subscription-welcome failed:', err instanceof Error ? err.message : String(err));
      }

    } else {
      console.warn('[webhook] unhandled session.mode:', session.mode);
    }

  // ── invoice.payment_succeeded ───────────────────────────────────────────────
  // Fires when a subscription trial ends and the first real payment is collected.
  // In Stripe SDK v22 (API 2025-03-31.basil), invoice.subscription is removed —
  // subscription info is now at invoice.parent.subscription_details.subscription.
  } else if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice;

    // Only care about subscription invoices (not one-off invoices)
    const parentType = invoice.parent?.type;
    if (parentType !== 'subscription_details') {
      return NextResponse.json({ received: true });
    }

    const subscriptionId = invoice.parent?.subscription_details?.subscription;

    // Skip the £0 invoice Stripe creates at subscription start (during trial)
    if ((invoice.amount_paid ?? 0) === 0) {
      console.log('[webhook] invoice.payment_succeeded — £0 invoice (trial start), skipping');
      return NextResponse.json({ received: true });
    }

    console.log('[webhook] invoice.payment_succeeded — subscription:', subscriptionId, '| amount:', invoice.amount_paid);

    const { email, firstName } = await getCustomerDetails(invoice.customer as string);
    if (!email) {
      console.warn('[webhook] invoice.payment_succeeded — no email, skipping');
      return NextResponse.json({ received: true });
    }

    const amountPence = invoice.amount_paid ?? 0;
    const amount = `£${(amountPence / 100).toFixed(2)}`;

    // Use ORDER_CONFIRMATION template for actual charges
    try {
      const resendId = await sendTemplate(
        RESEND_TEMPLATES.ORDER_CONFIRMATION,
        email,
        {
          first_name:    firstName,
          product_name:  'NECTA Subscription',
          order_total:   amount,
          dispatch_date: 'Your subscription is now active',
        },
      );
      console.log('[webhook] invoice payment-confirmation sent — id:', resendId);
    } catch (err) {
      console.error('[webhook] invoice payment-confirmation failed:', err instanceof Error ? err.message : String(err));
    }

  } else {
    console.log('[webhook] unhandled event:', event.type);
  }

  return NextResponse.json({ received: true });
}
