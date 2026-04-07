import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

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
    const amountPence = session.amount_total ?? 0;
    const amount = (amountPence / 100).toFixed(2);
    const mode = session.mode ?? 'payment';

    // Save to pre_orders (no dedup — one row per purchase)
    await supabaseAdmin
      .from('pre_orders')
      .insert({
        email,
        product_slug: productName,
        amount_paid: amountPence,
        status: mode,
        stripe_session_id: sessionId,
        size: session.metadata?.size ?? null,
        format: session.metadata?.frequency ?? null,
      });

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
