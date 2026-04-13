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

    // Pre-order: first charge on dispatch date, no trial period (avoids misleading "X days free" copy)
    const dispatchTimestamp = Math.floor(new Date('2026-10-01T00:00:00Z').getTime() / 1000);

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email ?? undefined,
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop`,
      metadata: meta,
      custom_text: {
        submit: {
          message: 'No payment taken today. Your card will be charged on 1 October 2026 when your order ships. Cancel any time before dispatch for a full refund.',
        },
      },
      ...(mode === 'subscription' && {
        subscription_data: {
          metadata: meta,
          trial_end: dispatchTimestamp,
        },
      }),
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout session creation failed';
    console.error('[api/checkout]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
