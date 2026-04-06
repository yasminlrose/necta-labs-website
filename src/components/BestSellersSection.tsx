'use client';

import { useState } from "react";
import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { products, productSlugs } from "@/data/products";

const BestSellersSection = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="necta-container">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Best Sellers</h2>
          <Link
            href="/shop"
            className="text-sm font-medium text-primary/60 hover:text-primary transition-colors underline underline-offset-4"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {productSlugs.map((slug) => (
            <ProductCard key={slug} slug={slug} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ slug }: { slug: string }) => {
  const [isSubscription, setIsSubscription] = useState(true);
  const product = products[slug as keyof typeof products];
  if (!product) return null;

  const price = isSubscription ? product.price250Sub : product.price250;
  const savePct = Math.round(((product.price250 - product.price250Sub) / product.price250) * 100);

  return (
    <div className="group flex flex-col">
      {/* Image area */}
      <Link href={`/shop/${slug}`} className="block">
        <div className="relative aspect-square flex items-center justify-center mb-4 overflow-hidden rounded-lg bg-white">
          <Image
            src={product.bottleImage}
            alt={`NECTA ${product.name}`}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            style={{ mixBlendMode: "multiply" }}
            loading="lazy"
          />
          {isSubscription && (
            <span className="absolute top-3 right-3 bg-pink text-primary text-xs font-semibold px-2 py-1 rounded">
              Save {savePct}%
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 flex flex-col">
        <Link href={`/shop/${slug}`}>
          <p className="text-xs font-medium text-primary/50 uppercase tracking-wider mb-0.5">NECTA Labs</p>
          <h3 className="font-bold text-primary text-sm md:text-base mb-1">{product.name} Infusion</h3>
          <p className="text-xs text-primary/60 mb-2 line-clamp-1">{product.tagline}</p>
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-3 w-3"
              fill={i < Math.round(product.rating) ? "hsl(var(--primary))" : "none"}
              stroke="hsl(var(--primary))"
            />
          ))}
          <span className="text-xs text-primary/50 ml-1">({product.reviewCount})</span>
        </div>

        {/* Subscription toggle */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setIsSubscription(true)}
            className={`flex-1 text-xs py-1.5 px-2 rounded border transition-colors font-medium ${
              isSubscription
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white text-primary/60 border-border hover:border-primary/40"
            }`}
          >
            Subscribe
          </button>
          <button
            onClick={() => setIsSubscription(false)}
            className={`flex-1 text-xs py-1.5 px-2 rounded border transition-colors font-medium ${
              !isSubscription
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white text-primary/60 border-border hover:border-primary/40"
            }`}
          >
            One-off
          </button>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-lg font-bold text-primary">£{price}</span>
            {isSubscription && (
              <span className="text-xs text-primary/40 ml-1 line-through">£{product.price250}</span>
            )}
            <span className="text-xs text-primary/40 block">/250ml</span>
          </div>
          <Link
            href={`/shop/${slug}`}
            className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-md hover:bg-primary/90 transition-colors"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BestSellersSection;
