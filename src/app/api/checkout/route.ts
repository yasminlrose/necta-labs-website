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

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email ?? undefined,
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop`,
      metadata: meta,
      ...(mode === 'subscription' && {
        subscription_data: { metadata: meta },
      }),
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout session creation failed';
    console.error('[api/checkout]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
