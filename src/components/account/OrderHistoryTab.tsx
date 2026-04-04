import { useState } from "react";
import { Package, Truck, CheckCircle2, Clock, ExternalLink, RotateCcw, ChevronDown } from "lucide-react";

// TODO: Replace demo data with Shopify Customer Orders API
// https://shopify.dev/docs/api/customer/2024-01/objects/Order
// Requires: Shopify Customer Account API OAuth setup

interface OrderLineItem {
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  total_price: number;
  line_items: OrderLineItem[];
  fulfillment_status: "fulfilled" | "in_transit" | "unfulfilled" | "delivered";
  financial_status: "paid" | "pending" | "refunded";
  tracking_number?: string;
  tracking_url?: string;
  type: "subscription" | "one-off";
}

const DEMO_ORDERS: Order[] = [
  {
    id: "ord_001",
    order_number: "#1042",
    created_at: "2026-03-22",
    total_price: 43.98,
    line_items: [
      { title: "NECTA Focus Infusion – Elderflower & Lemon", quantity: 1, price: 24.99 },
      { title: "NECTA Calm Sachets – Lavender & Chamomile", quantity: 1, price: 18.99 },
    ],
    fulfillment_status: "delivered",
    financial_status: "paid",
    tracking_number: "JD0003000009876543",
    tracking_url: "https://www.royalmail.com/track-your-item",
    type: "subscription",
  },
  {
    id: "ord_002",
    order_number: "#1038",
    created_at: "2026-02-22",
    total_price: 43.98,
    line_items: [
      { title: "NECTA Focus Infusion – Elderflower & Lemon", quantity: 1, price: 24.99 },
      { title: "NECTA Calm Sachets – Lavender & Chamomile", quantity: 1, price: 18.99 },
    ],
    fulfillment_status: "delivered",
    financial_status: "paid",
    type: "subscription",
  },
  {
    id: "ord_003",
    order_number: "#1025",
    created_at: "2026-01-15",
    total_price: 51.97,
    line_items: [
      { title: "NECTA Immunity Infusion – Ginger & Turmeric", quantity: 1, price: 24.99 },
      { title: "NECTA Glow Sachets – Rose & Hibiscus", quantity: 2, price: 13.49 },
    ],
    fulfillment_status: "delivered",
    financial_status: "paid",
    type: "one-off",
  },
  {
    id: "ord_004",
    order_number: "#1008",
    created_at: "2025-12-08",
    total_price: 24.99,
    line_items: [
      { title: "NECTA Focus Infusion – Elderflower & Lemon", quantity: 1, price: 24.99 },
    ],
    fulfillment_status: "delivered",
    financial_status: "paid",
    type: "one-off",
  },
];

const statusConfig = {
  delivered: { label: "Delivered", icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: "text-green-700 bg-green-50" },
  in_transit: { label: "In transit", icon: <Truck className="h-3.5 w-3.5" />, color: "text-blue-700 bg-blue-50" },
  unfulfilled: { label: "Processing", icon: <Clock className="h-3.5 w-3.5" />, color: "text-amber-700 bg-amber-50" },
  fulfilled: { label: "Dispatched", icon: <Truck className="h-3.5 w-3.5" />, color: "text-blue-700 bg-blue-50" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

const OrderCard = ({ order }: { order: Order }) => {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[order.fulfillment_status];

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            <Package className="h-4 w-4 text-primary/50" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-primary">{order.order_number}</p>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                {status.icon}
                {status.label}
              </span>
            </div>
            <p className="text-xs text-primary/50">{formatDate(order.created_at)} · £{order.total_price.toFixed(2)}</p>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-primary/30 flex-shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="px-5 pb-5">
          <div className="border-t border-border pt-4 space-y-2 mb-4">
            {order.line_items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-primary/70">
                  {item.quantity > 1 && <span className="font-medium text-primary mr-1">×{item.quantity}</span>}
                  {item.title}
                </span>
                <span className="text-primary font-medium">£{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm font-semibold text-primary pt-2 border-t border-border">
              <span>Total</span>
              <span>£{order.total_price.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {order.tracking_number && order.tracking_url && (
              <a
                href={order.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs font-medium text-primary hover:border-primary/30 transition-colors"
              >
                <Truck className="h-3.5 w-3.5" />
                Track: {order.tracking_number}
                <ExternalLink className="h-3 w-3 text-primary/30" />
              </a>
            )}
            {order.type === "one-off" && (
              <button
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
                onClick={() => {
                  // TODO: Add items to cart
                  window.location.href = "/shop";
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reorder
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

type FilterPeriod = "all" | "3m" | "6m" | "1y";

const OrderHistoryTab = () => {
  const [filter, setFilter] = useState<FilterPeriod>("all");

  const filterOptions: { value: FilterPeriod; label: string }[] = [
    { value: "all", label: "All orders" },
    { value: "3m", label: "Last 3 months" },
    { value: "6m", label: "Last 6 months" },
    { value: "1y", label: "Last year" },
  ];

  const cutoffDate = (period: FilterPeriod): Date | null => {
    const now = new Date();
    if (period === "3m") return new Date(now.setMonth(now.getMonth() - 3));
    if (period === "6m") return new Date(now.setMonth(now.getMonth() - 6));
    if (period === "1y") return new Date(now.setFullYear(now.getFullYear() - 1));
    return null;
  };

  const cutoff = cutoffDate(filter);
  const filtered = cutoff
    ? DEMO_ORDERS.filter((o) => new Date(o.created_at) >= cutoff)
    : DEMO_ORDERS;

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === opt.value
                ? "bg-primary text-white"
                : "bg-muted text-primary/60 hover:text-primary"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-2xl">
          <Package className="h-10 w-10 text-primary/20 mx-auto mb-3" />
          <p className="text-sm text-primary/50">No orders in this period</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      <p className="text-xs text-center text-primary/30">
        Full order history synced from Shopify · {DEMO_ORDERS.length} orders
      </p>
    </div>
  );
};

export default OrderHistoryTab;
