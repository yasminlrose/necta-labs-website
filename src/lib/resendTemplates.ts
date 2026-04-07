/**
 * Resend template IDs and a raw REST API helper.
 *
 * Uses "template" (not "template_id") in the request body — this is the
 * correct Resend API parameter name for template-based sends.
 */

export const RESEND_TEMPLATES = {
  ORDER_CONFIRMATION:   '5aa58376-5fde-4e81-9fd6-0bd81a1daace',
  SUBSCRIPTION_WELCOME: 'affee8ae-d524-49e4-87d7-bdaffe6644a4',
  LAUNCH_ANNOUNCEMENT:  '5009f78f-d767-4487-9f80-6b6e1b906174',
  NEWSLETTER_WELCOME:   '2c0f8509-5081-4e62-9038-5b9cec3e65c6',
} as const;

const FROM = 'NECTA Labs <hello@nectalabs.com>';

/**
 * Send an email using a Resend template via the REST API.
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

  console.log('[resendTemplates] sendTemplate — template:', templateId, '| to:', to, '| variables:', variables);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      template: {
        id: templateId,
        variables,
      },
    }),
  });

  const data = (await response.json()) as { id?: string; message?: string; name?: string };
  console.log('[resendTemplates] API response status:', response.status, '| body:', data);

  if (!response.ok) {
    throw new Error(`Resend API error ${response.status}: ${JSON.stringify(data)}`);
  }

  return data.id ?? 'unknown';
}
