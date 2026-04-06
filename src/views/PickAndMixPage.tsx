'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Check, Minus, Plus, ShoppingBag, ChevronRight, X, Share2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";

import bottleFocus from "@/assets/bottle-focus.jpeg";
import bottleImmunity from "@/assets/bottle-immunity.jpeg";
import bottleCalm from "@/assets/bottle-calm.jpeg";
import bottleGlow from "@/assets/bottle-glow.jpeg";
import sachetFocus from "@/assets/sachet-focus.png";
import sachetImmunity from "@/assets/sachet-immunity.png";
import sachetCalm from "@/assets/sachet-calm.png";
import sachetGlow from "@/assets/sachet-beauty.png";

/* ─── Product catalogue ──────────────────────────────────────── */
type Format = "bottle" | "sachet";
type FilterTab = "all" | "bottle" | "sachet";
type SellingPlan = "one-off" | "subscribe";

interface MixProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  format: Format;
  size: string;
  price: number;
  image: string;
  accentColor: string;
  cardBg: string;
}

const mixProducts: MixProduct[] = [
  { id: "focus-250ml",       slug: "focus",    name: "FOCUS",    tagline: "Mental clarity",   format: "bottle", size: "250ml",      price: 29, image: bottleFocus as unknown as string,    accentColor: "#5B9E99", cardBg: "#D6EBEA" },
  { id: "immunity-250ml",    slug: "immunity", name: "IMMUNITY", tagline: "Daily defence",     format: "bottle", size: "250ml",      price: 29, image: bottleImmunity as unknown as string, accentColor: "#C06040", cardBg: "#F2DDD4" },
  { id: "calm-250ml",        slug: "calm",     name: "CALM",     tagline: "Stress relief",     format: "bottle", size: "250ml",      price: 29, image: bottleCalm as unknown as string,     accentColor: "#8878C0", cardBg: "#E0DAEF" },
  { id: "glow-250ml",        slug: "glow",     name: "GLOW",     tagline: "Skin from within",  format: "bottle", size: "250ml",      price: 29, image: bottleGlow as unknown as string,     accentColor: "#B06455", cardBg: "#F0DEDA" },
  { id: "focus-500ml",       slug: "focus",    name: "FOCUS",    tagline: "Mental clarity",   format: "bottle", size: "500ml",      price: 39, image: bottleFocus as unknown as string,    accentColor: "#5B9E99", cardBg: "#D6EBEA" },
  { id: "immunity-500ml",    slug: "immunity", name: "IMMUNITY", tagline: "Daily defence",     format: "bottle", size: "500ml",      price: 39, image: bottleImmunity as unknown as string, accentColor: "#C06040", cardBg: "#F2DDD4" },
  { id: "calm-500ml",        slug: "calm",     name: "CALM",     tagline: "Stress relief",     format: "bottle", size: "500ml",      price: 39, image: bottleCalm as unknown as string,     accentColor: "#8878C0", cardBg: "#E0DAEF" },
  { id: "glow-500ml",        slug: "glow",     name: "GLOW",     tagline: "Skin from within",  format: "bottle", size: "500ml",      price: 39, image: bottleGlow as unknown as string,     accentColor: "#B06455", cardBg: "#F0DEDA" },
  { id: "focus-sachet-30",   slug: "focus",    name: "FOCUS",    tagline: "Mental clarity",   format: "sachet", size: "30-day box", price: 45, image: sachetFocus as unknown as string,    accentColor: "#5B9E99", cardBg: "#D6EBEA" },
  { id: "immunity-sachet-30",slug: "immunity", name: "IMMUNITY", tagline: "Daily defence",     format: "sachet", size: "30-day box", price: 45, image: sachetImmunity as unknown as string, accentColor: "#C06040", cardBg: "#F2DDD4" },
  { id: "calm-sachet-30",    slug: "calm",     name: "CALM",     tagline: "Stress relief",     format: "sachet", size: "30-day box", price: 45, image: sachetCalm as unknown as string,     accentColor: "#8878C0", cardBg: "#E0DAEF" },
  { id: "glow-sachet-30",    slug: "glow",     name: "GLOW",     tagline: "Skin from within",  format: "sachet", size: "30-day box", price: 45, image: sachetGlow as unknown as string,     accentColor: "#B06455", cardBg: "#F0DEDA" },
];

const TIERS = [
  { count: 2, label: "Duo Bundle",      discount: 10, tag: null,          desc: "Pick any 2 products" },
  { count: 3, label: "Trio Bundle",     discount: 15, tag: "Most popular", desc: "Pick any 3 products" },
  { count: 4, label: "Full Collection", discount: 25, tag: "Best value",   desc: "One of everything"   },
];

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all",    label: "All Products" },
  { id: "bottle", label: "Pump Bottles" },
  { id: "sachet", label: "Sachets" },
];

type Selection = Record<string, number>;

function encodeProducts(selection: Selection): string {
  return Object.entries(selection)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => `${id}-${qty}`)
    .join("_");
}

function decodeProducts(encoded: string): Selection {
  if (!encoded) return {};
  const sel: Selection = {};
  encoded.split("_").forEach((chunk) => {
    const lastDash = chunk.lastIndexOf("-");
    if (lastDash === -1) return;
    const id = chunk.slice(0, lastDash);
    const qty = parseInt(chunk.slice(lastDash + 1), 10);
    if (id && !isNaN(qty) && qty > 0) sel[id] = qty;
  });
  return sel;
}

const PickAndMixPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { addItem, openCart } = useCart();

  const [bundleSize, setBundleSizeState] = useState<number | null>(() => {
    const v = searchParams?.get("bundleSize");
    const n = v ? parseInt(v, 10) : null;
    return n && [2,3,4].includes(n) ? n : null;
  });
  const [filter, setFilterState] = useState<FilterTab>(() => {
    const v = searchParams?.get("filter") as FilterTab;
    return ["all","bottle","sachet"].includes(v) ? v : "all";
  });
  const [selection, setSelectionState] = useState<Selection>(() =>
    decodeProducts(searchParams?.get("products") || "")
  );
  const [sellingPlan, setSellingPlanState] = useState<SellingPlan>(() => {
    const v = searchParams?.get("sellingPlan");
    return v === "subscribe" ? "subscribe" : "one-off";
  });
  const [shareToast, setShareToast] = useState(false);

  const syncUrl = useCallback((size: number | null, sel: Selection, flt: FilterTab, plan: SellingPlan) => {
    const params = new URLSearchParams();
    if (size) params.set("bundleSize", String(size));
    const encoded = encodeProducts(sel);
    if (encoded) params.set("products", encoded);
    if (flt !== "all") params.set("filter", flt);
    if (plan !== "one-off") params.set("sellingPlan", plan);
    const qs = params.toString();
    const currentPath = pathname ?? "/pick-and-mix";
    router.replace(qs ? `${currentPath}?${qs}` : currentPath, { scroll: false });
  }, [router, pathname]);

  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) { isInitialRender.current = false; return; }
    syncUrl(bundleSize, selection, filter, sellingPlan);
  }, [bundleSize, selection, filter, sellingPlan, syncUrl]);

  const setBundleSize = (v: number | null) => setBundleSizeState(v);
  const setFilter = (v: FilterTab) => setFilterState(v);
  const setSelection = (fn: (prev: Selection) => Selection) => setSelectionState(fn);
  const setSellingPlan = (v: SellingPlan) => setSellingPlanState(v);

  const tier = TIERS.find((t) => t.count === bundleSize);
  const totalSelected = useMemo(() => Object.values(selection).reduce((s, q) => s + q, 0), [selection]);
  const baseTotal = useMemo(() => Object.entries(selection).reduce((s, [id, qty]) => {
    const p = mixProducts.find((m) => m.id === id);
    return s + (p ? p.price * qty : 0);
  }, 0), [selection]);
  const bundleDiscountPct = tier?.discount ?? 0;
  const subDiscountPct = sellingPlan === "subscribe" ? 20 : 0;
  const totalDiscountPct = Math.min(bundleDiscountPct + subDiscountPct, 40);
  const savings = +(baseTotal * (totalDiscountPct / 100)).toFixed(2);
  const finalTotal = +(baseTotal - savings).toFixed(2);
  const slotsLeft = bundleSize ? Math.max(0, bundleSize - totalSelected) : 0;
  const isFull = bundleSize !== null && totalSelected >= bundleSize;

  const increment = (id: string) => {
    if (bundleSize && totalSelected >= bundleSize) return;
    setSelection((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };
  const decrement = (id: string) => {
    setSelection((prev) => {
      const next = { ...prev };
      if (!next[id] || next[id] <= 1) delete next[id];
      else next[id]--;
      return next;
    });
  };
  const handleAddToCart = () => {
    Object.entries(selection).forEach(([id, qty]) => {
      const p = mixProducts.find((m) => m.id === id);
      if (!p) return;
      addItem({ id: `mix-${id}`, slug: p.slug, name: `${p.name} (Bundle)`, image: p.image, price: +(p.price * (1 - totalDiscountPct / 100)).toFixed(2), size: p.size, mode: sellingPlan === "subscribe" ? "subscribe" : "one-off" });
    });
    openCart();
  };
  const handleReset = () => { setBundleSizeState(null); setSelectionState({}); setFilterState("all"); setSellingPlanState("one-off"); router.replace(pathname ?? "/pick-and-mix", { scroll: false }); };
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) { await navigator.share({ title: "My NECTA Bundle", url }); }
    else { await navigator.clipboard.writeText(url); setShareToast(true); setTimeout(() => setShareToast(false), 2000); }
  };

  const visibleProducts = filter === "all" ? mixProducts : mixProducts.filter((p) => p.format === filter);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="pt-10 pb-10 text-center" style={{ background: "radial-gradient(ellipse 100% 120% at 50% 0%, #E8F6F5 0%, #EDE8F6 40%, #FEF8F5 100%)" }}>
        <div className="necta-container">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary/40 mb-3">Build Your Bundle</p>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 tracking-tight">Pick &amp; Mix</h1>
          <p className="text-primary/55 text-base max-w-md mx-auto leading-relaxed">Mix any NECTA organic functional infusions and sachets. The more you add, the more you save.</p>
        </div>
      </section>

      <div className="necta-container pb-40">

        {/* STEP 1 */}
        <div className="py-12">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
            <h2 className="text-xl font-bold text-primary">Choose your bundle size</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TIERS.map((t) => {
              const isActive = bundleSize === t.count;
              return (
                <button key={t.count} onClick={() => { setBundleSizeState(t.count); setSelectionState({}); syncUrl(t.count, {}, filter, sellingPlan); }}
                  className={`relative text-left rounded-2xl border-2 p-6 transition-all duration-200 ${isActive ? "border-primary shadow-lg bg-primary/[0.02]" : "border-border hover:border-primary/30 hover:shadow-md bg-white"}`}>
                  {t.tag && <span className="absolute -top-3 left-5 text-[10px] font-bold uppercase tracking-widest bg-primary text-white px-3 py-1 rounded-full">{t.tag}</span>}
                  <div className="flex items-start justify-between mb-3">
                    <div><p className="font-bold text-primary text-lg">{t.label}</p><p className="text-sm text-primary/50 mt-0.5">{t.desc}</p></div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${isActive ? "border-primary bg-primary" : "border-border"}`}>
                      {isActive && <Check className="h-3.5 w-3.5 text-white" />}
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <span className="text-base">🎉</span> Save {t.discount}%
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2 */}
        {bundleSize && (
          <div className="pb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
              <h2 className="text-xl font-bold text-primary">One-off or subscribe?</h2>
            </div>
            <div className="flex rounded-xl bg-muted p-1 max-w-sm">
              {(["one-off", "subscribe"] as SellingPlan[]).map((plan) => (
                <button key={plan} onClick={() => setSellingPlan(plan)}
                  className={`flex-1 relative text-sm py-2.5 rounded-lg transition-all font-medium ${sellingPlan === plan ? "bg-white text-primary shadow-sm" : "text-primary/50 hover:text-primary"}`}>
                  {plan === "subscribe" ? "Subscribe & Save" : "One-off"}
                  {plan === "subscribe" && <span className="absolute -top-2.5 right-1 text-[9px] font-bold px-2 py-0.5 rounded-full text-white bg-green-600">+20% OFF</span>}
                </button>
              ))}
            </div>
            {sellingPlan === "subscribe" && <p className="text-xs text-primary/50 mt-2 ml-1">Subscribe for an extra 20% off on top of your bundle discount. Cancel anytime.</p>}
          </div>
        )}

        {/* STEP 3 */}
        {bundleSize && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
                <h2 className="text-xl font-bold text-primary">Choose your products</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  {Array.from({ length: bundleSize }).map((_, i) => (
                    <div key={i} className="w-3 h-3 rounded-full border-2 transition-colors"
                      style={{ backgroundColor: i < totalSelected ? "hsl(var(--primary))" : "transparent", borderColor: i < totalSelected ? "hsl(var(--primary))" : "hsl(var(--border))" }} />
                  ))}
                </div>
                <span className="text-sm font-medium text-primary">{totalSelected}/{bundleSize}{isFull ? " — bundle complete! 🎉" : ` — ${slotsLeft} to go`}</span>
              </div>
            </div>

            <div className="flex gap-2 mb-8 flex-wrap">
              {FILTER_TABS.map((tab) => (
                <button key={tab.id} onClick={() => setFilter(tab.id)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${filter === tab.id ? "bg-primary text-white border-primary" : "bg-white text-primary/60 border-border hover:border-primary/30"}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {visibleProducts.map((product) => {
                const qty = selection[product.id] ?? 0;
                const isAtMax = isFull && qty === 0;
                return (
                  <div key={product.id} className={`relative rounded-2xl border-2 bg-white overflow-hidden flex flex-col transition-all duration-200 ${qty > 0 ? "border-primary shadow-md" : isAtMax ? "border-border opacity-50" : "border-border hover:border-primary/30 hover:shadow-sm"}`}>
                    {qty > 0 && <div className="absolute top-3 right-3 z-10 w-6 h-6 bg-primary rounded-full flex items-center justify-center"><span className="text-white text-xs font-bold">{qty}</span></div>}
                    <div className="pt-6 px-4 flex items-end justify-center h-44">
                      <Image src={product.image} alt={`NECTA ${product.name} organic functional infusion`} width={160} height={160} className="h-full w-auto object-contain" style={{ mixBlendMode: "multiply" }} />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-primary/40 mb-0.5">{product.format === "bottle" ? "Pump Bottle" : "Sachet Box"}</p>
                      <p className="font-bold text-primary text-sm leading-tight mb-0.5">{product.name}</p>
                      <p className="text-xs text-primary/50 mb-1">{product.tagline}</p>
                      <p className="text-xs text-primary/40 mb-3">{product.size}</p>
                      <div className="flex items-baseline gap-1.5 mb-3">
                        <span className="text-sm font-bold text-primary">£{product.price}</span>
                        {totalDiscountPct > 0 && <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: product.cardBg, color: product.accentColor }}>-{totalDiscountPct}%</span>}
                      </div>
                      {qty === 0 ? (
                        <button onClick={() => increment(product.id)} disabled={isAtMax} className="w-full py-2.5 rounded-lg text-sm font-semibold transition-colors text-white disabled:opacity-40" style={{ backgroundColor: isAtMax ? undefined : product.accentColor }}>
                          {isAtMax ? "Bundle full" : "Add to bundle"}
                        </button>
                      ) : (
                        <div className="flex items-center justify-between border-2 border-primary rounded-lg overflow-hidden">
                          <button onClick={() => decrement(product.id)} className="w-10 h-9 flex items-center justify-center hover:bg-muted transition-colors"><Minus className="h-3.5 w-3.5 text-primary" /></button>
                          <span className="text-sm font-bold text-primary">{qty}</span>
                          <button onClick={() => increment(product.id)} disabled={isFull} className="w-10 h-9 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"><Plus className="h-3.5 w-3.5 text-primary" /></button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* STICKY BOTTOM BAR */}
      {bundleSize && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
          <div className="necta-container py-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex gap-1.5">
                  {Array.from({ length: bundleSize }).map((_, i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full border transition-all duration-300"
                      style={{ backgroundColor: i < totalSelected ? "hsl(var(--primary))" : "transparent", borderColor: i < totalSelected ? "hsl(var(--primary))" : "hsl(var(--border))", transform: i < totalSelected ? "scale(1.15)" : "scale(1)" }} />
                  ))}
                </div>
                <span className="text-sm font-medium text-primary">{totalSelected}/{bundleSize} items</span>
              </div>
              <div className="flex-1 hidden sm:block" />
              {totalSelected > 0 && (
                <div className="flex items-center gap-4 flex-shrink-0">
                  {totalDiscountPct > 0 && (
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-primary/40 line-through">£{baseTotal.toFixed(2)}</p>
                      <p className="text-xs font-semibold text-green-600">You save £{savings.toFixed(2)}</p>
                    </div>
                  )}
                  <div className="text-right">
                    <p className="text-xs text-primary/50">Bundle total</p>
                    <p className="text-lg font-bold text-primary">£{finalTotal.toFixed(2)}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
                {totalSelected === 0 ? (
                  <p className="text-sm text-primary/40 w-full sm:w-auto text-center">Add {bundleSize} products to continue</p>
                ) : !isFull ? (
                  <p className="text-sm text-primary/60 font-medium w-full sm:w-auto text-center">Add {slotsLeft} more to complete your bundle</p>
                ) : (
                  <>
                    <button onClick={handleShare} className="p-2.5 rounded-lg border border-border hover:bg-muted transition-colors text-primary/50 hover:text-primary flex-shrink-0 relative" aria-label="Share bundle">
                      <Share2 className="h-4 w-4" />
                      {shareToast && <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-primary text-white px-2 py-1 rounded whitespace-nowrap">Copied!</span>}
                    </button>
                    <button onClick={handleAddToCart} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-3.5 rounded-lg text-sm hover:bg-primary/90 transition-colors">
                      <ShoppingBag className="h-4 w-4" />
                      {sellingPlan === "subscribe" ? "Subscribe & save" : "Add bundle to basket"}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
                {totalSelected > 0 && (
                  <button onClick={handleReset} className="p-2.5 rounded-lg border border-border hover:bg-muted transition-colors text-primary/40 hover:text-primary flex-shrink-0" aria-label="Reset bundle">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PickAndMixPage;
