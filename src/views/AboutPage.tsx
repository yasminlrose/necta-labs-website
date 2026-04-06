'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import founderPhoto from "@/assets/founder-yasmin.jpg";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section
        className="min-h-screen flex items-center py-20 md:py-28"
        style={{
          background: "linear-gradient(135deg, #D6EBEA 0%, #E8E4F4 40%, #F5E0DB 100%)",
        }}
      >
        <div className="necta-container">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center max-w-5xl mx-auto">

            {/* Photo */}
            <div className="flex justify-center md:justify-start order-1 md:order-2">
              <div className="relative">
                <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl">
                  <Image
                    src={founderPhoto}
                    alt="Yasmin, Founder of NECTA Labs"
                    width={384}
                    height={384}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {/* Name badge */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full px-5 py-2.5 shadow-lg whitespace-nowrap">
                  <p className="text-sm font-bold text-foreground">Yasmin</p>
                  <p className="text-xs text-muted-foreground text-center">Founder, NECTA Labs</p>
                </div>
              </div>
            </div>

            {/* Story */}
            <div className="order-2 md:order-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40 mb-5">
                Why NECTA exists
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-snug mb-8">
                Pills, powders, capsules — I condensed 20 supplements into one pump.
              </h1>

              <div className="space-y-5 text-[15px] text-foreground/65 leading-relaxed">
                <p>
                  Powders that made every drink gritty and tasted awful. Pills I'd forget by Wednesday. An entire shelf of supplements that cost as much as rent — and half of them I wasn't even absorbing properly.
                </p>
                <p>
                  I just wanted Lion's Mane in my morning coffee. Reishi in my matcha. Collagen in my smoothie. Without the texture, without the taste, and without the faff of swallowing a handful of capsules every morning.
                </p>
                <p>
                  So I built it. Two pumps. All your supplements. Into any drink — coffee, matcha, smoothie, cocktail, or straight from the bottle when you're on the go. Clinically dosed, 70% organic, and it actually tastes amazing.
                </p>
                <p className="font-semibold text-foreground">
                  That's the whole idea. That's NECTA.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-10">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-primary/90 transition-colors"
                >
                  Try NECTA →
                </Link>
                <Link
                  href="/science"
                  className="inline-flex items-center gap-2 border border-foreground/20 text-foreground font-semibold px-6 py-3 rounded-full text-sm hover:bg-white/50 transition-colors"
                >
                  See the ingredients
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
