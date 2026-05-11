'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FlaskConical, Star, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLiveCounters } from "@/hooks/use-live-counters";
import { products, productSlugs } from "@/data/products";
import Header from "@/components/Header";

const FOUNDING_LIMIT = 100;

const HERO_BG = [
  "radial-gradient(ellipse 80% 70% at 10% 30%, #FAD4C0 0%, transparent 55%)",
  "radial-gradient(ellipse 60% 60% at 90% 15%, #C4D9F5 0%, transparent 50%)",
  "radial-gradient(ellipse 55% 65% at 85% 85%, #C8E8C0 0%, transparent 50%)",
  "radial-gradient(ellipse 50% 50% at 20% 80%, #E8D0EE 0%, transparent 50%)",
  "radial-gradient(ellipse 40% 40% at 55% 50%, #F5E8C0 0%, transparent 60%)",
  "#fdfcfa",
].join(", ");

const skuMeta: Record<string, { bg: string; label: string }> = {
  focus:    { bg: "#D6EBEA", label: "For the 3pm brain fog" },
  calm:     { bg: "#E0DAEF", label: "For the Sunday anxiety" },
  immunity: { bg: "#F2DDD4", label: "For when everyone around you is ill" },
  glow:     { bg: "#F0DEDA", label: "For your skin from the inside out" },
};

const WaitlistPage = () => {
  const [email, setEmail] = useState("");
  const [memberNumber, setMemberNumber] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const { waitlistCount } = useLiveCounters();

  const spotsRemaining = Math.max(0, FOUNDING_LIMIT - waitlistCount);
  const progressPct = Math.min(100, (waitlistCount / FOUNDING_LIMIT) * 100);
  const submitted = memberNumber !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("email_signups")
        .insert({ email: email.trim(), source: "waitlist" });

      if (error) {
        if (error.code === "23505") {
          toast({ title: "You're already on the list", description: "We'll be in touch soon." });
          setMemberNumber(waitlistCount);
          return;
        }
        throw error;
      }
      const { data } = await supabase.rpc("get_waitlist_count");
      setMemberNumber(data ?? waitlistCount + 1);
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO — matches homepage gradient */}
      <section className="py-20 md:py-28 text-center px-5" style={{ background: HERO_BG }}>
        <div className="max-w-2xl mx-auto">

          {/* Spots counter */}
          <div className="inline-flex flex-col items-center gap-2 bg-white/60 backdrop-blur-sm border border-primary/10 rounded-3xl px-6 py-3 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-necta-immunity animate-pulse" />
              <span className="text-xs text-primary/70 font-medium">
                {spotsRemaining > 0
                  ? `${spotsRemaining} founding member spot${spotsRemaining === 1 ? "" : "s"} remaining`
                  : "Founding spots full — join the free waitlist below"}
              </span>
            </div>
            <div className="w-52 h-1.5 bg-primary/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 bg-necta-immunity"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-[10px] text-primary/35">{waitlistCount} of {FOUNDING_LIMIT} founding spots claimed</p>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/35 mb-5">
            NECTA Labs
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary leading-[1.08] tracking-tight mb-5">
            Your coffee.<br />Now functional.
          </h1>

          <p className="text-base md:text-lg text-primary/50 font-light mb-4 max-w-sm mx-auto leading-relaxed">
            One pump of clinically dosed adaptogens into whatever you're already drinking.
          </p>

          <p className="text-primary font-semibold mb-1">
            Get your order{" "}
            <span className="underline decoration-2 underline-offset-2" style={{ textDecorationColor: "hsl(var(--necta-immunity))" }}>
              November 2026.
            </span>
          </p>
          <p className="text-sm font-medium mb-10 text-necta-immunity">
            First 100 founding members get 15% off every order, forever.
          </p>

          {/* CTAs */}
          {submitted ? (
            <div className="max-w-sm mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-sm border border-primary/8">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white bg-primary">
                #{memberNumber}
              </div>
              <h2 className="text-xl font-bold text-primary mb-2">
                You're Founding Member #{memberNumber}
              </h2>
              <p className="text-sm text-primary/50 leading-relaxed mb-5">
                We'll email you before launch with your 15% discount and first access to new flavours. Welcome to the founding crew.
              </p>
              <Link
                href="/pre-order"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-70 transition-opacity"
              >
                Secure your order with a £10 deposit <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <Link
                href="/pre-order"
                className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                Pre-order — No Charge Until November
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>

              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full py-4 px-6 bg-white/60 border border-primary/20 text-primary rounded-full font-medium text-sm hover:bg-white/80 transition-colors"
                >
                  Join Free Waitlist Instead
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 pt-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full px-5 py-3.5 bg-white/80 border border-primary/15 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/15 text-sm text-primary placeholder:text-primary/30"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {isSubmitting ? "Claiming your spot..." : "Claim My Founding Member Spot"}
                  </button>
                  <p className="text-[10px] text-primary/30 text-center pt-0.5">
                    No spam · Unsubscribe anytime · UK delivery only at launch
                  </p>
                </form>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FOUNDING MEMBER PERKS */}
      <section className="py-16 px-5 max-w-4xl mx-auto">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-primary/35 mb-3">
          Founding Members Only
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-8">
          What you unlock as a founding member
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Star,
              bg: "#D6EBEA",
              title: "15% off every order, forever",
              desc: "Locked in at signup. Never expires, never decreases. You earned it for being early.",
            },
            {
              icon: Sparkles,
              bg: "#E0DAEF",
              title: "You get a founding member number",
              desc: "After signing up you'll see your number — #1 through #100. You helped build this.",
            },
            {
              icon: FlaskConical,
              bg: "#F2DDD4",
              title: "First access to new flavours",
              desc: "Every new variant we launch, founding members try it before the public. Always.",
            },
          ].map(({ icon: Icon, bg, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-primary/6 shadow-sm">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: bg }}>
                <Icon className="h-5 w-5 text-primary/60" />
              </div>
              <p className="font-semibold text-primary mb-2">{title}</p>
              <p className="text-sm text-primary/45 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="py-8 px-5 pb-16 max-w-4xl mx-auto">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-primary/35 mb-3">
          Four Variants
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-8">
          One pump. Any drink. Every outcome.
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {productSlugs.map((slug) => {
            const p = products[slug];
            const meta = skuMeta[slug];
            return (
              <div key={slug} className="rounded-[22px] overflow-hidden" style={{ backgroundColor: meta.bg }}>
                <div className="flex items-center justify-center p-6 pb-3" style={{ aspectRatio: "1" }}>
                  <Image
                    src={p.bottleImage}
                    alt={p.name}
                    width={180}
                    height={180}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="px-4 pb-5">
                  <p className="font-bold text-primary text-sm">{p.name}</p>
                  <p className="text-[10px] text-primary/45 italic mt-0.5">{p.flavor}</p>
                  <p className="text-[10px] text-primary/50 mt-1 leading-snug">{meta.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="px-5 pb-20 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Get Your Order Nov 2026", sub: "Production underway" },
            { label: "Cancel Anytime", sub: "Full refund on deposits" },
            { label: "Clinically Dosed", sub: "Not fairy-dust amounts" },
          ].map(({ label, sub }) => (
            <div key={label} className="bg-white rounded-2xl px-5 py-4 text-center border border-primary/8 shadow-sm">
              <p className="text-sm font-semibold text-primary">{label}</p>
              <p className="text-[11px] text-primary/40 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky mobile bottom bar */}
      {!submitted && (
        <div
          className="fixed bottom-0 left-0 right-0 md:hidden z-50 px-5 py-4 border-t border-primary/10 bg-background/95 backdrop-blur-sm"
        >
          <Link
            href="/pre-order"
            className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-primary-foreground rounded-full font-medium text-sm"
          >
            Pre-order — No Charge Until November
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default WaitlistPage;
