'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <section
      className="pt-32 pb-24 md:pt-44 md:pb-36 relative overflow-hidden"
      style={{
        background: "linear-gradient(to right, #B8DDD8 0%, #F2C4A8 35%, #C8C0DF 65%, #F0DEDA 100%)",
      }}
    >
      <div className="necta-container relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-foreground leading-[1.15] mb-8">
            Your daily drinks. Upgraded.
          </h1>

          <p className="text-lg md:text-xl text-foreground/55 max-w-xl mx-auto mb-12 leading-relaxed">
            Functional infusions with adaptogens, nootropics and botanicals. One pump into any drink. Research-backed doses. Tastes incredible.
          </p>

          <Button asChild size="lg">
            <Link href="/waitlist">Join the Waitlist</Link>
          </Button>

          <p className="text-sm text-foreground/35 mt-6">
            Launching Summer 2026 · Free UK delivery on subscriptions
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;