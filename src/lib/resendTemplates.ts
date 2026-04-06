/**
 * Resend template IDs and a raw-fetch helper.
 *
 * The Resend TypeScript SDK v6 does not expose `template_id` as a typed
 * parameter, so we call the REST API directly.
 */

export const RESEND_TEMPLATES = {
  ORDER_CONFIRMATION:    '5aa58376-5fde-4e81-9fd6-0bd81a1daace',
  SUBSCRIPTION_WELCOME:  'affee8ae-d524-49e4-87d7-bdaffe6644a4',
  LAUNCH_ANNOUNCEMENT:   '5009f78f-d767-4487-9f80-6b6e1b906174',
} as const;

const FROM = 'NECTA Labs <hello@nectalabs.com>';

/**
 * Send an email using a Resend template.
 *
 * @param templateId  One of the RESEND_TEMPLATES values
 * @param to          Recipient email address
 * @param variables   Key/value pairs passed to the template
 * @returns           The Resend email ID on success
 */
export async function sendTemplate(
  templateId: string,
  to: string,
  variables: Record<string, string>,
): Promise<string> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured');

  console.log('[resendTemplates] sendTemplate called — template:', templateId, '| to:', to, '| variables:', variables);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      template_id: templateId,
      variables,
    }),
  });

  const json = (await res.json()) as { id?: string; message?: string };
  console.log('[resendTemplates] API response status:', res.status, '| body:', json);

  if (!res.ok) {
    throw new Error(`Resend API error ${res.status}: ${json.message ?? JSON.stringify(json)}`);
  }

  return json.id ?? 'unknown';
}
