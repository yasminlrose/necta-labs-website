import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for using NECTA Labs and placing pre-orders.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="necta-container max-w-3xl py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Terms &amp; Conditions</h1>
        <p className="text-sm text-primary/40 mb-10">Last updated: 12 May 2026</p>

        <div className="prose prose-sm max-w-none space-y-8 text-primary/70 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">1. About us</h2>
            <p>
              NECTA GROUP LTD ("NECTA Labs", "we", "us") is registered in England &amp; Wales. We operate nectalabs.com and sell products worldwide. By using our website or placing an order, you agree to these terms.
            </p>
            <p className="mt-2">Contact: <a href="mailto:hello@nectalabs.com" className="text-primary underline">hello@nectalabs.com</a></p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">2. Pre-orders and deposits</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Deposit:</strong> Pre-orders require a non-refundable* £10 deposit per item. This secures your place and locks in your founding member pricing. <em>*The deposit is fully refundable if you cancel before dispatch (see Section 5).</em>
              </li>
              <li>
                <strong>Balance charge:</strong> The remaining balance for your order will be charged on <strong>1 November 2026</strong>. By placing a pre-order, you authorise us to charge your saved payment method on that date.
              </li>
              <li>
                <strong>Dispatch:</strong> Orders are estimated to dispatch from <strong>17 November 2026</strong>. Dispatch dates are estimates and may be subject to change. We will notify you of any significant delays by email.
              </li>
              <li>
                <strong>Pre-order confirmation:</strong> Placing a pre-order is a commitment to purchase. If your payment method fails on 1 November 2026, we will attempt to contact you. If payment cannot be collected, your pre-order may be cancelled.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">3. Subscriptions</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Subscription pre-orders operate on a free trial period until <strong>1 November 2026</strong>, at which point your subscription begins and the first charge is taken.</li>
              <li>Subscriptions continue on your chosen billing frequency (monthly, every 2 months, or every 3 months) until cancelled.</li>
              <li>You can cancel your subscription at any time from your account dashboard before the next billing date. Cancellations take effect immediately — no further charges will be taken.</li>
              <li>Subscription prices are locked at the founding member rate for as long as you remain subscribed.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">4. Pricing</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>All prices are displayed in GBP (£) and are inclusive of VAT where applicable.</li>
              <li>For international orders, prices are in GBP. Your bank or card provider may apply a currency conversion fee — this is outside our control.</li>
              <li>We reserve the right to change prices for new orders. Existing pre-orders are locked at the price paid.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">5. Cancellations and refunds</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Before dispatch:</strong> You may cancel any pre-order or subscription at any time before dispatch directly from your account dashboard. Your £10 deposit will be refunded in full within 3–5 business days.
              </li>
              <li>
                <strong>After dispatch:</strong> Once an order has been dispatched, we cannot accept cancellations. If your order arrives damaged or incorrect, contact us within 14 days of receipt.
              </li>
              <li>
                <strong>Consumer rights (UK &amp; EU):</strong> If you are a consumer in the UK or EU, you have the right to cancel within 14 days of receiving goods under the Consumer Contracts Regulations 2013 (UK) / Consumer Rights Directive (EU). Products must be returned unused and in original packaging. Return postage is at your cost unless the item is faulty.
              </li>
              <li>
                <strong>Faulty or damaged goods:</strong> Contact <a href="mailto:hello@nectalabs.com" className="text-primary underline">hello@nectalabs.com</a> with photos. We will offer a replacement or full refund at our discretion.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">6. Shipping and delivery</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>We ship worldwide. Shipping costs and estimated delivery times are shown at checkout.</li>
              <li>International customers are responsible for any import duties, taxes, or customs fees applicable in their country. These are not included in the price and are payable by the recipient.</li>
              <li>We are not responsible for delays caused by customs clearance or courier services beyond our control.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">7. Products and health information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>NECTA Labs products are food supplements. They are not medicines and are not intended to diagnose, treat, cure, or prevent any disease.</li>
              <li>Always read the label. Keep out of reach of children. If you are pregnant, breastfeeding, or taking medication, consult a healthcare professional before use.</li>
              <li>Product images are for illustration only. Packaging may differ slightly from images shown.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">8. Accounts</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>You are responsible for keeping your account secure. We use magic link (passwordless) authentication — your account is accessed via a one-time link sent to your email.</li>
              <li>You must use the same email address for your account as used at checkout to access your orders.</li>
              <li>We may suspend or close accounts that are used fraudulently or in breach of these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">9. Intellectual property</h2>
            <p>
              All content on nectalabs.com — including text, images, branding, and product designs — is owned by NECTA GROUP LTD. You may not reproduce, redistribute, or use our content without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">10. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, NECTA GROUP LTD shall not be liable for indirect, incidental, or consequential losses arising from use of our website or products. Our total liability for any claim shall not exceed the amount you paid for the relevant order.
            </p>
            <p className="mt-2">
              Nothing in these terms limits our liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">11. Governing law</h2>
            <p>
              These terms are governed by the laws of England &amp; Wales. Disputes will be subject to the exclusive jurisdiction of the courts of England &amp; Wales.
            </p>
            <p className="mt-2">
              If you are a consumer in the EU, you may also have the right to use the EU Online Dispute Resolution platform (ec.europa.eu/odr). Customers in other jurisdictions retain any rights afforded to them by their local consumer protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">12. Changes to these terms</h2>
            <p>
              We may update these terms from time to time. The current version is always at nectalabs.com/terms. Continued use of our site after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">13. Contact</h2>
            <p>
              NECTA GROUP LTD<br />
              Registered in England &amp; Wales<br />
              <a href="mailto:hello@nectalabs.com" className="text-primary underline">hello@nectalabs.com</a>
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link href="/privacy" className="text-sm text-primary/50 hover:text-primary underline transition-colors">
            View Privacy Policy →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
