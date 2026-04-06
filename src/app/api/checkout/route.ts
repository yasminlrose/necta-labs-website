import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const { priceId, email, mode, productName, size, productSlug } = await req.json();

  if (!priceId || !mode) {
    return NextResponse.json({ error: 'Missing priceId or mode' }, { status: 400 });
  }

  const origin = req.headers.get('origin') ?? 'https://nectalabs.com';

  const session = await stripe.checkout.sessions.create({
    mode,
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email ?? undefined,
    success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop`,
    metadata: {
      productName: productName ?? '',
      size: size ?? '',
      productSlug: productSlug ?? '',
    },
    ...(mode === 'subscription' && {
      subscription_data: {
        metadata: {
          productName: productName ?? '',
          size: size ?? '',
          productSlug: productSlug ?? '',
        },
      },
    }),
  });

  return NextResponse.json({ url: session.url });
}
