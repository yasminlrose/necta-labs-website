import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function checkAuth(req: NextRequest) {
  const pwd = req.headers.get('x-admin-password');
  return pwd === process.env.ADMIN_PASSWORD;
}

// GET — list all applications
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = adminClient();
  const { data, error } = await db
    .from('stockist_applications')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ applications: data });
}

// PATCH — approve or deny
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status } = await req.json();
  if (!id || !['approved', 'denied'].includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const db = adminClient();

  // Fetch the application for the email
  const { data: app, error: fetchErr } = await db
    .from('stockist_applications')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchErr || !app) return NextResponse.json({ error: 'Application not found' }, { status: 404 });

  // Update status
  const { error: updateErr } = await db
    .from('stockist_applications')
    .update({ status })
    .eq('id', id);

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  // Send email to applicant
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const firstName = app.contact_name.split(' ')[0];
    const html = status === 'approved' ? approvedHtml(firstName, app.business_name) : deniedHtml(firstName, app.business_name);
    const subject = status === 'approved'
      ? `You're approved to stock NECTA Labs 🎉`
      : `Your NECTA Labs stockist application`;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'NECTA Labs <hello@nectalabs.com>', to: [app.contact_email], subject, html }),
    });
  }

  return NextResponse.json({ ok: true });
}

function approvedHtml(firstName: string, businessName: string) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
      <div style="background:#1a1a2e;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:white;margin:0;font-size:24px">NECTA Labs</h1>
      </div>
      <div style="background:#f9f9fb;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e8e8ed;border-top:none">
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px">Hi ${firstName},</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px">
          Great news — <strong>${businessName}</strong> has been approved as a NECTA Labs stockist!
        </p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 24px">
          We'll be in touch shortly with your wholesale pricing, minimum order details, and next steps to place your first order.
        </p>
        <p style="font-size:14px;color:#666;margin:0">
          Warm regards,<br/><strong style="color:#1a1a2e">Yaz</strong><br/>Founder, NECTA Labs<br/>
          <a href="mailto:hello@nectalabs.com">hello@nectalabs.com</a>
        </p>
      </div>
    </div>`;
}

function deniedHtml(firstName: string, businessName: string) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
      <div style="background:#1a1a2e;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:white;margin:0;font-size:24px">NECTA Labs</h1>
      </div>
      <div style="background:#f9f9fb;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e8e8ed;border-top:none">
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px">Hi ${firstName},</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px">
          Thank you for your interest in stocking NECTA Labs at <strong>${businessName}</strong>.
        </p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 24px">
          After careful consideration, we don't think it's the right fit at this time — but this can change as we grow.
          Please feel free to reapply in the future, and don't hesitate to reach out if you have any questions.
        </p>
        <p style="font-size:14px;color:#666;margin:0">
          Warm regards,<br/><strong style="color:#1a1a2e">Yaz</strong><br/>Founder, NECTA Labs<br/>
          <a href="mailto:hello@nectalabs.com">hello@nectalabs.com</a>
        </p>
      </div>
    </div>`;
}
