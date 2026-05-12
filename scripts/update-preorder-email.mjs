/**
 * Updates the pre-order-confirmation Resend template with new content.
 * Run with: node scripts/update-preorder-email.mjs
 * Requires RESEND_API_KEY in .env.local
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envPath = resolve(__dirname, '../.env.local');
const env = readFileSync(envPath, 'utf8');
const apiKey = env.match(/RESEND_API_KEY=(.+)/)?.[1]?.trim();

if (!apiKey) {
  console.error('❌  RESEND_API_KEY not found in .env.local');
  process.exit(1);
}

const ALIAS = 'pre-order-confirmation';
const API   = 'https://api.resend.com';

const SUBJECT = 'You\'re Founding Member #{{{member_number}}} — your NECTA order is confirmed';

const HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#fdfcfa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdfcfa;">
    <tr>
      <td align="center" style="padding:48px 20px 64px;">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:28px;overflow:hidden;border:1px solid #f0ede8;">

          <!-- Header -->
          <tr>
            <td style="padding:44px 44px 36px;text-align:center;border-bottom:1px solid #f4f1ec;">
              <p style="margin:0 0 24px;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#b0a090;">NECTA Labs</p>

              <!-- Member badge -->
              <table cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 24px;">
                <tr>
                  <td style="background:linear-gradient(135deg,#1a1410 0%,#3a2e28 100%);border-radius:50%;width:80px;height:80px;text-align:center;vertical-align:middle;">
                    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.5);line-height:1;">#</p>
                    <p style="margin:0;font-size:28px;font-weight:900;color:#ffffff;line-height:1.1;">{{{member_number}}}</p>
                  </td>
                </tr>
              </table>

              <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#1a1410;letter-spacing:-0.5px;line-height:1.25;">You're Founding Member #{{{member_number}}} of 100.</h1>
              <p style="margin:0;font-size:15px;color:#9a8e82;line-height:1.55;">Hi {{{first_name}}} — your pre-order is confirmed, and we are so glad you're here.</p>
            </td>
          </tr>

          <!-- Order summary -->
          <tr>
            <td style="padding:26px 44px;background:#f9f7f4;border-bottom:1px solid #f0ede8;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#b0a090;">Order</td>
                  <td style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#b0a090;text-align:right;">Amount</td>
                </tr>
                <tr>
                  <td style="padding-top:10px;font-size:15px;font-weight:600;color:#1a1410;">{{{product_name}}}</td>
                  <td style="padding-top:10px;font-size:15px;font-weight:700;color:#1a1410;text-align:right;">{{{order_total}}}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:10px;font-size:12px;color:#b0a090;">
                    Ships {{{dispatch_date}}} &nbsp;·&nbsp; Balance charged on dispatch &nbsp;·&nbsp; Free UK delivery
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Perks intro -->
          <tr>
            <td style="padding:40px 44px 4px;text-align:center;">
              <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#b0a090;">Exclusive to founding members</p>
              <h2 style="margin:0;font-size:20px;font-weight:800;color:#1a1410;line-height:1.35;">To say thank you, here are your perks.</h2>
            </td>
          </tr>

          <!-- Perks -->
          <tr>
            <td style="padding:24px 36px 12px;">

              <!-- Perk 1 — teal -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;background:#D6EBEA;border-radius:20px;">
                <tr>
                  <td style="padding:22px 24px;">
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="vertical-align:middle;padding-right:16px;width:52px;">
                          <table cellpadding="0" cellspacing="0"><tr><td style="background:#5B9E99;border-radius:14px;width:48px;height:48px;text-align:center;vertical-align:middle;font-size:22px;line-height:1;">🏷️</td></tr></table>
                        </td>
                        <td style="vertical-align:middle;">
                          <p style="margin:0 0 5px;font-size:15px;font-weight:800;color:#1a1410;line-height:1.2;">15% off every order, forever</p>
                          <p style="margin:0;font-size:13px;color:#3d7a76;line-height:1.55;">Never expires. Never decreases. Automatically applied to every order you ever place with us.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Perk 2 — purple (coupon code) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;background:#E0DAEF;border-radius:20px;">
                <tr>
                  <td style="padding:22px 24px;">
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="vertical-align:middle;padding-right:16px;width:52px;">
                          <table cellpadding="0" cellspacing="0"><tr><td style="background:#8878C0;border-radius:14px;width:48px;height:48px;text-align:center;vertical-align:middle;font-size:22px;line-height:1;">👑</td></tr></table>
                        </td>
                        <td style="vertical-align:middle;">
                          <p style="margin:0 0 6px;font-size:15px;font-weight:800;color:#1a1410;line-height:1.2;">Your exclusive discount code</p>
                          <p style="margin:0 0 10px;font-size:13px;color:#5848a0;line-height:1.55;">This code is yours alone — tied to your founding member number. Use it, or just know it exists.</p>
                          <!-- Code pill -->
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background:#ffffff;border:2px dashed #8878C0;border-radius:12px;padding:10px 20px;text-align:center;">
                                <p style="margin:0;font-size:18px;font-weight:900;color:#1a1410;letter-spacing:0.15em;font-family:monospace,monospace;">{{{coupon_code}}}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Perk 3 — terracotta -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;background:#F2DDD4;border-radius:20px;">
                <tr>
                  <td style="padding:22px 24px;">
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="vertical-align:middle;padding-right:16px;width:52px;">
                          <table cellpadding="0" cellspacing="0"><tr><td style="background:#C06040;border-radius:14px;width:48px;height:48px;text-align:center;vertical-align:middle;font-size:22px;line-height:1;">🧪</td></tr></table>
                        </td>
                        <td style="vertical-align:middle;">
                          <p style="margin:0 0 5px;font-size:15px;font-weight:800;color:#1a1410;line-height:1.2;">First access to new flavours</p>
                          <p style="margin:0;font-size:13px;color:#904020;line-height:1.55;">Every new variant we launch, founding members try it before anyone else. Always. No exceptions.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:16px 44px 44px;text-align:center;">
              <p style="margin:0 0 20px;font-size:13px;color:#b0a090;line-height:1.6;">Click below to sign in and access your order details, founding member dashboard, and more. No password needed.</p>
              <a href="{{{sign_in_url}}}" style="display:inline-block;background:#1a1410;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:17px 38px;border-radius:100px;letter-spacing:-0.2px;">Sign in to my account →</a>
              <p style="margin:14px 0 0;font-size:11px;color:#c8c0b8;">This sign-in link expires in 24 hours.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:22px 44px;background:#f9f7f4;border-top:1px solid #f0ede8;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#c0b8b0;">Questions? Just reply to this email.</p>
              <p style="margin:0;font-size:11px;color:#d0c8c0;">NECTA Labs · London, UK · <a href="https://nectalabs.com" style="color:#b0a090;text-decoration:none;">nectalabs.com</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

const TEXT = `You're Founding Member #{{{member_number}}} of 100. Your NECTA pre-order is confirmed.

Hi {{{first_name}}},

ORDER SUMMARY
Product: {{{product_name}}}
Amount: {{{order_total}}}
Ships: {{{dispatch_date}}} · Balance charged on dispatch · Free UK delivery

---

YOUR FOUNDING MEMBER PERKS:

🏷️  15% off every order, forever
Automatically applied to every order. Never expires.

👑  Your exclusive discount code: {{{coupon_code}}}
Tied to your founding member number. Use it or just know it's yours.

🧪  First access to new flavours
Every new variant we launch, you try it first. Always.

---

Sign in to your account (link expires in 24 hours):
{{{sign_in_url}}}

---

Questions? Reply to this email or visit nectalabs.com
NECTA Labs · London, UK`;

const VARIABLES = [
  { key: 'first_name',    type: 'string', fallback: 'there' },
  { key: 'product_name',  type: 'string', fallback: 'NECTA Infusion' },
  { key: 'order_total',   type: 'string', fallback: '£10 deposit' },
  { key: 'dispatch_date', type: 'string', fallback: 'November 2026' },
  { key: 'sign_in_url',   type: 'string', fallback: 'https://nectalabs.com/account' },
  { key: 'member_number', type: 'string', fallback: '?' },
  { key: 'coupon_code',   type: 'string', fallback: 'FOUNDING?' },
];

async function run() {
  // 1. Fetch template to get its ID
  console.log(`Fetching template "${ALIAS}"…`);
  const fetchRes = await fetch(`${API}/templates/${ALIAS}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!fetchRes.ok) {
    console.error('❌  Failed to fetch template:', fetchRes.status, await fetchRes.text());
    process.exit(1);
  }
  const template = await fetchRes.json();
  console.log(`✓  Found template: id=${template.id}`);

  // 2. PATCH with new content
  console.log('Updating template…');
  const patchRes = await fetch(`${API}/templates/${template.id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: SUBJECT,
      html: HTML,
      text: TEXT,
      variables: VARIABLES,
    }),
  });
  const patchBody = await patchRes.json();
  if (!patchRes.ok) {
    console.error('❌  PATCH failed:', patchRes.status, JSON.stringify(patchBody, null, 2));
    process.exit(1);
  }
  console.log('✓  Template updated');

  // 3. Publish
  console.log('Publishing…');
  const pubRes = await fetch(`${API}/templates/${template.id}/publish`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const pubBody = await pubRes.json().catch(() => ({}));
  if (!pubRes.ok) {
    console.error('❌  Publish failed:', pubRes.status, JSON.stringify(pubBody, null, 2));
    process.exit(1);
  }
  console.log('✓  Published!');
  console.log('\n🎉  pre-order-confirmation template is live.');
}

run().catch((err) => { console.error(err); process.exit(1); });
