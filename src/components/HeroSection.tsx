'use client';

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import bottleFocus from "@/assets/bottle-focus.jpeg";
import bottleImmunity from "@/assets/bottle-immunity.jpeg";
import bottleGlow from "@/assets/bottle-glow.jpeg";
import bottleCalm from "@/assets/bottle-calm.jpeg";

const slides = [
  {
    label: "BEST SELLER",
    headline: "Mental clarity,\nwithout the crash.",
    sub: "Lion's Mane · Rhodiola · L-Theanine · Bacopa",
    cta: "Shop FOCUS",
    ctaLink: "/shop/focus",
    image: bottleFocus.src,
    imageAlt: "NECTA FOCUS bottle",
    // Pastel gradient — sage
    gradient: "radial-gradient(ellipse 80% 70% at 60% 50%, #C8E8E5 0%, #E8F6F5 45%, #F5FFFE 100%)",
    accentColor: "#5B9E99",
  },
  {
    label: "BEST FOR CALM",
    headline: "Stress relief,\nnaturally.",
    sub: "Chamomile · Lemon Balm · Jujube Seed · Poria",
    cta: "Shop CALM",
    ctaLink: "/shop/calm",
    image: bottleCalm.src,
    imageAlt: "NECTA CALM bottle",
    // Pastel gradient — lavender
    gradient: "radial-gradient(ellipse 80% 70% at 60% 50%, #CFC7EC 0%, #E8E3F6 45%, #F7F5FE 100%)",
    accentColor: "#8878C0",
  },
  {
    label: "DAILY IMMUNITY",
    headline: "Daily defence,\ninside out.",
    sub: "Reishi · Elderberry · Ashwagandha · Vitamin C",
    cta: "Shop IMMUNITY",
    ctaLink: "/shop/immunity",
    image: bottleImmunity.src,
    imageAlt: "NECTA IMMUNITY bottle",
    // Pastel gradient — peach
    gradient: "radial-gradient(ellipse 80% 70% at 60% 50%, #EAC9BB 0%, #F5E5DC 45%, #FEF7F4 100%)",
    accentColor: "#C06040",
  },
  {
    label: "NEW FORMULA",
    headline: "Radiant skin,\nfrom the inside.",
    sub: "Marine Collagen · Hyaluronic Acid · CoQ10 · Fisetin",
    cta: "Shop GLOW",
    ctaLink: "/shop/glow",
    image: bottleGlow.src,
    imageAlt: "NECTA GLOW bottle",
    // Pastel gradient — warm rose
    gradient: "radial-gradient(ellipse 80% 70% at 60% 50%, #E8C4BD 0%, #F5DDD9 45%, #FEF6F5 100%)",
    accentColor: "#B06455",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => advance((current + 1) % slides.length), 5500);
    return () => clearInterval(timer);
  }, [current]);

  const advance = (idx: number) => {
    if (fading || idx === current) return;
    setFading(true);
    setTimeout(() => { setCurrent(idx); setFading(false); }, 350);
  };

  const prev = () => advance((current - 1 + slides.length) % slides.length);
  const next = () => advance((current + 1) % slides.length);

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden transition-all duration-700"
      style={{
        background: slide.gradient,
        minHeight: "calc(100vh - 105px)",
      }}
    >
      <div
        className={`necta-container py-16 md:py-24 flex flex-col md:flex-row items-center gap-10 md:gap-16 transition-opacity duration-350 ${fading ? "opacity-0" : "opacity-100"}`}
      >
        {/* Text side */}
        <div className="flex-1">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-5 px-3 py-1.5 rounded-full border"
            style={{ borderColor: slide.accentColor + "60", color: slide.accentColor, background: slide.accentColor + "12" }}
          >
            {slide.label}
          </span>
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 tracking-tight text-primary"
            style={{ whiteSpace: "pre-line" }}
          >
            {slide.headline}
          </h1>
          <p className="text-primary/50 text-sm mb-8 font-medium tracking-wide">
            {slide.sub}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={slide.ctaLink}
              className="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-md text-sm hover:bg-primary/90 transition-colors"
            >
              {slide.cta}
            </Link>
            <Link
              href="/shop"
              className="inline-block border border-primary/25 text-primary font-medium px-8 py-3.5 rounded-md text-sm hover:border-primary/50 transition-colors"
            >
              View All
            </Link>
          </div>

          {/* Dots */}
          <div className="flex gap-2 mt-12">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => advance(i)}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "2rem" : "0.5rem",
                  background: i === current ? slide.accentColor : slide.accentColor + "30",
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Image side */}
        <div className="flex-1 flex justify-center items-end">
          <img
            src={slide.image}
            alt={slide.imageAlt}
            className="w-52 md:w-68 lg:w-80 object-contain drop-shadow-xl"
            style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.12))" }}
          />
        </div>
      </div>

      {/* Arrow controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center text-primary transition-colors shadow-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center text-primary transition-colors shadow-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </section>
  );
};

export default HeroSection;
