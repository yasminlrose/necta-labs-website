import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { ExternalLink, ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getIngredient } from "@/data/ingredients";
import { products } from "@/data/products";
import type { ProductSlug } from "@/data/products";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

// SKU accent & card bg colours
const skuAccent: Record<string, string> = {
  focus: "#7BADA8",
  immunity: "#D4785A",
  calm: "#A89BC8",
  glow: "#C9897A",
};

const skuCardBg: Record<string, string> = {
  focus: "#D6EBEA",
  immunity: "#F2DDD4",
  calm: "#E0DAEF",
  glow: "#F0DEDA",
};

const IngredientPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const ingredient = slug ? getIngredient(slug) : undefined;

  const { ref: scienceRef, isVisible: scienceVisible } = useScrollAnimation();
  const { ref: whyRef, isVisible: whyVisible } = useScrollAnimation();

  useEffect(() => {
    if (ingredient) {
      document.title = `${ingredient.name} — Research & Benefits | NECTA Labs`;
    }
    return () => {
      document.title = "NECTA Labs — Functional Adaptogen Infusions for Coffee & Tea";
    };
  }, [ingredient]);

  if (!ingredient) return <Navigate to="/science" replace />;

  const primarySlug = ingredient.foundIn[0]?.slug || "focus";
  const heroCardBg = skuCardBg[primarySlug] || skuCardBg.focus;
  const heroAccent = skuAccent[primarySlug] || skuAccent.focus;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section
        className="pt-32 pb-16 md:pt-44 md:pb-24"
        style={{ backgroundColor: heroCardBg }}
      >
        <div className="necta-container max-w-5xl mx-auto text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
          >
            <Leaf className="h-7 w-7" style={{ color: heroAccent }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">
            {ingredient.name}
          </h1>
          <p className="text-lg text-foreground/55 max-w-xl mx-auto">
            {ingredient.benefit}
          </p>

          {/* Found in badges */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {ingredient.foundIn.map(({ product, slug: pSlug }) => (
              <Link
                key={pSlug}
                to={`/shop/${pSlug}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/60 bg-white/70 rounded-full px-3 py-1.5 hover:text-foreground transition-colors"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: skuAccent[pSlug] }}
                />
                Found in {product}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What is it? — White card */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm text-foreground/40 tracking-widest uppercase mb-4">
            What is it?
          </p>
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-border">
            <div className="space-y-5 text-base text-foreground/55 leading-[1.8]">
              {ingredient.whatIsIt.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Science — Cards with SKU accent border */}
      <section ref={scienceRef} className="py-16 md:py-24 bg-background">
        <div className="necta-container max-w-6xl mx-auto">
          <p className="text-sm text-foreground/40 tracking-widest uppercase mb-4">
            The science
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-10">
            Published research
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ingredient.studies.map((study, i) => (
              <div
                key={i}
                className={`rounded-2xl bg-background p-6 flex flex-col scroll-fade-in ${scienceVisible ? "visible" : ""}`}
                style={{
                  transitionDelay: `${i * 100}ms`,
                  border: `1px solid ${heroAccent}`,
                }}
              >
                <h3 className="text-sm font-medium text-foreground mb-2 leading-snug">
                  {study.title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs text-foreground/40 bg-muted rounded-full px-2 py-0.5">
                    {study.year}
                  </span>
                  <span className="text-xs text-foreground/40 bg-muted rounded-full px-2 py-0.5">
                    {study.journal}
                  </span>
                  {study.sampleSize && (
                    <span className="text-xs text-foreground/40 bg-muted rounded-full px-2 py-0.5">
                      {study.sampleSize}
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground/50 leading-relaxed flex-1 mb-4">
                  {study.finding}
                </p>
                <a
                  href={study.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs transition-colors hover:opacity-70"
                  style={{ color: heroAccent }}
                >
                  <ExternalLink className="h-3 w-3" /> View on PubMed
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why we use it — SKU card bg */}
      <section
        ref={whyRef}
        className="py-16 md:py-24"
        style={{ backgroundColor: heroCardBg }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm text-foreground/40 tracking-widest uppercase mb-4">
            Why we use it
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
            {ingredient.dose} per serving
          </h2>
          <p
            className={`text-base text-foreground/55 leading-[1.8] mb-8 scroll-fade-in ${whyVisible ? "visible" : ""}`}
          >
            {ingredient.doseRationale}
          </p>

          {/* Product cards */}
          <div className="flex flex-wrap gap-4">
            {ingredient.foundIn.map(({ product: pName, slug: pSlug }) => {
              const p = pSlug in products ? products[pSlug as ProductSlug] : null;
              if (!p) return null;
              return (
                <Link
                  key={pSlug}
                  to={`/shop/${pSlug}`}
                  className="flex items-center gap-4 rounded-xl bg-white border border-border p-4 hover:border-foreground/20 transition-colors group"
                >
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: skuCardBg[pSlug] }}
                  >
                    <img
                      src={p.bottleImage}
                      alt={pName}
                      className="h-12 object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:underline">
                      {pName}
                    </p>
                    <p className="text-xs text-foreground/40">{p.flavor}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-foreground/20 group-hover:text-foreground/50 transition-colors ml-auto" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Works well with — navy pills */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm text-foreground/40 tracking-widest uppercase mb-4">
            Works well with
          </p>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-8">
            Synergistic ingredients
          </h2>

          <div className="flex flex-wrap gap-3">
            {ingredient.synergies.map((syn) => (
              <Link
                key={syn.slug}
                to={`/ingredients/${syn.slug}`}
                className="inline-flex items-center gap-2 bg-foreground text-background text-sm font-medium rounded-full px-4 py-2.5 hover:bg-foreground/90 transition-colors"
              >
                {syn.name}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Explore all ingredients
          </h2>
          <p className="text-foreground/55 mb-8">
            Every ingredient in every NECTA product, backed by published research.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/science">View the Science Library</Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full" asChild>
              <Link to="/shop">Shop NECTA</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IngredientPage;
