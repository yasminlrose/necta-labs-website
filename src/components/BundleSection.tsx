'use client';

import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { products, productSlugs, ProductSlug } from "@/data/products";

const BUNDLE_TIERS = [
  { count: 1, label: "Single", discount: 0 },
  { count: 2, label: "Duo", discount: 10 },
  { count: 3, label: "Trio", discount: 15 },
  { count: 4, label: "Full Set", discount: 25 },
];


const BundleSection = () => {
  const [selected, setSelected] = useState<Set<ProductSlug>>(new Set());

  const toggle = (slug: ProductSlug) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const count = selected.size;
  const tier = BUNDLE_TIERS.find((t) => t.count === count) || BUNDLE_TIERS[0];
  const baseTotal = count * 29;
  const savedAmount = Math.round(baseTotal * (tier.discount / 100));
  const finalPrice = baseTotal - savedAmount;

  return (
    <section className="py-16 md:py-20 bg-cream">
      <div className="necta-container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-primary mb-3">Build Your Bundle</h2>
          <p className="text-primary/60 text-base max-w-lg mx-auto">
            Mix and match your infusions. The more you add, the more you save.
          </p>
        </div>

        {/* Tier badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {BUNDLE_TIERS.map((t) => (
            <div
              key={t.count}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                count === t.count
                  ? "bg-primary text-primary-foreground border-primary"
                  : t.discount > 0
                  ? "bg-pink text-primary border-pink"
                  : "bg-white text-primary/60 border-border"
              }`}
            >
              {t.label}
              {t.discount > 0 && (
                <span className="ml-1.5 font-bold">— Save {t.discount}%</span>
              )}
            </div>
          ))}
        </div>

        {/* Product selection */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {productSlugs.map((slug) => {
            const product = products[slug];
            const isSelected = selected.has(slug);

            return (
              <button
                key={slug}
                onClick={() => toggle(slug)}
                className={`relative rounded-xl p-5 text-left transition-all duration-200 bg-white border-2 ${
                  isSelected
                    ? "border-primary shadow-md scale-[1.02]"
                    : "border-border hover:scale-[1.01] hover:shadow-sm"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </span>
                )}
                <Image
                  src={product.bottleImage}
                  alt={product.name}
                  width={112}
                  height={112}
                  className="mx-auto object-contain mb-3"
                  style={{ mixBlendMode: "multiply" }}
                  loading="lazy"
                />
                <p className="font-bold text-primary text-sm">{product.name}</p>
                <p className="text-xs text-primary/60">{product.flavor}</p>
                <p className="text-sm font-semibold text-primary mt-2">£29</p>
              </button>
            );
          })}
        </div>

        {/* Summary */}
        <div className="max-w-sm mx-auto bg-white rounded-xl border border-border p-6 text-center">
          {count === 0 ? (
            <p className="text-primary/50 text-sm">Select products above to build your bundle</p>
          ) : (
            <>
              <p className="text-sm text-primary/60 mb-1">
                {count} {count === 1 ? "product" : "products"} selected
              </p>
              {tier.discount > 0 && (
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-sm text-primary/40 line-through">£{baseTotal}</span>
                  <span className="bg-pink text-primary text-xs font-bold px-2 py-0.5 rounded">
                    Save {tier.discount}%
                  </span>
                </div>
              )}
              <p className="text-3xl font-bold text-primary mb-4">£{finalPrice}</p>
              <Link
                href="/shop"
                className="block w-full bg-primary text-primary-foreground font-semibold py-3 rounded-md text-sm hover:bg-primary/90 transition-colors"
              >
                Shop Bundle
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default BundleSection;
