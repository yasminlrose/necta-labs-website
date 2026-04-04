import { useState } from "react";

type SyrupType = "focus" | "immunity" | "calm" | "beauty";

interface Ingredient {
  name: string;
  dose: string;
  benefit: string;
  imageUrl: string;
}

const ingredientsByType: Record<SyrupType, { ingredients: Ingredient[]; color: string; bgColor: string }> = {
  focus: {
    color: "text-necta-focus",
    bgColor: "bg-necta-focus",
    ingredients: [
      {
        name: "Lion's Mane",
        dose: "500mg",
        benefit: "Supports brain health, memory, and focus by promoting nerve growth and cognitive resilience",
        imageUrl: "https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=300&h=300&fit=crop",
      },
      {
        name: "Rhodiola Rosea",
        dose: "200mg",
        benefit: "An adaptogen that improves mental stamina, stress resilience, and fatigue resistance",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop",
      },
      {
        name: "Ginkgo Biloba",
        dose: "140mg",
        benefit: "Enhances circulation to the brain to support memory, focus, and cognitive clarity",
        imageUrl: "https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?w=300&h=300&fit=crop",
      },
      {
        name: "L-Theanine",
        dose: "80mg",
        benefit: "Promotes calm, focused alertness by reducing mental stress without drowsiness",
        imageUrl: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=300&h=300&fit=crop",
      },
      {
        name: "Blueberry Extract",
        dose: "200mg",
        benefit: "Rich in anthocyanins for cognitive, vascular, and eye/skin support",
        imageUrl: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=300&h=300&fit=crop",
      },
      {
        name: "Panax Ginseng",
        dose: "150mg",
        benefit: "Boosts stamina, mental performance, and immune function",
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop",
      },
      {
        name: "Vitamin D3",
        dose: "1000 IU",
        benefit: "Supports cognitive function, mood, neuroprotection, and general wellness",
        imageUrl: "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=300&h=300&fit=crop",
      },
      {
        name: "Bacopa Monnieri",
        dose: "300mg",
        benefit: "Enhances memory, learning, and recall while reducing mental fatigue",
        imageUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=300&h=300&fit=crop",
      },
    ],
  },
  immunity: {
    color: "text-necta-immunity",
    bgColor: "bg-necta-immunity",
    ingredients: [
      {
        name: "Reishi Mushroom",
        dose: "2g",
        benefit: "An immune-modulating adaptogenic mushroom for stress balance and longevity",
        imageUrl: "https://images.unsplash.com/photo-1622653902334-2a18f81b5eab?w=300&h=300&fit=crop",
      },
      {
        name: "Elderberry Extract",
        dose: "500mg",
        benefit: "Supports immune defenses and antioxidant protection during physical stress",
        imageUrl: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=300&h=300&fit=crop",
      },
      {
        name: "Ashwagandha",
        dose: "300mg",
        benefit: "Reduces stress and cortisol while supporting mood and cognitive performance",
        imageUrl: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=300&h=300&fit=crop",
      },
      {
        name: "Vitamin C",
        dose: "200mg",
        benefit: "Essential for immune defense, collagen production, and antioxidant protection",
        imageUrl: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=300&h=300&fit=crop",
      },
      {
        name: "Walnut Leaves",
        dose: "100mg",
        benefit: "Antimicrobial and anti-parasitic activity for gut cleansing and immune reinforcement",
        imageUrl: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=300&h=300&fit=crop",
      },
      {
        name: "Rose Hip",
        dose: "200mg",
        benefit: "Very high in vitamin C and polyphenols for immune strength and brightening",
        imageUrl: "https://images.unsplash.com/photo-1569488648952-448eb4f5da96?w=300&h=300&fit=crop",
      },
      {
        name: "Quercetin",
        dose: "80mg",
        benefit: "Senolytic, mast cell stabilizer, and anti-inflammatory for immune support",
        imageUrl: "https://images.unsplash.com/photo-1568702846914-96b305d2aaaf?w=300&h=300&fit=crop",
      },
    ],
  },
  calm: {
    color: "text-necta-calm",
    bgColor: "bg-necta-calm",
    ingredients: [
      {
        name: "Chamomile Extract",
        dose: "150mg",
        benefit: "Promotes relaxation, calm mood, and gentle digestive comfort",
        imageUrl: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=300&h=300&fit=crop",
      },
      {
        name: "Scarlet Beebalm",
        dose: "120mg",
        benefit: "Supports calm, immune balance, and microbial defense with anti-inflammatory properties",
        imageUrl: "https://images.unsplash.com/photo-1597826368522-9f4cb5a6ba48?w=300&h=300&fit=crop",
      },
      {
        name: "Lemon Balm",
        dose: "150mg",
        benefit: "Reduces anxiety and nervous tension while supporting digestion and sleep quality",
        imageUrl: "https://images.unsplash.com/photo-1585015509498-42dd5edf5e7c?w=300&h=300&fit=crop",
      },
      {
        name: "Jujube Seed",
        dose: "200mg",
        benefit: "Supports deep relaxation and restorative sleep while aiding overnight skin repair",
        imageUrl: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=300&h=300&fit=crop",
      },
      {
        name: "Pine Sponge (Poria)",
        dose: "200mg",
        benefit: "Reduces fluid retention, calms the nervous system, and supports clear, de-puffed skin",
        imageUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300&h=300&fit=crop",
      },
    ],
  },
  beauty: {
    color: "text-necta-beauty",
    bgColor: "bg-necta-beauty",
    ingredients: [
      {
        name: "Marine Collagen",
        dose: "2500mg",
        benefit: "Bioavailable peptides for skin firmness, elasticity, hair, nails, and joint health",
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=300&fit=crop",
      },
      {
        name: "Hyaluronic Acid",
        dose: "120mg",
        benefit: "Supports skin hydration, plumpness, and joint lubrication from within",
        imageUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=300&h=300&fit=crop",
      },
      {
        name: "Schisandra",
        dose: "1000mg",
        benefit: "Premium adaptogen for mental clarity, liver detox, skin brightness, and stress resistance",
        imageUrl: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=300&h=300&fit=crop",
      },
      {
        name: "Trans-Resveratrol",
        dose: "100mg",
        benefit: "Potent antioxidant for healthy aging, cellular protection, and skin vitality",
        imageUrl: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=300&h=300&fit=crop",
      },
      {
        name: "CoQ10",
        dose: "80mg",
        benefit: "Supports mitochondrial energy production, heart health, and skin appearance",
        imageUrl: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=300&h=300&fit=crop",
      },
      {
        name: "Nicotinamide (B3)",
        dose: "150mg",
        benefit: "Supports NAD⁺ production for cellular energy, DNA repair, and skin renewal",
        imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop",
      },
      {
        name: "Fisetin",
        dose: "50mg",
        benefit: "Senolytic and neuroprotective compound for cellular rejuvenation",
        imageUrl: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=300&h=300&fit=crop",
      },
      {
        name: "Juniper Berries",
        dose: "80mg",
        benefit: "Supports lymphatic drainage, reduces bloating, and promotes clearer skin",
        imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop",
      },
      {
        name: "Pomegranate Extract",
        dose: "250mg",
        benefit: "Rich in polyphenols for skin elasticity, vascular health, and anti-aging",
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop",
      },
      {
        name: "Moringa",
        dose: "500mg",
        benefit: "Rich in Vitamin A for skin renewal, cellular turnover, and antioxidant protection",
        imageUrl: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=300&h=300&fit=crop",
      },
      {
        name: "Biotin (B7)",
        dose: "5000mcg",
        benefit: "Supports healthy hair, skin, nails, and energy metabolism",
        imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop",
      },
    ],
  },
};

const syrupTypes: { id: SyrupType; label: string }[] = [
  { id: "focus", label: "Focus" },
  { id: "immunity", label: "Immunity" },
  { id: "calm", label: "Calm" },
  { id: "beauty", label: "Beauty" },
];

const Ingredients = () => {
  const [activeType, setActiveType] = useState<SyrupType>("focus");
  const currentData = ingredientsByType[activeType];

  return (
    <section id="ingredients" className="py-24 bg-background relative overflow-hidden">
      <div className="necta-container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">
            Traceable Ingredients
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Know exactly what's inside
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each ingredient is carefully selected for its proven benefits. 
            No fillers, no artificial additives — just pure, functional botanicals.
          </p>
        </div>

        {/* Infusion Type Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex gap-2 p-1.5 bg-muted rounded-full">
            {syrupTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeType === type.id
                    ? `${ingredientsByType[type.id].bgColor} text-foreground shadow-sm`
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredients Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentData.ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="group relative bg-card p-4 rounded-2xl border border-border hover:border-accent/40 transition-all duration-300 hover:shadow-md ingredient-card"
            >
              {/* Ingredient Image */}
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 bg-muted">
                <img
                  src={ingredient.imageUrl}
                  alt={ingredient.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              
              {/* Dose Badge */}
              <span className={`inline-block text-xs font-medium ${currentData.color} bg-muted px-2 py-1 rounded-full mb-2`}>
                {ingredient.dose}
              </span>
              
              {/* Content */}
              <h3 className="text-base font-semibold text-foreground mb-1">
                {ingredient.name}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {ingredient.benefit}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom highlight */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card rounded-full border border-border shadow-sm">
            <span className="text-sm font-medium text-foreground">
              1 serving = 2 pumps (15ml) • Clinically Studied • Bioavailable Forms
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ingredients;