import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const comparisons = [
  { ingredient: "Lion's Mane", necta: "2,000mg", others: "50–200mg" },
  { ingredient: "Marine Collagen", necta: "2,500mg", others: "500mg" },
  { ingredient: "Reishi", necta: "1,500mg", others: "100mg" },
  { ingredient: "L-Theanine", necta: "80mg", others: "10–25mg" },
];

const NectaDifference = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-24 md:py-32 bg-background">
      <div className="necta-container">
        <div className={`text-center mb-16 scroll-fade-in ${isVisible ? "visible" : ""}`}>
          <p className="text-sm text-foreground/40 tracking-widest uppercase mb-4">The difference</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Dosed to actually work
          </h2>
          <p className="text-foreground/50 text-lg">Effective doses, not label claims.</p>
        </div>

        <div className={`max-w-3xl mx-auto scroll-fade-in ${isVisible ? "visible" : ""}`}>
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-foreground/10">
            <div className="text-xs text-foreground/40 uppercase tracking-wider">Ingredient</div>
            <div className="text-xs text-foreground uppercase tracking-wider text-center">Necta</div>
            <div className="text-xs text-foreground/40 uppercase tracking-wider text-center">Others</div>
          </div>

          {comparisons.map((row, i) => (
            <div key={i} className="grid grid-cols-3 gap-4 py-5 border-b border-border items-center">
              <div className="text-sm text-foreground">{row.ingredient}</div>
              <div className="text-center">
                <span className="text-lg font-medium text-foreground">{row.necta}</span>
              </div>
              <div className="text-center">
                <span className="text-foreground/30 line-through">{row.others}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NectaDifference;