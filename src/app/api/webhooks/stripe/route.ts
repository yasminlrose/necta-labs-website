/**
 * Stripe webhook handler.
 *
 * IMPORTANT: Set STRIPE_WEBHOOK_SECRET in Vercel environment variables to the
 * whsec_... secret from your Stripe dashboard → Developers → Webhooks.
 * The value in .env.local is a placeholder and will cause signature
 * verification to fail locally — use `stripe listen --forward-to localhost:PORT/api/webhooks/stripe`
 * to get a real local webhook secret for local testing.
 *
 * Subscribed events (configure in Stripe dashboard → Webhooks):
 *   checkout.session.completed
 *   invoice.payment_succeeded
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { sendEmail } from '@/lib/resendTemplates';
import { createClient } from '@supabase/supabase-js';
import type { User as SupabaseUser } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/** Generate a Supabase magic link for the given email. Returns the URL or a fallback. */
async function generateMagicLink(email: string, origin: string): Promise<string> {
  try {
    const { data, error } = await getSupabaseAdmin().auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo: `${origin}/account` },
    });
    if (error || !data.properties?.action_link) throw new Error(error?.message ?? 'no link');
    return data.properties.action_link;
  } catch (err) {
    console.error('[webhook] generateMagicLink failed:', err instanceof Error ? err.message : String(err));
    return `${origin}/account`;
  }
}

/** Format a Unix timestamp as a human-readable UK date. */
function formatUnixDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Derive a human-readable delivery frequency from session metadata. */
function deriveFrequency(size: string, metaFrequency: string): string {
  if (metaFrequency) return metaFrequency;
  if (size.includes('90-day')) return 'every 3 months';
  if (size.includes('14-day') || size.includes('30-day')) return 'monthly';
  return 'monthly';
}

/** Fetch a Stripe customer's email and first name. */
async function getCustomerDetails(customerId: string): Promise<{ email: string | null; firstName: string }> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return { email: null, firstName: 'there' };
    const c = customer as Stripe.Customer;
    const firstName = (c.name ?? '').trim().split(/\s+/)[0] || 'there';
    return { email: c.email ?? null, firstName };
  } catch (err) {
    console.error('[webhook] getCustomerDetails failed:', err instanceof Error ? err.message : String(err));
    return { email: null, firstName: 'there' };
  }
}

export async function POST(req: NextRequest) {
  console.log('[webhook] POST received');

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    console.error('[webhook] missing stripe-signature header');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    console.log('[webhook] event verified:', event.type, event.id);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    console.error('[webhook] signature verification failed:', message);
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  // ── checkout.session.completed ──────────────────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('[webhook] checkout.session.completed — mode:', session.mode, '| payment_status:', session.payment_status);

    const productName = session.metadata?.productName ?? 'NECTA Infusion';
    const size = session.metadata?.size ?? '';
    const metaFrequency = session.metadata?.frequency ?? '';

    if (session.metadata?.checkoutType === 'deposit') {
      // ── £10 deposit pre-order ────────────────────────────────────────────────
      const email = session.customer_details?.email ?? null;
      if (!email) {
        console.warn('[webhook] no email for deposit — skipping');
        return NextResponse.json({ received: true });
      }
      const rawName = session.customer_details?.name ?? '';
      const firstName = rawName.trim().split(/\s+/)[0] || 'there';
      const balance = session.metadata?.balance ?? '';
      const purchaseType = session.metadata?.purchaseType ?? 'one-off';
      const productSlug = session.metadata?.productSlug ?? '';
      const size = session.metadata?.size ?? '';
      const freq = session.metadata?.frequency ?? '';

      // Save to pre_orders table and get member number (count after insert)
      let memberNumber = 0;
      try {
        const supabase = getSupabase();
        await supabase.from('pre_orders').insert({
          email,
          product_slug: productSlug,
          format: purchaseType === 'subscribe' ? `subscription${freq ? `:${freq}` : ''}` : 'one-off',
          size,
          quantity: 1,
          status: 'deposit_paid',
        });
        const { count } = await supabase
          .from('pre_orders')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'deposit_paid');
        memberNumber = count ?? 0;
        // Also add to email_signups
        await supabase.from('email_signups').insert({
          email,
          source: `deposit-${productSlug}`,
        });
        console.log('[webhook] deposit saved to pre_orders — email:', email, '| member:', memberNumber);
      } catch (err) {
        console.error('[webhook] failed to save deposit to pre_orders:', err instanceof Error ? err.message : String(err));
      }

      // Sync customer name to Supabase auth metadata so the account dashboard
      // shows their real name instead of their email prefix
      if (rawName) {
        try {
          const admin = getSupabaseAdmin();
          const listResult = await admin.auth.admin.listUsers({ perPage: 1000 });
          const existing = (listResult.data.users as SupabaseUser[]).find(u => u.email?.toLowerCase() === email.toLowerCase());
          if (existing && !existing.user_metadata?.full_name) {
            await admin.auth.admin.updateUserById(existing.id, {
              user_metadata: { ...existing.user_metadata, full_name: rawName },
            });
            console.log('[webhook] synced full_name to user metadata:', email);
          }
        } catch (err) {
          console.error('[webhook] name sync failed:', err instanceof Error ? err.message : String(err));
        }
      }

      // Create founding member coupon + personal promo code in Stripe
      const FOUNDING_COUPON_ID = 'founding-member-15pct';
      const couponCode = memberNumber ? `FOUNDING${memberNumber}` : '';
      if (memberNumber && session.customer) {
        try {
          // Ensure the base coupon exists
          try { await stripe.coupons.retrieve(FOUNDING_COUPON_ID); }
          catch {
            await stripe.coupons.create({
              id: FOUNDING_COUPON_ID,
              percent_off: 15,
              duration: 'forever',
              name: 'Founding Member — 15% Off Forever',
            });
          }
          // Create a unique promo code tied to this customer
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (stripe.promotionCodes.create as any)({
            coupon: FOUNDING_COUPON_ID,
            code: couponCode,
            customer: session.customer as string,
          });
          // Apply discount directly to customer account (auto-applies at checkout)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (stripe.customers.update as any)(session.customer as string, {
            coupon: FOUNDING_COUPON_ID,
          });
          console.log('[webhook] founding coupon applied — code:', couponCode);
        } catch (err) {
          console.error('[webhook] coupon setup failed:', err instanceof Error ? err.message : String(err));
        }
      }

      // Send confirmation email (with magic sign-in link embedded)
      const orderDesc = [size, purchaseType === 'subscribe' ? `Subscribe (${freq || 'monthly'})` : 'One-off'].filter(Boolean).join(' · ');
      const balanceText = balance ? `£${balance}` : 'your remaining balance';
      // Use stable URLs only — VERCEL_URL changes every deploy and can't be
      // whitelisted in Supabase. VERCEL_BRANCH_URL is stable per branch.
      const origin = process.env.VERCEL_ENV === 'production'
        ? 'https://www.nectalabs.com'
        : process.env.VERCEL_BRANCH_URL
          ? `https://${process.env.VERCEL_BRANCH_URL}`
          : 'https://nectalabs.com';
      const signInUrl = await generateMagicLink(email, origin);
      try {
        const resendId = await sendEmail('deposit', email, {
            first_name:    firstName,
            product_name:  `NECTA ${productName} — ${orderDesc}`,
            order_total:   `£10 deposit (${balanceText} due on dispatch)`,
            dispatch_date: 'From 17 November 2026',
            sign_in_url:   signInUrl,
            member_number: memberNumber ? String(memberNumber) : '',
            coupon_code:   couponCode,
          });
        console.log('[webhook] deposit confirmation sent — id:', resendId);
      } catch (err) {
        console.error('[webhook] deposit confirmation email failed:', err instanceof Error ? err.message : String(err));
      }

      return NextResponse.json({ received: true });

    } else if (session.mode === 'payment') {
      // ── One-off payment ──────────────────────────────────────────────────────
      const email = session.customer_details?.email ?? null;
      if (!email) {
        console.warn('[webhook] no email for payment — skipping');
        return NextResponse.json({ received: true });
      }
      const rawName = session.customer_details?.name ?? '';
      const firstName = rawName.trim().split(/\s+/)[0] || 'there';
      const amountPence = session.amount_total ?? 0;
      const amount = `£${(amountPence / 100).toFixed(2)}`;

      try {
        const resendId = await sendEmail('deposit', email, {
          first_name: firstName, product_name: productName, order_total: amount, dispatch_date: 'From 17 November 2026',
        });
        console.log('[webhook] order-confirmation sent — id:', resendId);
      } catch (err) {
        console.error('[webhook] order-confirmation failed:', err instanceof Error ? err.message : String(err));
      }

    } else if (session.mode === 'subscription') {
      // ── Subscription pre-order (trial_end = Nov 2026, no charge today) ────────
      const { email, firstName } = await getCustomerDetails(session.customer as string);

      if (!email) {
        console.warn('[webhook] no email for subscription — skipping welcome email');
        return NextResponse.json({ received: true });
      }

      // Save to pre_orders so Order History shows this order
      const subFreq = metaFrequency || deriveFrequency(size, metaFrequency);
      try {
        const supabaseClient = getSupabase();
        await supabaseClient.from('pre_orders').insert({
          email,
          product_slug: session.metadata?.productSlug ?? productName.toLowerCase().replace(/\s+/g, '-'),
          format: `subscription${subFreq ? `:${subFreq}` : ''}`,
          size: size || null,
          quantity: 1,
          status: 'deposit_paid',
        });
        // Also add to email_signups
        await supabaseClient.from('email_signups').insert({
          email,
          source: `subscription-${session.metadata?.productSlug ?? 'unknown'}`,
        });
        console.log('[webhook] subscription saved to pre_orders — email:', email);
      } catch (err) {
        console.error('[webhook] failed to save subscription to pre_orders:', err instanceof Error ? err.message : String(err));
      }

      // Sync customer name to Supabase auth metadata
      if (firstName && firstName !== 'there') {
        try {
          const admin = getSupabaseAdmin();
          const listResult = await admin.auth.admin.listUsers({ perPage: 1000 });
          const existing = (listResult.data.users as SupabaseUser[]).find(u => u.email?.toLowerCase() === email.toLowerCase());
          if (existing && !existing.user_metadata?.full_name) {
            await admin.auth.admin.updateUserById(existing.id, {
              user_metadata: { ...existing.user_metadata, full_name: firstName },
            });
            console.log('[webhook] synced name to user metadata (subscription):', email);
          }
        } catch (err) {
          console.error('[webhook] name sync failed (subscription):', err instanceof Error ? err.message : String(err));
        }
      }

      // Get the actual recurring price amount and first charge date from Stripe
      let subscriptionAmount = '';
      let firstChargeDate = 'November 2026'; // safe fallback

      try {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string,
          { expand: ['items.data.price'] },
        );
        const price = subscription.items.data[0]?.price as Stripe.Price | undefined;
        if (price?.unit_amount) {
          subscriptionAmount = `£${(price.unit_amount / 100).toFixed(2)}`;
        }
        if (subscription.trial_end) {
          firstChargeDate = formatUnixDate(subscription.trial_end);
        }
        console.log('[webhook] subscription — amount:', subscriptionAmount, '| first charge:', firstChargeDate);
      } catch (err) {
        console.error('[webhook] failed to retrieve subscription details:', err instanceof Error ? err.message : String(err));
      }

      const frequency = deriveFrequency(size, metaFrequency);

      try {
        const resendId = await sendEmail('subscription', email, {
          first_name:        firstName,
          product_name:      productName,
          amount:            subscriptionAmount,
          next_billing_date: firstChargeDate,
          frequency,
        });
        console.log('[webhook] subscription-welcome sent — id:', resendId);
      } catch (err) {
        console.error('[webhook] subscription-welcome failed:', err instanceof Error ? err.message : String(err));
      }

    } else {
      console.warn('[webhook] unhandled session.mode:', session.mode);
    }

  // ── invoice.payment_succeeded ───────────────────────────────────────────────
  // Fires when a subscription trial ends and the first real payment is collected.
  // In Stripe SDK v22 (API 2025-03-31.basil), invoice.subscription is removed —
  // subscription info is now at invoice.parent.subscription_details.subscription.
  } else if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice;

    // Only care about subscription invoices (not one-off invoices)
    const parentType = invoice.parent?.type;
    if (parentType !== 'subscription_details') {
      return NextResponse.json({ received: true });
    }

    const subscriptionId = invoice.parent?.subscription_details?.subscription;

    // Skip the £0 invoice Stripe creates at subscription start (during trial)
    if ((invoice.amount_paid ?? 0) === 0) {
      console.log('[webhook] invoice.payment_succeeded — £0 invoice (trial start), skipping');
      return NextResponse.json({ received: true });
    }

    console.log('[webhook] invoice.payment_succeeded — subscription:', subscriptionId, '| amount:', invoice.amount_paid);

    const { email, firstName } = await getCustomerDetails(invoice.customer as string);
    if (!email) {
      console.warn('[webhook] invoice.payment_succeeded — no email, skipping');
      return NextResponse.json({ received: true });
    }

    const amountPence = invoice.amount_paid ?? 0;
    const amount = `£${(amountPence / 100).toFixed(2)}`;

    // Use ORDER_CONFIRMATION template for actual charges
    try {
      const resendId = await sendEmail('deposit', email, {
          first_name:    firstName,
          product_name:  'NECTA Subscription',
          order_total:   amount,
          dispatch_date: 'Your subscription is now active',
        },
      );
      console.log('[webhook] invoice payment-confirmation sent — id:', resendId);
    } catch (err) {
      console.error('[webhook] invoice payment-confirmation failed:', err instanceof Error ? err.message : String(err));
    }

  } else {
    console.log('[webhook] unhandled event:', event.type);
  }

  return NextResponse.json({ received: true });
}
