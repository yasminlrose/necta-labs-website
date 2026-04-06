import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { launchAnnouncementEmail } from '@/lib/emails';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-launch-secret');
  if (secret !== process.env.LAUNCH_EMAIL_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { emails } = (await req.json()) as { emails: { email: string; firstName?: string }[] };
  if (!Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json({ error: 'No emails provided' }, { status: 400 });
  }

  const BATCH = 50;
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < emails.length; i += BATCH) {
    const batch = emails.slice(i, i + BATCH);
    await Promise.all(
      batch.map(async ({ email, firstName }) => {
        try {
          const { subject, html } = launchAnnouncementEmail({ firstName: firstName ?? 'there' });
          await resend.emails.send({
            from: 'NECTA Labs <hello@nectalabs.com>',
            to: [email],
            subject,
            html,
          });
          sent++;
        } catch {
          failed++;
        }
      }),
    );
  }

  return NextResponse.json({ sent, failed });
}
