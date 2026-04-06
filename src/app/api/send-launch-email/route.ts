import { NextRequest, NextResponse } from 'next/server';
import { sendTemplate, RESEND_TEMPLATES } from '@/lib/resendTemplates';

export async function POST(req: NextRequest) {
  console.log('[send-launch-email] POST received');

  const secret = req.headers.get('x-launch-secret');
  if (secret !== process.env.LAUNCH_EMAIL_SECRET) {
    console.error('[send-launch-email] unauthorized — invalid x-launch-secret');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { emails } = (await req.json()) as { emails: { email: string; firstName?: string }[] };
  if (!Array.isArray(emails) || emails.length === 0) {
    console.error('[send-launch-email] no emails provided');
    return NextResponse.json({ error: 'No emails provided' }, { status: 400 });
  }

  console.log('[send-launch-email] sending to', emails.length, 'recipients');

  const BATCH = 50;
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < emails.length; i += BATCH) {
    const batch = emails.slice(i, i + BATCH);
    console.log('[send-launch-email] processing batch', Math.floor(i / BATCH) + 1, '— size:', batch.length);
    await Promise.all(
      batch.map(async ({ email, firstName }) => {
        try {
          console.log('[send-launch-email] sending to:', email, '| firstName:', firstName ?? 'there');
          const id = await sendTemplate(
            RESEND_TEMPLATES.LAUNCH_ANNOUNCEMENT,
            email,
            "NECTA Labs is live — you're first to know",
            { first_name: firstName ?? 'there' },
          );
          console.log('[send-launch-email] sent to:', email, '| resend id:', id);
          sent++;
        } catch (err) {
          console.error('[send-launch-email] failed for:', email, '|', err);
          failed++;
        }
      }),
    );
  }

  console.log('[send-launch-email] complete — sent:', sent, '| failed:', failed);
  return NextResponse.json({ sent, failed });
}
