'use client';

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Image from "next/image";
import bottleFocus from "@/assets/bottle-focus.jpeg";
import sachetFocus from "@/assets/sachet-focus.png";

const HowItWorksPage = () => {
  const hero = useScrollAnimation();
  const formats = useScrollAnimation();
  const ritual = useScrollAnimation();
  const philosophy = useScrollAnimation();
  const cta = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section
        ref={hero.ref}
        className="pt-32 pb-20 md:pt-44 md:pb-28"
        style={{
          background: "linear-gradient(135deg, #B8DDD8 0%, #F2C4A8 50%, #C8C0DF 100%)",
        }}
      >
        <div className="necta-container text-center">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.15] mb-4 scroll-fade-in ${hero.isVisible ? "visible" : ""}`}>
            Wellness that fits your ritual
          </h1>
          <p className={`text-lg text-foreground/55 max-w-3xl mx-auto scroll-fade-in ${hero.isVisible ? "visible" : ""}`}>
            No mixing. No mess. Just add to what you're already drinking.
          </p>
        </div>
      </section>

      {/* Two Formats */}
      <section ref={formats.ref} className="py-24 md:py-32 bg-background">
        <div className="necta-container">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Pump Bottles */}
            <div className={`bg-muted rounded-2xl p-8 md:p-10 scroll-fade-in ${formats.isVisible ? "visible" : ""}`}>
              <div className="flex justify-center mb-6">
                <Image src={bottleFocus} alt="Pump bottle" width={192} height={192} loading="lazy" className="h-48 w-auto object-contain" />
              </div>
              <p className="text-xs text-foreground/40 tracking-widest uppercase mb-2">For home & cafe use</p>
              <h2 className="text-2xl font-medium text-foreground mb-4">Pump bottles</h2>
              <ul className="space-y-2 text-sm text-foreground/55 mb-6">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-foreground/40 mt-0.5 shrink-0" />One pump = 7.5ml. Two pumps = perfect dose.</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-foreground/40 mt-0.5 shrink-0" />250ml (17 servings) or 500ml (33 servings)</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-foreground/40 mt-0.5 shrink-0" />From £25/mo on subscription</li>
              </ul>
              <Link href="/shop">
                <Button className="w-full">Shop Bottles</Button>
              </Link>
            </div>

            {/* Sachets */}
            <div className={`bg-muted rounded-2xl p-8 md:p-10 scroll-fade-in ${formats.isVisible ? "visible" : ""}`} style={{ transitionDelay: "100ms" }}>
              <div className="flex justify-center mb-6">
                <Image src={sachetFocus} alt="Sachet" width={192} height={192} loading="lazy" className="h-48 w-auto object-contain" />
              </div>
              <p className="text-xs text-foreground/40 tracking-widest uppercase mb-2">For on-the-go</p>
              <h2 className="text-2xl font-medium text-foreground mb-4">Sachets</h2>
              <ul className="space-y-2 text-sm text-foreground/55 mb-6">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-foreground/40 mt-0.5 shrink-0" />15ml single-serve sachets</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-foreground/40 mt-0.5 shrink-0" />Tear, pour, done. Perfect for travel, office, gym.</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-foreground/40 mt-0.5 shrink-0" />7, 14, 30, or 90-day boxes from £12</li>
              </ul>
              <Link href="/shop">
                <Button className="w-full">Shop Sachets</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Ritual */}
      <section ref={ritual.ref} className="py-20 md:py-28 bg-muted">
        <div className="necta-container text-center">
          <h2 className={`text-3xl md:text-4xl text-foreground mb-8 scroll-fade-in ${ritual.isVisible ? "visible" : ""}`}>
            Your morning coffee, now working for you
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {["Fits your routine", "No new habits", "Real results"].map((pill) => (
              <span key={pill} className="bg-background text-foreground/60 px-5 py-2.5 rounded-full text-sm">
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Dosing Comparison */}
      <section ref={philosophy.ref} className="py-24 md:py-32 bg-background">
        <div className="necta-container">
          <div className={`max-w-4xl mx-auto text-center mb-12 scroll-fade-in ${philosophy.isVisible ? "visible" : ""}`}>
            <p className="text-sm text-foreground/40 tracking-widest uppercase mb-4">The difference</p>
            <h2 className="text-3xl md:text-4xl text-foreground mb-4">
              Dosed to actually work
            </h2>
            <p className="text-foreground/50 text-lg">
              Every ingredient is at or above the amounts used in published clinical trials.
            </p>
          </div>

          <div className={`max-w-3xl mx-auto scroll-fade-in ${philosophy.isVisible ? "visible" : ""}`}>
            <div className="grid grid-cols-3 gap-4 pb-4 border-b border-foreground/10">
              <span className="text-xs text-foreground/40 uppercase tracking-wider">Ingredient</span>
              <span className="text-xs text-foreground uppercase tracking-wider text-center">Necta</span>
              <span className="text-xs text-foreground/40 uppercase tracking-wider text-center">Others</span>
            </div>
            {[
              { ingredient: "Lion's Mane", necta: "2,000mg", other: "50–200mg" },
              { ingredient: "Marine Collagen", necta: "2,500mg", other: "500mg" },
              { ingredient: "Reishi", necta: "1,500mg", other: "100–300mg" },
              { ingredient: "L-Theanine", necta: "80mg", other: "10–25mg" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 gap-4 py-5 border-b border-border items-center">
                <span className="text-sm text-foreground">{row.ingredient}</span>
                <span className="text-lg font-medium text-foreground text-center">{row.necta}</span>
                <span className="text-foreground/30 line-through text-center">{row.other}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={cta.ref} className="py-24 md:py-32 bg-muted text-center">
        <div className="necta-container">
          <h2 className={`text-3xl md:text-4xl text-foreground mb-4 scroll-fade-in ${cta.isVisible ? "visible" : ""}`}>
            Ready to upgrade your drinks?
          </h2>
          <p className={`text-foreground/50 mb-8 scroll-fade-in ${cta.isVisible ? "visible" : ""}`}>
            Join the waitlist for early access and 20% off.
          </p>
          <Link href="/waitlist">
            <Button size="lg">Join the Waitlist</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;