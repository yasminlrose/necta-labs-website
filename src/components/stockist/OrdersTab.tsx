import { useState } from "react";
import { Package, Truck, CheckCircle2, Clock, ChevronDown, Download, ExternalLink, AlertCircle } from "lucide-react";

// TODO: Replace with Shopify B2B API / backend orders endpoint
// https://shopify.dev/docs/api/admin-rest/2024-01/resources/order

interface OrderItem {
  product: string;
  sku: string;
  size: string;
  qty: number;
  unit_price: number;
}

interface WholesaleOrder {
  id: string;
  order_number: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  vat: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "overdue";
  payment_status: "invoiced" | "paid" | "overdue";
  tracking_number?: string;
  tracking_url?: string;
  invoice_url?: string;
  due_date?: string;
}

const DEMO_ORDERS: WholesaleOrder[] = [
  {
    id: "wo_001",
    order_number: "WO-1042",
    date: "2026-03-22",
    items: [
      { product: "FOCUS", sku: "FOCUS-250", size: "250ml", qty: 6, unit_price: 22 },
      { product: "CALM", sku: "CALM-250", size: "250ml", qty: 6, unit_price: 22 },
      { product: "IMMUNITY", sku: "IMMU-500", size: "500ml", qty: 2, unit_price: 30 },
    ],
    subtotal: 324,
    vat: 64.80,
    total: 388.80,
    status: "delivered",
    payment_status: "paid",
    tracking_number: "JD0003000099876",
    tracking_url: "https://www.royalmail.com/track-your-item",
    invoice_url: "#",
  },
  {
    id: "wo_002",
    order_number: "WO-1038",
    date: "2026-02-20",
    items: [
      { product: "FOCUS", sku: "FOCUS-250", size: "250ml", qty: 8, unit_price: 22 },
      { product: "IMMUNITY", sku: "IMMU-250", size: "250ml", qty: 4, unit_price: 22 },
      { product: "GLOW", sku: "GLOW-250", size: "250ml", qty: 4, unit_price: 22 },
    ],
    subtotal: 352,
    vat: 70.40,
    total: 422.40,
    status: "delivered",
    payment_status: "paid",
    invoice_url: "#",
  },
  {
    id: "wo_003",
    order_number: "WO-1051",
    date: "2026-04-01",
    items: [
      { product: "FOCUS", sku: "FOCUS-250", size: "250ml", qty: 8, unit_price: 22 },
      { product: "CALM", sku: "CALM-500", size: "500ml", qty: 2, unit_price: 30 },
      { product: "IMMUNITY", sku: "IMMU-250", size: "250ml", qty: 6, unit_price: 22 },
    ],
    subtotal: 392,
    vat: 78.40,
    total: 470.40,
    status: "shipped",
    payment_status: "invoiced",
    tracking_number: "JD0003000011223",
    tracking_url: "https://www.royalmail.com/track-your-item",
    invoice_url: "#",
    due_date: "2026-05-01",
  },
  {
    id: "wo_004",
    order_number: "WO-1059",
    date: "2026-04-03",
    items: [
      { product: "FOCUS", sku: "FOCUS-250", size: "250ml", qty: 6, unit_price: 22 },
      { product: "GLOW", sku: "GLOW-500", size: "500ml", qty: 2, unit_price: 30 },
    ],
    subtotal: 192,
    vat: 38.40,
    total: 230.40,
    status: "pending",
    payment_status: "invoiced",
    invoice_url: "#",
    due_date: "2026-05-03",
  },
];

const statusConfig: Record<WholesaleOrder["status"], { label: string; color: string; icon: React.ReactNode }> = {
  pending:   { label: "Pending",   color: "bg-amber-50 text-amber-700",  icon: <Clock className="h-3 w-3" /> },
  confirmed: { label: "Confirmed", color: "bg-blue-50 text-blue-700",    icon: <CheckCircle2 className="h-3 w-3" /> },
  shipped:   { label: "Shipped",   color: "bg-indigo-50 text-indigo-700",icon: <Truck className="h-3 w-3" /> },
  delivered: { label: "Delivered", color: "bg-green-50 text-green-700",  icon: <CheckCircle2 className="h-3 w-3" /> },
  overdue:   { label: "Overdue",   color: "bg-red-50 text-red-600",      icon: <AlertCircle className="h-3 w-3" /> },
};

const paymentConfig: Record<WholesaleOrder["payment_status"], { label: string; color: string }> = {
  invoiced: { label: "Invoice sent",  color: "text-amber-600" },
  paid:     { label: "Paid",          color: "text-green-600" },
  overdue:  { label: "Payment overdue", color: "text-red-500" },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const OrderRow = ({ order }: { order: WholesaleOrder }) => {
  const [open, setOpen] = useState(false);
  const sc = statusConfig[order.status];
  const pc = paymentConfig[order.payment_status];

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors text-left"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <Package className="h-4 w-4 text-primary/50" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-primary">{order.order_number}</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.color}`}>
                {sc.icon} {sc.label}
              </span>
            </div>
            <p className="text-xs text-primary/50">{formatDate(order.date)} · {order.items.reduce((s, i) => s + i.qty, 0)} bottles</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-primary">£{order.total.toFixed(2)}</p>
            <p className={`text-xs font-medium ${pc.color}`}>{pc.label}</p>
          </div>
          <ChevronDown className={`h-4 w-4 text-primary/30 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="border-t border-border px-5 pb-5 pt-4">
          {/* Items table */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-primary/40 font-medium uppercase tracking-wide">
                  <th className="text-left pb-2">Product</th>
                  <th className="text-center pb-2">Size</th>
                  <th className="text-center pb-2">Qty</th>
                  <th className="text-right pb-2">Unit</th>
                  <th className="text-right pb-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {order.items.map((item) => (
                  <tr key={item.sku}>
                    <td className="py-2 font-medium text-primary">{item.product}</td>
                    <td className="py-2 text-center text-primary/60">{item.size}</td>
                    <td className="py-2 text-center text-primary">×{item.qty}</td>
                    <td className="py-2 text-right text-primary/60">£{item.unit_price}</td>
                    <td className="py-2 text-right font-medium text-primary">£{(item.qty * item.unit_price).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-border">
                  <td colSpan={4} className="pt-3 text-xs text-primary/50">Subtotal</td>
                  <td className="pt-3 text-right text-sm text-primary/70">£{order.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={4} className="text-xs text-primary/50">VAT (20%)</td>
                  <td className="text-right text-sm text-primary/70">£{order.vat.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={4} className="pt-1 text-sm font-bold text-primary">Total inc. VAT</td>
                  <td className="pt-1 text-right text-sm font-bold text-primary">£{order.total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {order.due_date && order.payment_status === "invoiced" && (
            <div className="mb-3 px-3 py-2 bg-amber-50 rounded-lg text-xs text-amber-700 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              Payment due by {formatDate(order.due_date)} (Net 30)
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {order.tracking_number && (
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
            {order.invoice_url && (
              <a
                href={order.invoice_url}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs font-medium text-primary hover:border-primary/30 transition-colors"
                onClick={(e) => { e.preventDefault(); alert("Invoice download available once Shopify B2B is connected."); }}
              >
                <Download className="h-3.5 w-3.5" />
                Download invoice
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const OrdersTab = () => {
  const lifetimeValue = DEMO_ORDERS.reduce((s, o) => s + o.total, 0);
  const pendingPayment = DEMO_ORDERS.filter((o) => o.payment_status === "invoiced").reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-white border border-border rounded-xl p-4">
          <p className="text-xs text-primary/50 mb-1">Total orders</p>
          <p className="text-2xl font-bold text-primary">{DEMO_ORDERS.length}</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-4">
          <p className="text-xs text-primary/50 mb-1">Lifetime value</p>
          <p className="text-2xl font-bold text-primary">£{lifetimeValue.toFixed(0)}</p>
        </div>
        <div className="hidden md:block bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-xs text-amber-600/70 mb-1">Outstanding balance</p>
          <p className="text-2xl font-bold text-amber-700">£{pendingPayment.toFixed(0)}</p>
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {DEMO_ORDERS.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
      </div>

      <p className="text-xs text-center text-primary/30">
        All pricing is ex-works, exclusive of VAT · Net 30 payment terms
      </p>
    </div>
  );
};

export default OrdersTab;
