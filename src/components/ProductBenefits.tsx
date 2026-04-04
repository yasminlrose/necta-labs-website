import { Check, Brain, Shield, Moon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import PumpBottle from "./PumpBottle";

type ProductVariant = "focus" | "immunity" | "calm" | "beauty";

interface ProductBenefitData {
  name: string;
  subtitle: string;
  description: string;
  ingredients: string[];
  bestFor: string;
  icon: typeof Brain;
  bgGradient: string;
}

const productData: Record<ProductVariant, ProductBenefitData> = {
  focus: {
    name: "Focus",
    subtitle: "Lion's Mane Superblend",
    description: "Brain-fog, be-gone! Mental fatigue - never heard of it! This refocusing blend is designed to help you feel stress-free and sharp as a whistle.",
    ingredients: [
      "Lion's Mane 500mg",
      "Rhodiola Rosea 200mg",
      "Ginkgo Biloba 140mg",
      "L-Theanine 80mg",
      "Blueberry Extract 200mg",
      "Panax Ginseng 150mg",
      "Vitamin D3 1000 IU",
      "Bacopa Monnieri 300mg",
    ],
    bestFor: "Staying sharp in meetings, peak productivity, crushing deadlines, being a superhero at work",
    icon: Brain,
    bgGradient: "from-necta-focus/30 to-necta-focus/10",
  },
  immunity: {
    name: "Immunity",
    subtitle: "Reishi Defence Blend",
    description: "Your daily shield against whatever life throws at you. This powerful blend supports your immune system year-round so you can show up every day.",
    ingredients: [
      "Reishi Mushroom 2g",
      "Elderberry Extract 500mg",
      "Ashwagandha 300mg",
      "Vitamin C 200mg",
      "Walnut Leaves 100mg",
      "Rose Hip 200mg",
      "Quercetin 80mg",
    ],
    bestFor: "Fighting off colds, staying healthy year-round, being the one who never calls in sick",
    icon: Shield,
    bgGradient: "from-necta-immunity/30 to-necta-immunity/10",
  },
  calm: {
    name: "Calm",
    subtitle: "Chamomile Serenity Blend",
    description: "Take a breath and let the calm emerge from within. This potent blend wards off stress and helps you find peace on the most chaotic days.",
    ingredients: [
      "Chamomile Extract 150mg",
      "Scarlet Beebalm 120mg",
      "Lemon Balm 150mg",
      "Jujube Seed 200mg",
      "Pine Sponge (Poria) 200mg",
    ],
    bestFor: "Unwinding after a long day, getting restful sleep, finding your zen, staying cool under pressure",
    icon: Moon,
    bgGradient: "from-necta-calm/30 to-necta-calm/10",
  },
  beauty: {
    name: "Beauty",
    subtitle: "Collagen Radiance Blend",
    description: "Glow from the inside out. This luxurious blend nourishes your skin, hair, and nails with premium, bioavailable ingredients for that lit-from-within radiance.",
    ingredients: [
      "Marine Collagen 2500mg",
      "Hyaluronic Acid 120mg",
      "Schisandra 1000mg",
      "Trans-Resveratrol 100mg",
      "CoQ10 80mg",
      "Nicotinamide (B3) 150mg",
      "Pomegranate 250mg",
      "Biotin 5000mcg",
    ],
    bestFor: "Glowing skin that turns heads, healthy luscious hair, ageing like fine wine, looking amazing in photos",
    icon: Sparkles,
    bgGradient: "from-necta-beauty/30 to-necta-beauty/10",
  },
};

const variants: ProductVariant[] = ["focus", "immunity", "calm", "beauty"];

const ProductBenefits = () => {
  return (
    <section id="benefits" className="py-24 bg-background">
      <div className="necta-container">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">
            The Range
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Four blends, infinite benefits
          </h2>
        </div>

        <div className="space-y-24">
          {variants.map((variant, index) => {
            const data = productData[variant];
            const isReversed = index % 2 === 1;
            const Icon = data.icon;

            return (
              <div
                key={variant}
                className={`grid lg:grid-cols-2 gap-12 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Content Side */}
                <div className={`space-y-6 ${isReversed ? 'lg:order-2' : ''}`}>
                  <div>
                    <h3 className="text-3xl font-semibold text-foreground mb-1">
                      {data.name.toLowerCase()}
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      {data.subtitle.toLowerCase()}
                    </p>
                  </div>
                  
                  <p className="text-foreground leading-relaxed">
                    {data.description}
                  </p>

                  <Button 
                    size="lg" 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8"
                  >
                    Shop {data.name}
                  </Button>
                </div>

                {/* Visual Side */}
                <div className={`${isReversed ? 'lg:order-1' : ''}`}>
                  <div className={`bg-gradient-to-br ${data.bgGradient} rounded-3xl p-8 relative`}>
                    <div className="grid grid-cols-2 gap-8 items-center">
                      {/* Bottle & Icon */}
                      <div className="relative flex flex-col items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center">
                          <Icon className="h-7 w-7 text-foreground" />
                        </div>
                        <PumpBottle variant={variant} size="lg" />
                      </div>

                      {/* Ingredients & Best For */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Ingredients</h4>
                          <ul className="space-y-1.5">
                            {data.ingredients.slice(0, 6).map((ingredient, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                                <Check className="h-4 w-4 mt-0.5 text-foreground flex-shrink-0" />
                                <span>{ingredient}</span>
                              </li>
                            ))}
                            {data.ingredients.length > 6 && (
                              <li className="text-sm text-muted-foreground pl-6">
                                +{data.ingredients.length - 6} more
                              </li>
                            )}
                          </ul>
                        </div>
                        
                        <div className="pt-4 border-t border-foreground/10">
                          <h4 className="font-semibold text-foreground mb-2">Best For</h4>
                          <p className="text-sm text-foreground/80">
                            {data.bestFor}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductBenefits;