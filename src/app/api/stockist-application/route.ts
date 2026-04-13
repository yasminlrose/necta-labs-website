import { NextRequest, NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = 'NECTA Labs <hello@nectalabs.com>';
const NOTIFY_EMAIL = 'hello@nectalabs.com';

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Resend error: ${JSON.stringify(err)}`);
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

    if (!businessName || !businessType || !contactName || !contactEmail || !city || !postcode || !whyNecta) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const submittedAt = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });

    // Internal notification to NECTA
    const internalHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
        <div style="background:#1a1a2e;padding:24px;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:20px">New Stockist Application</h1>
          <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:13px">${submittedAt}</p>
        </div>
        <div style="background:#f9f9fb;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e8e8ed;border-top:none">

          <h3 style="margin:0 0 12px;font-size:14px;color:#666;text-transform:uppercase;letter-spacing:0.05em">Business</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            ${row("Business name", businessName)}
            ${row("Type", businessType)}
            ${row("Location", `${city}, ${postcode}`)}
            ${row("Website", website || "—")}
            ${row("Instagram", instagram ? `@${instagram.replace('@', '')}` : "—")}
            ${row("VAT number", vatNumber || "—")}
          </table>

          <h3 style="margin:0 0 12px;font-size:14px;color:#666;text-transform:uppercase;letter-spacing:0.05em">Contact</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            ${row("Name", contactName)}
            ${row("Email", `<a href="mailto:${contactEmail}">${contactEmail}</a>`)}
            ${row("Phone", contactPhone || "—")}
          </table>

          <h3 style="margin:0 0 12px;font-size:14px;color:#666;text-transform:uppercase;letter-spacing:0.05em">Fit</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            ${row("Monthly units", monthlyUnits || "Not specified")}
            ${row("Heard about NECTA", heardAbout || "—")}
          </table>

          <div style="background:white;border:1px solid #e8e8ed;border-radius:8px;padding:16px;margin-bottom:20px">
            <p style="margin:0 0 6px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.05em">Why they want to stock NECTA</p>
            <p style="margin:0;font-size:14px;color:#1a1a2e;line-height:1.6">${whyNecta.replace(/\n/g, '<br/>')}</p>
          </div>

          <div style="display:flex;gap:12px">
            <a href="mailto:${contactEmail}?subject=Your NECTA Labs stockist application"
               style="display:inline-block;background:#1a1a2e;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600">
              Reply to applicant
            </a>
          </div>
        </div>
      </div>
    `;

    // Confirmation to applicant
    const applicantHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
        <div style="background:#1a1a2e;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:white;margin:0;font-size:24px;font-weight:700">NECTA Labs</h1>
          <p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:12px;letter-spacing:0.1em;text-transform:uppercase">Stockist Application</p>
        </div>
        <div style="background:#f9f9fb;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e8e8ed;border-top:none">
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px">Hi ${contactName.split(' ')[0]},</p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px">
            Thank you for applying to stock NECTA Labs at <strong>${businessName}</strong>.
            We've received your application and will review it personally.
          </p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 24px">
            We review every application to make sure we're the right fit for each other.
            You'll hear from us within <strong>3–5 business days</strong>.
          </p>
          <div style="background:white;border:1px solid #e8e8ed;border-radius:8px;padding:16px;margin-bottom:24px">
            <p style="margin:0;font-size:13px;color:#666">
              In the meantime, if you have any questions don't hesitate to reach out directly at{" "}
              <a href="mailto:hello@nectalabs.com" style="color:#1a1a2e">hello@nectalabs.com</a>
            </p>
          </div>
          <p style="font-size:14px;color:#666;margin:0">
            Warm regards,<br/>
            <strong style="color:#1a1a2e">Yaz</strong><br/>
            Founder, NECTA Labs
          </p>
        </div>
      </div>
    `;

    await Promise.all([
      sendEmail(NOTIFY_EMAIL, `New stockist application: ${businessName} (${city})`, internalHtml),
      sendEmail(contactEmail, `Your NECTA Labs stockist application`, applicantHtml),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Submission failed';
    console.error('[api/stockist-application]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:6px 12px 6px 0;font-size:12px;color:#999;vertical-align:top;white-space:nowrap">${label}</td>
      <td style="padding:6px 0;font-size:13px;color:#1a1a2e;font-weight:500">${value}</td>
    </tr>
  `;
}
