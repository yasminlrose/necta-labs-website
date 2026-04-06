import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { resend } from '@/lib/resend';
import { preOrderEmail, subscriptionWelcomeEmail } from '@/lib/emails';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_details?.email;
    const fullName = session.customer_details?.name ?? '';
    const firstName = fullName.split(' ')[0] || 'there';
    const amountPence = session.amount_total ?? 0;
    const amount = `£${(amountPence / 100).toFixed(2)}`;
    const productName = session.metadata?.productName ?? 'NECTA Infusion';
    const size = session.metadata?.size ?? '';
    const productSlug = (session.metadata?.productSlug ?? 'focus') as import('@/lib/emails').ProductSlug;

    if (!email) return NextResponse.json({ received: true });

    if (session.mode === 'payment') {
      const { subject, html } = preOrderEmail({
        firstName,
        productName,
        size,
        amount,
        dispatchDate: 'within 5–7 working days',
      });
      await resend.emails.send({
        from: 'NECTA Labs <hello@nectalabs.com>',
        to: [email],
        subject,
        html,
      });
    } else if (session.mode === 'subscription') {
      const nextCharge = new Date();
      nextCharge.setDate(nextCharge.getDate() + 30);
      const nextChargeDate = nextCharge.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      });

      const { subject, html } = subscriptionWelcomeEmail({
        firstName,
        productName,
        productSlug,
        size,
        amount,
        nextChargeDate,
      });
      await resend.emails.send({
        from: 'NECTA Labs <hello@nectalabs.com>',
        to: [email],
        subject,
        html,
      });
    }
  }

  return NextResponse.json({ received: true });
}
