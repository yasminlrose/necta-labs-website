const BASE = `
  font-family: system-ui, -apple-system, sans-serif;
  color: #1E2D3D;
  background: #ffffff;
  max-width: 560px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const HEADING = `font-size: 24px; font-weight: 700; margin: 0 0 8px;`;
const BODY = `font-size: 15px; line-height: 1.7; color: #4a5568; margin: 0 0 16px;`;
const LABEL = `font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af;`;
const VALUE = `font-size: 15px; font-weight: 600; color: #1E2D3D;`;
const DIVIDER = `border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;`;
const FOOTER = `font-size: 13px; color: #9ca3af; margin-top: 40px;`;
const SIG = `font-size: 14px; color: #4a5568; font-style: italic;`;

function wrap(content: string) {
  return `<!DOCTYPE html><html><body style="${BASE}">${content}</body></html>`;
}

/* ─── Email 1 — Pre-order confirmation ─────────────────────────── */
export interface PreOrderEmailData {
  firstName: string;
  productName: string;
  size: string;
  amount: string;
  dispatchDate?: string;
}

export function preOrderEmail(d: PreOrderEmailData) {
  const dispatch = d.dispatchDate ?? 'Summer 2026';
  return {
    subject: "Your NECTA order is confirmed — here's what happens next",
    html: wrap(`
      <p style="${HEADING}">Your order is confirmed.</p>
      <p style="${BODY}">Hi ${d.firstName},</p>
      <p style="${BODY}">
        Thank you for pre-ordering NECTA. You're one of the first people to have this —
        and that genuinely means a lot to us.
      </p>
      <p style="${BODY}">Here's what to expect:</p>
      <hr style="${DIVIDER}" />
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="${LABEL}padding:8px 0;">Your order</td>
          <td style="${VALUE}padding:8px 0;text-align:right;">${d.productName} — ${d.size}</td>
        </tr>
        <tr>
          <td style="${LABEL}padding:8px 0;">Order total</td>
          <td style="${VALUE}padding:8px 0;text-align:right;">${d.amount}</td>
        </tr>
        <tr>
          <td style="${LABEL}padding:8px 0;">Expected dispatch</td>
          <td style="${VALUE}padding:8px 0;text-align:right;">${dispatch}</td>
        </tr>
      </table>
      <hr style="${DIVIDER}" />
      <p style="${BODY}">
        We'll email you the moment your order ships with a tracking link. If anything changes
        with the timeline we'll let you know straight away — no radio silence, ever.
      </p>
      <p style="${BODY}">
        In the meantime, if you have any questions just reply to this email. It comes straight to us.
      </p>
      <p style="${BODY}">Thank you for being here at the beginning.</p>
      <p style="${SIG}">Yaz<br/>Founder, NECTA Labs<br/>hello@nectalabs.com</p>
      <p style="${FOOTER}">© 2026 NECTA GROUP LTD — Registered in England &amp; Wales</p>
    `),
  };
}

/* ─── Email 2 — Subscription welcome ───────────────────────────── */
export type ProductSlug = 'focus' | 'immunity' | 'calm' | 'glow';

export interface SubscriptionEmailData {
  firstName: string;
  productName: string;
  productSlug: ProductSlug;
  size: string;
  amount: string;
  nextChargeDate: string;
  frequency: string;
}

const usageTips: Record<ProductSlug, string> = {
  focus:
    'Add 2 to 4 pumps to your morning coffee or tea. Effects build over the first 2 weeks — stick with it.',
  calm:
    'Add 2 to 4 pumps to chamomile tea or warm oat milk in the evening. Most people notice a difference within 10 to 14 days.',
  immunity:
    'Add 2 to 4 pumps to any drink, morning or evening. Works best when used daily — consistency is everything.',
  glow:
    'Add 2 to 4 pumps to your morning tea, smoothie or water. Skin changes take 3 to 4 weeks to become visible — keep going.',
};

export function subscriptionWelcomeEmail(d: SubscriptionEmailData) {
  const tip = usageTips[d.productSlug] ?? 'Add 2 to 4 pumps to any drink of your choice.';
  return {
    subject: 'Welcome to NECTA — your first order is on its way',
    html: wrap(`
      <p style="${HEADING}">Your subscription is live.</p>
      <p style="${BODY}">Hi ${d.firstName},</p>
      <p style="${BODY}">Your NECTA subscription is live. Here's everything you need to know:</p>
      <hr style="${DIVIDER}" />
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="${LABEL}padding:8px 0;">Your subscription</td>
          <td style="${VALUE}padding:8px 0;text-align:right;">${d.productName} — ${d.size}</td>
        </tr>
        <tr>
          <td style="${LABEL}padding:8px 0;">First charge</td>
          <td style="${VALUE}padding:8px 0;text-align:right;">${d.amount} taken today</td>
        </tr>
        <tr>
          <td style="${LABEL}padding:8px 0;">Next charge</td>
          <td style="${VALUE}padding:8px 0;text-align:right;">${d.nextChargeDate}</td>
        </tr>
        <tr>
          <td style="${LABEL}padding:8px 0;">Delivery frequency</td>
          <td style="${VALUE}padding:8px 0;text-align:right;">${d.frequency}</td>
        </tr>
      </table>
      <hr style="${DIVIDER}" />
      <p style="${LABEL}margin-bottom:8px;">Managing your subscription</p>
      <p style="${BODY}">
        You can pause, skip or cancel any time from your account at
        <a href="https://nectalabs.com/account" style="color:#1E2D3D;">nectalabs.com/account</a> —
        no hoops, no awkward cancellation flows. We mean that.
      </p>
      <p style="${LABEL}margin-bottom:8px;">Getting the most from ${d.productName}</p>
      <p style="${BODY}">${tip}</p>
      <p style="${BODY}">Any questions, just reply here.</p>
      <p style="${SIG}">Yaz<br/>Founder, NECTA Labs<br/>hello@nectalabs.com</p>
      <p style="${FOOTER}">© 2026 NECTA GROUP LTD — Registered in England &amp; Wales</p>
    `),
  };
}

/* ─── Email 3 — Launch announcement ────────────────────────────── */
export interface LaunchEmailData {
  firstName: string;
}

export function launchAnnouncementEmail(d: LaunchEmailData) {
  return {
    subject: 'We\'re live — and you\'re first',
    html: wrap(`
      <p style="${HEADING}">Today is the day.</p>
      <p style="${BODY}">Hi ${d.firstName || 'there'},</p>
      <p style="${BODY}">NECTA Labs is officially open.</p>
      <p style="${BODY}">
        All four infusions — FOCUS, CALM, IMMUNITY and GLOW — are available now at
        <a href="https://nectalabs.com" style="color:#1E2D3D;">nectalabs.com</a>.
      </p>
      <p style="${BODY}">
        You signed up because you wanted something better than another supplement to swallow.
        A wellness habit that fits around your life, not the other way around. That's exactly what we built.
      </p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;">
        <tr><td style="padding:10px 0;border-top:1px solid #e5e7eb;">
          <strong style="color:#1E2D3D;">FOCUS</strong> — Lion's Mane + Rhodiola. For the mornings when you need to be on.
        </td></tr>
        <tr><td style="padding:10px 0;border-top:1px solid #e5e7eb;">
          <strong style="color:#1E2D3D;">CALM</strong> — Ashwagandha + Reishi. For the evenings when you need to come down.
        </td></tr>
        <tr><td style="padding:10px 0;border-top:1px solid #e5e7eb;">
          <strong style="color:#1E2D3D;">IMMUNITY</strong> — For daily defence without the daily effort.
        </td></tr>
        <tr><td style="padding:10px 0;border-top:1px solid #e5e7eb;">
          <strong style="color:#1E2D3D;">GLOW</strong> — Because skin health starts before the moisturiser.
        </td></tr>
      </table>
      <p style="${BODY}">All liquid. All UK-made. All add to whatever you're already drinking.</p>
      <p style="margin:24px 0;">
        <a href="https://nectalabs.com/shop" style="display:inline-block;background:#1E2D3D;color:#ffffff;font-weight:700;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;">
          Shop now — nectalabs.com
        </a>
      </p>
      <p style="${BODY}">
        Not sure where to start? The 7-day sachet trial is £12 — one sachet per day,
        try it in your morning coffee, see how you feel by Friday.
      </p>
      <p style="${BODY}">Thank you for being here before it was easy to be here.</p>
      <p style="${SIG}">Yaz<br/>Founder, NECTA Labs</p>
      <p style="${BODY}">
        P.S. If you love it, tell someone. We're a tiny team and word of mouth is everything right now.
      </p>
      <p style="${FOOTER}">© 2026 NECTA GROUP LTD — Registered in England &amp; Wales</p>
    `),
  };
}
