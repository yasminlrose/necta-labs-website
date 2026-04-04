import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { products, productSlugs, type ProductData } from "@/data/products";

interface YouMayAlsoLikeProps {
  currentSlug: string;
}

const cardColors: Record<string, { light: string; accent: string }> = {
  focus:   { light: "#D6EBEA", accent: "#5B9E99" },
  immunity:{ light: "#F2DDD4", accent: "#C06040" },
  calm:    { light: "#E0DAEF", accent: "#8878C0" },
  glow:    { light: "#F0DEDA", accent: "#B06455" },
};

const YouMayAlsoLike = ({ currentSlug }: YouMayAlsoLikeProps) => {
  const others = productSlugs.filter(s => s !== currentSlug).map(s => products[s]);

  return (
    <section className="py-16 md:py-20 bg-white border-t border-border">
      <div className="necta-container">
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-2">
          Complete your ritual
        </h2>
        <p className="text-center text-primary/55 text-sm mb-10">
          Stack multiple infusions for full-spectrum daily wellness.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {others.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ product }: { product: ProductData }) => {
  const colors = cardColors[product.slug] || cardColors.focus;

  return (
    <Link
      to={`/shop/${product.slug}`}
      className="group block rounded-2xl border border-border overflow-hidden hover:shadow-md transition-all duration-200"
    >
      {/* Image */}
      <div className="flex items-center justify-center h-[220px] bg-white">
        <img
          src={product.bottleImage}
          alt={`NECTA ${product.name}`}
          className="h-[190px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]"
          style={{ mixBlendMode: "multiply" }}
        />
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="text-xs text-primary/40 tracking-widest uppercase mb-0.5">NECTA Labs</p>
        <h3 className="font-bold text-primary mb-0.5">{product.name}</h3>
        <p className="text-xs text-primary/50 italic mb-3">{product.flavor}</p>

        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < Math.round(product.rating) ? "fill-primary text-primary" : "text-primary/20"}`} />
          ))}
          <span className="text-xs text-primary/40 ml-1">({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-primary">£{product.price250Sub}/mo</span>
            <span className="text-xs text-primary/35 ml-1">subscribe</span>
          </div>
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-md"
            style={{ backgroundColor: colors.light, color: colors.accent }}
          >
            Shop now
          </span>
        </div>
      </div>
    </Link>
  );
};

export default YouMayAlsoLike;
