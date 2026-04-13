import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';


export async function POST(req: NextRequest) {
  try {
    const { priceId, email, mode, productName, size, productSlug, frequency } = await req.json();

    if (!priceId || !mode) {
      return NextResponse.json({ error: 'Missing priceId or mode' }, { status: 400 });
    }

    const origin = req.headers.get('origin') ?? 'https://nectalabs.com';

    const meta = {
      productName: productName ?? '',
      size: size ?? '',
      productSlug: productSlug ?? '',
      frequency: frequency ?? '',
    };

    // Subscription pre-orders: use subscription mode with trial_end set to the
    // dispatch date so Stripe shows the proper order summary panel with product
    // image. Stripe displays "Subscription starts 1 Oct 2026" (specific date),
    // not "X days free", so the copy is honest. No charge until dispatch.
    if (mode === 'subscription') {
      const billingFreq = frequency === 'every 2 months' ? 'every 2 months' : 'monthly';
      const trialEnd = Math.floor(new Date('2026-10-01T00:00:00Z').getTime() / 1000);

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: email ?? undefined,
        subscription_data: {
          trial_end: trialEnd,
          metadata: { ...meta, priceId, subscriptionType: 'preorder' },
        },
        success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/shop`,
        metadata: meta,
        custom_text: {
          submit: {
            message: `Pre-order: no charge today. Your ${billingFreq} subscription starts on 1 October 2026 when your order ships. Cancel before dispatch for a full refund.`,
          },
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // One-off payment — reference the existing Stripe price so Stripe uses
    // the product images already configured in the Stripe dashboard.
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email ?? undefined,
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop`,
      metadata: meta,
      custom_text: {
        submit: {
          message: 'Pre-order: payment taken today. Your order ships in October 2026. Cancel before dispatch for a full refund.',
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout session creation failed';
    console.error('[api/checkout]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
