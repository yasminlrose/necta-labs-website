import { useState } from "react";
import {
  CreditCard, Download, ShieldCheck, Lock, Plus,
  CheckCircle2, Building2
} from "lucide-react";

// TODO: Integrate with Stripe Customer Portal for payment method management
// https://stripe.com/docs/billing/subscriptions/customer-portal
// Customer portal URL: redirect to Stripe-hosted portal using your Stripe secret key

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  description: string;
}

// Demo data — replace with Stripe API calls via backend proxy
const DEMO_INVOICES: Invoice[] = [
  { id: "inv_001", date: "2026-03-22", amount: 43.98, status: "paid", description: "Monthly subscription" },
  { id: "inv_002", date: "2026-02-22", amount: 43.98, status: "paid", description: "Monthly subscription" },
  { id: "inv_003", date: "2026-01-22", amount: 43.98, status: "paid", description: "Monthly subscription" },
  { id: "inv_004", date: "2025-12-22", amount: 43.98, status: "paid", description: "Monthly subscription" },
  { id: "inv_005", date: "2025-11-22", amount: 24.99, status: "paid", description: "First order" },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const CARD_BRANDS: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "Amex",
};

const BillingTab = () => {
  const [billingAddress, setBillingAddress] = useState({
    line1: "12 Wellness Street",
    line2: "",
    city: "London",
    postcode: "EC1A 1BB",
    country: "United Kingdom",
  });
  const [editingAddress, setEditingAddress] = useState(false);
  const [draft, setDraft] = useState(billingAddress);

  const paymentMethod = {
    brand: "visa",
    last4: "4242",
    expiry: "09/27",
    name: "Sarah Johnson",
  };

  const nextBillingDate = "18 April 2026";
  const nextAmount = 43.98;

  const statusBadge = (status: Invoice["status"]) => {
    const map = {
      paid: "bg-green-50 text-green-700",
      pending: "bg-amber-50 text-amber-700",
      failed: "bg-red-50 text-red-600",
    };
    return map[status];
  };

  return (
    <div className="space-y-6">
      {/* Next billing */}
      <div className="bg-primary rounded-2xl p-5 text-primary-foreground">
        <p className="text-sm text-primary-foreground/60 mb-1">Next billing date</p>
        <p className="text-2xl font-bold">{nextBillingDate}</p>
        <p className="text-sm text-primary-foreground/70 mt-1">£{nextAmount.toFixed(2)} for 2 active subscriptions</p>
      </div>

      {/* Payment method */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-primary text-sm">Payment method</h3>
          <button
            className="text-xs text-primary/50 hover:text-primary transition-colors flex items-center gap-1"
            onClick={() => {
              // TODO: Redirect to Stripe Customer Portal
              // window.location.href = stripePortalUrl;
              alert("Redirecting to Stripe Customer Portal...\n\n(Set up VITE_STRIPE_PORTAL_URL to enable)");
            }}
          >
            <Plus className="h-3 w-3" /> Update card
          </button>
        </div>

        <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
          <div className="w-10 h-7 bg-primary/10 rounded flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary">
              {CARD_BRANDS[paymentMethod.brand]} ending ···· {paymentMethod.last4}
            </p>
            <p className="text-xs text-primary/50">Expires {paymentMethod.expiry} · {paymentMethod.name}</p>
          </div>
          <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Lock className="h-3 w-3 text-primary/30" />
          <p className="text-xs text-primary/40">Payments secured by Stripe. We never store your card details.</p>
        </div>
      </div>

      {/* Billing address */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-primary text-sm">Billing address</h3>
          <button
            onClick={() => {
              if (editingAddress) {
                setBillingAddress(draft);
              }
              setEditingAddress(!editingAddress);
            }}
            className="text-xs text-primary/50 hover:text-primary transition-colors"
          >
            {editingAddress ? "Save" : "Edit"}
          </button>
        </div>

        {editingAddress ? (
          <div className="space-y-3">
            {(["line1", "line2", "city", "postcode"] as const).map((field) => (
              <input
                key={field}
                type="text"
                value={draft[field]}
                onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
                placeholder={
                  field === "line1" ? "Address line 1"
                  : field === "line2" ? "Address line 2 (optional)"
                  : field === "city" ? "City"
                  : "Postcode"
                }
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
              />
            ))}
            <button
              onClick={() => setEditingAddress(false)}
              className="text-xs text-primary/40 hover:text-primary transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <Building2 className="h-4 w-4 text-primary/30 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-primary/70 leading-relaxed">
              <p>{billingAddress.line1}</p>
              {billingAddress.line2 && <p>{billingAddress.line2}</p>}
              <p>{billingAddress.city}</p>
              <p>{billingAddress.postcode}</p>
              <p>{billingAddress.country}</p>
            </div>
          </div>
        )}
      </div>

      {/* Invoice history */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-primary text-sm mb-4">Invoice history</h3>
        <div className="space-y-1">
          {DEMO_INVOICES.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-primary">£{invoice.amount.toFixed(2)}</p>
                <p className="text-xs text-primary/50">{formatDate(invoice.date)} · {invoice.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(invoice.status)}`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
                <button
                  aria-label="Download invoice"
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                  onClick={() => {
                    // TODO: Fetch PDF from Stripe invoice URL
                    alert("Invoice download will be available once Stripe is connected.");
                  }}
                >
                  <Download className="h-3.5 w-3.5 text-primary/40 hover:text-primary" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 py-4">
        <div className="flex items-center gap-2 text-xs text-primary/40">
          <ShieldCheck className="h-4 w-4" />
          <span>SSL encrypted</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-primary/40">
          <Lock className="h-4 w-4" />
          <span>PCI DSS compliant</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-primary/40">
          <CreditCard className="h-4 w-4" />
          <span>Powered by Stripe</span>
        </div>
      </div>
    </div>
  );
};

export default BillingTab;
