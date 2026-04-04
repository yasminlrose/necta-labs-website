import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ProductData } from "@/data/products";

interface ProductFAQProps {
  product: ProductData;
}

// SKU accent colours for left border and arrow
const skuAccent: Record<string, string> = {
  focus: "#7BADA8",
  immunity: "#D4785A",
  calm: "#A89BC8",
  glow: "#C9897A",
};

const allFAQs: { question: string; answer: string }[] = [
  {
    question: "How quickly will I feel the effects?",
    answer:
      "Most customers notice a difference within 7–14 days of consistent daily use. Adaptogens and nootropics work cumulatively — unlike stimulants, they support your body's natural systems over time. Some ingredients like L-Theanine can produce a sense of calm focus within 30–60 minutes of a single dose.",
  },
  {
    question: "Can I add it to hot drinks?",
    answer:
      "Yes. All Necta infusions are formulated for full stability in hot and cold beverages. Add to coffee, tea, matcha, or any drink at any temperature.",
  },
  {
    question: "Is it safe to take every day?",
    answer:
      "Yes. All ingredients are used at doses consistent with long-term safety profiles in peer-reviewed literature. We recommend one pump (15ml) per day. Always consult a healthcare professional if you are pregnant, breastfeeding, or taking medication.",
  },
  {
    question: "What's the difference between the bottle and the sachets?",
    answer:
      "Both deliver the same dose of active ingredients. The 250ml and 500ml pump bottles are ideal for home or cafe use. The 15ml sachets are individually portioned — perfect for work, travel, or the gym. Sachets are available on subscription only.",
  },
  {
    question: "Is Necta suitable for vegans?",
    answer:
      "FOCUS, IMMUNITY, and CALM are fully vegan. GLOW contains Marine Collagen (fish-derived) and is therefore not vegan — we'll be launching a plant-based collagen alternative in Phase 2.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Absolutely, anytime with no penalty. Manage via your account dashboard or email us and we'll sort it within 24 hours. You can also pause, skip a delivery, or change your frequency at any time.",
  },
  {
    question: 'What does "clinically dosed" mean?',
    answer:
      "Every active ingredient is included at a dose matching or exceeding the amounts used in peer-reviewed clinical trials showing efficacy. We never add ingredients in trace amounts purely for marketing.",
  },
  {
    question: "Is Necta organic?",
    answer:
      'Made with 70%+ organic ingredients by weight, qualifying as "made with organic ingredients" under Soil Association Organic Standards. We are pursuing full Soil Association certification.',
  },
];

const ProductFAQ = ({ product }: ProductFAQProps) => {
  const accent = skuAccent[product.slug] || skuAccent.focus;

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="necta-container">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-3">
            Questions about {product.name}
          </h2>
          <p className="text-center text-foreground/55 text-sm mb-10">
            Everything you need to know before you try it.
          </p>

          <Accordion type="single" collapsible className="space-y-3">
            {allFAQs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-0 rounded-xl bg-muted/40 px-5 md:px-6 transition-all data-[state=open]:border-l-[3px]"
                style={{
                  borderLeftColor: "transparent",
                }}
                ref={(el) => {
                  if (el) {
                    const observer = new MutationObserver(() => {
                      const state = el.getAttribute("data-state");
                      el.style.borderLeftColor = state === "open" ? accent : "transparent";
                    });
                    observer.observe(el, { attributes: true, attributeFilter: ["data-state"] });
                    // Set initial
                    const state = el.getAttribute("data-state");
                    el.style.borderLeftColor = state === "open" ? accent : "transparent";
                  }
                }}
              >
                <AccordionTrigger
                  className={`hover:no-underline py-5 text-left text-base font-medium text-foreground`}
                  style={{ ["--chevron-color" as string]: accent }}
                >
                  <span className="flex-1 pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/55 text-sm leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default ProductFAQ;
