/**
 * Resend email sending — inline HTML, no external templates required.
 */

const FROM = 'NECTA Labs <hello@nectalabs.com>';

const baseStyle = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f9f7f4;
  margin: 0; padding: 0;
`;

function wrap(content: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${baseStyle}">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
    <!-- Header -->
    <div style="background:#1E2D3D;padding:28px 36px;">
      <span style="color:#fff;font-size:20px;font-weight:700;letter-spacing:-0.5px;">NECTA Labs</span>
    </div>
    <!-- Body -->
    <div style="padding:36px;">
      ${content}
    </div>
    <!-- Footer -->
    <div style="padding:24px 36px;border-top:1px solid #f0ede8;text-align:center;">
      <p style="color:#999;font-size:12px;margin:0;">NECTA GROUP LTD · Registered in England &amp; Wales</p>
      <p style="color:#bbb;font-size:11px;margin:6px 0 0;">hello@nectalabs.com · nectalabs.com</p>
    </div>
  </div>
</body></html>`;
}

function h1(text: string): string {
  return `<h1 style="color:#1E2D3D;font-size:24px;font-weight:700;margin:0 0 8px;letter-spacing:-0.5px;">${text}</h1>`;
}

function p(text: string, muted = false): string {
  return `<p style="color:${muted ? '#888' : '#1E2D3D'};font-size:15px;line-height:1.6;margin:0 0 16px;">${text}</p>`;
}

function box(content: string): string {
  return `<div style="background:#f9f7f4;border-radius:12px;padding:20px 24px;margin:24px 0;">${content}</div>`;
}

function row(label: string, value: string): string {
  return `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #ede9e3;">
    <span style="color:#888;font-size:14px;">${label}</span>
    <span style="color:#1E2D3D;font-size:14px;font-weight:600;">${value}</span>
  </div>`;
}

function badge(text: string): string {
  return `<span style="display:inline-block;background:#1E2D3D;color:#fff;font-size:12px;font-weight:600;padding:4px 12px;border-radius:100px;margin-bottom:20px;">${text}</span>`;
}

function cta(text: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;background:#1E2D3D;color:#fff;font-size:14px;font-weight:600;padding:14px 28px;border-radius:10px;text-decoration:none;margin-top:8px;">${text}</a>`;
}

// ── Email builders ─────────────────────────────────────────────────────────────

function depositConfirmationHtml(vars: Record<string, string>): string {
  const { first_name, product_name, order_total, dispatch_date } = vars;
  return wrap(`
    ${badge('Pre-order confirmed')}
    ${h1(`You're in, ${first_name || 'there'}!`)}
    ${p('Your NECTA pre-order is reserved. Here\'s what you ordered:')}
    ${box(`
      ${row('Product', product_name || 'NECTA Infusion')}
      ${row('Deposit paid today', order_total || '£10')}
      ${row('Balance due', `On dispatch (${dispatch_date || 'November 2026'})`)}
      ${row('Estimated dispatch', dispatch_date || 'November 2026')}
    `)}
    ${p('We\'ll email you before we charge anything. Cancel any time before dispatch for a full refund — no questions asked.', true)}
    ${cta('View your order →', 'https://nectalabs.com/account')}
    <p style="color:#bbb;font-size:12px;margin-top:24px;">Questions? Reply to this email or contact hello@nectalabs.com</p>
  `);
}

function subscriptionWelcomeHtml(vars: Record<string, string>): string {
  const { first_name, product_name, amount, next_billing_date, frequency } = vars;
  return wrap(`
    ${badge('Subscription confirmed')}
    ${h1(`Welcome, ${first_name || 'there'}!`)}
    ${p('Your NECTA subscription is set up. No payment is taken today — your first charge is when your order ships.')}
    ${box(`
      ${row('Product', product_name || 'NECTA Infusion')}
      ${row('Amount', amount || '')}
      ${row('Frequency', frequency || 'Monthly')}
      ${row('First charge', next_billing_date || 'November 2026')}
    `)}
    ${p('You can manage or cancel your subscription any time from your account.', true)}
    ${cta('Manage subscription →', 'https://nectalabs.com/account')}
  `);
}

function newsletterWelcomeHtml(vars: Record<string, string>): string {
  const { first_name } = vars;
  return wrap(`
    ${h1(`Hey ${first_name || 'there'} 👋`)}
    ${p('You\'re on the NECTA Labs list — welcome.')}
    ${p('We\'ll send you launch updates, early access to new products, and the occasional behind-the-scenes from the lab. No spam, ever.')}
    ${box(`<p style="color:#1E2D3D;font-size:14px;margin:0;font-style:italic;">"Functional infusions with adaptogens, nootropics and botanicals. One pump into any drink."</p>`)}
    ${cta('Explore NECTA →', 'https://nectalabs.com')}
  `);
}

function launchAnnouncementHtml(vars: Record<string, string>): string {
  const { first_name } = vars;
  return wrap(`
    ${badge('🚀 We\'re live!')}
    ${h1(`${first_name || 'Hey'}, NECTA is officially launching!`)}
    ${p('The wait is over. Your order is being prepared and will ship soon.')}
    ${p('As a founding member, you have 15% off locked in for life. Thank you for being here from the start.', true)}
    ${cta('Complete your order →', 'https://nectalabs.com/pre-order')}
  `);
}

// ── Send function ──────────────────────────────────────────────────────────────

type EmailType = 'deposit' | 'preorder' | 'subscription' | 'newsletter' | 'launch';

export async function sendEmail(
  type: EmailType,
  to: string,
  variables: Record<string, string>,
): Promise<string> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured');

  const subjects: Record<EmailType, string> = {
    deposit:      `Your NECTA pre-order is confirmed ✓`,
    preorder:     `Your NECTA pre-order is confirmed ✓`,
    subscription: `Your NECTA subscription is confirmed ✓`,
    newsletter:   `Welcome to NECTA Labs`,
    launch:       `NECTA is live — your order is on the way`,
  };

  const htmlBuilders: Record<EmailType, (v: Record<string, string>) => string> = {
    deposit:      depositConfirmationHtml,
    preorder:     depositConfirmationHtml,
    subscription: subscriptionWelcomeHtml,
    newsletter:   newsletterWelcomeHtml,
    launch:       launchAnnouncementHtml,
  };

  const html = htmlBuilders[type](variables);

  console.log('[resend] sending', type, '→', to);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject: subjects[type],
      html,
    }),
  });

  const data = (await response.json()) as { id?: string; message?: string };
  console.log('[resend] response', response.status, data);

  if (!response.ok) {
    throw new Error(`Resend error ${response.status}: ${JSON.stringify(data)}`);
  }

  return data.id ?? 'unknown';
}

// Legacy compat — used in existing routes
export const RESEND_TEMPLATES = {} as const;
export async function sendTemplate(
  _templateId: string,
  to: string,
  variables: Record<string, string>,
): Promise<string> {
  // Map old template calls to new typed function
  if (variables.frequency !== undefined) return sendEmail('subscription', to, variables);
  if (variables.order_total !== undefined) return sendEmail('deposit', to, variables);
  if (variables.first_name !== undefined && Object.keys(variables).length === 1) return sendEmail('newsletter', to, variables);
  return sendEmail('deposit', to, variables);
}
