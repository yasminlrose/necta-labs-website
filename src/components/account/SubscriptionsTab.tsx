'use client';

import Link from "next/link";
import { Package, Clock, CheckCircle2, Calendar } from "lucide-react";

interface PreOrder {
  id: string;
  product_slug: string;
  format: string | null;
  size: string | null;
  quantity: number;
  status: string;
  created_at: string;
}

interface Props {
  orders: PreOrder[];
}

const SubscriptionsTab = ({ orders }: Props) => {
  const subscriptionOrders = orders.filter((o) => o.format === "subscription");

  if (subscriptionOrders.length === 0) {
    return (
      <div className="space-y-5">
        <div className="text-center py-16 bg-white border border-border rounded-2xl">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Package className="h-7 w-7 text-primary/30" />
          </div>
          <h3 className="font-semibold text-primary mb-2">No subscriptions yet</h3>
          <p className="text-sm text-primary/50 max-w-xs mx-auto">
            You haven't pre-ordered a subscription. Subscribe now to lock in your founding member rate.
          </p>
          <Link
            href="/pre-order"
            className="mt-5 inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors"
          >
            Pre-order a subscription
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pre-order confirmed banner */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex gap-4 items-start">
        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-green-800 text-sm">Your pre-order subscription is confirmed</p>
          <p className="text-xs text-green-700 mt-1">
            Your card will be charged on <strong>1 November 2026</strong>. Your order will be dispatched from <strong>17 November 2026</strong>.
            You'll receive an email when it's on its way.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-primary text-sm mb-4">What happens next</h3>
        <div className="space-y-4">
          {[
            { icon: <CheckCircle2 className="h-4 w-4 text-green-500" />, label: "Pre-order confirmed", sub: "Your spot is reserved", done: true },
            { icon: <Clock className="h-4 w-4 text-primary/30" />, label: "Production & fulfilment", sub: "Summer – Autumn 2026", done: false },
            { icon: <Calendar className="h-4 w-4 text-primary/30" />, label: "First charge", sub: "1 November 2026", done: false },
            { icon: <Package className="h-4 w-4 text-primary/30" />, label: "Dispatch & subscription begins", sub: "From 17 November 2026", done: false },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? "bg-green-50" : "bg-muted"}`}>
                {step.icon}
              </div>
              <div>
                <p className={`text-sm font-medium ${step.done ? "text-primary" : "text-primary/40"}`}>{step.label}</p>
                <p className="text-xs text-primary/40">{step.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manage subscription note */}
      <div className="border border-dashed border-primary/20 rounded-xl p-4 text-center">
        <p className="text-xs text-primary/50 mb-2">
          Need to cancel before dispatch? Email us and we'll sort it immediately.
        </p>
        <a
          href="mailto:hello@nectalabs.com?subject=Pre-order cancellation"
          className="text-xs font-semibold text-primary hover:underline"
        >
          hello@nectalabs.com
        </a>
      </div>

      {/* Add more */}
      <div className="text-center">
        <Link
          href="/pre-order"
          className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors"
        >
          Add another subscription
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionsTab;
