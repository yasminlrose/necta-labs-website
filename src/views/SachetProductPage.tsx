'use client';

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Star, ArrowRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProduct, products, productSlugs, type ProductSlug } from "@/data/products";
import { getPriceId, getStripeMode } from "@/lib/stripePrices";
import type { ProductSlug as StripePriceSlug } from "@/lib/stripePrices";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import ReviewSection from "@/components/ReviewSection";

const SachetProductPage = ({ slug: slugProp }: { slug?: string } = {}) => {
  const params = useParams();
  const slug = slugProp ?? (params?.slug as string | undefined);
  const baseSlug = slug?.replace("-sachets", "") || "";
  const product = getProduct(baseSlug);

  if (!product) {
    if (typeof window !== 'undefined') window.location.replace('/shop');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <SachetHero product={product} />
        <IngredientsSection product={product} />
        <HowToUse />
        <LifestyleSection />
        <ReviewSection product={product.slug} />
        <RelatedSachets currentSlug={product.slug} />
      </div>
      <Footer />
    </div>
  );
};

/* Savings vs one-off price for each subscribable sachet duration */
const SACHET_SAVINGS = {
  14: { amount: 3,  badge: 'SAVE £3',    period: 'monthly',         frequency: 'monthly'        },
  30: { amount: 7,  badge: 'SAVE £7/mo', period: 'monthly',         frequency: 'monthly'        },
  90: { amount: 21, badge: 'SAVE £21',   period: 'every 3 months',  frequency: 'every 3 months' },
} as const;

function SachetHero({ product }: { product: NonNullable<ReturnType<typeof getProduct>> }) {
  const [duration, setDuration] = useState<7 | 14 | 30 | 90>(30);
  const [liveRating, setLiveRating] = useState(product.rating);
  const [liveCount, setLiveCount] = useState(product.reviewCount);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    supabase.from("product_reviews").select("rating").eq("product", product.slug).then(({ data }) => {
      if (data && data.length > 0) {
        setLiveRating(+(data.reduce((s, r) => s + r.rating, 0) / data.length).toFixed(1));
        setLiveCount(data.length);
      } else {
        setLiveCount(0);
      }
    });
  }, [product.slug]);

  const scrollToReviews = () => {
    document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
  };

  /* Prices */
  const oneOffPrice = product.sachets[duration];
  const subSavings = duration !== 7 ? SACHET_SAVINGS[duration as 14 | 30 | 90].amount : 0;
  const subPrice = oneOffPrice - subSavings;
  const canSubscribe = duration !== 7;

  const handleCheckout = useCallback(async (mode: 'one-off' | 'subscribe') => {
    setCheckoutLoading(true);
    try {
      const priceId = getPriceId(product.slug as StripePriceSlug, 'sachet', duration, mode);
      const stripeMode = getStripeMode('sachet', duration, mode);
      const sizeLabel = `${duration}-day box`;
      const billingFrequency = mode === 'subscribe' && canSubscribe
        ? SACHET_SAVINGS[duration as 14 | 30 | 90].frequency
        : undefined;
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          mode: stripeMode,
          productName: `NECTA ${product.name} Sachets`,
          size: sizeLabel,
          productSlug: product.slug,
          frequency: billingFrequency,
        }),
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
  }, [duration, canSubscribe, product.slug, product.name]);

  const sachetOptions: {
    value: 7 | 14 | 30 | 90;
    title: string;
    sachets: number;
    badge?: string;
    frequency: string;
  }[] = [
    { value: 30, title: "30-DAY BOX",  sachets: 30, badge: "MOST POPULAR", frequency: "Subscribe or buy once" },
    { value: 90, title: "90-DAY BOX",  sachets: 90, badge: "BEST VALUE",   frequency: "Subscribe or buy once" },
    { value: 14, title: "14-DAY BOX",  sachets: 14,                        frequency: "Subscribe or buy once" },
    { value: 7,  title: "7-DAY TRIAL", sachets: 7,                         frequency: "One-time only"        },
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="necta-container">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="bg-background rounded-3xl p-6 flex items-center justify-center aspect-square border border-border">
            <Image
              src={product.sachetImage}
              alt={`${product.name} sachets`}
              width={500}
              height={500}
              priority
              className="max-h-[500px] w-auto object-contain"
            />
          </div>

          {/* Details */}
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase mb-2">
              {product.flavor}
            </p>
            <h1 className="text-5xl md:text-6xl font-heading font-extrabold text-foreground uppercase tracking-tight mb-2">
              {product.name} SACHETS
            </h1>
            <p className="text-lg font-sub text-muted-foreground mb-2">Your daily ritual, on-the-go</p>
            <p className="text-xs text-muted-foreground bg-muted border border-border rounded-lg px-3 py-2 mb-4">
              Pre-order — ships October 2026. Cancel any time before dispatch for a full refund.
            </p>

            {/* Rating */}
            {liveCount > 0 && (
              <button onClick={scrollToReviews} className="flex items-center gap-2 mb-8 group bg-transparent border-none cursor-pointer p-0">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(liveRating) ? "fill-secondary text-secondary" : "text-border"}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-foreground">{liveRating}/5</span>
                <span className="text-sm text-muted-foreground group-hover:underline">({liveCount} reviews)</span>
              </button>
            )}

            {/* Box size selector cards */}
            <div className="space-y-3 mb-5">
              {sachetOptions.map((opt) => {
                const optOneOff = product.sachets[opt.value];

                return (
                  <button
                    key={opt.value}
                    onClick={() => setDuration(opt.value)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all relative ${
                      duration === opt.value
                        ? "border-secondary bg-secondary/[0.04] shadow-md"
                        : "border-border hover:border-secondary/40"
                    }`}
                  >
                    {opt.badge && (
                      <span className="absolute -top-3 right-4 bg-secondary text-secondary-foreground text-[10px] font-heading font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                        {opt.badge}
                      </span>
                    )}
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center mt-0.5 ${
                        duration === opt.value ? "border-secondary bg-secondary" : "border-muted-foreground/40"
                      }`}>
                        {duration === opt.value && <Check className="h-3 w-3 text-secondary-foreground" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-heading font-extrabold uppercase tracking-wider">
                          {opt.title} <span className="text-muted-foreground font-body font-normal text-xs">({opt.sachets} sachets)</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{opt.frequency}</p>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-lg font-heading font-extrabold text-foreground">£{optOneOff}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Price display */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-heading font-extrabold text-foreground">£{oneOffPrice}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">One-time purchase</p>
            </div>

            {/* Primary CTA — one-off */}
            <Button
              size="lg"
              disabled={checkoutLoading}
              onClick={() => handleCheckout('one-off')}
              className="w-full rounded-lg py-7 text-base font-heading font-bold tracking-wider uppercase shadow-bold mb-3 disabled:opacity-60 bg-foreground text-background hover:bg-foreground/90"
            >
              {checkoutLoading ? "Redirecting…" : "PRE-ORDER NOW"}
            </Button>

            {/* Secondary CTA — subscribe (hidden for 7-day trial) */}
            {canSubscribe && (
              <Button
                size="lg"
                variant="outline"
                disabled={checkoutLoading}
                onClick={() => handleCheckout('subscribe')}
                className="w-full rounded-lg py-6 text-sm font-heading font-bold tracking-wider uppercase mb-3 disabled:opacity-60 border-2 border-secondary text-secondary hover:bg-secondary/10"
              >
                PRE-ORDER &amp; SUBSCRIBE — £{subPrice}
                <span className="ml-2 text-xs font-normal opacity-70">{SACHET_SAVINGS[duration as 14 | 30 | 90].badge}</span>
              </Button>
            )}

            {/* Pick & Mix link */}
            <Link
              href="/pick-and-mix"
              className="flex items-center justify-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mt-2 mb-6"
            >
              Add to Pick &amp; Mix <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link href={`/shop/${product.slug}`} className="flex items-center justify-center gap-1 text-sm font-bold text-secondary hover:underline">
              Prefer pump bottles? View {product.name} Pump <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function IngredientsSection({ product }: { product: NonNullable<ReturnType<typeof getProduct>> }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className="py-20 bg-primary text-primary-foreground">
      <div className="necta-container">
        <h2 className={`text-4xl md:text-5xl font-heading font-extrabold text-center uppercase tracking-tight mb-16 scroll-fade-in ${isVisible ? "visible" : ""}`}>
          WHAT'S INSIDE
        </h2>
        <div className="max-w-5xl mx-auto space-y-0">
          {product.ingredients.map((ing, i) => (
            <div key={i} className="flex items-center justify-between py-5 border-b border-primary-foreground/10">
              <span className="font-bold text-lg">{ing.name}</span>
              <span className="font-mono text-secondary text-lg font-bold">{ing.dose}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/science" className="inline-flex items-center gap-2 text-secondary font-bold text-sm tracking-wider hover:gap-3 transition-all">
            SEE THE STUDIES <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function HowToUse() {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="necta-container">
        <div className={`flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 scroll-fade-in ${isVisible ? "visible" : ""}`}>
          {[
            { step: "TEAR", icon: "✂️" },
            { step: "POUR", icon: "💧" },
            { step: "ENJOY", icon: "☕" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-4xl">{s.icon}</span>
              <span className="text-xl font-heading font-extrabold text-foreground uppercase">{s.step}</span>
              {i < 2 && <span className="hidden md:block text-3xl text-muted-foreground/30 ml-8">→</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LifestyleSection() {
  return (
    <section className="relative py-32 bg-muted">
      <div className="necta-container text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-foreground uppercase tracking-tight">
          PERFECT FOR OFFICE, GYM, TRAVEL, ANYWHERE
        </h2>
      </div>
    </section>
  );
}


function RelatedSachets({ currentSlug }: { currentSlug: ProductSlug }) {
  const related = productSlugs.filter((s) => s !== currentSlug).slice(0, 3);
  return (
    <section className="py-20 bg-muted">
      <div className="necta-container">
        <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center uppercase tracking-tight mb-12">
          YOU MIGHT LIKE
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {related.map((slug) => {
            const p = products[slug];
            return (
              <Link key={slug} href={`/shop/${slug}-sachets`} className="group product-card-hover rounded-2xl overflow-hidden border border-border bg-background">
                <div className="bg-background p-4 flex items-center justify-center aspect-square">
                  <Image src={p.sachetImage} alt={`${p.name} sachets`} width={160} height={160} loading="lazy" className="h-40 w-auto object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-heading font-extrabold text-foreground uppercase">{p.name} SACHETS</h3>
                  <p className="text-sm text-muted-foreground">{p.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default SachetProductPage;