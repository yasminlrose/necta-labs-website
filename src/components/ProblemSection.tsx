import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const ProblemSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-24 md:py-32 bg-muted">
      <div className="necta-container">
        <div className={`max-w-3xl mx-auto text-center scroll-fade-in ${isVisible ? "visible" : ""}`}>
          <p className="text-sm text-foreground/40 tracking-widest uppercase mb-6">The problem</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-foreground leading-[1.2] mb-8">
            98 million cups of coffee are consumed daily in the UK — and every infusion is the same
          </h2>
          <p className="text-lg text-foreground/60 leading-relaxed max-w-xl mx-auto">
            Sugar, flavour, nothing functional. Meanwhile, supplements come as pills you forget or powders that taste like dirt. There had to be a better way.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;