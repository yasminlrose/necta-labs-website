import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendInternalNotification } from '@/lib/resendTemplates';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function POST(req: NextRequest) {
  const { email, source = 'footer' } = await req.json();

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const supabase = getSupabase();

  // Check for existing signup
  const { data: existing } = await supabase
    .from('email_signups')
    .select('id')
    .eq('email', email.trim())
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({ ok: true, alreadyExists: true });
  }

  const { error } = await supabase
    .from('email_signups')
    .insert({ email: email.trim(), source });

  if (error && error.code !== '23505') {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }

  // Send newsletter welcome email
  await fetch(`${req.nextUrl.origin}/api/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'newsletter', to: email.trim(), data: { firstName: '' } }),
  }).catch(() => null);

  // Internal notification — awaited so it runs before the serverless function terminates
  await sendInternalNotification(
    'New waitlist signup',
    `New email signup!\n\nEmail: ${email.trim()}\nSource: ${source}`,
  );

  return NextResponse.json({ ok: true, alreadyExists: false });
}
