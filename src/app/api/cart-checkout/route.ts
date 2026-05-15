import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  mode: 'subscribe' | 'one-off';
  balance?: number;
  frequency?: string;
}

function getProductImageUrl(slug: string, size: string): string {
  const isSachet = !size.includes('ml');
  if (isSachet) {
    const imgSlug = slug === 'glow' ? 'beauty' : slug;
    return `https://www.nectalabs.com/sachet-${imgSlug}.png`;
  }
  return `https://www.nectalabs.com/bottle-${slug}.jpeg`;
}

const DEPOSIT_PENCE = 1000; // £10

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    const origin = req.headers.get('origin') ?? 'https://nectalabs.com';

    // Build a summary for metadata (Stripe metadata values must be strings ≤500 chars)
    const itemsSummary = items.map(item =>
      `${item.name} ${item.size} (${item.mode === 'subscribe' ? `Subscribe${item.frequency ? ` ${item.frequency}` : ''}` : 'One-off'}) bal=£${item.balance ?? 0}`
    ).join(' | ');

    const totalBalance = items.reduce((sum, item) => sum + ((item.balance ?? 0) * item.quantity), 0);
    const productSlugs = items.map(i => i.slug).join(',');
    const productNames = items.map(i => i.name).join(', ');

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items.flatMap((item) =>
        Array.from({ length: item.quantity }, () => ({
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `${item.name} — Pre-order Deposit`,
              description: [
                item.size,
                item.mode === 'subscribe'
                  ? `Subscribe (${item.frequency || 'monthly'})`
                  : 'One-off',
                item.balance ? `Balance £${item.balance} due on dispatch` : undefined,
              ].filter(Boolean).join(' · '),
              images: [getProductImageUrl(item.slug, item.size)],
            },
            unit_amount: DEPOSIT_PENCE,
          },
          quantity: 1,
        }))
      ),
      payment_intent_data: {
        // Save card for off-session charge when orders dispatch (Nov 2026)
        setup_future_usage: 'off_session',
      },
      shipping_address_collection: {
        allowed_countries: ['GB', 'US', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'SE', 'DK', 'FI', 'NO', 'CH', 'IE', 'PT', 'PL', 'SG', 'AU', 'CA'],
      },
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}&source=cart`,
      cancel_url: `${origin}/pre-order`,
      metadata: {
        checkoutType: 'cart-deposit',
        productSlugs,
        productNames,
        itemsSummary: itemsSummary.slice(0, 500),
        totalBalance: totalBalance.toString(),
        itemCount: items.length.toString(),
      },
      custom_text: {
        submit: {
          message: `This £${items.length * 10} deposit (£10 per product) secures your founding member pre-orders. Your remaining balance of £${totalBalance} plus any applicable shipping is charged on 1 November 2026 — orders dispatch from 17 November 2026. Shipping is calculated from your delivery address below and added to your November balance. Cancel any time before dispatch for a full refund.`,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Cart checkout failed';
    console.error('[api/cart-checkout]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
