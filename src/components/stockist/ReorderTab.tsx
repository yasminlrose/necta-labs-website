import { useState } from "react";
import { ShoppingCart, Minus, Plus, AlertCircle, CheckCircle2, RefreshCw, Info } from "lucide-react";

interface Product {
  id: string;
  name: string;
  size: "250ml" | "500ml";
  sku: string;
  price: number;
  servings: number;
  color: string;
  suggested: number; // based on last order velocity
}

const PRODUCTS: Product[] = [
  { id: "focus-250",    name: "FOCUS",    size: "250ml", sku: "FOCUS-250",  price: 22, servings: 16.7, color: "#D6EBEA", suggested: 8 },
  { id: "immunity-250", name: "IMMUNITY", size: "250ml", sku: "IMMU-250",   price: 22, servings: 16.7, color: "#F2DDD4", suggested: 4 },
  { id: "calm-250",     name: "CALM",     size: "250ml", sku: "CALM-250",   price: 22, servings: 16.7, color: "#E0DAEF", suggested: 6 },
  { id: "glow-250",     name: "GLOW",     size: "250ml", sku: "GLOW-250",   price: 22, servings: 16.7, color: "#F0DEDA", suggested: 0 },
  { id: "focus-500",    name: "FOCUS",    size: "500ml", sku: "FOCUS-500",  price: 30, servings: 33.3, color: "#D6EBEA", suggested: 2 },
  { id: "immunity-500", name: "IMMUNITY", size: "500ml", sku: "IMMU-500",   price: 30, servings: 33.3, color: "#F2DDD4", suggested: 0 },
  { id: "calm-500",     name: "CALM",     size: "500ml", sku: "CALM-500",   price: 30, servings: 33.3, color: "#E0DAEF", suggested: 0 },
  { id: "glow-500",     name: "GLOW",     size: "500ml", sku: "GLOW-500",   price: 30, servings: 33.3, color: "#F0DEDA", suggested: 0 },
];

const MIN_ORDER = 6;

const QuantityControl = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) => (
  <div className="flex items-center gap-1">
    <button
      onClick={() => onChange(Math.max(0, value - 1))}
      className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
      disabled={value === 0}
    >
      <Minus className="h-3 w-3 text-primary" />
    </button>
    <span className="w-8 text-center text-sm font-semibold text-primary tabular-nums">{value}</span>
    <button
      onClick={() => onChange(value + 1)}
      className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
    >
      <Plus className="h-3 w-3 text-primary" />
    </button>
  </div>
);

const ReorderTab = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(PRODUCTS.map((p) => [p.id, p.suggested]))
  );
  const [autoReorder, setAutoReorder] = useState(false);
  const [autoFrequency, setAutoFrequency] = useState("monthly");
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const setQty = (id: string, qty: number) => setQuantities((prev) => ({ ...prev, [id]: qty }));

  const loadSuggested = () =>
    setQuantities(Object.fromEntries(PRODUCTS.map((p) => [p.id, p.suggested])));

  const totalBottles = Object.values(quantities).reduce((s, q) => s + q, 0);
  const subtotal = PRODUCTS.reduce((s, p) => s + (quantities[p.id] ?? 0) * p.price, 0);
  const vat = subtotal * 0.2;
  const total = subtotal + vat;
  const totalServings = PRODUCTS.reduce((s, p) => s + (quantities[p.id] ?? 0) * p.servings, 0);
  const meetsMinimum = totalBottles >= MIN_ORDER;

  const handlePlaceOrder = async () => {
    if (!meetsMinimum) return;
    setLoading(true);
    // TODO: Submit to Shopify B2B Draft Orders API
    // https://shopify.dev/docs/api/admin-rest/2024-01/resources/draftorder
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setPlaced(true);
  };

  const selectedItems = PRODUCTS.filter((p) => (quantities[p.id] ?? 0) > 0);

  if (placed) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-primary mb-2">Order placed!</h3>
        <p className="text-sm text-primary/60 mb-2">
          Your order has been submitted. We'll confirm within 2 hours (Mon–Fri, 9am–5pm).
        </p>
        <p className="text-sm text-primary/50 mb-8">
          Invoice will be sent upon dispatch · Net 30 payment terms
        </p>
        <button
          onClick={() => { setPlaced(false); setQuantities(Object.fromEntries(PRODUCTS.map((p) => [p.id, 0]))); }}
          className="px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Place another order
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Suggested order banner */}
      <div className="bg-[hsl(var(--necta-focus-card))] rounded-xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-[hsl(var(--necta-focus))] flex-shrink-0" />
          <p className="text-xs text-primary/70">
            <strong className="text-primary">Suggested reorder</strong> based on your typical monthly order loaded. Edit quantities below.
          </p>
        </div>
        <button
          onClick={loadSuggested}
          className="flex-shrink-0 flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/70 transition-colors"
        >
          <RefreshCw className="h-3 w-3" /> Reset
        </button>
      </div>

      {/* 250ml section */}
      <div>
        <p className="text-xs font-bold text-primary/40 uppercase tracking-wider mb-3 flex items-center gap-2">
          250ml Pump Bottles
          <span className="font-normal normal-case tracking-normal text-primary/30">· 16.7 servings per bottle · £22 each</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRODUCTS.filter((p) => p.size === "250ml").map((product) => {
            const qty = quantities[product.id] ?? 0;
            return (
              <div
                key={product.id}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                  qty > 0 ? "border-primary/20 bg-primary/[0.02]" : "border-border bg-white"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black text-primary/70"
                  style={{ backgroundColor: product.color }}
                >
                  {product.name.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary">{product.name}</p>
                  <p className="text-xs text-primary/50">250ml · £22 · {product.servings} servings</p>
                </div>
                <QuantityControl value={qty} onChange={(n) => setQty(product.id, n)} />
              </div>
            );
          })}
        </div>
      </div>

      {/* 500ml section */}
      <div>
        <p className="text-xs font-bold text-primary/40 uppercase tracking-wider mb-3 flex items-center gap-2">
          500ml Pump Bottles
          <span className="font-normal normal-case tracking-normal text-primary/30">· 33.3 servings per bottle · £30 each</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRODUCTS.filter((p) => p.size === "500ml").map((product) => {
            const qty = quantities[product.id] ?? 0;
            return (
              <div
                key={product.id}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                  qty > 0 ? "border-primary/20 bg-primary/[0.02]" : "border-border bg-white"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black text-primary/70"
                  style={{ backgroundColor: product.color }}
                >
                  {product.name.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary">{product.name}</p>
                  <p className="text-xs text-primary/50">500ml · £30 · {product.servings} servings</p>
                </div>
                <QuantityControl value={qty} onChange={(n) => setQty(product.id, n)} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Order summary card */}
      <div className="bg-white border border-border rounded-2xl p-5 sticky bottom-4 shadow-md">
        {/* Selected items preview */}
        {selectedItems.length > 0 && (
          <div className="mb-4 space-y-1.5">
            {selectedItems.map((p) => (
              <div key={p.id} className="flex justify-between text-sm">
                <span className="text-primary/70">{p.name} {p.size} × {quantities[p.id]}</span>
                <span className="text-primary font-medium">£{((quantities[p.id] ?? 0) * p.price).toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-border flex justify-between text-xs text-primary/50">
              <span>VAT (20%)</span>
              <span>£{vat.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-xs text-primary/50">Order total (inc. VAT)</p>
            <p className="text-2xl font-bold text-primary">£{total.toFixed(2)}</p>
            <p className="text-xs text-primary/40">{totalBottles} bottles · ~{Math.round(totalServings)} servings</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-primary/40">Subtotal ex. VAT</p>
            <p className="text-sm font-semibold text-primary">£{subtotal.toFixed(2)}</p>
          </div>
        </div>

        {/* Min order warning */}
        {totalBottles > 0 && !meetsMinimum && (
          <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg">
            <AlertCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              Minimum order is <strong>{MIN_ORDER} bottles</strong>. Add {MIN_ORDER - totalBottles} more to proceed.
            </p>
          </div>
        )}

        <button
          onClick={handlePlaceOrder}
          disabled={!meetsMinimum || loading || totalBottles === 0}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40"
        >
          <ShoppingCart className="h-4 w-4" />
          {loading ? "Placing order…" : totalBottles === 0 ? "Select products to order" : `Place order · £${total.toFixed(2)}`}
        </button>

        <p className="text-xs text-center text-primary/30 mt-2">
          Net 30 · Invoice sent upon dispatch · No upfront payment required
        </p>
      </div>

      {/* Auto-reorder */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-primary">Auto-reorder</h3>
            <p className="text-xs text-primary/50 mt-0.5">Automatically repeat this order on a schedule</p>
          </div>
          <button
            onClick={() => setAutoReorder(!autoReorder)}
            className={`relative w-11 h-6 rounded-full transition-colors ${autoReorder ? "bg-primary" : "bg-border"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${autoReorder ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
        {autoReorder && (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-primary/50 mb-2">Frequency</p>
              <div className="flex gap-2">
                {["monthly", "bi-monthly", "quarterly"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setAutoFrequency(f)}
                    className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                      autoFrequency === f ? "border-primary bg-primary text-white" : "border-border text-primary hover:border-primary/30"
                    }`}
                  >
                    {f === "monthly" ? "Monthly" : f === "bi-monthly" ? "Every 2 months" : "Quarterly"}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-primary/40">
              You'll receive an email 5 days before each auto-order ships so you can adjust quantities.
            </p>
            <button className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              Set up auto-reorder
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReorderTab;
