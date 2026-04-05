import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ArrowRight, Check, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const BUSINESS_TYPES = ["Cafe", "Gym / Studio", "Hotel", "Bar / Restaurant", "Wellness Retailer", "Other"];

/* ─── Profit Carousel Cards ─── */
function ProfitCarousel() {
  const [active, setActive] = useState(0);
  const total = 3;

  return (
    <div className="relative">
      {/* Cards */}
      <div className="overflow-hidden rounded-3xl">
        {/* Card 1 — Before / After */}
        {active === 0 && (
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-border">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">Card 1 of 3 · Revenue impact</p>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-10">
              Standard Takeaway Coffee vs NECTA Add-On
            </h3>
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
              {/* Before */}
              <div className="rounded-2xl p-6 md:p-8 bg-[#f5f5f5]">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Before</p>
                <p className="text-base font-semibold text-foreground mb-6">Standard Takeaway Coffee</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Average Order Value</p>
                    <p className="text-3xl font-bold text-foreground">£2.80</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Gross Profit (inc. VAT)</p>
                    <p className="text-3xl font-bold text-foreground">£1.60</p>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center gap-2 py-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
                <p className="text-xs font-bold text-primary uppercase tracking-wide">Add-on</p>
              </div>

              {/* After */}
              <div
                className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #C8E8E5 0%, #E0DAEF 100%)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-4">After</p>
                <p className="text-base font-semibold text-foreground mb-6">Coffee + NECTA Add-On</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-foreground/60 mb-1">Average Order Value</p>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl font-bold text-foreground">£3.70</p>
                      <span className="mb-1 text-sm font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">+32%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/60 mb-1">Gross Profit (inc. VAT)</p>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl font-bold text-foreground">£2.13</p>
                      <span className="mb-1 text-sm font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">+33%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card 2 — How it works */}
        {active === 1 && (
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-border">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">Card 2 of 3 · How it works</p>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-10">
              How NECTA Works in Your Venue
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Stock the Bottles",
                  bullets: [
                    "Available in 250ml and 500ml pump formats",
                    "Many servings per bottle — excellent yield",
                    "Competitive wholesale pricing (on approval)",
                  ],
                  color: "#D6EBEA",
                },
                {
                  step: "02",
                  title: "Offer the Add-On",
                  bullets: [
                    "Suggest: +£1.50–£2.50 per drink",
                    "Wellness customers already pay this",
                    "Comparable to oat milk or protein add-ons",
                  ],
                  color: "#E0DAEF",
                },
                {
                  step: "03",
                  title: "Watch Margins Grow",
                  bullets: [
                    "Strong gross margins on every serving",
                    "Premium retail price justified by real results",
                    "No long-term contracts required",
                  ],
                  color: "#F2DDD4",
                },
              ].map(({ step, title, bullets, color }) => (
                <div key={step} className="rounded-2xl p-6" style={{ backgroundColor: color }}>
                  <p className="text-4xl font-black text-foreground/10 mb-3 leading-none">{step}</p>
                  <h4 className="text-base font-bold text-foreground mb-4">{title}</h4>
                  <ul className="space-y-2">
                    {bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-foreground/70">
                        <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-foreground/40" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Card 3 — Customer demand */}
        {active === 2 && (
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-border">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">Card 3 of 3 · Customer demand</p>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-10">
              The Demand Is Already There
            </h3>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Stats */}
              <div className="space-y-5">
                {[
                  { label: "UK coffee drinkers seeking functional add-ons", value: "38%" },
                  { label: "Average order value uplift per transaction", value: "+32%" },
                  { label: "Gross profit increase per drink sold", value: "+33%" },
                  { label: "UK stockists in year one", value: "121+" },
                  { label: "Customer repeat purchase rate", value: "67%", highlight: true },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className={`flex items-center justify-between py-3 border-b border-border ${highlight ? "border-b-0" : ""}`}>
                    <p className="text-sm text-foreground/60">{label}</p>
                    <p className={`text-base font-bold ${highlight ? "text-emerald-600 text-lg" : "text-foreground"}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Context */}
              <div
                className="rounded-2xl p-7"
                style={{ background: "linear-gradient(135deg, #D6EBEA 0%, #E0DAEF 100%)" }}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-3">Why it converts</p>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  Unlike standard infusions (Monin, Torani) which have{" "}
                  <strong className="text-foreground">zero functional benefit</strong>, NECTA delivers
                  real, feelable results — Lion's Mane for focus, Reishi for immunity, Ashwagandha for
                  calm. Customers come back because it actually works.
                </p>
                <div className="mt-6 pt-5 border-t border-white/40">
                  <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">Premium positioning</p>
                  <p className="text-sm text-foreground/70">
                    Wellness-forward venues already charge £1.50+ for functional add-ons. NECTA gives
                    you a science-backed product that justifies every penny.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setActive((p) => Math.max(0, p - 1))}
          disabled={active === 0}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-primary" : "w-1.5 bg-border"}`}
            />
          ))}
        </div>
        <button
          onClick={() => setActive((p) => Math.min(total - 1, p + 1))}
          disabled={active === total - 1}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Contact Form ─── */
function ContactForm() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    business_name: "",
    contact_name: "",
    email: "",
    venue_type: "",
    notes: "",
  });

  const set = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("wholesale_applications").insert({
        business_name: form.business_name,
        contact_name: form.contact_name,
        email: form.email,
        venue_type: form.venue_type,
        notes: form.notes || null,
        phone: "",
        city: "",
        postcode: "",
        daily_coffee_sales: "",
        referral_source: "stockist-page",
        products_interested: [],
      });
      if (error) throw error;
      setSubmitted(true);
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or email wholesale@nectalabs.com",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <Check className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">Application received</h3>
        <p className="text-muted-foreground">We'll be in touch within 48 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-2 block">Business name *</label>
          <Input required value={form.business_name} onChange={(e) => set("business_name", e.target.value)} className="rounded-xl h-12" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-2 block">Contact name *</label>
          <Input required value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} className="rounded-xl h-12" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-2 block">Email *</label>
          <Input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="rounded-xl h-12" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-2 block">Venue type *</label>
          <Select required onValueChange={(v) => set("venue_type", v)}>
            <SelectTrigger className="rounded-xl h-12">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-2 block">Message (optional)</label>
        <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} className="rounded-xl" rows={4} placeholder="Tell us about your venue, typical footfall, or any questions..." />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-white font-bold py-4 rounded-full text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Become a Stockist Today"}
      </button>
    </form>
  );
}

/* ─── Main Page ─── */
const StockistPage = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ═══ HERO ═══ */}
      <section
        className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28"
        style={{
          background: `
            radial-gradient(ellipse 70% 90% at 8% 20%, rgba(212,229,228,0.70) 0%, transparent 58%),
            radial-gradient(ellipse 60% 70% at 85% 10%, rgba(224,218,239,0.60) 0%, transparent 52%),
            radial-gradient(ellipse 75% 55% at 50% 95%, rgba(242,221,212,0.55) 0%, transparent 55%),
            radial-gradient(ellipse 50% 60% at 78% 72%, rgba(240,222,218,0.50) 0%, transparent 50%),
            radial-gradient(ellipse 40% 45% at 30% 55%, rgba(214,235,234,0.40) 0%, transparent 48%),
            #fdfcfa
          `,
        }}
      >
        {/* Stockist login link — top right */}
        <div className="absolute top-6 right-6 z-10">
          <Link
            to="/stockist-portal"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/15 bg-white/70 backdrop-blur-sm text-primary/60 text-xs font-medium hover:border-primary/30 hover:text-primary transition-all"
          >
            <LogIn className="h-3.5 w-3.5" />
            Stockist Login
          </Link>
        </div>

        <div className="necta-container max-w-5xl relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/30 mb-6">
            Wholesale &amp; Trade
          </p>

          {/* Main headline — concise and data-driven */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02] mb-5 tracking-tight text-primary">
            Increase Your<br />
            Profits by{" "}
            <span style={{ color: "hsl(174,27%,49%)" }}>33%</span>
          </h1>

          {/* Subheading with UK statistic */}
          <p className="text-lg md:text-xl font-medium mb-3 leading-relaxed" style={{ color: "hsl(174,27%,40%)" }}>
            38% of UK coffee drinkers want functional add-ons.
            <br className="hidden md:block" />
            Stock NECTA and capture this growing market.
          </p>

          {/* Supporting stat */}
          <p className="text-sm text-primary/45 mb-10 max-w-lg">
            Average order value increases by 32% when customers add NECTA to their drink.
            No long-term contracts. Net 30 payment terms. Pricing details shared with approved stockists.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-full hover:bg-primary/90 transition-colors text-sm shadow-md shadow-primary/20"
            >
              Become a Stockist
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="mailto:wholesale@nectalabs.com"
              className="inline-flex items-center gap-2 border border-primary/20 bg-white/60 text-primary font-semibold px-8 py-4 rounded-full hover:border-primary/40 hover:bg-white transition-colors text-sm backdrop-blur-sm"
            >
              wholesale@nectalabs.com
            </a>
          </div>

          {/* Social proof strip */}
          <div className="mt-10 flex flex-wrap items-center gap-5">
            {[
              { stat: "121+", label: "UK stockists" },
              { stat: "+33%", label: "Gross profit uplift" },
              { stat: "Net 30", label: "Payment terms" },
            ].map(({ stat, label }) => (
              <div key={label} className="flex items-center gap-2">
                <p className="text-lg font-black text-primary">{stat}</p>
                <p className="text-xs text-primary/50">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STAT BAR ═══ */}
      <section className="bg-[#faf9f7] border-y border-border">
        <div className="necta-container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {[
              { stat: "121", label: "Stockists in Year 1" },
              { stat: "67", label: "Servings per 250ml bottle" },
              { stat: "+32%", label: "Avg order value uplift" },
              { stat: "+33%", label: "Gross profit increase" },
            ].map(({ stat, label }) => (
              <div key={label} className="py-8 px-6 md:px-10 text-center">
                <p className="text-3xl md:text-4xl font-black text-primary mb-1">{stat}</p>
                <p className="text-xs text-muted-foreground font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROFIT CAROUSEL ═══ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="necta-container">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">The business case</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">The numbers that matter</h2>
          </div>
          <ProfitCarousel />
        </div>
      </section>

      {/* ═══ WHAT MAKES NECTA DIFFERENT ═══ */}
      <section className="py-20 md:py-28 bg-[#faf9f7]">
        <div className="necta-container">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">The product</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">What makes NECTA different</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 — Clinically dosed */}
            <div className="bg-white rounded-3xl p-8 border border-border">
              <div className="w-10 h-10 rounded-2xl bg-[#D6EBEA] flex items-center justify-center mb-6">
                <span className="text-lg">⚗️</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">Clinically Dosed</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Unlike competitors, every ingredient is at or above research-backed effective doses —
                not trace amounts for label claims.
              </p>
              <div className="space-y-2">
                {[
                  "Lion's Mane 500mg — focus",
                  "Reishi 2g — immunity",
                  "Ashwagandha 300mg — calm",
                  "Marine Collagen 2.5g — glow",
                ].map((d) => (
                  <div key={d} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <p className="text-xs text-foreground/70 font-medium">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2 — Four blends */}
            <div className="bg-white rounded-3xl p-8 border border-border">
              <div className="w-10 h-10 rounded-2xl bg-[#E0DAEF] flex items-center justify-center mb-6">
                <span className="text-lg">✦</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-5">Four Blends, One Solution</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "FOCUS", flavor: "Vanilla Bean", color: "#D6EBEA" },
                  { name: "IMMUNITY", flavor: "Hazelnut + Orange", color: "#F2DDD4" },
                  { name: "CALM", flavor: "Honey Caramel", color: "#E0DAEF" },
                  { name: "GLOW", flavor: "Cherry Almond", color: "#F0DEDA" },
                ].map(({ name, flavor, color }) => (
                  <div key={name} className="rounded-xl p-3" style={{ backgroundColor: color }}>
                    <p className="text-xs font-black text-foreground">{name}</p>
                    <p className="text-[10px] text-foreground/60 mt-0.5">{flavor}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3 — Premium & organic */}
            <div className="bg-white rounded-3xl p-8 border border-border">
              <div className="w-10 h-10 rounded-2xl bg-[#F2DDD4] flex items-center justify-center mb-6">
                <span className="text-lg">🌿</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">Premium &amp; Organic</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                A product your customers are proud to be seen with — and that positions your venue as wellness-forward.
              </p>
              {[
                "70% organic by weight",
                "Made in the UK",
                "No proprietary blends",
                "Every ingredient &amp; dose on label",
              ].map((d) => (
                <div key={d} className="flex items-center gap-2 mb-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <p className="text-xs text-foreground/70 font-medium" dangerouslySetInnerHTML={{ __html: d }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHAT YOU GET ═══ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="necta-container">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">The partnership</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">What you get</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                emoji: "💷",
                title: "Strong Retail Margins",
                color: "#D6EBEA",
                lines: [
                  "Competitive wholesale pricing (shared on approval)",
                  "Typical 70%+ gross margin per serving",
                  "Volume discounts from 24+ bottles",
                ],
              },
              {
                emoji: "⚡",
                title: "Integration Made Easy",
                color: "#E0DAEF",
                lines: [
                  "Sits on your counter, ready to use",
                  "2 pumps per drink — under 5 seconds",
                  "No mixing, no mess, no training needed",
                ],
              },
              {
                emoji: "🎨",
                title: "Point-of-Sale Support",
                color: "#F2DDD4",
                lines: [
                  "Brand-approved signage & menu cards",
                  "Staff training materials (PDF + email)",
                  "Social media marketing assets",
                ],
              },
              {
                emoji: "📦",
                title: "Flexible Minimum Orders",
                color: "#F0DEDA",
                lines: [
                  "Low minimum order to get started",
                  "No long-term contracts",
                  "Net 30 payment terms",
                ],
              },
              {
                emoji: "👤",
                title: "Direct Account Management",
                color: "#D6EBEA",
                lines: [
                  "Dedicated account manager",
                  "Monthly performance check-ins",
                  "Reorder support & inventory planning",
                ],
              },
              {
                emoji: "📈",
                title: "Scale As You Grow",
                color: "#E8E4F4",
                lines: [
                  "Volume pricing from 24+ bottles",
                  "Sales data dashboard (coming soon)",
                  "Priority access to new SKUs",
                ],
              },
            ].map(({ emoji, title, color, lines }) => (
              <div key={title} className="rounded-2xl p-7 border border-border bg-white hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl mb-5" style={{ backgroundColor: color }}>
                  {emoji}
                </div>
                <h3 className="text-base font-bold text-foreground mb-4">{title}</h3>
                <ul className="space-y-2.5">
                  {lines.map((l) => (
                    <li key={l} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-500" />
                      <span className="text-sm text-muted-foreground">{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHO STOCKS NECTA ═══ */}
      <section className="py-20 md:py-28 bg-[#faf9f7]">
        <div className="necta-container">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">Venue types</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Who stocks NECTA</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              { emoji: "☕", type: "Premium Cafes", desc: "Where wellness-conscious customers expect functional add-ons" },
              { emoji: "💪", type: "Boutique Gyms", desc: "Pre/post-workout ritual enhancement" },
              { emoji: "🧘", type: "Wellness Studios", desc: "Yoga, Pilates, Meditation studios" },
              { emoji: "🍹", type: "Cocktail Bars", desc: "Functional mixology drinks" },
              { emoji: "🏪", type: "Health Retailers", desc: "Independent health food stores" },
              { emoji: "🏨", type: "Hotels & Spas", desc: "Premium wellness experiences" },
            ].map(({ emoji, type, desc }) => (
              <div key={type} className="bg-white rounded-2xl p-6 border border-border text-center hover:shadow-sm transition-shadow">
                <div className="text-3xl mb-3">{emoji}</div>
                <p className="text-sm font-bold text-foreground mb-1.5">{type}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT COMES TOGETHER ═══ */}
      <section className="py-20 md:py-28 bg-primary text-white">
        <div className="necta-container">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-3">The process</p>
            <h2 className="text-3xl md:text-4xl font-bold">How it all comes together</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: "01",
                title: "Contact Us",
                lines: ["Fill out the form below", "or email wholesale@nectalabs.com"],
              },
              {
                step: "02",
                title: "We Review & Connect",
                lines: ["Our team replies within 48 hours", "We discuss your venue and needs"],
              },
              {
                step: "03",
                title: "Place Your First Order",
                lines: ["Minimum 6 bottles to start", "We handle logistics and setup"],
              },
              {
                step: "04",
                title: "Launch & Scale",
                lines: ["We provide signage and training", "Monitor and reorder as demand grows"],
              },
            ].map(({ step, title, lines }) => (
              <div key={step} className="rounded-2xl p-7 bg-white/5 border border-white/10">
                <p className="text-5xl font-black text-white/10 mb-4 leading-none">{step}</p>
                <h3 className="text-base font-bold text-white mb-3">{title}</h3>
                {lines.map((l) => (
                  <p key={l} className="text-sm text-white/55 leading-relaxed">{l}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT FORM ═══ */}
      <section ref={formRef} className="py-20 md:py-28 bg-white">
        <div className="necta-container">
          <div className="grid md:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
            {/* Left */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Get started</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5">
                Become a Stockist Today
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Join 121+ UK venues already transforming their customer experience.
                Launching Summer 2026.
              </p>
              <div className="space-y-4">
                {[
                  { emoji: "📩", label: "wholesale@nectalabs.com" },
                  { emoji: "⏱️", label: "We reply within 48 hours" },
                  { emoji: "📦", label: "Minimum order: 6 bottles" },
                ].map(({ emoji, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xl">{emoji}</span>
                    <p className="text-sm text-foreground/70 font-medium">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div className="bg-[#faf9f7] rounded-3xl p-8 md:p-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StockistPage;
