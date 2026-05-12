import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// READ-ONLY: retrieves Stripe session data for the order-success page UI.
// pre_orders insertion is handled exclusively by the Stripe webhook to avoid duplicates.
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const email = session.customer_details?.email ?? '';
    const rawName = session.customer_details?.name ?? '';
    const firstName = rawName.trim().split(/\s+/)[0] || '';
    const productName = session.metadata?.productName ?? '';
    const mode = session.mode ?? 'payment';
    const amountPence = mode === 'setup' ? 0 : (session.amount_total ?? 0);
    const amount = mode === 'setup' ? '0.00' : (amountPence / 100).toFixed(2);

    return NextResponse.json({
      email,
      firstName,
      productName,
      amount,
      mode,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve session';
    console.error('[order-session]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
