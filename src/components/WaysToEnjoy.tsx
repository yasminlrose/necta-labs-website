import { Coffee, Wine, Droplets, GlassWater, Sparkles } from "lucide-react";

const ways = [
  {
    icon: Coffee,
    title: "Coffee",
    description: "Add a pump to your morning brew for functional benefits without changing the taste.",
  },
  {
    icon: Droplets,
    title: "Tea",
    description: "Blend seamlessly into your favourite tea, hot or iced.",
  },
  {
    icon: Wine,
    title: "Cocktails",
    description: "Elevate your evening drinks with a functional twist.",
  },
  {
    icon: GlassWater,
    title: "Water",
    description: "The purest way to enjoy — simply add to still or sparkling water.",
  },
  {
    icon: Sparkles,
    title: "Alone",
    description: "Take it straight for a concentrated dose of goodness.",
  },
];

const WaysToEnjoy = () => {
  return (
    <section className="py-24 bg-background">
      <div className="necta-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
            Versatile & Delicious
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
            Add it to anything
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One pump, endless possibilities. Our infusions blend seamlessly into your daily rituals.
          </p>
        </div>

        {/* Ways Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
          {ways.map((way, index) => (
            <div key={index} className="text-center group">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4 mx-auto">
                <div className="absolute inset-0 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300" />
                <way.icon className="h-8 w-8 text-primary relative z-10" />
              </div>
              <h3 className="text-base font-medium text-foreground mb-1">
                {way.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed hidden md:block">
                {way.description}
              </p>
            </div>
          ))}
        </div>

        {/* Visual Banner */}
        <div className="mt-16 bg-card rounded-2xl p-8 md:p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
              No added sugar. No artificial flavours.
            </h3>
            <p className="text-muted-foreground mb-6">
              Just clean, functional ingredients that complement your drinks without overpowering them.
              Subtle honey-like sweetness from natural sources.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-4 py-2 bg-background rounded-full">Vegan</span>
              <span className="px-4 py-2 bg-background rounded-full">Gluten-Free</span>
              <span className="px-4 py-2 bg-background rounded-full">Non-GMO</span>
              <span className="px-4 py-2 bg-background rounded-full">Made in UK</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaysToEnjoy;