import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

function getProductImageUrl(slug: string, size: string): string {
  const isSachet = !size.includes('ml');
  if (isSachet) {
    const imgSlug = slug === 'glow' ? 'beauty' : slug;
    return `https://www.nectalabs.com/sachet-${imgSlug}.png`;
  }
  return `https://www.nectalabs.com/bottle-${slug}.jpeg`;
}

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

    // Subscription pre-orders: subscription mode with trial_end = dispatch date.
    // Use price_data so we control the product name, image, and interval display
    // (avoids malformed nicknames on existing Stripe prices like "every2months").
    // Stripe auto-formats interval_count into "every 2 months" / "every 3 months"
    // with correct spacing. "X days free" is Stripe-generated and cannot be
    // overridden in hosted checkout; custom_text clarifies no charge today.
    if (mode === 'subscription') {
      const trialEnd = Math.floor(new Date('2026-10-01T00:00:00Z').getTime() / 1000);

      // Map frequency string → Stripe recurring interval
      let intervalCount = 1;
      if (frequency === 'every 2 months') intervalCount = 2;
      else if (frequency === 'every 3 months') intervalCount = 3;

      const stripePrice = await stripe.prices.retrieve(priceId);
      const unitAmount = stripePrice.unit_amount ?? 0;
      const imageUrl = getProductImageUrl(productSlug ?? '', size ?? '');

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: productName ?? 'NECTA Infusion',
                description: size ?? undefined,
                images: [imageUrl],
              },
              unit_amount: unitAmount,
              recurring: { interval: 'month', interval_count: intervalCount },
            },
            quantity: 1,
          },
        ],
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
            message: `You won't be charged until 1 October 2026 when your order ships. Cancel any time before dispatch for a full refund.`,
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
