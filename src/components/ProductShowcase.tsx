'use client';

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import bottleFocus from "@/assets/bottle-focus.jpeg";
import bottleImmunity from "@/assets/bottle-immunity.jpeg";
import bottleCalm from "@/assets/bottle-calm.jpeg";
import bottleGlow from "@/assets/bottle-glow.jpeg";

const productCards = [
  {
    name: "Focus",
    flavour: "Vanilla Bean",
    ingredients: "Lion's Mane 2g · L-Theanine · Rhodiola",
    price: "From £25/mo",
    image: bottleFocus.src,
    bg: "#D6EBEA",
    slug: "focus",
  },
  {
    name: "Immunity",
    flavour: "Hazelnut & Orange",
    ingredients: "Reishi 1.5g · Elderberry · Zinc",
    price: "From £25/mo",
    image: bottleImmunity.src,
    bg: "#F2DDD4",
    slug: "immunity",
  },
  {
    name: "Calm",
    flavour: "Honey Caramel",
    ingredients: "Chamomile · Lemon Balm · Magnesium",
    price: "From £25/mo",
    image: bottleCalm.src,
    bg: "#E0DAEF",
    slug: "calm",
  },
  {
    name: "Glow",
    flavour: "Cherry Almond",
    ingredients: "Marine Collagen 2.5g · CoQ10 · Vitamin C",
    price: "From £25/mo",
    image: bottleGlow.src,
    bg: "#F0DEDA",
    slug: "glow",
  },
];

const ProductShowcase = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-24 md:py-32 bg-muted">
      <div className="necta-container">
        <div className={`text-center mb-16 scroll-fade-in ${isVisible ? "visible" : ""}`}>
          <p className="text-sm text-foreground/40 tracking-widest uppercase mb-4">Our range</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-foreground">
            Four blends, real ingredients
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {productCards.map((product, i) => (
            <Link
              key={product.slug}
              href={`/shop/${product.slug}`}
              className={`group rounded-2xl overflow-hidden product-card-hover cursor-pointer scroll-fade-in ${isVisible ? "visible" : ""}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="p-5 flex items-center justify-center h-[220px] md:h-[280px]" style={{ backgroundColor: product.bg }}>
                <Image
                  src={product.image}
                  alt={`${product.name} infusion`}
                  width={200}
                  height={280}
                  className="object-contain group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5 bg-background">
                <h3 className="text-base md:text-lg font-medium text-foreground mb-0.5">{product.name}</h3>
                <p className="text-sm text-foreground/40 mb-2">{product.flavour}</p>
                <p className="text-xs font-mono text-foreground/35 mb-3 leading-relaxed">{product.ingredients}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{product.price}</span>
                  <span className="text-sm text-foreground/40 group-hover:text-foreground transition-colors inline-flex items-center gap-1">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;