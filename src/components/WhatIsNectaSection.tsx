const drinks = [
  { emoji: "☕", label: "Coffee" },
  { emoji: "🍵", label: "Tea" },
  { emoji: "🥛", label: "Oat Milk Latte" },
  { emoji: "🍵", label: "Matcha" },
  { emoji: "🥤", label: "Smoothie" },
  { emoji: "🍹", label: "Cocktails" },
  { emoji: "💧", label: "Water" },
  { emoji: "💪", label: "Protein Shake" },
];

const WhatIsNectaSection = () => {
  return (
    <section
      className="py-20 md:py-28 text-center"
      style={{
        background: [
          "radial-gradient(ellipse 80% 70% at 10% 30%, #FAD4C0 0%, transparent 55%)",
          "radial-gradient(ellipse 60% 60% at 90% 15%, #C4D9F5 0%, transparent 50%)",
          "radial-gradient(ellipse 55% 65% at 85% 85%, #C8E8C0 0%, transparent 50%)",
          "radial-gradient(ellipse 50% 50% at 20% 80%, #E8D0EE 0%, transparent 50%)",
          "radial-gradient(ellipse 40% 40% at 55% 50%, #F5E8C0 0%, transparent 60%)",
          "#fdfcfa",
        ].join(", "),
      }}
    >
      <div className="necta-container max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/35 mb-5">
          What is NECTA
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary leading-[1.08] tracking-tight mb-5">
          Organic, functional
          <br /> liquid infusions
          <br /> for any drink.
        </h2>
        <p className="text-base md:text-lg text-primary/50 font-light mb-10 max-w-sm mx-auto leading-relaxed">
          One pump into whatever you're already drinking.
          <br />Your daily ritual, upgraded.
        </p>

        {/* Drinks strip */}
        <div className="flex flex-wrap justify-center gap-2.5 md:gap-3">
          {drinks.map((drink) => (
            <span
              key={drink.label}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/15 bg-white/70 backdrop-blur-sm text-sm font-medium text-primary/70 hover:border-primary/35 hover:text-primary transition-colors"
            >
              <span className="text-base">{drink.emoji}</span>
              {drink.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIsNectaSection;
