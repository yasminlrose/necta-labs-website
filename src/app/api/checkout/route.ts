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

// Promotion codes (e.g. FOUNDING16) become available at checkout from launch date onwards.
const LAUNCH_DATE = new Date('2026-11-17T00:00:00Z');
const promoCodesEnabled = () => new Date() >= LAUNCH_DATE;

export async function POST(req: NextRequest) {
  try {
    const { priceId, email, mode, productName, size, productSlug, frequency, balance, purchaseType } = await req.json();

    if (!mode) {
      return NextResponse.json({ error: 'Missing mode' }, { status: 400 });
    }

    const origin = req.headers.get('origin') ?? 'https://nectalabs.com';

    const meta = {
      productName: productName ?? '',
      size: size ?? '',
      productSlug: productSlug ?? '',
      frequency: frequency ?? '',
    };

    // ── £10 deposit pre-order ─────────────────────────────────────────────────
    // Charges £10 now. Balance is charged manually on dispatch (November 2026).
    if (mode === 'deposit') {
      const imageUrl = getProductImageUrl(productSlug ?? '', size ?? '');
      const balanceFormatted = balance ? `£${balance}` : '';

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: `NECTA ${productName ?? 'Infusion'} — Pre-order Deposit`,
                description: [
                  size,
                  purchaseType === 'subscribe' ? `Subscribe (${frequency || 'monthly'})` : 'One-off',
                  balanceFormatted ? `Balance ${balanceFormatted} due on dispatch` : undefined,
                ].filter(Boolean).join(' · '),
                images: [imageUrl],
              },
              unit_amount: 1000, // £10 in pence
            },
            quantity: 1,
          },
        ],
        customer_email: email ?? undefined,
        payment_intent_data: {
          // Save card for off-session charge when order dispatches (Nov 2026)
          setup_future_usage: 'off_session',
        },
        shipping_address_collection: { allowed_countries: ['GB', 'US', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'SE', 'DK', 'FI', 'NO', 'CH', 'IE', 'PT', 'PL', 'SG', 'AU', 'CA'] },
        success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/pre-order`,
        metadata: {
          ...meta,
          checkoutType: 'deposit',
          balance: balance ?? '',
          purchaseType: purchaseType ?? '',
        },
        ...(promoCodesEnabled() && { allow_promotion_codes: true }),
        custom_text: {
          submit: {
            message: `This £10 deposit secures your founding member pre-order. The remaining balance${balanceFormatted ? ` of ${balanceFormatted}` : ''} plus any applicable shipping is charged on 1 November 2026 — orders dispatch from 17 November 2026. Shipping is calculated from your delivery address below and added to your November balance. Cancel any time before dispatch for a full refund.`,
          },
        },
      });

      return NextResponse.json({ url: session.url });
    }

    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
    }

    // ── Subscription pre-order (trial_end = dispatch date, no charge today) ───
    if (mode === 'subscription') {
      const trialEnd = Math.floor(new Date('2026-11-01T00:00:00Z').getTime() / 1000);

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
        cancel_url: `${origin}/pre-order`,
        metadata: meta,
        ...(promoCodesEnabled() && { allow_promotion_codes: true }),
        custom_text: {
          submit: {
            message: `Your first charge is 1 November 2026 — orders dispatch from 17 November 2026. Cancel any time before dispatch for a full refund.`,
          },
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // ── One-off payment ───────────────────────────────────────────────────────
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email ?? undefined,
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pre-order`,
      metadata: meta,
      ...(promoCodesEnabled() && { allow_promotion_codes: true }),
      custom_text: {
        submit: {
          message: 'Pre-order: payment taken today. Your order ships in November 2026. Cancel before dispatch for a full refund.',
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
