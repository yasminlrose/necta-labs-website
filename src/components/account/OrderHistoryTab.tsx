'use client';

import { useEffect, useState } from "react";
import { Package, Clock, X, AlertTriangle } from "lucide-react";
import Link from "next/link";
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
  email: string;
}

const statusLabel: Record<string, { text: string; colour: string }> = {
  deposit_paid:           { text: "Deposit paid · Balance on dispatch", colour: "text-amber-600 bg-amber-50 border-amber-200" },
  confirmed:              { text: "Confirmed",                          colour: "text-green-700 bg-green-50 border-green-200" },
  dispatched:             { text: "Dispatched",                        colour: "text-blue-700 bg-blue-50 border-blue-200" },
  cancelled:              { text: "Cancelled",                         colour: "text-primary/40 bg-muted border-border" },
  cancellation_requested: { text: "Cancellation requested",            colour: "text-orange-600 bg-orange-50 border-orange-200" },
};

function formatSlug(slug: string): string {
  return `NECTA ${slug.charAt(0).toUpperCase() + slug.slice(1)}`;
}

function CancelConfirm({ order, onConfirm, onClose, loading }: {
  order: PreOrder;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </div>
        <h3 className="font-bold text-primary text-base mb-2">Cancel this pre-order?</h3>
        <p className="text-sm text-primary/55 leading-relaxed mb-1">
          <strong>{formatSlug(order.product_slug)}</strong>
          {order.size ? ` · ${order.size}` : ""}
        </p>
        <p className="text-sm text-primary/55 leading-relaxed mb-5">
          Your £10 deposit will be refunded within 3–5 business days. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-primary/60 hover:text-primary transition-colors"
          >
            Keep order
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {loading ? "Cancelling…" : "Yes, cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

const OrderHistoryTab = ({ email }: Props) => {
  const [orders, setOrders] = useState<PreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;
    supabase
      .from("pre_orders")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? []);
        setLoading(false);
      });
  }, [email]);

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
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 'cancelled' } : o));
      }
    } catch {
      setCancelError('Could not connect. Please try again or contact hello@nectalabs.com');
    } finally {
      setCancellingId(null);
      setConfirmingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-5">
        <div className="text-center py-16 bg-white border border-border rounded-2xl">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-7 w-7 text-amber-500" />
          </div>
          <h3 className="font-semibold text-primary mb-2">No orders found</h3>
          <p className="text-sm text-primary/50 max-w-xs mx-auto">
            We couldn't find any orders linked to {email}. If you placed an order with a different email, contact us.
          </p>
          <a href="mailto:hello@nectalabs.com" className="mt-4 inline-block text-xs font-medium text-primary/50 hover:text-primary underline transition-colors">
            hello@nectalabs.com
          </a>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter((o) => o.status !== 'cancelled');
  const cancelledOrders = orders.filter((o) => o.status === 'cancelled');

  return (
    <div className="space-y-4">
      {cancelError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {cancelError}
        </div>
      )}

      {activeOrders.map((order) => {
        const s = statusLabel[order.status] ?? { text: order.status, colour: "text-primary/60 bg-muted border-border" };
        const canCancel = order.status === 'deposit_paid' || order.status === 'confirmed';
        return (
          <div key={order.id} className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <Package className="h-5 w-5 text-primary/40" />
                </div>
                <div>
                  <p className="font-semibold text-primary text-sm">{formatSlug(order.product_slug)}</p>
                  <p className="text-xs text-primary/45 mt-0.5">
                    {[order.size, (order.format?.startsWith('subscription') ? "Subscription" : "One-off")].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${s.colour}`}>
                {s.text}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-primary/50 border-t border-border pt-3 mt-3">
              <div>
                <p className="font-medium text-primary/70 mb-0.5">Order date</p>
                <p>{new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
              <div>
                <p className="font-medium text-primary/70 mb-0.5">Expected dispatch</p>
                <p>From 17 November 2026</p>
              </div>
            </div>

            {canCancel && (
              <button
                onClick={() => setConfirmingId(order.id)}
                disabled={cancellingId === order.id}
                className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 border border-red-200 text-red-500 rounded-xl text-xs font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
                Cancel this order
              </button>
            )}
          </div>
        );
      })}

      {cancelledOrders.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-primary/40 uppercase tracking-wider px-1">Cancelled orders</p>
          {cancelledOrders.map((order) => (
            <div key={order.id} className="bg-muted/50 border border-border rounded-2xl p-4 opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <Package className="h-4 w-4 text-primary/30" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-primary/60 text-sm">{formatSlug(order.product_slug)}</p>
                  <p className="text-xs text-primary/35">{order.size} · Cancelled {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border text-primary/40 bg-muted border-border">
                  Cancelled
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-muted/50 rounded-xl p-4 flex gap-3 items-start">
        <Package className="h-4 w-4 text-primary/40 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-primary/60">Questions about your order?</p>
          <a href="mailto:hello@nectalabs.com" className="text-xs text-primary/40 underline hover:text-primary transition-colors">
            hello@nectalabs.com
          </a>
        </div>
      </div>

      <div className="text-center">
        <Link href="/pre-order" className="text-sm font-medium text-primary/50 hover:text-primary transition-colors underline">
          Add another pre-order
        </Link>
      </div>

      {confirmingId && (
        <CancelConfirm
          order={orders.find((o) => o.id === confirmingId)!}
          onConfirm={() => handleCancel(confirmingId)}
          onClose={() => setConfirmingId(null)}
          loading={cancellingId === confirmingId}
        />
      )}
    </div>
  );
};

export default OrderHistoryTab;
