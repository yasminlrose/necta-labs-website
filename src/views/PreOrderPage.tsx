'use client';

import { useState, useMemo } from "react";
import Image from "next/image";
import { products, productSlugs, ProductSlug } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lock, Package, X, Gift, Zap, Mail, ShieldCheck, CalendarDays, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReserveOrderModal from "@/components/ReserveOrderModal";

const skuColors: Record<ProductSlug, { card: string; accent: string }> = {
  focus: { card: "#D6EBEA", accent: "#7BADA8" },
  immunity: { card: "#F2DDD4", accent: "#D4785A" },
  calm: { card: "#E0DAEF", accent: "#A89BC8" },
  glow: { card: "#F0DEDA", accent: "#C9897A" },
};

const skuIngredientLines: Record<ProductSlug, string> = {
  focus: "Lion's Mane · L-Theanine · Rhodiola · Ginkgo · Bacopa",
  immunity: "Reishi · Elderberry · Ashwagandha · Echinacea · Zinc",
  calm: "Chamomile · Lemon Balm · Jujube Seed · Poria Cocos · Magnesium",
  glow: "Marine Collagen · Hyaluronic Acid · CoQ10 · Resveratrol",
};

type Format = "bottle" | "sachet";
type BottleSize = "250ml" | "500ml";
type SachetSize = 7 | 14 | 30 | 90;

interface CardState {
  imageView: "bottle" | "sachet";
  format: Format;
  bottleSize: BottleSize;
  sachetSize: SachetSize;
  subscribe: boolean;
  frequency: string;
  selected: boolean;
}

const DEPOSIT = 10;

const sachetLabels: Record<SachetSize, string> = {
  7: "7-day — £12",
  14: "14-day — £22",
  30: "30-day — £45/mo",
  90: "90-day — £120",
};

const sachetBadges: Partial<Record<SachetSize, string>> = {
  30: "BEST VALUE",
  90: "BIGGEST SAVING",
};

function getPrice(state: CardState, slug: ProductSlug): number {
  const p = products[slug];
  if (state.format === "sachet") {
    return p.sachets[state.sachetSize];
  }
  if (state.subscribe) {
    return state.bottleSize === "250ml" ? p.price250Sub : p.price500Sub;
  }
  return state.bottleSize === "250ml" ? p.price250 : p.price500;
}

function getDisplayPrice(state: CardState, slug: ProductSlug): string {
  const price = getPrice(state, slug);
  if (state.format === "sachet" && (state.sachetSize === 30 || state.sachetSize === 90)) {
    return state.sachetSize === 30 ? `£${price}/mo` : `£${price}/qtr`;
  }
  if (state.format === "bottle" && state.subscribe) {
    return `£${price.toFixed(2)}/delivery`;
  }
  return `£${price}`;
}

const defaultCardState = (): CardState => ({
  imageView: "bottle",
  format: "bottle",
  bottleSize: "250ml",
  sachetSize: 30,
  subscribe: true,
  frequency: "Every month",
  selected: false,
});

function Pill({ active, onClick, children, className = "" }: { active: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${active ? "bg-[#1E2D3D] text-white border-[#1E2D3D]" : "bg-[#F5F0E6] text-[#1E2D3D] border-[#1E2D3D]/20 hover:border-[#1E2D3D]/40"} ${className}`}
    >
      {children}
    </button>
  );
}

function ProductCard({ slug, state, onChange }: { slug: ProductSlug; state: CardState; onChange: (s: CardState) => void }) {
  const p = products[slug];
  const colors = skuColors[slug];
  const price = getPrice(state, slug);
  const balance = price - DEPOSIT;
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="rounded-[20px] border border-[#1E2D3D]/15 bg-[#F5F0E6] overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left — Image */}
          <div className="md:w-[45%] p-4 flex flex-col items-center">
            <div className="w-full aspect-square rounded-2xl flex items-center justify-center p-[10%]" style={{ backgroundColor: colors.card }}>
              <Image
                src={state.imageView === "bottle" ? p.bottleImage : p.sachetImage}
                alt={`${p.name} ${state.imageView}`}
                width={300}
                height={300}
                className="max-h-full max-w-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <Pill active={state.imageView === "bottle"} onClick={() => onChange({ ...state, imageView: "bottle" })}>Bottle</Pill>
              <Pill active={state.imageView === "sachet"} onClick={() => onChange({ ...state, imageView: "sachet" })}>Sachet</Pill>
            </div>
          </div>

          {/* Right — Info */}
          <div className="md:w-[55%] p-5 md:p-6 flex flex-col gap-3">
            <div>
              <h3 className="text-xl font-bold text-[#1E2D3D]">{p.name}</h3>
              <p className="text-sm italic text-[#1E2D3D]/60">{p.flavor}</p>
              <p className="text-xs text-[#1E2D3D]/50 mt-1">{skuIngredientLines[slug]}</p>
            </div>

            {/* Format selector */}
            <div>
              <p className="text-xs text-[#1E2D3D]/50 mb-1.5">Format</p>
              <div className="flex gap-2">
                <Pill active={state.format === "bottle"} onClick={() => onChange({ ...state, format: "bottle" })}>Pump Bottle</Pill>
                <Pill active={state.format === "sachet"} onClick={() => onChange({ ...state, format: "sachet" })}>Sachet Box</Pill>
              </div>
            </div>

            {state.format === "bottle" ? (
              <>
                {/* Size */}
                <div>
                  <p className="text-xs text-[#1E2D3D]/50 mb-1.5">Size</p>
                  <div className="flex gap-2">
                    <Pill active={state.bottleSize === "250ml"} onClick={() => onChange({ ...state, bottleSize: "250ml" })}>250ml — £29</Pill>
                    <Pill active={state.bottleSize === "500ml"} onClick={() => onChange({ ...state, bottleSize: "500ml" })}>500ml — £39</Pill>
                  </div>
                </div>
                {/* Subscribe toggle */}
                <div>
                  <div className="flex gap-2">
                    <Pill active={state.subscribe} onClick={() => onChange({ ...state, subscribe: true })}>Subscribe & Save 15%</Pill>
                    <Pill active={!state.subscribe} onClick={() => onChange({ ...state, subscribe: false })}>One-off</Pill>
                  </div>
                  {state.subscribe && (
                    <select
                      value={state.frequency}
                      onChange={(e) => onChange({ ...state, frequency: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-[#1E2D3D]/15 bg-[#F5F0E6] text-[#1E2D3D] text-sm px-3 py-2 focus:outline-none"
                    >
                      <option>Every month</option>
                      <option>Every 2 months</option>
                      <option>Every 3 months</option>
                    </select>
                  )}
                </div>
                <p className="text-sm font-medium text-[#1E2D3D]">{getDisplayPrice(state, slug)}</p>
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs text-[#1E2D3D]/50 mb-1.5">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {([7, 14, 30, 90] as SachetSize[]).map((s) => (
                      <Pill key={s} active={state.sachetSize === s} onClick={() => onChange({ ...state, sachetSize: s })}>
                        {sachetLabels[s]}
                        {sachetBadges[s] && (
                          <span className="ml-1.5 inline-block bg-[#1E2D3D] text-white text-[9px] px-1.5 py-0.5 rounded-full">{sachetBadges[s]}</span>
                        )}
                      </Pill>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#1E2D3D]/50 italic">Sachets are available on subscription only. Cancel or pause anytime.</p>
                <p className="text-sm font-medium text-[#1E2D3D]">{getDisplayPrice(state, slug)}</p>
              </>
            )}

            {/* Deposit box */}
            <div className="rounded-xl p-3 text-sm" style={{ backgroundColor: colors.card }}>
              <p className="text-[#1E2D3D] font-medium">Today you pay: £{DEPOSIT} deposit</p>
              <p className="text-[#1E2D3D]/60 text-xs mt-0.5">Remaining balance of £{balance < 0 ? 0 : balance} charged when your order ships.</p>
            </div>

            {/* CTA */}
            <button
              onClick={() => onChange({ ...state, selected: !state.selected })}
              className={`w-full py-3 rounded-full text-sm font-medium transition-all ${state.selected ? "bg-[#1E2D3D]/80 text-white" : "bg-[#1E2D3D] text-white hover:bg-[#1E2D3D]/90"}`}
            >
              {state.selected ? "✓ Added to Pre-Order" : "Reserve with £10 Deposit →"}
            </button>

            <p className="text-[10px] text-[#1E2D3D]/40 text-center">Your card is saved securely. We'll notify you by email before your balance is charged.</p>
          </div>
        </div>
      </div>

      <ReserveOrderModal
        open={showModal}
        onClose={() => setShowModal(false)}
        productName={p.name}
        productSlug={slug}
        format={state.format}
        size={state.format === "bottle" ? state.bottleSize : `${state.sachetSize}-day`}
        price={getDisplayPrice(state, slug)}
      />
    </>
  );
}

const faqItems = [
  { q: "Why a deposit instead of full payment?", a: "We're in final production and want to reward early supporters without asking for full payment upfront. Your £10 deposit secures your place and your early-backer discount. The balance is only charged when your order is ready to ship." },
  { q: "When will my order ship?", a: "We're targeting dispatch in Summer 2026. We'll email you with an update if anything changes — and we'll always notify you before charging your balance." },
  { q: "Can I pre-order more than one product?", a: "Yes — add as many SKUs as you like. Each costs a £10 deposit, and all will ship together in one order." },
  { q: "What if I want to change my format or size before dispatch?", a: "Easy. Email hello@nectalabs.com before dispatch and we'll update your order. No charge for changes." },
];

const accentRotation = ["#7BADA8", "#D4785A", "#A89BC8", "#C9897A"];

export default function PreOrderPage() {
  const [cards, setCards] = useState<Record<ProductSlug, CardState>>(
    Object.fromEntries(productSlugs.map((s) => [s, defaultCardState()])) as Record<ProductSlug, CardState>
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const selectedSlugs = productSlugs.filter((s) => cards[s].selected);
  const depositTotal = selectedSlugs.length * DEPOSIT;
  const balanceTotal = selectedSlugs.reduce((sum, s) => sum + getPrice(cards[s], s) - DEPOSIT, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0E6" }}>
      <Header />

      {/* HERO */}
      <section className="pt-28 pb-16 px-4" style={{ background: "linear-gradient(135deg, #B8DDD8 0%, #F2C4A8 50%, #C8C0DF 100%)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E2D3D] mb-4">Be First. Pre-Order Necta.</h1>
          <p className="text-[#1E2D3D]/70 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            We're in final production. Reserve your first order now with a £10 deposit — your balance is only charged when your order ships.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {[
              { icon: Lock, text: "Secure £10 deposit — balance charged on dispatch" },
              { icon: Package, text: "Free UK delivery on all pre-orders" },
              { icon: X, text: "Cancel anytime before dispatch for a full refund" },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/40 rounded-2xl px-4 py-3">
                <Icon className="h-5 w-5 text-[#1E2D3D] shrink-0" />
                <span className="text-sm text-[#1E2D3D] text-left">{text}</span>
              </div>
            ))}
          </div>

          <div className="inline-block bg-[#1E2D3D] text-white text-sm font-medium px-5 py-2.5 rounded-full">
            Estimated dispatch: Summer 2026
          </div>
        </div>
      </section>

      {/* PRODUCT CARDS */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {productSlugs.map((slug) => (
            <ProductCard
              key={slug}
              slug={slug}
              state={cards[slug]}
              onChange={(s) => setCards((prev) => ({ ...prev, [slug]: s }))}
            />
          ))}
        </div>
      </section>

      {/* EARLY BACKER BANNER */}
      <section className="px-4 py-14" style={{ background: "linear-gradient(135deg, #D6EBEA 0%, #F2DDD4 100%)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1E2D3D] mb-3">Early backer reward: 20% off your first subscription</h2>
          <p className="text-[#1E2D3D]/60 text-sm md:text-base max-w-xl mx-auto mb-8">
            Pre-order customers receive 20% off their first recurring charge — better than our standard 15% launch offer. Automatically applied at dispatch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {[
              { icon: Gift, text: "Early backer discount" },
              { icon: Zap, text: "First to receive stock" },
              { icon: Mail, text: "Priority dispatch" },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-2 bg-white rounded-full px-5 py-2.5">
                <Icon className="h-4 w-4 text-[#1E2D3D]" />
                <span className="text-sm text-[#1E2D3D] font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REASSURANCE */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: "Your deposit is protected", desc: "If we can't fulfil your order for any reason, your £10 deposit is refunded in full, no questions asked." },
            { icon: CalendarDays, title: "We'll keep you updated", desc: "Email confirmation now, a production update, and a dispatch notification before your balance is charged." },
            { icon: HeartHandshake, title: "Change your mind? No problem.", desc: "Cancel before dispatch for a full deposit refund. Email hello@nectalabs.com or manage via your account." },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
              <Icon className="h-6 w-6 text-[#1E2D3D] mb-3" />
              <h3 className="font-bold text-[#1E2D3D] mb-2">{title}</h3>
              <p className="text-sm text-[#1E2D3D]/60">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-[#1E2D3D] mb-6 text-center">Pre-Order FAQ</h2>
        <div className="space-y-3">
          {faqItems.map((item, i) => {
            const isOpen = openFaq === i;
            const accent = accentRotation[i % accentRotation.length];
            return (
              <div
                key={i}
                className="rounded-xl bg-white overflow-hidden transition-all"
                style={{ borderLeft: isOpen ? `3px solid ${accent}` : "3px solid transparent" }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-[#1E2D3D]">{item.q}</span>
                  <svg className={`h-4 w-4 text-[#1E2D3D] transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-[#1E2D3D]/60">{item.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* STICKY ORDER SUMMARY */}
      {selectedSlugs.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#F5F0E6] border-t border-[#1E2D3D]/15 px-4 py-3 md:py-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 items-center">
              {selectedSlugs.map((s) => (
                <span key={s} className="text-xs bg-white rounded-full px-3 py-1 text-[#1E2D3D] font-medium">
                  {products[s].name} · {cards[s].format === "bottle" ? cards[s].bottleSize : `${cards[s].sachetSize}-day`}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-[#1E2D3D]/50">Deposit now: <span className="font-bold text-[#1E2D3D]">£{depositTotal}</span></p>
                <p className="text-[10px] text-[#1E2D3D]/40">Est. balance: £{balanceTotal.toFixed(2)}</p>
              </div>
              <button className="bg-[#1E2D3D] text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-[#1E2D3D]/90 transition-colors whitespace-nowrap">
                Complete Pre-Order — Pay £{depositTotal} Deposit
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
