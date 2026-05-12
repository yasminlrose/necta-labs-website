import { useState } from "react";
import { CreditCard, ShieldCheck, Lock, Calendar, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const BillingTab = () => {
  const { user } = useAuth();
  const [portalLoading, setPortalLoading] = useState(false);

  const handleManageBilling = async () => {
    if (!user?.email) return;
    setPortalLoading(true);
    try {
      const res = await fetch('/api/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const data: { url?: string; error?: string } = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? 'Could not open billing portal. Please contact hello@nectalabs.com');
      }
    } catch {
      alert('Could not open billing portal. Please contact hello@nectalabs.com');
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Next charge */}
      <div className="bg-primary rounded-2xl p-5 text-primary-foreground">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="h-4 w-4 text-primary-foreground/60" />
          <p className="text-sm text-primary-foreground/60">First charge date</p>
        </div>
        <p className="text-2xl font-bold">1 November 2026</p>
        <p className="text-sm text-primary-foreground/70 mt-1">
          No payment is taken today. Your card will be charged when your order ships.
        </p>
      </div>

      {/* Payment method */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-primary text-sm">Payment method</h3>
          <button
            onClick={handleManageBilling}
            disabled={portalLoading}
            className="text-xs text-primary/50 hover:text-primary transition-colors flex items-center gap-1 disabled:opacity-60"
          >
            {portalLoading ? 'Opening…' : <>Manage card <ExternalLink className="h-3 w-3" /></>}
          </button>
        </div>

        <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
          <CreditCard className="h-5 w-5 text-primary/40" />
          <div>
            <p className="text-sm text-primary/70">Card saved for November 2026 charge</p>
            <p className="text-xs text-primary/40 mt-0.5">
              Click "Manage card" to update or remove your payment method.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Lock className="h-3 w-3 text-primary/30" />
          <p className="text-xs text-primary/40">Payments secured by Stripe. We never store your card details.</p>
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
