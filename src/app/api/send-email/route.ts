import { NextRequest, NextResponse } from 'next/server';
import { sendTemplate, RESEND_TEMPLATES } from '@/lib/resendTemplates';

export async function POST(req: NextRequest) {
  console.log('[send-email] POST received');

  let body: { type: string; to: string; data: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    console.error('[send-email] invalid JSON body');
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { type, to, data } = body;
  console.log('[send-email] type:', type, '| to:', to, '| data:', data);

  if (!type || !to) {
    console.error('[send-email] missing required field — type:', type, '| to:', to);
    return NextResponse.json({ error: 'Missing type or to' }, { status: 400 });
  }

  if (typeof to !== 'string' || !to.includes('@')) {
    console.error('[send-email] invalid email address:', to);
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  try {
    let templateId: string;
    let variables: Record<string, string>;

    if (type === 'preorder') {
      console.log('[send-email] sending order-confirmation template');
      templateId = RESEND_TEMPLATES.ORDER_CONFIRMATION;
      variables = {
        first_name:    String(data.firstName ?? 'there'),
        product_name:  String(data.productName ?? 'NECTA Infusion'),
        order_total:   String(data.amount ?? ''),
        dispatch_date: String(data.dispatchDate ?? 'within 5–7 working days'),
      };
    } else if (type === 'subscription') {
      console.log('[send-email] sending subscription-welcome template');
      templateId = RESEND_TEMPLATES.SUBSCRIPTION_WELCOME;
      variables = {
        first_name:        String(data.firstName ?? 'there'),
        product_name:      String(data.productName ?? 'NECTA Infusion'),
        amount:            String(data.amount ?? ''),
        next_billing_date: String(data.nextChargeDate ?? ''),
        frequency:         String(data.frequency ?? 'monthly'),
      };
    } else if (type === 'launch') {
      console.log('[send-email] sending launch-announcement template');
      templateId = RESEND_TEMPLATES.LAUNCH_ANNOUNCEMENT;
      variables = {
        first_name: String(data.firstName ?? 'there'),
      };
    } else {
      console.error('[send-email] unknown email type:', type);
      return NextResponse.json({ error: `Unknown email type: ${type}` }, { status: 400 });
    }

    const id = await sendTemplate(templateId, to, variables);
    console.log('[send-email] email sent — resend id:', id);
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error('[send-email] failed:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
