import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resendTemplates';

export async function POST(req: NextRequest) {
  let body: { type: string; to: string; data: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { type, to, data } = body;

  if (!type || !to || typeof to !== 'string' || !to.includes('@')) {
    return NextResponse.json({ error: 'Missing or invalid type/to' }, { status: 400 });
  }

  try {
    let id: string;

    if (type === 'preorder' || type === 'deposit') {
      id = await sendEmail('deposit', to, {
        first_name:    String(data.firstName ?? 'there'),
        product_name:  String(data.productName ?? 'NECTA Infusion'),
        order_total:   String(data.amount ?? '£10 deposit'),
        dispatch_date: String(data.dispatchDate ?? 'November 2026'),
      });
    } else if (type === 'subscription') {
      id = await sendEmail('subscription', to, {
        first_name:        String(data.firstName ?? 'there'),
        product_name:      String(data.productName ?? 'NECTA Infusion'),
        amount:            String(data.amount ?? ''),
        next_billing_date: String(data.nextChargeDate ?? 'November 2026'),
        frequency:         String(data.frequency ?? 'monthly'),
      });
    } else if (type === 'newsletter') {
      id = await sendEmail('newsletter', to, {
        first_name: String(data.firstName ?? 'there'),
      });
    } else if (type === 'launch') {
      id = await sendEmail('launch', to, {
        first_name: String(data.firstName ?? 'there'),
      });
    } else {
      return NextResponse.json({ error: `Unknown email type: ${type}` }, { status: 400 });
    }

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error('[send-email] failed:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
