'use client';

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import bottleFocus from "@/assets/bottle-focus.jpeg";
import bottleCalm from "@/assets/bottle-calm.jpeg";
import bottleImmunity from "@/assets/bottle-immunity.jpeg";
import bottleGlow from "@/assets/bottle-glow.jpeg";

const spotlights = [
  {
    product: "FOCUS",
    tagline: "For mental clarity & performance",
    color: "bg-[#D6EBEA]",
    image: bottleFocus.src,
    ingredients: [
      { name: "Lion's Mane", dose: "500mg", note: "Nerve growth factor" },
      { name: "Rhodiola Rosea", dose: "200mg", note: "Stress resilience" },
      { name: "L-Theanine", dose: "80mg", note: "Calm focus" },
      { name: "Bacopa Monnieri", dose: "300mg", note: "Memory & recall" },
    ],
    link: "/shop/focus",
  },
  {
    product: "IMMUNITY",
    tagline: "For daily immune defence",
    color: "bg-[#F2DDD4]",
    image: bottleImmunity.src,
    ingredients: [
      { name: "Reishi Mushroom", dose: "2g", note: "Immune modulation" },
      { name: "Elderberry", dose: "500mg", note: "Antioxidant defence" },
      { name: "Ashwagandha", dose: "300mg", note: "Cortisol balance" },
      { name: "Vitamin C", dose: "200mg", note: "Immune support" },
    ],
    link: "/shop/immunity",
  },
  {
    product: "CALM",
    tagline: "For stress relief & sleep",
    color: "bg-[#E0DAEF]",
    image: bottleCalm.src,
    ingredients: [
      { name: "Chamomile Extract", dose: "150mg", note: "Anxiolytic" },
      { name: "Lemon Balm", dose: "150mg", note: "Nervine tonic" },
      { name: "Jujube Seed", dose: "200mg", note: "Sleep quality" },
      { name: "Poria Cocos", dose: "200mg", note: "CNS calming" },
    ],
    link: "/shop/calm",
  },
  {
    product: "GLOW",
    tagline: "For radiant skin & beauty",
    color: "bg-[#F0DEDA]",
    image: bottleGlow.src,
    ingredients: [
      { name: "Marine Collagen", dose: "2.5g", note: "Skin firmness" },
      { name: "Hyaluronic Acid", dose: "120mg", note: "Skin hydration" },
      { name: "CoQ10", dose: "80mg", note: "Cellular energy" },
      { name: "Trans-Resveratrol", dose: "100mg", note: "Antioxidant" },
    ],
    link: "/shop/glow",
  },
];

const IngredientSpotlightsSection = () => {
  const [current, setCurrent] = useState(0);
  const spot = spotlights[current];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="necta-container">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Ingredients you can trust
          </h2>
          <p className="text-primary/60 text-sm max-w-md mx-auto">
            Every ingredient at a clinically relevant dose. No fillers, no fluff.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {spotlights.map((s, i) => (
            <button
              key={s.product}
              onClick={() => setCurrent(i)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                current === i
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-white text-primary/60 border-border hover:border-primary/40"
              }`}
            >
              {s.product}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-border bg-white p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Image */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <img
                src={spot.image}
                alt={`NECTA ${spot.product}`}
                className="h-44 md:h-60 object-contain"
                style={{ mixBlendMode: "multiply" }}
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-widest uppercase text-primary/50 mb-2">
                NECTA Labs
              </p>
              <h3 className="text-3xl font-bold text-primary mb-1">{spot.product}</h3>
              <p className="text-primary/60 text-sm mb-8">{spot.tagline}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {spot.ingredients.map(({ name, dose, note }) => (
                  <div key={name} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-primary">
                        {name}
                        <span className="ml-1.5 text-xs font-normal bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                          {dose}
                        </span>
                      </p>
                      <p className="text-xs text-primary/50">{note}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href={spot.link}
                className="inline-block bg-primary text-primary-foreground font-semibold px-7 py-3 rounded-md text-sm hover:bg-primary/90 transition-colors"
              >
                Shop {spot.product}
              </Link>
            </div>
          </div>
        </div>

        {/* Arrow nav */}
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={() => setCurrent((c) => (c - 1 + spotlights.length) % spotlights.length)}
            className="w-9 h-9 rounded-full border border-border hover:border-primary flex items-center justify-center text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % spotlights.length)}
            className="w-9 h-9 rounded-full border border-border hover:border-primary flex items-center justify-center text-primary transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default IngredientSpotlightsSection;
