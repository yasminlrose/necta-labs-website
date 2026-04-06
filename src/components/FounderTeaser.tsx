'use client';

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Image from "next/image";
import yasminPortrait from "@/assets/founder-yasmin.jpg";

const FounderTeaser = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-24 md:py-32 bg-muted">
      <div className="necta-container">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Image */}
          <div className={`rounded-2xl overflow-hidden scroll-slide-left ${isVisible ? "visible" : ""}`}>
            <Image
              src={yasminPortrait}
              alt="Yasmin, Founder of NECTA Labs"
              width={600}
              height={520}
              className="w-full h-[400px] md:h-[520px] object-cover"
              loading="lazy"
            />
          </div>

          {/* Text */}
          <div className={`scroll-slide-right ${isVisible ? "visible" : ""}`}>
            <p className="text-sm text-foreground/40 tracking-widest uppercase mb-6">
              Why Necta exists
            </p>
            <blockquote className="text-xl md:text-2xl text-foreground leading-[1.7] mb-8">
              "I was tired of choking down grainy mushroom powders that ruined my oat milk latte. Tired of forgetting to take 12 different pills. Tired of supplements that either tasted like dirt or were dosed too low to actually work.
              <br /><br />
              I wanted adaptogens and nootropics in a liquid format that tastes incredible and actually works. One pump into any drink. Real effective doses. Zero compromise."
            </blockquote>
            <p className="text-sm text-foreground/50 mb-6">
              — Yasmin, Founder
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              Read the full story <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderTeaser;