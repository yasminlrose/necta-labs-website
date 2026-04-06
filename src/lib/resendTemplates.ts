/**
 * Resend template IDs and a helper that sends via the Resend SDK.
 *
 * The Resend TypeScript SDK doesn't expose `template_id` / `variables` in its
 * types, so we cast to `any` to pass them through. The SDK still serialises
 * them correctly and the API accepts them.
 */

import { resend } from '@/lib/resend';

export const RESEND_TEMPLATES = {
  ORDER_CONFIRMATION:   '5aa58376-5fde-4e81-9fd6-0bd81a1daace',
  SUBSCRIPTION_WELCOME: 'affee8ae-d524-49e4-87d7-bdaffe6644a4',
  LAUNCH_ANNOUNCEMENT:  '5009f78f-d767-4487-9f80-6b6e1b906174',
} as const;

const FROM = 'NECTA Labs <hello@nectalabs.com>';

/**
 * Send an email using a Resend template.
 *
 * @param templateId  One of the RESEND_TEMPLATES values
 * @param to          Recipient email address
 * @param subject     Email subject line
 * @param variables   Key/value pairs passed to the template
 * @returns           The Resend email ID on success
 */
export async function sendTemplate(
  templateId: string,
  to: string,
  subject: string,
  variables: Record<string, string>,
): Promise<string> {
  console.log('[resendTemplates] sendTemplate called — template:', templateId, '| to:', to, '| subject:', subject, '| variables:', variables);

  const result = await (resend.emails.send as (o: unknown) => Promise<{ data?: { id?: string }; error?: unknown }>)({
    from: FROM,
    to,
    subject,
    template_id: templateId,
    variables,
  });

  console.log('[resendTemplates] API result:', result);

  if (result.error) {
    throw new Error(`Resend error: ${JSON.stringify(result.error)}`);
  }

  return result.data?.id ?? 'unknown';
}
