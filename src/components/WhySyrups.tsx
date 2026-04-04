import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const WhySyrups = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-24 md:py-32 bg-background">
      <div className="necta-container">
        <div className={`grid md:grid-cols-2 gap-12 md:gap-16 items-center scroll-fade-in ${isVisible ? "visible" : ""}`}>
          {/* Text */}
          <div>
            <p className="text-sm text-foreground/40 tracking-widest uppercase mb-4">The format</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-foreground mb-8">
              Why a liquid infusion?
            </h2>
            <p className="text-lg text-foreground/55 leading-[1.8]">
              You already add flavour to your drinks — vanilla in your latte, honey in your tea, cordial in your cocktail. We just made that pump functional.
            </p>
            <p className="text-lg text-foreground/55 leading-[1.8] mt-6">
              No powders. No pills. No grainy textures. One pump, effectively dosed, into whatever you're already drinking.
            </p>
          </div>

          {/* Pastel gradient block */}
          <div
            className="rounded-2xl h-[320px] md:h-[400px]"
            style={{
              background: "linear-gradient(145deg, #B8DDD8 0%, #C8C0DF 50%, #F0DEDA 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default WhySyrups;