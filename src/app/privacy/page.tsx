import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How NECTA Labs collects, uses, and protects your personal data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="necta-container max-w-3xl py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Privacy Policy</h1>
        <p className="text-sm text-primary/40 mb-10">Last updated: 12 May 2026</p>

        <div className="prose prose-sm max-w-none space-y-8 text-primary/70 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">1. Who we are</h2>
            <p>
              NECTA GROUP LTD ("NECTA Labs", "we", "us", "our") is a company registered in England &amp; Wales. We operate the website at <strong>nectalabs.com</strong> and sell our products worldwide.
            </p>
            <p className="mt-2">
              For any privacy queries, contact us at: <a href="mailto:hello@nectalabs.com" className="text-primary underline">hello@nectalabs.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">2. What data we collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account &amp; order data:</strong> name, email address, order history, product preferences, and account login information.</li>
              <li><strong>Payment data:</strong> billing details are processed directly by Stripe. We do not store your card details — Stripe holds them securely under PCI-DSS compliance. We receive only a tokenised reference and the last four digits of your card.</li>
              <li><strong>Communications:</strong> emails you send us, responses to our emails, and email marketing preferences.</li>
              <li><strong>Usage data:</strong> pages visited, browser type, IP address, and referring URL, collected via standard server logs and analytics.</li>
              <li><strong>Cookies:</strong> session cookies required for the website to function, and analytics cookies. See Section 8.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">3. How we use your data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To process and fulfil your pre-orders and subscriptions.</li>
              <li>To send order confirmations, shipping updates, and account notifications.</li>
              <li>To send marketing emails where you have opted in (you can unsubscribe at any time).</li>
              <li>To manage your account and provide customer support.</li>
              <li>To improve our website and product offering.</li>
              <li>To meet our legal and regulatory obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">4. Legal basis for processing (UK &amp; EU)</h2>
            <p>We rely on the following legal bases under UK GDPR / EU GDPR:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Contract:</strong> processing necessary to fulfil your order.</li>
              <li><strong>Legitimate interests:</strong> fraud prevention, security, and improving our services.</li>
              <li><strong>Consent:</strong> email marketing — you can withdraw consent at any time by clicking "unsubscribe" in any email.</li>
              <li><strong>Legal obligation:</strong> where required by law (e.g. financial records).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">5. Who we share data with</h2>
            <p>We only share your data with third parties where necessary:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Stripe</strong> — payment processing (stripe.com/privacy)</li>
              <li><strong>Supabase</strong> — secure database and authentication hosting</li>
              <li><strong>Resend</strong> — transactional email delivery</li>
              <li><strong>Vercel</strong> — website hosting</li>
              <li><strong>Fulfilment partners</strong> — your name and delivery address are shared with our logistics partners solely to dispatch your order</li>
            </ul>
            <p className="mt-2">We do not sell your personal data. We do not share it with advertisers or data brokers.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">6. International transfers</h2>
            <p>
              We ship worldwide. Some of our service providers (Stripe, Supabase, Vercel, Resend) may process data outside the UK or EEA. Where this occurs, appropriate safeguards are in place — such as Standard Contractual Clauses or adequacy decisions — to ensure your data is protected to an equivalent standard.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">7. How long we keep your data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account data:</strong> for as long as your account is active, and up to 2 years after your last order.</li>
              <li><strong>Order and payment records:</strong> 7 years to comply with UK tax law.</li>
              <li><strong>Marketing preferences:</strong> until you unsubscribe or request deletion.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">8. Cookies</h2>
            <p>We use the following cookies:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Essential cookies:</strong> required for login sessions and checkout to work. Cannot be disabled.</li>
              <li><strong>Analytics cookies:</strong> used to understand how visitors use our site (anonymised). You can opt out via your browser settings.</li>
            </ul>
            <p className="mt-2">We do not use advertising or tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">9. Your rights</h2>
            <p>Depending on where you are located, you may have the following rights:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Access:</strong> request a copy of the personal data we hold about you.</li>
              <li><strong>Rectification:</strong> ask us to correct inaccurate data.</li>
              <li><strong>Erasure:</strong> ask us to delete your data (subject to legal obligations).</li>
              <li><strong>Restriction:</strong> ask us to limit how we use your data.</li>
              <li><strong>Portability:</strong> receive your data in a machine-readable format.</li>
              <li><strong>Objection:</strong> object to processing based on legitimate interests.</li>
              <li><strong>Withdraw consent:</strong> for marketing, at any time via the unsubscribe link in any email.</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, email <a href="mailto:hello@nectalabs.com" className="text-primary underline">hello@nectalabs.com</a>. We will respond within 30 days.
            </p>
            <p className="mt-2">
              If you are in the UK, you have the right to complain to the <strong>ICO</strong> (ico.org.uk). If you are in the EU, you may complain to your local supervisory authority. Customers in other jurisdictions may have additional rights under applicable local law — contact us and we will assist.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">10. Security</h2>
            <p>
              We take security seriously. All data is transmitted over HTTPS. Passwords are never stored — we use magic link authentication. Payment data is handled exclusively by Stripe. Access to personal data is restricted to authorised personnel only.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">11. Children</h2>
            <p>
              Our products and website are not directed at children under 16. We do not knowingly collect data from anyone under 16. If you believe a child has provided us with personal data, please contact us and we will delete it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-3">12. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. We will notify registered customers of material changes by email. The latest version is always available at nectalabs.com/privacy.
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
          <Link href="/terms" className="text-sm text-primary/50 hover:text-primary underline transition-colors">
            View Terms &amp; Conditions →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
