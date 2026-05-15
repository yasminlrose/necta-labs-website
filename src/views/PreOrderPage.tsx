'use client';

import { useState } from "react";
import Image from "next/image";
import { Truck, RefreshCcw, Leaf, Check, ChevronDown, BadgePercent, Crown, FlaskConical, X, FlaskConical as Flask, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { products, productSlugs, type ProductSlug } from "@/data/products";
import { ingredientImages } from "@/data/ingredientImages";
import { useCart } from "@/contexts/CartContext";

/* ─── Brand colours per product ─── */
const colorMap: Record<ProductSlug, { accent: string; light: string; mid: string; gradient: string }> = {
  focus:    { accent: "#5B9E99", light: "#D6EBEA", mid: "#B8DDD8", gradient: "radial-gradient(ellipse 120% 100% at 50% 0%, #C8E8E5 0%, #EBF7F6 55%, #f0fafa 100%)" },
  immunity: { accent: "#C06040", light: "#F2DDD4", mid: "#E8C4A8", gradient: "radial-gradient(ellipse 120% 100% at 50% 0%, #EAC9BB 0%, #F5E5DC 55%, #fef8f5 100%)" },
  calm:     { accent: "#8878C0", light: "#E0DAEF", mid: "#C8C0DF", gradient: "radial-gradient(ellipse 120% 100% at 50% 0%, #CFC7EC 0%, #E9E4F6 55%, #f7f5fe 100%)" },
  glow:     { accent: "#B06455", light: "#F0DEDA", mid: "#E0C4BC", gradient: "radial-gradient(ellipse 120% 100% at 50% 0%, #E8C4BD 0%, #F5DDD9 55%, #fef7f6 100%)" },
};

const heroTaglines: Record<ProductSlug, string> = {
  focus:    "Sharpen your mind.",
  immunity: "Support your everyday resilience.",
  calm:     "Find your calm.",
  glow:     "Glow from within.",
};

type Format       = "bottle" | "sachet";
type BottleSize   = "250ml" | "500ml";
type SachetDays   = 7 | 14 | 30 | 90;
type PurchaseType = "one-off" | "subscribe";

const SACHET_OPTIONS: { days: SachetDays; label: string; badge?: string }[] = [
  { days: 7,  label: "7-day trial" },
  { days: 14, label: "14-day box" },
  { days: 30, label: "30-day box", badge: "Popular" },
  { days: 90, label: "90-day box", badge: "Best value" },
];

const SACHET_SUB_SAVINGS: Partial<Record<SachetDays, { amount: number; badge: string }>> = {
  14: { amount: 3, badge: "SAVE £3" },
  30: { amount: 7, badge: "SAVE £7" },
  90: { amount: 21, badge: "SAVE £21" },
};

const DEPOSIT = 10;

/* ─── Founding member perks banner ─── */
function FoundingPerks() {
  const heroBg = "linear-gradient(120deg, #C4D9F5 0%, #CFC7EC 30%, #F2DDD4 65%, #F0DEDA 100%)";

  return (
    <section style={{ background: heroBg }} className="py-14 px-5">
      <div className="necta-container max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/40 mb-3">Founding Members</p>
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
          Be one of our first 100 —<br className="hidden sm:block" /> get exclusive perks for life.
        </h2>
        <p className="text-primary/55 text-sm max-w-lg mx-auto mb-10">
          Reserve your order with a £10 deposit today. Your balance is charged on 1 November 2026 — orders dispatch from 17 November 2026.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {[
            { Icon: BadgePercent, accent: "#5B9E99", light: "#D6EBEA", title: "15% off every order, forever", desc: "Never expires. Never decreases. Locked in at checkout." },
            { Icon: Crown,        accent: "#8878C0", light: "#E0DAEF", title: "You're Founding Member #1–100", desc: "Your number is yours. You helped build this from the start." },
            { Icon: FlaskConical, accent: "#C06040", light: "#F2DDD4", title: "First access to new flavours",  desc: "Every new variant we launch, founding members try it first." },
          ].map(({ Icon, accent, light, title, desc }) => (
            <div key={title} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-sm border border-white">
              <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: light }}>
                <Icon className="h-5 w-5" style={{ color: accent }} />
              </div>
              <p className="font-semibold text-primary mb-1.5">{title}</p>
              <p className="text-sm text-primary/45 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {["£10 deposit — balance on dispatch", "Free UK delivery", "Cancel anytime for full refund"].map((t) => (
            <span key={t} className="flex items-center gap-1.5 bg-white/50 backdrop-blur-sm rounded-full px-4 py-1.5 text-primary/65 text-xs border border-white/60">
              <Check className="h-3 w-3 text-primary/45" />{t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Product Detail Modal ─── */
interface ProductDetailModalProps {
  slug: ProductSlug;
  onClose: () => void;
  onReserve: () => void;
  loading: boolean;
}

function ProductDetailModal({ slug, onClose, onReserve, loading }: ProductDetailModalProps) {
  const product = products[slug];
  const colors  = colorMap[slug];
  const [tab, setTab] = useState<"ingredients" | "science">("ingredients");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border shrink-0"
          style={{ background: colors.gradient }}>
          <div>
            <p className="text-[9px] text-primary/35 tracking-widest uppercase">NECTA Labs</p>
            <h3 className="text-xl font-bold text-primary">{product.name}</h3>
            <p className="text-xs text-primary/50 italic">{product.flavor} · {product.heroIngredientsSummary}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center hover:bg-white transition-colors">
            <X className="h-4 w-4 text-primary/60" />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-border shrink-0 bg-white">
          {(["ingredients", "science"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
                tab === t ? "border-primary text-primary" : "border-transparent text-primary/40 hover:text-primary/70"
              }`}
              style={tab === t ? { borderBottomColor: colors.accent, color: colors.accent } : {}}
            >
              {t === "ingredients" ? "Ingredients & Dosages" : "Science & Studies"}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-5">

          {tab === "ingredients" && (
            <div>
              <p className="text-xs text-primary/40 mb-5">
                Every ingredient is clinically dosed, traceable, and organic. Per serving (2 pumps or 1 sachet).
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.ingredients.map((ing) => {
                  const imgSrc = ingredientImages[ing.name];
                  return (
                    <div key={ing.name} className="rounded-xl border border-border bg-white overflow-hidden flex flex-col">
                      {/* Ingredient image */}
                      <div className="relative h-24 w-full bg-muted/20 shrink-0">
                        {imgSrc ? (
                          <Image
                            src={imgSrc}
                            alt={ing.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${colors.light}` }}>
                            <Flask className="h-8 w-8 opacity-30" style={{ color: colors.accent }} />
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="p-3 flex flex-col gap-1 flex-1">
                        <p className="text-xs font-bold text-primary leading-tight">{ing.name}</p>
                        <p className="text-sm font-extrabold" style={{ color: colors.accent }}>{ing.dose}</p>
                        <p className="text-[10px] text-primary/50 leading-snug mt-0.5">{ing.benefit}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "science" && (
            <div className="space-y-4">
              {product.studies.length === 0 && (
                <p className="text-sm text-primary/40 text-center py-8">Studies coming soon.</p>
              )}
              {product.studies.map((study) => (
                <div key={study.title} className="rounded-xl border border-border p-4">
                  <p className="text-xs font-bold text-primary mb-1">{study.title}</p>
                  <p className="text-[11px] text-primary/45 mb-2">{study.authors} · {study.journal} ({study.year})</p>
                  <p className="text-xs text-primary/65 leading-relaxed">{study.finding}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky footer CTA */}
        <div className="shrink-0 px-5 py-4 border-t border-border bg-white">
          <button
            onClick={() => { onClose(); onReserve(); }}
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: colors.accent }}
          >
            {loading ? 'Redirecting to checkout…' : `Reserve ${product.name} — £${DEPOSIT} deposit →`}
          </button>
          <p className="text-[10px] text-primary/35 text-center mt-2">
            Balance charged 1 Nov 2026 · Ships from 17 Nov · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Single product column ─── */
function ProductColumn({ slug }: { slug: ProductSlug }) {
  const product = products[slug];
  const colors  = colorMap[slug];

  const [format, setFormat]         = useState<Format>("bottle");
  const [size, setSize]             = useState<BottleSize>("250ml");
  const [sachetDays, setSachetDays] = useState<SachetDays>(30);
  const [purchaseType, setPurchase] = useState<PurchaseType>("one-off");
  const [frequency, setFrequency]   = useState("monthly");
  const [freqOpen, setFreqOpen]     = useState(false);
  const [activeImg, setActiveImg]   = useState(0);
  const [loading, setLoading]       = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const { addItem } = useCart();

  const oneOffPrice = size === "250ml" ? product.price250 : product.price500;
  const subPrice    = size === "250ml" ? product.price250Sub : product.price500Sub;
  const sachetPrice = product.sachets[sachetDays];
  const savings     = sachetDays !== 7 ? SACHET_SUB_SAVINGS[sachetDays] : undefined;
  const sachetSub   = savings ? sachetPrice - savings.amount : sachetPrice;
  const savePct     = Math.round(((oneOffPrice - subPrice) / oneOffPrice) * 100);

  const currentPrice = format === "sachet"
    ? (purchaseType === "subscribe" && savings ? sachetSub : sachetPrice)
    : (purchaseType === "subscribe" ? subPrice : oneOffPrice);

  const balance    = Math.max(0, currentPrice - DEPOSIT);
  const sizeLabel  = format === "bottle"
    ? `${size} bottle`
    : SACHET_OPTIONS.find(o => o.days === sachetDays)?.label ?? "";

  const images = [
    { src: product.bottleImage, alt: `NECTA ${product.name} bottle` },
    { src: product.sachetImage, alt: `NECTA ${product.name} sachet` },
  ];

  const handleReserve = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'deposit',
          productName: product.name,
          size: sizeLabel,
          productSlug: slug,
          balance: balance.toString(),
          purchaseType,
          frequency: frequency === 'monthly' ? 'monthly' : 'every 2 months',
        }),
      });
      const data: { url?: string; error?: string } = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Checkout failed');
      window.location.href = data.url;
    } catch {
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const Radio = ({ active }: { active: boolean }) => (
    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors`}
      style={{ borderColor: active ? colors.accent : "#d1d5db" }}>
      {active && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.accent }} />}
    </div>
  );

  return (
    <>
      <div id={slug} className="flex flex-col" style={{ background: colors.gradient }}>

        {/* Product image — clickable to open detail */}
        <div className="px-5 pt-8 pb-4">
          <button
            onClick={() => setShowDetail(true)}
            className="w-full bg-white rounded-2xl overflow-hidden flex items-center justify-center h-52 md:h-60 shadow-sm hover:shadow-md transition-shadow group relative"
            aria-label={`View ${product.name} ingredients`}
          >
            <Image
              src={images[activeImg].src}
              alt={images[activeImg].alt}
              width={220}
              height={220}
              priority
              className="h-[88%] w-auto object-contain group-hover:scale-[1.03] transition-transform duration-300"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
              <span className="text-[10px] font-semibold text-primary/60 bg-white/80 rounded-full px-3 py-1">
                View ingredients →
              </span>
            </div>
          </button>
          {/* Thumbnail switcher */}
          <div className="flex gap-2 mt-2.5 justify-center">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`rounded-xl bg-white overflow-hidden h-10 w-10 flex items-center justify-center border-2 transition-all shadow-sm`}
                style={{ borderColor: activeImg === i ? colors.accent : "transparent" }}
              >
                <Image src={img.src} alt="" width={32} height={32} loading="lazy" className="h-8 object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Purchase module */}
        <div className="px-5 pb-8 flex flex-col gap-3 flex-1">

          {/* Name + stars + ingredients link */}
          <div>
            <p className="text-[9px] text-primary/35 tracking-widest uppercase">NECTA Labs</p>
            <h3 className="text-lg font-bold text-primary leading-tight">{product.name}</h3>
            <p className="text-[11px] text-primary/50 italic mb-1.5">{product.flavor}</p>
            <p className="text-[11px] text-primary/55 mb-2">{heroTaglines[slug]}</p>
            {/* Ingredients shortcut */}
            <button
              onClick={() => setShowDetail(true)}
              className="inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2.5 py-1 transition-colors"
              style={{ color: colors.accent, backgroundColor: `${colors.light}` }}
            >
              <Flask className="h-2.5 w-2.5" />
              {product.heroIngredientsSummary} · See all →
            </button>
          </div>

          {/* Format toggle */}
          <div className="flex rounded-lg p-0.5" style={{ backgroundColor: `${colors.mid}60` }}>
            {(["bottle", "sachet"] as Format[]).map((f) => (
              <button
                key={f}
                onClick={() => { setFormat(f); setActiveImg(f === "sachet" ? 1 : 0); setPurchase("one-off"); }}
                className={`flex-1 text-[11px] py-2 rounded-md transition-all font-medium ${
                  format === f ? "bg-white text-primary shadow-sm" : "text-primary/55 hover:text-primary"
                }`}
              >
                {f === "bottle" ? "Pump Bottle" : "Sachet Box"}
              </button>
            ))}
          </div>

          {/* BOTTLE options */}
          {format === "bottle" && (
            <>
              <div className="flex gap-1.5">
                {(["250ml", "500ml"] as BottleSize[]).map((s) => {
                  const p = s === "250ml" ? product.price250 : product.price500;
                  const active = size === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className="flex-1 rounded-xl border-2 py-2.5 px-2 text-center transition-all bg-white/60"
                      style={{ borderColor: active ? colors.accent : "rgba(0,0,0,0.08)" }}
                    >
                      <p className="text-[11px] font-bold text-primary">{s}</p>
                      <p className="text-[11px] font-semibold" style={{ color: colors.accent }}>£{p}</p>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5">
                {[
                  { type: "one-off" as PurchaseType,  label: "One-off",          price: `£${oneOffPrice}` },
                  { type: "subscribe" as PurchaseType, label: "Subscribe & save", price: `£${subPrice}/mo`, badge: `SAVE ${savePct}%` },
                ].map(({ type, label, price, badge }) => {
                  const active = purchaseType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setPurchase(type)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 text-left transition-all bg-white/60"
                      style={{ borderColor: active ? colors.accent : "rgba(0,0,0,0.08)" }}
                    >
                      <div className="flex items-center gap-2">
                        <Radio active={active} />
                        <span className="text-[11px] font-semibold text-primary">{label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-primary">{price}</span>
                        {badge && (
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: colors.accent }}>{badge}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {purchaseType === "subscribe" && (
                <div className="relative">
                  <button
                    onClick={() => setFreqOpen(!freqOpen)}
                    className="w-full flex items-center justify-between border border-primary/15 rounded-lg px-3 py-2 text-[11px] text-primary bg-white/60 hover:bg-white/80 transition-colors"
                  >
                    <span>Deliver {frequency === "monthly" ? "monthly" : "every 2 months"}</span>
                    <ChevronDown className={`h-3 w-3 text-primary/40 transition-transform ${freqOpen ? "rotate-180" : ""}`} />
                  </button>
                  {freqOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                      {["monthly", "2monthly"].map((v) => (
                        <button key={v} onClick={() => { setFrequency(v); setFreqOpen(false); }}
                          className={`w-full text-left px-3 py-2.5 text-[11px] hover:bg-muted transition-colors flex items-center justify-between ${frequency === v ? "text-primary font-medium" : "text-primary/60"}`}>
                          {v === "monthly" ? "Monthly" : "Every 2 months"}
                          {frequency === v && <Check className="h-3 w-3" style={{ color: colors.accent }} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* SACHET options */}
          {format === "sachet" && (
            <>
              <div className="space-y-1.5">
                {SACHET_OPTIONS.map((opt) => {
                  const active = sachetDays === opt.days;
                  return (
                    <button
                      key={opt.days}
                      onClick={() => setSachetDays(opt.days)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 text-left transition-all bg-white/60"
                      style={{ borderColor: active ? colors.accent : "rgba(0,0,0,0.08)" }}
                    >
                      <div className="flex items-center gap-2">
                        <Radio active={active} />
                        <span className="text-[11px] font-semibold text-primary">{opt.label}</span>
                        {opt.badge && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: colors.accent }}>{opt.badge}</span>}
                      </div>
                      <span className="text-[11px] font-bold text-primary">£{product.sachets[opt.days]}</span>
                    </button>
                  );
                })}
              </div>

              {sachetDays !== 7 && savings && (
                <div className="flex rounded-lg p-0.5" style={{ backgroundColor: `${colors.mid}60` }}>
                  {[
                    { type: "one-off" as PurchaseType, label: `One-off £${sachetPrice}` },
                    { type: "subscribe" as PurchaseType, label: `Sub £${sachetSub}`, badge: savings.badge },
                  ].map(({ type, label, badge }) => (
                    <button
                      key={type}
                      onClick={() => setPurchase(type)}
                      className={`flex-1 text-[10px] py-2 rounded-md transition-all font-medium flex items-center justify-center gap-1 ${purchaseType === type ? "bg-white text-primary shadow-sm" : "text-primary/55 hover:text-primary"}`}
                    >
                      {label}
                      {badge && <span className="text-[7px] font-bold px-1 py-0.5 rounded-full text-white" style={{ backgroundColor: colors.accent }}>{badge}</span>}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Deposit summary */}
          <div className="rounded-xl px-3.5 py-3 border border-white/60 bg-white/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">Today: £{DEPOSIT} deposit</span>
              <span className="text-[9px] bg-white/70 rounded-full px-2 py-0.5 text-primary/50">Refundable</span>
            </div>
            <p className="text-[10px] text-primary/50 mt-0.5">Balance £{balance} charged 1 Nov · Ships from 17 Nov 2026</p>
            <div className="mt-2 pt-2 border-t border-white/50 grid grid-cols-2 gap-x-2 gap-y-0.5">
              <span className="text-[9px] text-primary/40">🇬🇧 UK</span><span className="text-[9px] text-primary/50 font-medium">Free delivery</span>
              <span className="text-[9px] text-primary/40">🇪🇺 EU</span><span className="text-[9px] text-primary/50 font-medium">+£9 (DPD tracked)</span>
              <span className="text-[9px] text-primary/40">🇺🇸 US / 🇨🇦 CA</span><span className="text-[9px] text-primary/50 font-medium">+£16 (FedEx tracked)</span>
              <span className="text-[9px] text-primary/40">🇦🇺 AU / 🇸🇬 SG</span><span className="text-[9px] text-primary/50 font-medium">+£20 (DHL tracked)</span>
            </div>
            <p className="text-[8px] text-primary/30 mt-1.5">Shipping added to November balance for international orders.</p>
          </div>

          {/* CTAs */}
          <button
            onClick={handleReserve}
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: colors.accent }}
          >
            {loading ? 'Redirecting to checkout…' : `Reserve with £${DEPOSIT} deposit →`}
          </button>
          <button
            onClick={() => {
              addItem({
                id: `${slug}-${format}-${format === 'bottle' ? size : sachetDays}-${purchaseType}`,
                slug,
                name: `NECTA ${product.name}`,
                image: format === 'sachet' ? product.sachetImage : product.bottleImage,
                price: DEPOSIT,
                size: sizeLabel,
                mode: purchaseType === 'subscribe' ? 'subscribe' : 'one-off',
                balance,
                frequency: purchaseType === 'subscribe' ? frequency : undefined,
              });
              toast.success(`NECTA ${product.name} added to basket`);
            }}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all border-2 flex items-center justify-center gap-2 hover:opacity-80"
            style={{ borderColor: colors.accent, color: colors.accent, backgroundColor: `${colors.light}80` }}
          >
            <ShoppingBag className="h-4 w-4" />
            Add to basket
          </button>

          {/* Trust */}
          <div className="flex items-center justify-center gap-3 text-primary/35">
            {[{ Icon: Truck, label: "Free UK delivery" }, { Icon: RefreshCcw, label: "Cancel anytime" }, { Icon: Leaf, label: "Natural" }].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-1">
                <Icon className="h-2.5 w-2.5" />
                <span className="text-[9px]">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-primary/25 text-center mt-1">Shipping to UK, US, EU & more — dispatching November 2026</p>
        </div>
      </div>

      {/* Detail modal */}
      {showDetail && (
        <ProductDetailModal
          slug={slug}
          onClose={() => setShowDetail(false)}
          onReserve={handleReserve}
          loading={loading}
        />
      )}
    </>
  );
}

/* ─── FAQ ─── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl bg-[#fafafa] border border-border overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <span className="text-sm font-medium text-primary">{q}</span>
        <ChevronDown className={`h-4 w-4 text-primary/40 transition-transform shrink-0 ml-4 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-4 text-sm text-primary/55 leading-relaxed">{a}</div>}
    </div>
  );
}

/* ─── Page ─── */
export default function PreOrderPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero + founding perks */}
      <FoundingPerks />

      {/* 4-column product grid */}
      <section>
        <div className="necta-container max-w-7xl py-8 pb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-2">
            4 moods. One pump.
          </h2>
          <p className="text-center text-primary/50 text-base mb-6">
            Add to whatever you're drinking. Feel whatever you need.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-x divide-white/40">
          {productSlugs.map((slug) => (
            <ProductColumn key={slug} slug={slug} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-5 bg-white border-t border-border">
        <div className="necta-container max-w-2xl">
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">Pre-order questions</h2>
          <div className="space-y-3">
            {[
              { q: "Why a deposit instead of full payment?", a: "Your £10 deposit secures your place and your founding member perks. The remaining balance is charged on 1 November 2026 — orders dispatch from 17 November 2026." },
              { q: "When will my order ship?", a: "Orders dispatch from 17 November 2026. We charge your balance on 1 November to give us time to process everything and ensure all orders are fulfilled together." },
              { q: "Can I pre-order more than one product?", a: "Yes — reserve as many as you like. Each costs a £10 deposit and they'll all ship together in one order." },
              { q: "What if I want to cancel?", a: "You can cancel any time before dispatch directly from your account. Sign in using the same email you used to pre-order, go to Order History or Subscriptions, and hit cancel. Your £10 deposit will be refunded in full — no questions asked." },
            ].map((item) => <FaqItem key={item.q} {...item} />)}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
