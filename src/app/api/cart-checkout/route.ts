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
}

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
    const { items }: { items: CartItem[] } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    const origin = req.headers.get('origin') ?? 'https://nectalabs.com';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items.map((item) => ({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.name,
            description: item.size,
            images: [getProductImageUrl(item.slug, item.size)],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pick-and-mix`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Cart checkout failed';
    console.error('[api/cart-checkout]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
