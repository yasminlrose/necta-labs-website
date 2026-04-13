import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

/** Returns a publicly accessible product image URL for Stripe to display. */
function getProductImageUrl(slug: string, size: string): string {
  const isSachet = !size.includes('ml');
  if (isSachet) {
    // glow's sachet image is named sachet-beauty
    const imgSlug = slug === 'glow' ? 'beauty' : slug;
    return `https://nectalabs.com/sachet-${imgSlug}.png`;
  }
  return `https://nectalabs.com/bottle-${slug}.jpeg`;
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

    const imageUrl = getProductImageUrl(productSlug ?? '', size ?? '');

    // Subscription pre-orders: use setup mode to save card with no charge today.
    // Stripe's trial mechanism always shows "X days free" which is misleading.
    // Setup mode collects the payment method cleanly — subscriptions are activated
    // via Stripe API when stock ships in October 2026.
    if (mode === 'subscription') {
      const stripePrice = await stripe.prices.retrieve(priceId);
      const unitAmount = stripePrice.unit_amount ?? 0;
      const displayPrice = `£${(unitAmount / 100).toFixed(2)}`;
      const billingFreq = frequency === 'every 2 months' ? 'every 2 months' : 'monthly';

      const session = await stripe.checkout.sessions.create({
        mode: 'setup',
        currency: 'gbp',
        customer_email: email ?? undefined,
        metadata: { ...meta, priceId, subscriptionType: 'preorder' },
        setup_intent_data: {
          metadata: { ...meta, priceId, subscriptionType: 'preorder' },
        },
        success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/shop`,
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
            },
            quantity: 1,
          },
        ],
        custom_text: {
          submit: {
            message: `${productName} (${size}) — ${displayPrice}/${billingFreq === 'every 2 months' ? '2 months' : 'month'}. No payment taken today. Your first charge will be on 1 October 2026 when your order ships. Cancel any time before dispatch for a full refund.`,
          },
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // One-off payment — retrieve price to build price_data with product image
    const stripePrice = await stripe.prices.retrieve(priceId);
    const unitAmount = stripePrice.unit_amount ?? 0;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
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
          },
          quantity: 1,
        },
      ],
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
