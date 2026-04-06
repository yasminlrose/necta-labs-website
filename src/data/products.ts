export type ProductSlug = "focus" | "immunity" | "calm" | "glow";

export interface Ingredient {
  name: string;
  dose: string;
  benefit: string;
}

export interface Study {
  title: string;
  authors: string;
  year: string;
  journal: string;
  finding: string;
  link?: string;
}

export interface ProductData {
  slug: ProductSlug;
  name: string;
  tagline: string;
  flavor: string;
  flavorNotes: string;
  heroIngredientsSummary: string;
  rating: number;
  reviewCount: number;
  /** D2C retail pricing */
  price250: number;       // one-off
  price500: number;       // one-off
  price250Sub: number;    // subscription (save £4/mo)
  price500Sub: number;    // subscription (save £7/mo)
  sachets: Record<7 | 14 | 30 | 90, number>;
  ingredients: Ingredient[];
  studies: Study[];
  perfectFor: string[];
  bestFor: string;
  faq: { question: string; answer: string }[];
  bottleImage: string;
  sachetImage: string;
  bgColorClass: string;
  textColorClass: string;
  borderColorClass: string;
}

import bottleFocus from "@/assets/bottle-focus.jpeg";
import bottleImmunity from "@/assets/bottle-immunity.jpeg";
import bottleCalm from "@/assets/bottle-calm.jpeg";
import bottleGlow from "@/assets/bottle-glow.jpeg";
import sachetFocus from "@/assets/sachet-focus.png";
import sachetImmunity from "@/assets/sachet-immunity.png";
import sachetCalm from "@/assets/sachet-calm.png";
import sachetGlow from "@/assets/sachet-beauty.png";

const SACHET_PRICES = { 7: 12, 14: 22, 30: 45, 90: 120 } as const;

export const products: Record<ProductSlug, ProductData> = {
  focus: {
    slug: "focus",
    name: "FOCUS",
    tagline: "Mental clarity without the crash",
    flavor: "Vanilla Bean",
    flavorNotes: "Rich vanilla with subtle earthy undertones",
    heroIngredientsSummary: "Lion's Mane 500mg • L-Theanine 80mg • Rhodiola 200mg",
    rating: 4.8,
    reviewCount: 127,
    price250: 29,
    price500: 39,
    price250Sub: 25,
    price500Sub: 32,
    sachets: SACHET_PRICES,
    ingredients: [
      { name: "Lion's Mane", dose: "500mg", benefit: "Supports brain health, memory, and focus by promoting nerve growth." },
      { name: "Rhodiola Rosea", dose: "200mg", benefit: "Improves mental stamina and stress resilience under pressure." },
      { name: "Ginkgo Biloba", dose: "140mg", benefit: "Enhances circulation to the brain for memory and cognitive clarity." },
      { name: "L-Theanine", dose: "80mg", benefit: "Promotes calm, focused alertness without drowsiness." },
      { name: "Blueberry Extract", dose: "200mg", benefit: "Rich in anthocyanins for cognitive and vascular support." },
      { name: "Panax Ginseng", dose: "150mg", benefit: "Boosts stamina, mental performance, and immune function." },
      { name: "Vitamin D3", dose: "1000 IU", benefit: "Supports cognitive function, mood, and neuroprotection." },
      { name: "Bacopa Monnieri", dose: "300mg", benefit: "Enhances memory, learning, and recall." },
    ],
    studies: [
      { title: "Improving effects of the mushroom Yamabushitake on mild cognitive impairment", authors: "Mori, K. et al.", year: "2009", journal: "Phytotherapy Research", finding: "Lion's Mane improved cognitive function in adults with mild cognitive impairment over 16 weeks.", link: "#" },
      { title: "L-Theanine and Caffeine in Combination Affect Human Cognition", authors: "Nobre, A.C. et al.", year: "2008", journal: "Nutritional Neuroscience", finding: "L-Theanine enhanced attention and focus when combined with caffeine in controlled trials." },
      { title: "Chronic Effects of Brahmi on Human Memory", authors: "Roodenrys, S. et al.", year: "2002", journal: "Neuropsychopharmacology", finding: "Bacopa Monnieri significantly improved speed of information processing and memory consolidation." },
    ],
    perfectFor: ["Morning coffee", "Midday matcha", "Pre-work ritual", "Study sessions"],
    bestFor: "Staying sharp in meetings, peak productivity, crushing deadlines",
    faq: [
      { question: "How long until I feel results?", answer: "Many users notice improved focus within 30-60 minutes. For full adaptogenic benefits, consistent use over 2-4 weeks is recommended." },
      { question: "What does it taste like?", answer: "Rich vanilla with subtle earthy undertones. Designed to complement coffee and tea." },
      { question: "Can I take multiple infusions?", answer: "Yes! Our infusions are designed to be used individually or combined." },
    ],
    bottleImage: bottleFocus.src,
    sachetImage: sachetFocus.src,
    bgColorClass: "bg-necta-focus",
    textColorClass: "text-necta-focus",
    borderColorClass: "border-necta-focus",
  },

  immunity: {
    slug: "immunity",
    name: "IMMUNITY",
    tagline: "Daily immune defence and resilience",
    flavor: "Hazelnut & Orange",
    flavorNotes: "Creamy hazelnut with bright citrus",
    heroIngredientsSummary: "Reishi 2g • Elderberry 500mg • Ashwagandha 300mg",
    rating: 4.9,
    reviewCount: 94,
    price250: 29,
    price500: 39,
    price250Sub: 25,
    price500Sub: 32,
    sachets: SACHET_PRICES,
    ingredients: [
      { name: "Reishi Mushroom", dose: "2g", benefit: "Immune-modulating adaptogenic mushroom for stress balance and deep immunity." },
      { name: "Elderberry Extract", dose: "500mg", benefit: "Supports immune defenses and provides antioxidant protection." },
      { name: "Ashwagandha", dose: "300mg", benefit: "Reduces stress and cortisol while supporting mood and immune resilience." },
      { name: "Vitamin C", dose: "200mg", benefit: "Essential for immune defense and antioxidant protection." },
      { name: "Walnut Leaves", dose: "100mg", benefit: "Antimicrobial activity for gut cleansing and immune reinforcement." },
      { name: "Rose Hip", dose: "200mg", benefit: "High in vitamin C and polyphenols for immune strength." },
      { name: "Quercetin", dose: "80mg", benefit: "Mast cell stabilizer and anti-inflammatory compound." },
    ],
    studies: [
      { title: "Ganoderma lucidum (Reishi) in cancer treatment", authors: "Hawkins, J. et al.", year: "2019", journal: "Cochrane Database of Systematic Reviews", finding: "Reishi mushroom showed immunomodulatory effects and improved quality of life markers." },
      { title: "A prospective study of Ashwagandha", authors: "Chandrasekhar, K. et al.", year: "2012", journal: "Indian Journal of Psychological Medicine", finding: "Ashwagandha root extract safely improved resistance towards stress." },
    ],
    perfectFor: ["Morning coffee", "Herbal tea", "Hot chocolate", "Winter wellness"],
    bestFor: "Fighting off colds, staying healthy year-round",
    faq: [
      { question: "How long until I feel results?", answer: "Immune support builds over time. Most users notice improved resilience after 2-3 weeks." },
      { question: "What does it taste like?", answer: "Creamy hazelnut with bright orange citrus. Pairs beautifully with coffee." },
      { question: "Can I take this year-round?", answer: "Absolutely. IMMUNITY is designed for daily, year-round immune support." },
    ],
    bottleImage: bottleImmunity.src,
    sachetImage: sachetImmunity.src,
    bgColorClass: "bg-necta-immunity",
    textColorClass: "text-necta-immunity",
    borderColorClass: "border-necta-immunity",
  },

  calm: {
    slug: "calm",
    name: "CALM",
    tagline: "Stress relief without drowsiness",
    flavor: "Honey Caramel",
    flavorNotes: "Warm caramel with floral honey",
    heroIngredientsSummary: "Chamomile 150mg • Lemon Balm 150mg • Jujube Seed 200mg",
    rating: 4.7,
    reviewCount: 86,
    price250: 29,
    price500: 39,
    price250Sub: 25,
    price500Sub: 32,
    sachets: SACHET_PRICES,
    ingredients: [
      { name: "Chamomile Extract", dose: "150mg", benefit: "Promotes relaxation and calm mood without sedation." },
      { name: "Scarlet Beebalm", dose: "120mg", benefit: "Supports calm, immune balance, and microbial defense." },
      { name: "Lemon Balm", dose: "150mg", benefit: "Reduces anxiety and nervous tension while supporting sleep quality." },
      { name: "Jujube Seed", dose: "200mg", benefit: "Supports deep relaxation and restorative sleep." },
      { name: "Pine Sponge (Poria)", dose: "200mg", benefit: "Calms the nervous system and reduces fluid retention." },
    ],
    studies: [
      { title: "Chamomile: A herbal medicine of the past with bright future", authors: "Srivastava, J.K. et al.", year: "2010", journal: "Molecular Medicine Reports", finding: "Chamomile demonstrated significant anxiolytic and mild sedative effects." },
      { title: "Pilot trial of Melissa officinalis on stress and anxiety", authors: "Cases, J. et al.", year: "2011", journal: "Mediterranean Journal of Nutrition and Metabolism", finding: "Lemon Balm reduced anxiety symptoms by 18% and insomnia by 42%." },
    ],
    perfectFor: ["Evening tea", "Golden milk", "Bedtime ritual", "Weekend wind-down"],
    bestFor: "Unwinding after a long day, getting restful sleep, staying cool under pressure",
    faq: [
      { question: "Will this make me drowsy?", answer: "No. CALM promotes relaxation without sedation. Great for daytime stress too." },
      { question: "What does it taste like?", answer: "Warm caramel with floral honey notes. Perfect in evening tea." },
    ],
    bottleImage: bottleCalm.src,
    sachetImage: sachetCalm.src,
    bgColorClass: "bg-necta-calm",
    textColorClass: "text-necta-calm",
    borderColorClass: "border-necta-calm",
  },

  glow: {
    slug: "glow",
    name: "GLOW",
    tagline: "Skin health from the inside out",
    flavor: "Cherry Almond",
    flavorNotes: "Sweet cherry with almond cream",
    heroIngredientsSummary: "Marine Collagen 2.5g • Hyaluronic Acid 120mg • CoQ10 80mg",
    rating: 4.9,
    reviewCount: 153,
    price250: 29,
    price500: 39,
    price250Sub: 25,
    price500Sub: 32,
    sachets: SACHET_PRICES,
    ingredients: [
      { name: "Marine Collagen", dose: "2500mg", benefit: "Bioavailable peptides for skin firmness, elasticity, hair, nails, and joints." },
      { name: "Hyaluronic Acid", dose: "120mg", benefit: "Supports skin hydration, plumpness, and joint lubrication." },
      { name: "Schisandra", dose: "1000mg", benefit: "Enhances mental clarity, liver detox, stress resilience, and skin brightness." },
      { name: "Trans-Resveratrol", dose: "100mg", benefit: "Potent antioxidant for healthy aging and cellular protection." },
      { name: "CoQ10", dose: "80mg", benefit: "Supports mitochondrial energy and youthful skin appearance." },
      { name: "Nicotinamide (B3)", dose: "150mg", benefit: "Supports NAD⁺ production for cellular energy and skin renewal." },
      { name: "Fisetin", dose: "50mg", benefit: "Senolytic compound that supports cellular rejuvenation." },
      { name: "Juniper Berries", dose: "80mg", benefit: "Supports lymphatic drainage and clearer-looking skin." },
      { name: "Pomegranate Extract", dose: "250mg", benefit: "Polyphenols for skin elasticity and antioxidant defense." },
      { name: "Moringa", dose: "500mg", benefit: "Nutrient-dense botanical for skin renewal and cellular turnover." },
      { name: "Biotin (B7)", dose: "5000mcg", benefit: "Supports healthy hair, skin, nails, and energy metabolism." },
    ],
    studies: [
      { title: "Oral Collagen Supplementation: A Systematic Review", authors: "Proksch, E. et al.", year: "2014", journal: "Journal of Drugs in Dermatology", finding: "Oral collagen peptides significantly improved skin elasticity and hydration after 8 weeks." },
      { title: "Oral Hyaluronic Acid Supplementation for Skin Moisturizing", authors: "Kawada, C. et al.", year: "2014", journal: "Nutrition Journal", finding: "Oral hyaluronic acid supplementation improved skin moisture and reduced wrinkles." },
    ],
    perfectFor: ["Morning coffee", "Smoothies", "Iced lattes", "Post-workout shakes"],
    bestFor: "Glowing skin, healthy hair, ageing like fine wine",
    faq: [
      { question: "How long until I see results?", answer: "Skin improvements typically become visible after 4-8 weeks of daily use." },
      { question: "What does it taste like?", answer: "Sweet cherry with almond cream notes. Delicious in coffee and smoothies." },
      { question: "Is the collagen sustainable?", answer: "We use marine collagen sourced from sustainably managed fisheries." },
    ],
    bottleImage: bottleGlow.src,
    sachetImage: sachetGlow.src,
    bgColorClass: "bg-necta-glow",
    textColorClass: "text-necta-glow",
    borderColorClass: "border-necta-glow",
  },
};

export const productSlugs: ProductSlug[] = ["focus", "immunity", "calm", "glow"];
export const getProduct = (slug: string): ProductData | undefined => products[slug as ProductSlug];
