import { Pipette, Coffee, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const HowItWorksPreview = () => {
  const { ref, isVisible } = useScrollAnimation();

  const steps = [
    {
      icon: Pipette,
      title: "Choose your blend",
      desc: "Focus, Immunity, Calm or Glow — pick the one that fits your needs.",
      bg: "bg-[hsl(169,28%,92%)]",
    },
    {
      icon: Coffee,
      title: "Add to any drink",
      desc: "Coffee, tea, matcha, smoothies, cocktails — it works in everything.",
      bg: "bg-[hsl(24,55%,93%)]",
    },
    {
      icon: Sparkles,
      title: "Feel the difference",
      desc: "Research-backed ingredients that actually work, not label decoration.",
      bg: "bg-[hsl(260,23%,93%)]",
    },
  ];

  return (
    <section ref={ref} className="py-24 md:py-32 bg-background">
      <div className="necta-container">
        <div className={`text-center mb-16 scroll-fade-in ${isVisible ? "visible" : ""}`}>
          <p className="text-sm text-foreground/40 tracking-widest uppercase mb-4">How it works</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-foreground">
            Three simple steps
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`text-center scroll-fade-in ${isVisible ? "visible" : ""}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className={`w-16 h-16 rounded-full ${step.bg} flex items-center justify-center mx-auto mb-5`}>
                <step.icon className="h-7 w-7 text-foreground/50" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-foreground/50 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksPreview;