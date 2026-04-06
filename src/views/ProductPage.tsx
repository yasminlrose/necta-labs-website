'use client';

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Star, Truck, RefreshCcw, Leaf, ChevronDown, Check, FlaskConical, Shield, Zap } from "lucide-react";
import { getPriceId, getStripeMode } from "@/lib/stripePrices";
import type { ProductSlug as StripePriceSlug } from "@/lib/stripePrices";
import ProductTabs from "@/components/ProductTabs";
import YouMayAlsoLike from "@/components/YouMayAlsoLike";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReserveOrderModal from "@/components/ReserveOrderModal";
import { products } from "@/data/products";
import type { ProductSlug } from "@/data/products";

/* ─── Per-product config ─────────────────────────────────────── */
const seoTitles: Record<string, string> = {
  focus:   "FOCUS Infusion — Lion's Mane for Mental Clarity | NECTA Labs",
  immunity:"IMMUNITY Infusion — Reishi for Daily Defence | NECTA Labs",
  calm:    "CALM Infusion — Chamomile for Stress Relief | NECTA Labs",
  glow:    "GLOW Infusion — Marine Collagen for Skin Health | NECTA Labs",
};

const colorMap: Record<string, { accent: string; light: string; gradient: string }> = {
  focus:   { accent: "#5B9E99", light: "#D6EBEA", gradient: "radial-gradient(ellipse 90% 80% at 55% 40%, #C8E8E5 0%, #EBF7F6 60%, #F8FFFE 100%)" },
  immunity:{ accent: "#C06040", light: "#F2DDD4", gradient: "radial-gradient(ellipse 90% 80% at 55% 40%, #EAC9BB 0%, #F5E5DC 60%, #FEF8F5 100%)" },
  calm:    { accent: "#8878C0", light: "#E0DAEF", gradient: "radial-gradient(ellipse 90% 80% at 55% 40%, #CFC7EC 0%, #E9E4F6 60%, #F8F6FE 100%)" },
  glow:    { accent: "#B06455", light: "#F0DEDA", gradient: "radial-gradient(ellipse 90% 80% at 55% 40%, #E8C4BD 0%, #F5DDD9 60%, #FEF7F6 100%)" },
};

const heroTaglines: Record<string, string> = {
  focus:   "Sharpen your mind. Add to any drink.",
  immunity:"Strengthen your defences. Add to any drink.",
  calm:    "Find your calm. Add to any drink.",
  glow:    "Glow from within. Add to any drink.",
};

const productBenefits: Record<string, { icon: typeof FlaskConical; title: string; desc: string }[]> = {
  focus: [
    { icon: Zap, title: "Sustained focus", desc: "No caffeine crash — just clean, calm mental clarity all day." },
    { icon: FlaskConical, title: "Clinically dosed", desc: "Lion's Mane at 500mg, Rhodiola at 200mg — proven therapeutic levels." },
    { icon: Shield, title: "Adaptogenic", desc: "Helps your body manage cognitive stress and mental fatigue." },
  ],
  immunity: [
    { icon: Shield, title: "Immune defence", desc: "Reishi at 2g — clinical-level immune modulation, daily." },
    { icon: Leaf, title: "Antioxidant rich", desc: "Elderberry, Vitamin C, and Quercetin work together for full-spectrum protection." },
    { icon: Zap, title: "Stress resilience", desc: "Ashwagandha at 300mg reduces cortisol and supports immune function under pressure." },
  ],
  calm: [
    { icon: Zap, title: "Non-drowsy calm", desc: "Relaxes without sedating — perfect for daytime stress and evening wind-down." },
    { icon: FlaskConical, title: "Sleep quality", desc: "Jujube Seed and Lemon Balm reduce sleep latency and improve depth." },
    { icon: Shield, title: "Nervine botanicals", desc: "Chamomile and Poria support your nervous system, naturally." },
  ],
  glow: [
    { icon: FlaskConical, title: "Marine collagen", desc: "2.5g bioavailable peptides for skin firmness, hair, and nails." },
    { icon: Zap, title: "Deep hydration", desc: "Hyaluronic Acid at 120mg holds up to 1,000× its weight in water." },
    { icon: Shield, title: "Anti-ageing complex", desc: "CoQ10, Resveratrol, and Fisetin protect against cellular ageing." },
  ],
};

type Format = "bottle" | "sachet";
type PurchaseMode = "subscribe" | "one-off";
type BottleSize = "250ml" | "500ml";
type SachetDays = 7 | 14 | 30 | 90;

const SACHET_OPTIONS: { days: SachetDays; label: string; badge?: string }[] = [
  { days: 7,  label: "7-day trial" },
  { days: 14, label: "14-day box" },
  { days: 30, label: "30-day box", badge: "Most popular" },
  { days: 90, label: "90-day box", badge: "Best value" },
];

const frequencies = [
  { label: "Monthly",        value: "monthly"  },
  { label: "Every 2 months", value: "2monthly" },
];

const ProductPage = ({ slug: slugProp }: { slug?: string } = {}) => {
  const params = useParams();
  const slug = slugProp ?? (params?.slug as string | undefined);
  const searchParams = useSearchParams();
  const product = slug && slug in products ? products[slug as ProductSlug] : undefined;
  const colors = slug ? colorMap[slug] : undefined;

  const [format, setFormat] = useState<Format>(() =>
    searchParams?.get("format") === "sachet" ? "sachet" : "bottle"
  );
  const [mode, setMode] = useState<PurchaseMode>("subscribe");
  const [size, setSize] = useState<BottleSize>("250ml");
  const [sachetDays, setSachetDays] = useState<SachetDays>(30);
  const [sachetMode, setSachetMode] = useState<'subscribe' | 'one-off'>('subscribe');
  const [frequency, setFrequency] = useState("monthly");
  const [freqOpen, setFreqOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = useCallback(async (priceId: string, stripeMode: 'payment' | 'subscription', productName: string, sizeLabel: string, billingFrequency?: string) => {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, mode: stripeMode, productName, size: sizeLabel, productSlug: slug, frequency: billingFrequency }),
      });
      const data: { url?: string; error?: string } = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? 'No checkout URL returned');
      }
      window.location.href = data.url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Checkout failed';
      console.error('[checkout]', message);
      alert(`Checkout unavailable: ${message}`);
    } finally {
      setCheckoutLoading(false);
    }
  }, [slug]);

  useEffect(() => { setActiveImage(0); }, [slug]);
  useEffect(() => { setActiveImage(format === "sachet" ? 1 : 0); }, [format]);
  useEffect(() => { if (sachetDays === 7) setSachetMode('one-off'); }, [sachetDays]);

  if (!product || !colors) {
    if (typeof window !== 'undefined') window.location.replace('/shop');
    return null;
  }

  /* pricing */
  const bottlePrice = size === "250ml"
    ? (mode === "subscribe" ? product.price250Sub : product.price250)
    : (mode === "subscribe" ? product.price500Sub : product.price500);
  const sachetPrice = product.sachets[sachetDays];
  const currentPrice = format === "sachet" ? sachetPrice : bottlePrice;
  const oneOffPrice = size === "250ml" ? product.price250 : product.price500;
  const savePct = Math.round(((oneOffPrice - bottlePrice) / oneOffPrice) * 100);

  const benefits = productBenefits[slug ?? ""] || productBenefits.focus;

  const images = [
    { src: product.bottleImage, alt: `NECTA ${product.name} bottle` },
    { src: product.sachetImage, alt: `NECTA ${product.name} sachet` },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── HERO ── */}
      <section style={{ background: colors.gradient }}>
        <div className="necta-container pt-8 pb-0 md:pt-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-primary/40 mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-primary/70">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-start">
            {/* LEFT — Image gallery */}
            <div className="order-1">
              {/* Main image */}
              <div className="rounded-2xl overflow-hidden flex items-center justify-center h-[360px] md:h-[480px] mb-3 bg-white">
                <Image
                  src={images[activeImage].src}
                  alt={images[activeImage].alt}
                  width={600}
                  height={600}
                  priority
                  className="h-[90%] w-auto object-contain"
                  style={{ mixBlendMode: "multiply" }}
                />
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`rounded-xl overflow-hidden h-[70px] w-[70px] flex items-center justify-center border-2 transition-all flex-shrink-0 bg-white ${
                      activeImage === i ? "border-primary" : "border-border hover:border-primary/20"
                    }`}
                  >
                    <Image src={img.src} alt="" width={58} height={58} loading="lazy" className="h-[58px] object-contain" style={{ mixBlendMode: "multiply" }} />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT — Purchase module */}
            <div className="order-2 md:sticky md:top-24 pb-10">
              <p className="text-xs text-primary/40 tracking-widest uppercase mb-2">NECTA Labs</p>
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-1">{product.name}</h1>
              <p className="text-sm text-primary/50 italic mb-4">{product.flavor}</p>

              {/* Stars */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-primary text-primary" : "text-primary/20"}`} />
                  ))}
                </div>
                <span className="text-sm text-primary/55">{product.rating} ({product.reviewCount} reviews)</span>
              </div>

              <p className="text-base text-primary/70 mb-6 leading-relaxed">{heroTaglines[product.slug]}</p>

              {/* ── FORMAT TOGGLE — Pump Bottle / Sachet ── */}
              <div className="flex rounded-lg bg-muted p-1 mb-6">
                {(["bottle", "sachet"] as Format[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`flex-1 text-sm py-2.5 rounded-md transition-all font-medium ${
                      format === f ? "bg-white text-primary shadow-sm" : "text-primary/50 hover:text-primary"
                    }`}
                  >
                    {f === "bottle" ? "Pump Bottle" : "Sachet Box"}
                  </button>
                ))}
              </div>

              {/* ── BOTTLE OPTIONS ── */}
              {format === "bottle" && (
                <>
                  {/* Subscribe / One-off toggle */}
                  <div className="flex rounded-lg bg-muted p-1 mb-5">
                    {(["subscribe", "one-off"] as PurchaseMode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`flex-1 relative text-sm py-2.5 rounded-md transition-all font-medium ${
                          mode === m ? "bg-white text-primary shadow-sm" : "text-primary/50 hover:text-primary"
                        }`}
                      >
                        {m === "subscribe" ? "Subscribe & Save" : "One-off"}
                        {m === "subscribe" && mode === "subscribe" && (
                          <span
                            className="absolute -top-2.5 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: colors.accent }}
                          >
                            SAVE {savePct}%
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Delivery frequency (subscribe only) */}
                  {mode === "subscribe" && (
                    <div className="relative mb-5">
                      <button
                        onClick={() => setFreqOpen(!freqOpen)}
                        className="w-full flex items-center justify-between border border-border rounded-lg px-4 py-3 text-sm text-primary bg-white hover:border-primary/30 transition-colors"
                      >
                        <span>Deliver {frequencies.find(f => f.value === frequency)?.label.toLowerCase()}</span>
                        <ChevronDown className={`h-4 w-4 text-primary/40 transition-transform ${freqOpen ? "rotate-180" : ""}`} />
                      </button>
                      {freqOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-10 overflow-hidden">
                          {frequencies.map((f) => (
                            <button
                              key={f.value}
                              onClick={() => { setFrequency(f.value); setFreqOpen(false); }}
                              className={`w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors flex items-center justify-between ${frequency === f.value ? "text-primary font-medium" : "text-primary/60"}`}
                            >
                              {f.label}
                              {frequency === f.value && <Check className="h-4 w-4" style={{ color: colors.accent }} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Size selector */}
                  <div className="flex gap-3 mb-5">
                    {(["250ml", "500ml"] as BottleSize[]).map((s) => {
                      const p = mode === "subscribe"
                        ? (s === "250ml" ? product.price250Sub : product.price500Sub)
                        : (s === "250ml" ? product.price250 : product.price500);
                      const rrp = s === "250ml" ? product.price250 : product.price500;
                      return (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={`flex-1 rounded-xl border-2 py-3.5 px-4 text-center transition-all ${
                            size === s ? "border-primary bg-primary/[0.03]" : "border-border hover:border-primary/30"
                          }`}
                        >
                          <p className="text-sm font-bold text-primary">{s} Bottle</p>
                          <p className="text-sm font-semibold mt-0.5" style={{ color: colors.accent }}>
                            £{p}{mode === "subscribe" ? "/mo" : ""}
                          </p>
                          {mode === "subscribe" && (
                            <p className="text-xs text-primary/30 line-through mt-0.5">£{rrp}</p>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Price display */}
                  <div className="flex items-baseline gap-3 mb-5">
                    <span className="text-2xl font-bold text-primary">
                      £{bottlePrice}{mode === "subscribe" ? "/mo" : ""}
                    </span>
                    {mode === "subscribe" && (
                      <span className="text-base text-primary/35 line-through">£{oneOffPrice}</span>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    disabled={checkoutLoading}
                    onClick={() => {
                      const subMode = mode === 'subscribe'
                        ? (frequency === '2monthly' ? 'subscribe-2m' : 'subscribe')
                        : 'one-off';
                      const priceId = getPriceId(slug as StripePriceSlug, 'bottle', size as '250ml' | '500ml', subMode);
                      const stripeMode = getStripeMode('bottle', size as '250ml' | '500ml', subMode);
                      const freqLabel = mode === 'subscribe'
                        ? (frequency === '2monthly' ? 'every 2 months' : 'monthly')
                        : undefined;
                      handleCheckout(priceId, stripeMode, `NECTA ${product.name}`, `${size} bottle`, freqLabel);
                    }}
                    className="w-full py-4 rounded-xl font-semibold text-base text-white transition-all mb-4 disabled:opacity-60"
                    style={{ backgroundColor: colors.accent }}
                  >
                    {checkoutLoading
                      ? "Redirecting…"
                      : mode === "subscribe"
                        ? `Subscribe & Save — £${bottlePrice}/mo`
                        : `Add to Basket — £${bottlePrice}`}
                  </button>
                </>
              )}

              {/* ── SACHET OPTIONS ── */}
              {format === "sachet" && (() => {
                const SACHET_SUB_SAVINGS: Partial<Record<SachetDays, { amount: number; badge: string; freq: string }>> = {
                  14: { amount: 3,  badge: "SAVE £3",    freq: "monthly"        },
                  30: { amount: 7,  badge: "SAVE £7/mo", freq: "monthly"        },
                  90: { amount: 21, badge: "SAVE £21",   freq: "every 3 months" },
                };
                const savings = sachetDays !== 7 ? SACHET_SUB_SAVINGS[sachetDays] : undefined;
                const oneOffPrice = product.sachets[sachetDays];
                const subPrice = savings ? oneOffPrice - savings.amount : oneOffPrice;
                const displayPrice = sachetMode === 'subscribe' && savings ? subPrice : oneOffPrice;
                const isSachetSub = sachetMode === 'subscribe' && !!savings;

                return (
                  <>
                    <p className="text-xs text-primary/50 mb-4">
                      Single-serve sachets — one per drink, wherever you go.
                    </p>

                    <div className="space-y-2.5 mb-4">
                      {SACHET_OPTIONS.map((opt) => {
                        const optSavings = opt.days !== 7 ? SACHET_SUB_SAVINGS[opt.days] : undefined;
                        const optOneOff = product.sachets[opt.days];
                        const optDisplay = sachetMode === 'subscribe' && optSavings
                          ? optOneOff - optSavings.amount
                          : optOneOff;
                        return (
                          <button
                            key={opt.days}
                            onClick={() => setSachetDays(opt.days)}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
                              sachetDays === opt.days
                                ? "border-primary bg-primary/[0.03]"
                                : "border-border hover:border-primary/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${sachetDays === opt.days ? "border-primary" : "border-foreground/25"}`}>
                                {sachetDays === opt.days && <div className="w-2 h-2 rounded-full bg-primary" />}
                              </div>
                              <span className="text-sm font-semibold text-primary">{opt.label}</span>
                              {opt.badge && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: colors.accent }}>
                                  {opt.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-primary">£{optDisplay}</span>
                              {sachetMode === 'subscribe' && optSavings && (
                                <span className="block text-[10px] text-primary/40 line-through">£{optOneOff}</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Subscribe / One-off toggle — hidden for 7-day */}
                    {sachetDays !== 7 && (
                      <div className="flex rounded-lg bg-muted p-1 mb-5">
                        {(['subscribe', 'one-off'] as const).map((m) => (
                          <button
                            key={m}
                            onClick={() => setSachetMode(m)}
                            className={`relative flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-all ${
                              sachetMode === m ? "bg-white text-primary shadow-sm" : "text-primary/50 hover:text-primary"
                            }`}
                          >
                            {m === 'subscribe' ? 'Subscribe & Save' : 'One-off'}
                            {m === 'subscribe' && sachetMode === 'subscribe' && savings && (
                              <span
                                className="absolute -top-2.5 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                                style={{ backgroundColor: colors.accent }}
                              >
                                {savings.badge}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Price display */}
                    <div className="flex items-baseline gap-3 mb-5">
                      <span className="text-2xl font-bold text-primary">£{displayPrice}</span>
                      {isSachetSub && <span className="text-base text-primary/35 line-through">£{oneOffPrice}</span>}
                      <span className="text-sm text-primary/45">
                        {isSachetSub ? savings!.freq : "one-time"}
                      </span>
                    </div>

                    {/* CTA */}
                    <button
                      disabled={checkoutLoading}
                      onClick={() => {
                        const opt = SACHET_OPTIONS.find(o => o.days === sachetDays)!;
                        const priceId = getPriceId(slug as StripePriceSlug, 'sachet', sachetDays, sachetMode === 'subscribe' && !!savings ? 'subscribe' : 'one-off');
                        const stripeMode = getStripeMode('sachet', sachetDays, sachetMode === 'subscribe' && !!savings ? 'subscribe' : 'one-off');
                        handleCheckout(priceId, stripeMode, `NECTA ${product.name} Sachets`, opt.label, isSachetSub ? savings!.freq : undefined);
                      }}
                      className="w-full py-4 rounded-xl font-semibold text-base text-white transition-all mb-4 disabled:opacity-60"
                      style={{ backgroundColor: colors.accent }}
                    >
                      {checkoutLoading
                        ? "Redirecting…"
                        : isSachetSub
                          ? `Subscribe & Save — £${displayPrice}`
                          : `Add to Basket — £${displayPrice}`}
                    </button>
                  </>
                );
              })()}

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-6 text-primary/40">
                {[
                  { Icon: Truck, label: "Free UK delivery" },
                  { Icon: RefreshCcw, label: "Cancel anytime" },
                  { Icon: Leaf, label: "100% natural" },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    <span className="text-[11px]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INGREDIENT HOOK STRIP ── */}
      <section className="py-10 bg-white border-y border-border">
        <div className="necta-container">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {product.ingredients.slice(0, 5).map((ing) => (
              <div key={ing.name} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colors.accent }}
                />
                <span className="text-sm font-medium text-primary">{ing.name}</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: colors.light, color: colors.accent }}
                >
                  {ing.dose}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY NECTA [PRODUCT] — Benefits icons ── */}
      <section className="py-16 md:py-20 bg-[#fafafa]">
        <div className="necta-container">
          <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-12">
            Why NECTA {product.name}?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-start gap-4 bg-white/70 rounded-xl p-6">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.light }}
                >
                  <Icon className="h-5 w-5" style={{ color: colors.accent }} />
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-1.5">{title}</h3>
                  <p className="text-sm text-primary/60 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INGREDIENT PROOF (scrollable cards) ── */}
      <section className="py-14 md:py-20 bg-white overflow-hidden">
        <div className="necta-container mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
            Every ingredient. Every dose. Proven.
          </h2>
          <p className="text-sm text-primary/55 max-w-xl mx-auto">
            We don't use ingredients for label claims. Every active in {product.name} is at or
            above its published therapeutic dose.
          </p>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-6 md:px-12 pb-2" style={{ minWidth: "max-content" }}>
            {product.ingredients.slice(0, 5).map((ing, i) => (
              <div
                key={ing.name}
                className="w-[260px] flex-shrink-0 rounded-2xl bg-white border border-border p-6 flex flex-col"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: colors.light }}
                >
                  <span className="text-sm font-bold" style={{ color: colors.accent }}>{i + 1}</span>
                </div>
                <h3 className="text-base font-bold text-primary mb-1">{ing.name}</h3>
                <p className="text-xs font-semibold mb-3" style={{ color: colors.accent }}>{ing.dose} per serving</p>
                <p className="text-sm text-primary/55 leading-relaxed flex-1">{ing.benefit}</p>
                <span
                  className="mt-4 inline-block text-[10px] uppercase tracking-wider font-medium px-2.5 py-1 rounded-full self-start"
                  style={{ backgroundColor: colors.light, color: colors.accent }}
                >
                  Clinically dosed
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TABS (How to Use / Ingredients / Nutrition / Reviews) ── */}
      <ProductTabs product={product} />

      {/* ── COMPARISON TABLE ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="necta-container">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
              Why NECTA beats powders and gummies
            </h2>
            <p className="text-primary/55">Not all functional supplements are created equal.</p>
          </div>
          <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left text-xs text-primary/40 uppercase tracking-wider py-3 pr-4 w-[200px]">Feature</th>
                  {["NECTA", "Mushroom Powders", "Adaptogen Gummies", "Standard Infusions"].map((col, i) => (
                    <th
                      key={col}
                      className={`text-center text-xs uppercase tracking-wider py-3 px-3 rounded-t-lg ${i === 0 ? "font-bold text-primary" : "text-primary/40"}`}
                      style={i === 0 ? { backgroundColor: colors.light } : {}}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Clinically relevant doses", v: [true, "partial", false, false] },
                  { feature: "Adds to drinks you already make", v: [true, "partial", false, true] },
                  { feature: "Organic certified (70%+)", v: [true, "partial", false, false] },
                  { feature: "No mixing or prep", v: [true, false, true, true] },
                  { feature: "Focus, Immunity, Calm & Glow", v: [true, false, false, false] },
                  { feature: "Works in hot and cold drinks", v: [true, "partial", false, true] },
                  { feature: "No sugar, no artificial flavours", v: [true, "partial", false, false] },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="text-sm text-primary py-3.5 pr-4">{row.feature}</td>
                    {row.v.map((val, j) => (
                      <td
                        key={j}
                        className="text-center py-3.5 px-3"
                        style={j === 0 ? { backgroundColor: colors.light } : {}}
                      >
                        <div className="flex justify-center">
                          {val === true && <Check className="h-4 w-4" style={{ color: colors.accent }} />}
                          {val === false && <span className="text-primary/15 text-lg">×</span>}
                          {val === "partial" && <span className="text-amber-400 text-sm">~</span>}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── YOU MAY ALSO LIKE ── */}
      <YouMayAlsoLike currentSlug={product.slug} />

      {/* ── BOTTOM CTA ── */}
      <section className="py-16 md:py-20" style={{ background: colors.gradient }}>
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
            Ready to try {product.name}?
          </h2>
          <p className="text-primary/55 mb-8 text-sm leading-relaxed">
            {format === "sachet"
              ? "Single-serve sachets — try before you commit. Free UK delivery over £35."
              : `Subscribe and save ${savePct}% — cancel anytime. Free UK delivery.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-3.5 rounded-lg font-semibold text-white text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: colors.accent }}
            >
              Reserve your order
            </button>
            <Link
              href="/shop"
              className="px-8 py-3.5 rounded-lg font-medium text-primary text-sm border border-primary/25 hover:border-primary/50 transition-colors"
            >
              Browse all products
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <ReserveOrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        productName={product.name}
        productSlug={product.slug}
        format="subscription"
        size={`${size} pump bottle`}
        price={`£${currentPrice}${mode === "subscribe" ? "/mo" : ""}`}
      />
    </div>
  );
};

export default ProductPage;
