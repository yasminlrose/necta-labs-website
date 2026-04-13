import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = 'NECTA Labs <hello@nectalabs.com>';
const NOTIFY_EMAIL = 'hello@nectalabs.com';

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) { console.error('[stockist] RESEND_API_KEY not set'); return; }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  if (!res.ok) {
    const err = await res.json();
    console.error('[stockist] Resend error:', JSON.stringify(err));
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessName, businessType, website, instagram,
      contactName, contactEmail, contactPhone,
      city, postcode, vatNumber,
      monthlyUnits, whyNecta, heardAbout,
    } = body;

    if (!businessName || !businessType || !contactName || !contactEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to Supabase — this is the critical step
    const db = adminClient();
    const { error: dbError } = await db.from('stockist_applications').insert({
      business_name: businessName,
      business_type: businessType,
      website: website || null,
      instagram: instagram || null,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone || null,
      city: city || null,
      postcode: postcode || null,
      vat_number: vatNumber || null,
      monthly_units: monthlyUnits || null,
      why_necta: whyNecta || null,
      heard_about: heardAbout || null,
      status: 'pending',
    });

    if (dbError) {
      console.error('[stockist] db error:', dbError.message);
      return NextResponse.json({ error: 'Failed to save application' }, { status: 500 });
    }

    // Send emails — non-blocking, don't fail the request if this errors
    const submittedAt = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
    const whyText = whyNecta ? String(whyNecta).replace(/\n/g, '<br/>') : '—';

    const internalHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
        <div style="background:#1a1a2e;padding:24px;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:20px">New Stockist Application</h1>
          <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:13px">${submittedAt}</p>
        </div>
        <div style="background:#f9f9fb;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e8e8ed;border-top:none">
          ${row('Business', businessName)} ${row('Type', businessType)}
          ${row('Location', [city, postcode].filter(Boolean).join(', ') || '—')}
          ${row('Website', website || '—')}
          ${row('Instagram', instagram ? `@${instagram.replace('@','')}` : '—')}
          ${row('VAT', vatNumber || '—')} ${row('Contact', contactName)}
          ${row('Email', contactEmail)} ${row('Phone', contactPhone || '—')}
          ${row('Monthly units', monthlyUnits || 'Not specified')}
          ${row('Heard about', heardAbout || '—')}
          <div style="background:white;border:1px solid #e8e8ed;border-radius:8px;padding:16px;margin:16px 0">
            <p style="margin:0 0 6px;font-size:12px;color:#999;text-transform:uppercase">Why they want to stock NECTA</p>
            <p style="margin:0;font-size:14px;line-height:1.6">${whyText}</p>
          </div>
          <p style="margin:0;font-size:13px;color:#666">
            Review all applications at <a href="https://www.nectalabs.com/admin/stockists">nectalabs.com/admin/stockists</a>
          </p>
        </div>
      </div>`;

    const applicantHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
        <div style="background:#1a1a2e;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:white;margin:0;font-size:24px">NECTA Labs</h1>
          <p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:12px;text-transform:uppercase;letter-spacing:0.1em">Stockist Application</p>
        </div>
        <div style="background:#f9f9fb;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e8e8ed;border-top:none">
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px">Hi ${contactName.split(' ')[0]},</p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px">
            Thank you for applying to stock NECTA Labs at <strong>${businessName}</strong>.
            We review every application personally and will be in touch within <strong>3–5 business days</strong>.
          </p>
          <p style="font-size:14px;color:#666;margin:0">
            Warm regards,<br/><strong style="color:#1a1a2e">Yaz</strong><br/>Founder, NECTA Labs
          </p>
        </div>
      </div>`;

    // Fire emails in background — don't await so DB save already returned ok
    Promise.all([
      sendEmail(NOTIFY_EMAIL, `New stockist application: ${businessName}${city ? ` (${city})` : ''}`, internalHtml),
      sendEmail(contactEmail, `Your NECTA Labs stockist application`, applicantHtml),
    ]).catch((err) => console.error('[stockist] email error:', err));

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Submission failed';
    console.error('[api/stockist-application]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function row(label: string, value: string) {
  return `<p style="font-size:13px;margin:4px 0"><span style="color:#999;margin-right:8px">${label}:</span><strong>${value}</strong></p>`;
}
