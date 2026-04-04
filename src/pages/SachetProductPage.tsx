import { useParams, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Star, ArrowRight, Minus, Plus, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProduct, products, productSlugs, type ProductSlug } from "@/data/products";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import ReviewSection from "@/components/ReviewSection";

const SachetProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const baseSlug = slug?.replace("-sachets", "") || "";
  const product = getProduct(baseSlug);

  if (!product) return <Navigate to="/shop" replace />;

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

function SachetHero({ product }: { product: NonNullable<ReturnType<typeof getProduct>> }) {
  const [duration, setDuration] = useState<7 | 14 | 30 | 90>(30);
  const [quantity, setQuantity] = useState(1);
  const [oneTimeFor14, setOneTimeFor14] = useState(false);
  const [liveRating, setLiveRating] = useState(product.rating);
  const [liveCount, setLiveCount] = useState(product.reviewCount);

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

  const price = duration === 14 && oneTimeFor14 ? 24 : product.sachets[duration];
  const earlyBirdPrice = +(price * 0.7).toFixed(2);
  const total = +(earlyBirdPrice * quantity).toFixed(2);
  const isSubscription = duration === 30 || duration === 90 || (duration === 14 && !oneTimeFor14);
  const isOneTime = duration === 7 || (duration === 14 && oneTimeFor14);

  const sachetOptions: { value: 7 | 14 | 30 | 90; title: string; sachets: number; sub: string; badge?: string; frequency: string }[] = [
    { value: 30, title: "30-DAY BOX", sachets: 30, sub: `£${product.sachets[30]}/month`, badge: "MOST POPULAR", frequency: "Delivered monthly" },
    { value: 90, title: "90-DAY BOX", sachets: 90, sub: `£${product.sachets[90]}/quarter (£40/month)`, badge: "BEST VALUE", frequency: "Delivered quarterly" },
    { value: 14, title: "14-DAY BOX", sachets: 14, sub: `£${product.sachets[14]}`, frequency: "Subscribe or one-time" },
    { value: 7, title: "7-DAY TRIAL", sachets: 7, sub: `£${product.sachets[7]}`, frequency: "One-time only" },
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="necta-container">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="bg-background rounded-3xl p-6 flex items-center justify-center aspect-square border border-border">
            <img
              src={product.sachetImage}
              alt={`${product.name} sachets`}
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
            <p className="text-lg font-sub text-muted-foreground mb-4">Your daily ritual, on-the-go</p>

            {/* Rating - clickable, hidden when 0 reviews */}
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
            <div className="space-y-3 mb-6">
              {sachetOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setDuration(opt.value); if (opt.value !== 14) setOneTimeFor14(false); }}
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
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-heading font-extrabold uppercase tracking-wider">{opt.title} <span className="text-muted-foreground font-body font-normal text-xs">({opt.sachets} sachets)</span></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{opt.frequency}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-lg font-heading font-extrabold text-foreground">{opt.sub}</span>
                        {opt.value === 90 && <span className="text-xs text-green-600 dark:text-green-400 font-medium">Save £5/month vs 30-day</span>}
                      </div>
                      {opt.value === 30 && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Check className="h-3 w-3 text-secondary" /> Daily supply</span>
                          <span className="flex items-center gap-1"><Check className="h-3 w-3 text-secondary" /> Free shipping</span>
                          <span className="flex items-center gap-1"><Check className="h-3 w-3 text-secondary" /> Cancel anytime</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* One-time toggle for 14-day */}
            {duration === 14 && (
              <label className="flex items-center gap-2 mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={oneTimeFor14}
                  onChange={(e) => setOneTimeFor14(e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm text-muted-foreground font-body">Make this a one-time purchase (£24)</span>
              </label>
            )}

            {/* Price display */}
            <div className="mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-heading font-extrabold text-foreground">£{earlyBirdPrice}</span>
                <span className="text-lg text-muted-foreground line-through">£{price.toFixed(2)}</span>
                <span className="bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">30% OFF</span>
              </div>
              {isSubscription && (
                <p className="text-xs text-muted-foreground mt-1">
                  {duration === 30 ? "per month" : duration === 90 ? "per quarter" : "per delivery"} • Cancel anytime
                </p>
              )}
              {isOneTime && (
                <p className="text-xs text-muted-foreground mt-1">One-time purchase + £3.99 shipping</p>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="text-xs font-heading font-bold tracking-wider uppercase text-foreground mb-2 block">QUANTITY</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border border-border rounded-lg flex items-center justify-center text-foreground hover:border-secondary transition-colors">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-14 text-center font-heading font-bold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-10 h-10 border border-border rounded-lg flex items-center justify-center text-foreground hover:border-secondary transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {quantity > 1 && <span className="text-sm font-bold text-foreground">Total: £{total}</span>}
              </div>
            </div>

            {/* CTA */}
            <Button
              size="lg"
              className={`w-full rounded-lg py-7 text-base font-heading font-bold tracking-wider uppercase shadow-bold mb-4 ${
                isSubscription
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  : "bg-foreground text-background hover:bg-foreground/90"
              }`}
            >
              {isSubscription ? "SUBSCRIBE NOW — 30% OFF FIRST DELIVERY" : "ADD TO CART — 30% OFF"}
            </Button>

            <p className="text-xs text-muted-foreground text-center mb-4">
              Early bird pricing. Ships August 2026.
            </p>

            {/* Trust signals */}
            {isSubscription && (
              <div className="grid grid-cols-2 gap-2 mb-6">
                {[
                  "Free shipping on subscriptions",
                  "Cancel anytime, no commitment",
                  "Pause or skip deliveries",
                  "Change box size anytime",
                ].map((text) => (
                  <p key={text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-secondary shrink-0" /> {text}
                  </p>
                ))}
              </div>
            )}

            <Link to={`/shop/${product.slug}`} className="flex items-center justify-center gap-1 text-sm font-bold text-secondary hover:underline">
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
        <div className="max-w-3xl mx-auto space-y-0">
          {product.ingredients.map((ing, i) => (
            <div key={i} className="flex items-center justify-between py-5 border-b border-primary-foreground/10">
              <span className="font-bold text-lg">{ing.name}</span>
              <span className="font-mono text-secondary text-lg font-bold">{ing.dose}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/science" className="inline-flex items-center gap-2 text-secondary font-bold text-sm tracking-wider hover:gap-3 transition-all">
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
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {related.map((slug) => {
            const p = products[slug];
            return (
              <Link key={slug} to={`/shop/${slug}-sachets`} className="group product-card-hover rounded-2xl overflow-hidden border border-border bg-background">
                <div className="bg-background p-4 flex items-center justify-center aspect-square">
                  <img src={p.sachetImage} alt={`${p.name} sachets`} className="h-40 w-auto object-contain group-hover:scale-110 transition-transform duration-500" loading="lazy" />
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