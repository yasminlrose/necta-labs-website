'use client';

import { useEffect, useState } from "react";
import { Package, Clock } from "lucide-react";
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
  deposit_paid: { text: "Deposit paid · Balance on dispatch", colour: "text-amber-600 bg-amber-50 border-amber-200" },
  confirmed:    { text: "Confirmed",                          colour: "text-green-700 bg-green-50 border-green-200" },
  dispatched:   { text: "Dispatched",                        colour: "text-blue-700 bg-blue-50 border-blue-200" },
};

function formatSlug(slug: string): string {
  return `NECTA ${slug.charAt(0).toUpperCase() + slug.slice(1)}`;
}

const OrderHistoryTab = ({ email }: Props) => {
  const [orders, setOrders] = useState<PreOrder[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const s = statusLabel[order.status] ?? { text: order.status, colour: "text-primary/60 bg-muted border-border" };
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
                    {[order.size, order.format === "subscription" ? "Subscribe" : "One-off"].filter(Boolean).join(" · ")}
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
          </div>
        );
      })}

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
    </div>
  );
};

export default OrderHistoryTab;
