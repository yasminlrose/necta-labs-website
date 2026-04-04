import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { products, productSlugs } from "@/data/products";

type CardFormat = "bottle" | "sachet";

interface ShopCard {
  slug: string;
  format: CardFormat;
  href: string;
  image: string;
  name: string;
  tagline: string;
  flavor: string;
  rating: number;
  reviewCount: number;
  sizes: string[];
  fromPrice: number;
}

const buildCards = (): ShopCard[] => {
  const bottles: ShopCard[] = productSlugs.map((slug) => {
    const p = products[slug];
    return {
      slug,
      format: "bottle",
      href: `/shop/${slug}`,
      image: p.bottleImage,
      name: p.name,
      tagline: p.tagline,
      flavor: p.flavor,
      rating: p.rating,
      reviewCount: p.reviewCount,
      sizes: ["250ml", "500ml"],
      fromPrice: p.price250Sub,
    };
  });

  const sachets: ShopCard[] = productSlugs.map((slug) => {
    const p = products[slug];
    return {
      slug,
      format: "sachet",
      href: `/shop/${slug}?format=sachet`,
      image: p.sachetImage,
      name: p.name,
      tagline: p.tagline,
      flavor: p.flavor,
      rating: p.rating,
      reviewCount: p.reviewCount,
      sizes: ["7-day", "14-day", "30-day", "90-day"],
      fromPrice: p.sachets[7],
    };
  });

  return [...bottles, ...sachets];
};

const ALL_CARDS = buildCards();

const ShopPage = () => {
  const bottleCards = ALL_CARDS.filter((c) => c.format === "bottle");
  const sachetCards = ALL_CARDS.filter((c) => c.format === "sachet");

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── HERO ── */}
      <section
        className="pt-20 pb-8 md:pt-24 md:pb-10"
        style={{
          background:
            "linear-gradient(135deg, #D6EBEA 0%, #E0DAEF 33%, #F2DDD4 66%, #F0DEDA 100%)",
        }}
      >
        <div className="necta-container text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-1">
            Shop NECTA
          </h1>
          <p className="text-sm text-foreground/50">
            Four daily wellness infusions — pump bottles &amp; sachets.
          </p>
        </div>
      </section>

      {/* ── PUMP BOTTLES ── */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {bottleCards.map((card) => (
          <ProductCard key={`${card.slug}-${card.format}`} card={card} />
        ))}
      </div>

      {/* ── SACHETS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {sachetCards.map((card) => (
          <ProductCard key={`${card.slug}-${card.format}`} card={card} />
        ))}
      </div>

      {/* ── PICK & MIX BANNER ── */}
      <div className="px-4 md:px-8 py-16 md:py-20">
        <div
          className="rounded-3xl py-14 md:py-20 overflow-hidden text-center"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-4">
            Save more
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Build your own bundle
          </h2>
          <p className="text-white/60 text-base mb-8 leading-relaxed max-w-md mx-auto px-6">
            Mix any 2–4 products and save up to 25%.
          </p>
          <Link
            to="/pick-and-mix"
            className="inline-flex items-center gap-2 bg-white text-foreground font-bold px-8 py-3.5 rounded-full hover:bg-white/90 transition-colors text-sm"
          >
            Pick &amp; Mix →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

/* ── SHARED CARD ── */
function ProductCard({ card }: { card: ShopCard }) {
  return (
    <Link to={card.href} className="group flex flex-col">
      {/* Image — edge to edge, no padding, large portrait */}
      <div className="relative overflow-hidden bg-white aspect-[3/4] w-full">
        <img
          src={card.image}
          alt={`NECTA ${card.name} ${card.format === "bottle" ? "pump bottle" : "sachets"}`}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          style={{ mixBlendMode: "multiply" }}
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/4 transition-colors duration-300" />

        {/* View product pill on hover */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="text-[11px] font-semibold bg-primary text-white px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
            View product
          </span>
        </div>
      </div>

      {/* Info — below image, with small side padding */}
      <div className="px-3 pt-3 pb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-0.5">
          NECTA · {card.format === "bottle" ? "Pump Bottle" : "Sachet Box"}
        </p>
        <h3 className="text-sm font-bold text-foreground leading-snug mb-2 group-hover:underline underline-offset-2">
          {card.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-2.5 w-2.5 ${
                  i < Math.floor(card.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-amber-200 text-amber-200"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">
            {card.rating} ({card.reviewCount})
          </span>
        </div>

        {/* Size pills */}
        <div className="flex flex-wrap gap-1">
          {card.sizes.map((s) => (
            <span
              key={s}
              className="text-[9px] font-semibold text-foreground/55 bg-[#f2f0ec] px-2 py-0.5 rounded-full"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default ShopPage;
