import { NextRequest, NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { to, html, venueName } = await req.json();
    if (!to || !html) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    if (!RESEND_API_KEY) return NextResponse.json({ error: 'Email not configured' }, { status: 500 });

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'NECTA Labs <hello@nectalabs.com>',
        to: [to],
        subject: `Your NECTA customer announcement email${venueName ? ` — ${venueName}` : ''}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('[stockist-send-email-template]', err);
      return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[stockist-send-email-template]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
