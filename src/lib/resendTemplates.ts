/**
 * Resend email sending — fetches templates from Resend dashboard, substitutes
 * {{variables}}, and sends via the emails API.
 *
 * Templates are managed at resend.com/emails/templates and can be edited there
 * without touching this code. Variable substitution uses {{variable_name}} syntax.
 *
 * Template aliases (editable in Resend dashboard):
 *   order-confirmation   — deposit / one-off pre-order confirmation
 *   subscription-welcome — subscription set-up confirmation
 *   newsletter-welcome   — waitlist / newsletter sign-up
 *   launch-announcement  — launch blast to all subscribers
 */

const RESEND_API = 'https://api.resend.com';
const FROM = 'NECTA Labs <hello@nectalabs.com>';

export const TEMPLATE_ALIASES = {
  ORDER_CONFIRMATION:   'pre-order-confirmation',
  SUBSCRIPTION_WELCOME: 'subscription-welcome',
  NEWSLETTER_WELCOME:   'waitlist-email',
  LAUNCH_ANNOUNCEMENT:  'launch-announcement',
} as const;

// Legacy compat — kept so any remaining imports don't break
export const RESEND_TEMPLATES = {} as const;

type TemplateAlias = typeof TEMPLATE_ALIASES[keyof typeof TEMPLATE_ALIASES];
type EmailType = 'deposit' | 'preorder' | 'subscription' | 'newsletter' | 'launch';

interface ResendTemplate {
  id: string;
  alias: string;
  subject: string;
  html: string;
  text: string;
}

/** In-memory cache so we don't fetch the same template twice per cold start. */
const templateCache = new Map<string, ResendTemplate>();

async function fetchTemplate(alias: string, apiKey: string): Promise<ResendTemplate> {
  if (templateCache.has(alias)) return templateCache.get(alias)!;

  const res = await fetch(`${RESEND_API}/templates/${alias}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch template "${alias}": ${res.status}`);
  }

  const t = await res.json() as ResendTemplate;
  templateCache.set(alias, t);
  return t;
}

/** Replace all {{variable}} and {{{variable}}} placeholders in a string. */
function interpolate(str: string, vars: Record<string, string>): string {
  // Handle triple braces first (Handlebars unescaped), then double braces
  return str
    .replace(/\{\{\{(\w+)\}\}\}/g, (_, key) => vars[key] ?? `{{{${key}}}}`)
    .replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

/** Send an email using a Resend dashboard template. Variables replace {{placeholders}}. */
export async function sendTemplate(
  aliasOrId: string,
  to: string,
  variables: Record<string, string>,
): Promise<string> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured');

  const template = await fetchTemplate(aliasOrId, apiKey);

  const html = interpolate(template.html, variables);
  const text = interpolate(template.text, variables);
  const subject = interpolate(template.subject, variables);

  console.log('[resend] sending template:', template.alias, '→', to);

  const res = await fetch(`${RESEND_API}/emails`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html, text }),
  });

  const data = await res.json() as { id?: string; message?: string };
  console.log('[resend] response:', res.status, data);

  if (!res.ok) throw new Error(`Resend error ${res.status}: ${JSON.stringify(data)}`);
  return data.id ?? 'unknown';
}

const NOTIFY_TO = 'hello@nectalabs.com';

/**
 * Send a plain-text internal notification to hello@nectalabs.com.
 * Non-blocking — call without await or catch errors yourself.
 */
export async function sendInternalNotification(subject: string, text: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  try {
    await fetch(`${RESEND_API}/emails`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [NOTIFY_TO], subject, text }),
    });
  } catch {
    // non-blocking — never fail the main flow
  }
}

/** Typed helper — maps email type to the right template + variables. */
export async function sendEmail(
  type: EmailType,
  to: string,
  variables: Record<string, string>,
): Promise<string> {
  const aliasMap: Record<EmailType, TemplateAlias> = {
    deposit:      'pre-order-confirmation',
    preorder:     'pre-order-confirmation',
    subscription: 'subscription-welcome',
    newsletter:   'waitlist-email',
    launch:       'launch-announcement',
  };
  return sendTemplate(aliasMap[type], to, variables);
}
