'use client';

import { useState } from "react";
import Link from "next/link";
import { Package, Clock, CheckCircle2, Calendar, RefreshCw, X, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

const PRODUCT_NAMES: Record<string, string> = {
  focus:    "NECTA Focus",
  calm:     "NECTA Calm",
  immunity: "NECTA Immunity",
  glow:     "NECTA Glow",
};

function productName(slug: string): string {
  return PRODUCT_NAMES[slug.toLowerCase()] ?? `NECTA ${slug.charAt(0).toUpperCase() + slug.slice(1)}`;
}

/** Extract frequency from format field, e.g. "subscription:monthly" → "Monthly" */
function parseFrequency(format: string | null, size: string | null): string {
  if (format?.includes(":")) {
    const freq = format.split(":")[1];
    return freq.charAt(0).toUpperCase() + freq.slice(1);
  }
  // Infer from size
  if (size?.includes("90")) return "Every 3 months";
  if (size?.includes("14")) return "Every 2 weeks";
  return "Monthly";
}

function isSubscription(format: string | null): boolean {
  return format?.startsWith("subscription") ?? false;
}

const SubscriptionsTab = ({ orders }: Props) => {
  const [liveOrders, setLiveOrders] = useState(orders);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const subscriptionOrders = liveOrders.filter((o) => isSubscription(o.format) && o.status !== 'cancelled');

  const handleCancel = async (orderId: string) => {
    setCancellingId(orderId);
    setCancelError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/cancel-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token ?? ''}`,
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setCancelError(data.error ?? 'Something went wrong. Please contact hello@nectalabs.com');
      } else {
        setLiveOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 'cancelled' } : o));
      }
    } catch {
      setCancelError('Could not connect. Please try again or contact hello@nectalabs.com');
    } finally {
      setCancellingId(null);
      setConfirmingId(null);
    }
  };

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
      {/* Confirmed banner */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex gap-4 items-start">
        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-green-800 text-sm">
            {subscriptionOrders.length === 1 ? "Your pre-order subscription is confirmed" : `${subscriptionOrders.length} pre-order subscriptions confirmed`}
          </p>
          <p className="text-xs text-green-700 mt-1">
            Your card will be charged on <strong>1 November 2026</strong>. Orders dispatch from <strong>17 November 2026</strong>.
          </p>
        </div>
      </div>

      {/* Subscription cards */}
      {subscriptionOrders.map((order) => {
        const freq = parseFrequency(order.format, order.size);
        return (
          <div key={order.id} className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="h-5 w-5 text-primary/50" />
                </div>
                <div>
                  <p className="font-semibold text-primary text-sm">{productName(order.product_slug)}</p>
                  {order.size && (
                    <p className="text-xs text-primary/45 mt-0.5">{order.size}</p>
                  )}
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap text-amber-600 bg-amber-50 border-amber-200">
                Deposit paid
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-primary/50 border-t border-border pt-3">
              <div>
                <p className="font-medium text-primary/70 mb-0.5">Frequency</p>
                <p>{freq}</p>
              </div>
              <div>
                <p className="font-medium text-primary/70 mb-0.5">First charge</p>
                <p>1 November 2026</p>
              </div>
              <div>
                <p className="font-medium text-primary/70 mb-0.5">First dispatch</p>
                <p>From 17 November 2026</p>
              </div>
              <div>
                <p className="font-medium text-primary/70 mb-0.5">Order date</p>
                <p>{new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
            </div>

            {order.status === 'deposit_paid' && (
              <button
                onClick={() => setConfirmingId(order.id)}
                disabled={!!cancellingId}
                className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 border border-red-200 text-red-500 rounded-xl text-xs font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" /> Cancel subscription
              </button>
            )}
          </div>
        );
      })}

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

      {cancelError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {cancelError}
        </div>
      )}

      {/* Confirm dialog */}
      {confirmingId && (() => {
        const order = liveOrders.find((o) => o.id === confirmingId)!;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setConfirmingId(null)}>
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <h3 className="font-bold text-primary text-base mb-2">Cancel this subscription?</h3>
              <p className="text-sm text-primary/55 leading-relaxed mb-1">
                <strong>{productName(order.product_slug)}</strong>{order.size ? ` · ${order.size}` : ""}
              </p>
              <p className="text-sm text-primary/55 leading-relaxed mb-5">
                Your subscription will be cancelled and no charge will be taken on 1 November 2026. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmingId(null)} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-primary/60 hover:text-primary transition-colors">
                  Keep it
                </button>
                <button
                  onClick={() => handleCancel(confirmingId)}
                  disabled={cancellingId === confirmingId}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
                >
                  {cancellingId === confirmingId ? "Cancelling…" : "Yes, cancel"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

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
