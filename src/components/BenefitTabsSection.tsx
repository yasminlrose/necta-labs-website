'use client';

import Image from "next/image";
import { useState } from "react";
import { Brain, Moon, Check } from "lucide-react";
import Link from "next/link";
import bottleFocus from "@/assets/bottle-focus.jpeg";
import bottleCalm from "@/assets/bottle-calm.jpeg";

const tabs = [
  {
    id: "performance",
    label: "Mental Performance",
    icon: Brain,
    headline: "Stay sharp, all day.",
    sub: "FOCUS & IMMUNITY infusions are designed to support cognitive performance, stress resilience, and immune defence — every single day.",
    benefits: [
      "Enhanced concentration and working memory",
      "Reduced mental fatigue and brain fog",
      "Stress resilience under pressure",
      "Immune system support",
    ],
    cta: "Shop FOCUS",
    ctaLink: "/shop/focus",
    image: bottleFocus.src,
    imgAlt: "NECTA FOCUS",
    bgColor: "bg-[#D6EBEA]",
  },
  {
    id: "sleep",
    label: "Stress & Sleep",
    icon: Moon,
    headline: "Unwind. Recover. Restore.",
    sub: "CALM infusion supports your nervous system to ease daily stress, improve sleep quality, and wake up feeling restored — naturally.",
    benefits: [
      "Reduced anxiety and nervous tension",
      "Deeper, more restorative sleep",
      "Calm focus during the day",
      "No drowsiness or morning grogginess",
    ],
    cta: "Shop CALM",
    ctaLink: "/shop/calm",
    image: bottleCalm.src,
    imgAlt: "NECTA CALM",
    bgColor: "bg-[#E0DAEF]",
  },
];

const BenefitTabsSection = () => {
  const [activeId, setActiveId] = useState(tabs[0].id);
  const tab = tabs.find((t) => t.id === activeId)!;

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="necta-container">
        {/* Tab selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-muted rounded-lg p-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveId(id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                  activeId === id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-primary/60 hover:text-primary"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Text side */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 leading-tight">
              {tab.headline}
            </h2>
            <p className="text-primary/60 text-base mb-8 leading-relaxed">{tab.sub}</p>
            <ul className="space-y-3 mb-8">
              {tab.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                  <span className="text-sm text-primary/80">{b}</span>
                </li>
              ))}
            </ul>
            <Link
              href={tab.ctaLink}
              className="inline-block bg-primary text-primary-foreground font-semibold px-7 py-3 rounded-md text-sm hover:bg-primary/90 transition-colors"
            >
              {tab.cta}
            </Link>
          </div>

          {/* Image side */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center justify-center w-full max-w-sm aspect-square">
              <Image
                src={tab.image}
                alt={tab.imgAlt}
                width={256}
                height={256}
                className="h-64 object-contain"
                style={{ mixBlendMode: "multiply" }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitTabsSection;
