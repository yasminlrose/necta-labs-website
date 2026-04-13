import { NextRequest, NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { message, senderEmail, senderName, businessName } = await req.json();
    if (!message || !senderEmail) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (!RESEND_API_KEY) {
      console.error('[stockist-message] RESEND_API_KEY not set');
      return NextResponse.json({ error: 'Email not configured' }, { status: 500 });
    }

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
        <div style="background:#1a1a2e;padding:24px;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:18px">Message from stockist portal</h1>
        </div>
        <div style="background:#f9f9fb;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e8e8ed;border-top:none">
          <p style="font-size:13px;margin:0 0 4px"><strong>From:</strong> ${senderName || senderEmail}</p>
          <p style="font-size:13px;margin:0 0 4px"><strong>Email:</strong> ${senderEmail}</p>
          ${businessName ? `<p style="font-size:13px;margin:0 0 16px"><strong>Business:</strong> ${businessName}</p>` : ''}
          <div style="background:white;border:1px solid #e8e8ed;border-radius:8px;padding:16px;margin-top:12px">
            <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap">${message}</p>
          </div>
          <p style="font-size:12px;color:#999;margin-top:16px">
            Reply directly to this email to respond to the stockist.
          </p>
        </div>
      </div>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'NECTA Labs <hello@nectalabs.com>',
        to: ['wholesale@nectalabs.com'],
        reply_to: senderEmail,
        subject: `Stockist message from ${businessName || senderEmail}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('[stockist-message] Resend error:', err);
      return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[stockist-message]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
