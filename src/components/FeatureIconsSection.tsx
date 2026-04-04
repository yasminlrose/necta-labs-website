import { FlaskConical, Leaf, Zap, ShieldCheck } from "lucide-react";

const features = [
  {
    Icon: FlaskConical,
    title: "Clinically Dosed",
    desc: "Every ingredient at the exact dose used in published clinical trials — no fairy-dusting.",
  },
  {
    Icon: Zap,
    title: "Uniquely Delicious",
    desc: "Flavours engineered to elevate your coffee, tea, or smoothie. Wellness that actually tastes good.",
  },
  {
    Icon: Leaf,
    title: "Whole Botanicals",
    desc: "100% natural, vegan, and gluten-free. No artificial sweeteners, colours, or preservatives.",
  },
  {
    Icon: ShieldCheck,
    title: "Third-Party Tested",
    desc: "Every batch independently lab-verified for potency, purity, and safety before it reaches you.",
  },
];

const FeatureIconsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-cream">
      <div className="necta-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {features.map(({ Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-primary text-base mb-1.5">{title}</h3>
                <p className="text-sm text-primary/60 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureIconsSection;
