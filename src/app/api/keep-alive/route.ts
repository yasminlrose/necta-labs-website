import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Called by Vercel Cron every 4 days to prevent Supabase free-tier pausing.
// Supabase pauses inactive projects after 7 days — this keeps the DB warm.
export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { error } = await supabase.rpc('get_waitlist_count');

    if (error) {
      console.error('[keep-alive] Supabase ping failed:', error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, pinged_at: new Date().toISOString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[keep-alive] Error:', message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
