/**
 * POST /api/send-magic-link
 * Body: { email: string }
 *
 * Generates a Supabase magic link using the service-role key, then sends
 * it to the user via Resend so we are never dependent on Supabase SMTP.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const FROM = 'NECTA Labs <hello@nectalabs.com>';
const RESEND_API = 'https://api.resend.com';

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: NextRequest) {
  const { email } = await req.json() as { email?: string };

  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 });
  }

  // Determine the correct origin for the redirect
  const origin =
    process.env.VERCEL_ENV === 'production'
      ? 'https://www.nectalabs.com'
      : process.env.VERCEL_BRANCH_URL
        ? `https://${process.env.VERCEL_BRANCH_URL}`
        : 'https://nectalabs.com';

  // Generate magic link via Supabase admin API
  let magicLinkUrl: string;
  try {
    const { data, error } = await adminClient().auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo: `${origin}/account` },
    });
    if (error || !data.properties?.action_link) {
      throw new Error(error?.message ?? 'no action_link returned');
    }
    magicLinkUrl = data.properties.action_link;
  } catch (err) {
    console.error('[send-magic-link] generateLink failed:', err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: 'Failed to generate magic link' }, { status: 500 });
  }

  // Send the email directly via Resend (no template dependency)
  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e0;">
        <!-- Header -->
        <tr><td style="background:#1a1a2e;padding:32px 40px;text-align:center;">
          <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">NECTA Labs</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px 40px 32px;">
          <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#1a1a2e;line-height:1.3;">Sign in to your account</h1>
          <p style="margin:0 0 28px;font-size:15px;color:#6b6b80;line-height:1.6;">
            Click the button below to sign in to your NECTA Labs account — no password needed. This link expires in 1 hour.
          </p>
          <div style="text-align:center;margin-bottom:28px;">
            <a href="${magicLinkUrl}" style="display:inline-block;background:#1a1a2e;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 36px;border-radius:50px;">
              Sign in to my account
            </a>
          </div>
          <p style="margin:0;font-size:12px;color:#a0a0b0;line-height:1.6;">
            If you didn't request this, you can safely ignore this email. This link can only be used once.
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:20px 40px;border-top:1px solid #f0f0ec;">
          <p style="margin:0;font-size:11px;color:#a0a0b0;text-align:center;">
            NECTA Labs · <a href="mailto:hello@nectalabs.com" style="color:#a0a0b0;">hello@nectalabs.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();

  const text = `Sign in to your NECTA Labs account\n\nClick the link below (expires in 1 hour):\n${magicLinkUrl}\n\nIf you didn't request this, ignore this email.\n\nNECTA Labs · hello@nectalabs.com`;

  const res = await fetch(`${RESEND_API}/emails`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [email],
      subject: 'Sign in to NECTA Labs',
      html,
      text,
    }),
  });

  const data = await res.json() as { id?: string; message?: string };
  console.log('[send-magic-link] Resend response:', res.status, data);

  if (!res.ok) {
    return NextResponse.json({ error: `Resend error: ${JSON.stringify(data)}` }, { status: 500 });
  }

  return NextResponse.json({ sent: true });
}
