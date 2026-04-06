import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  preOrderEmail,
  subscriptionWelcomeEmail,
  launchAnnouncementEmail,
  type PreOrderEmailData,
  type SubscriptionEmailData,
  type LaunchEmailData,
} from '@/lib/emails';

const FROM = 'NECTA Labs <hello@nectalabs.com>';

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  let body: { type: string; to: string; data: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { type, to, data } = body;
  if (!type || !to) {
    return NextResponse.json({ error: 'Missing type or to' }, { status: 400 });
  }

  try {
    let email: { subject: string; html: string };

    if (type === 'preorder') {
      email = preOrderEmail(data as unknown as PreOrderEmailData);
    } else if (type === 'subscription') {
      email = subscriptionWelcomeEmail(data as unknown as SubscriptionEmailData);
    } else if (type === 'launch') {
      email = launchAnnouncementEmail(data as unknown as LaunchEmailData);
    } else {
      return NextResponse.json({ error: `Unknown email type: ${type}` }, { status: 400 });
    }

    const result = await resend.emails.send({
      from: FROM,
      to,
      subject: email.subject,
      html: email.html,
    });

    return NextResponse.json({ ok: true, id: result.data?.id });
  } catch (err) {
    console.error('[send-email]', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
