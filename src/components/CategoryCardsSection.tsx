import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import bottleFocus from "@/assets/bottle-focus.jpeg";
import bottleCalm from "@/assets/bottle-calm.jpeg";
import bottleImmunity from "@/assets/bottle-immunity.jpeg";
import bottleGlow from "@/assets/bottle-glow.jpeg";

const categories = [
  { slug: "focus",   name: "Focus",   desc: "Mental clarity & cognitive performance", image: bottleFocus },
  { slug: "immunity",name: "Immunity",desc: "Daily immune defence & resilience",       image: bottleImmunity },
  { slug: "calm",    name: "Calm",    desc: "Stress relief & restful sleep",           image: bottleCalm },
  { slug: "glow",    name: "Glow",    desc: "Skin health from the inside out",         image: bottleGlow },
];

const CategoryCardsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="necta-container">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Shop by goal</h2>
          <Link
            to="/shop"
            className="flex items-center gap-1.5 text-sm font-medium text-primary/60 hover:text-primary transition-colors"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map(({ slug, name, desc, image }) => (
            <Link
              key={slug}
              to={`/shop/${slug}`}
              className="group block rounded-xl overflow-hidden border border-border hover:border-primary/20 transition-all duration-200 hover:shadow-md bg-white"
            >
              {/* Image */}
              <div className="aspect-square flex items-center justify-center p-6 bg-white">
                <img
                  src={image}
                  alt={`NECTA ${name}`}
                  className="h-36 object-contain transition-transform duration-300 group-hover:scale-105"
                  style={{ mixBlendMode: "multiply" }}
                />
              </div>
              {/* Text */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-primary text-sm mb-0.5">{name}</h3>
                    <p className="text-xs text-primary/50">{desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary/30 group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCardsSection;
