'use client';

import { useState, useEffect, useCallback } from "react";
import { X, ArrowUpRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import type { StaticImageData } from "next/image";
import lionsManeImg from "@/assets/ingredients/lions-mane.jpg";
import reishiImg from "@/assets/ingredients/reishi.jpg";
import ashwagandhaImg from "@/assets/ingredients/ashwagandha.jpg";
import lTheanineImg from "@/assets/ingredients/l-theanine.jpg";
import marineCollagenImg from "@/assets/ingredients/marine-collagen.jpg";
import elderberryImg from "@/assets/ingredients/elderberry.jpg";
import hyaluronicAcidImg from "@/assets/ingredients/hyaluronic-acid.jpg";
import rhodiolaImg from "@/assets/ingredients/rhodiola.jpg";
import ginkgoImg from "@/assets/ingredients/ginkgo.jpg";
import bacopaImg from "@/assets/ingredients/bacopa.jpg";
import ginsengImg from "@/assets/ingredients/ginseng.jpg";
import blueberryImg from "@/assets/ingredients/blueberry.jpg";
import vitaminD3Img from "@/assets/ingredients/vitamin-d3.jpg";
import vitaminCImg from "@/assets/ingredients/vitamin-c.jpg";
import zincImg from "@/assets/ingredients/zinc.jpg";
import roseHipImg from "@/assets/ingredients/rose-hip.jpg";
import echinaceaImg from "@/assets/ingredients/echinacea.jpg";
import chamomileImg from "@/assets/ingredients/chamomile.jpg";
import lemonBalmImg from "@/assets/ingredients/lemon-balm.jpg";
import jujubeSeedImg from "@/assets/ingredients/jujube-seed.jpg";
import poriacocosImg from "@/assets/ingredients/poria-cocos.jpg";
import magnesiumImg from "@/assets/ingredients/magnesium.jpg";
import beebalmImg from "@/assets/ingredients/beebalm.jpg";
import coq10Img from "@/assets/ingredients/coq10.jpg";
import resveratrolImg from "@/assets/ingredients/resveratrol.jpg";
import seleniumImg from "@/assets/ingredients/selenium.jpg";
import moringaImg from "@/assets/ingredients/moringa.jpg";
import pomegranateImg from "@/assets/ingredients/pomegranate.jpg";
import schisandraImg from "@/assets/ingredients/schisandra.jpg";
import biotinImg from "@/assets/ingredients/biotin.jpg";
import nicotinamideImg from "@/assets/ingredients/nicotinamide.jpg";

interface FoundIn {
  slug: string;
  name: string;
}

interface Ingredient {
  name: string;
  tagline: string;
  detail: string;
  dose: string;
  foundIn: FoundIn[];
  image: string | StaticImageData;
  studyLink: string;
  studyLabel: string;
}

const ingredients: Ingredient[] = [
  // FOCUS
  {
    name: "Lion's Mane",
    tagline: "Grow your brain, literally",
    detail:
      "Lion's Mane contains hericenones and erinacines — compounds that stimulate Nerve Growth Factor (NGF), supporting brain cell health and cognitive function. Studies show meaningful improvements in memory, focus, and mental clarity after consistent use, especially notable in reducing brain fog.",
    dose: "500mg",
    foundIn: [{ slug: "focus", name: "FOCUS" }],
    image: lionsManeImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/18844328/",
    studyLabel: "Mori et al. (2009) · Phytotherapy Research",
  },
  {
    name: "L-Theanine",
    tagline: "Calm focus. No jitters.",
    detail:
      "Found in green tea, L-Theanine increases alpha brain waves — the relaxed-but-alert state. It pairs synergistically with caffeine to sharpen attention without the crash, and reduces anxiety without drowsiness. One of the most well-studied focus compounds available.",
    dose: "80mg",
    foundIn: [{ slug: "focus", name: "FOCUS" }],
    image: lTheanineImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/18681988/",
    studyLabel: "Nobre et al. (2008) · Asia Pacific Journal of Clinical Nutrition",
  },
  {
    name: "Rhodiola Rosea",
    tagline: "Mental stamina under pressure",
    detail:
      "Rhodiola is an adaptogen proven to reduce mental fatigue and improve cognitive performance under stressful conditions. It modulates cortisol and monoamine pathways, helping your brain stay sharp when it's under load. Think of it as a reset button for your overworked nervous system.",
    dose: "200mg",
    foundIn: [{ slug: "focus", name: "FOCUS" }],
    image: rhodiolaImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/12725561/",
    studyLabel: "Shevtsov et al. (2003) · Phytomedicine",
  },
  {
    name: "Ginkgo Biloba",
    tagline: "More blood flow = sharper memory",
    detail:
      "One of the world's oldest medicinal plants. Ginkgo increases cerebral blood flow, enhancing oxygen and nutrient delivery to brain cells. Clinical trials show improvements in working memory, attention span, and processing speed — particularly valuable for sustained cognitive output.",
    dose: "140mg",
    foundIn: [{ slug: "focus", name: "FOCUS" }],
    image: ginkgoImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/10479795/",
    studyLabel: "Oken et al. (1998) · Archives of Neurology",
  },
  {
    name: "Bacopa Monnieri",
    tagline: "Upgrade your mental RAM",
    detail:
      "Used in Ayurvedic medicine for over 3,000 years. Bacopa's active bacosides enhance synaptic transmission and support memory consolidation. Clinical trials show significant improvements in information processing speed and working memory after 8–12 weeks of consistent use.",
    dose: "300mg",
    foundIn: [{ slug: "focus", name: "FOCUS" }],
    image: bacopaImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/12093601/",
    studyLabel: "Roodenrys et al. (2002) · Neuropsychopharmacology",
  },
  {
    name: "Panax Ginseng",
    tagline: "Sustained energy without the spike",
    detail:
      "Korean red ginseng's ginsenosides support mental performance, reduce fatigue, and help the body adapt to physical and psychological stress. Unlike stimulants, ginseng provides steady, crash-free energy. FDA-reviewed and backed by over 100 clinical trials.",
    dose: "150mg",
    foundIn: [{ slug: "focus", name: "FOCUS" }],
    image: ginsengImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/15982990/",
    studyLabel: "Ellis & Reddy (2002) · Annals of Pharmacotherapy",
  },
  {
    name: "Blueberry Extract",
    tagline: "Antioxidants for long-term brain health",
    detail:
      "Blueberry anthocyanins are among the most powerful neuroprotective compounds known. They reduce oxidative stress in brain cells, improve memory and concentration, and protect against cognitive decline. A daily hit of concentrated blueberry is insurance for your future self.",
    dose: "200mg",
    foundIn: [{ slug: "focus", name: "FOCUS" }],
    image: blueberryImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/20047325/",
    studyLabel: "Krikorian et al. (2010) · Journal of Agricultural and Food Chemistry",
  },
  {
    name: "Vitamin D3",
    tagline: "Sunshine for your brain",
    detail:
      "Vitamin D3 supports neurotransmitter synthesis, mood regulation, and neuroprotection. Low D3 is one of the most common deficiencies and directly linked to brain fog, low mood, and reduced cognitive function. We include the active D3 form (cholecalciferol) for maximum absorption.",
    dose: "1000 IU",
    foundIn: [{ slug: "focus", name: "FOCUS" }],
    image: vitaminD3Img,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/20534972/",
    studyLabel: "Annweiler et al. (2010) · Neuroepidemiology",
  },
  // IMMUNITY
  {
    name: "Reishi",
    tagline: "The immunity mushroom",
    detail:
      "Reishi's beta-glucan polysaccharides directly modulate immune cell activity, enhancing natural killer cell function and T-cell response. It's also adaptogenic — meaning it calms overactive immune responses (like inflammation) while boosting under-active ones. A true whole-system immune tonic.",
    dose: "2000mg",
    foundIn: [{ slug: "immunity", name: "IMMUNITY" }],
    image: reishiImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/16230844/",
    studyLabel: "Gao et al. (2004) · Cochrane Database of Systematic Reviews",
  },
  {
    name: "Elderberry",
    tagline: "Nature's antiviral powerhouse",
    detail:
      "Sambucus nigra (elderberry) flavonoids have been shown in randomised controlled trials to reduce the duration and severity of colds and flu. They inhibit viral replication and stimulate cytokine production, giving your immune system a measurable head start when pathogens strike.",
    dose: "500mg",
    foundIn: [{ slug: "immunity", name: "IMMUNITY" }],
    image: elderberryImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/15080016/",
    studyLabel: "Zakay-Rones et al. (2004) · Journal of International Medical Research",
  },
  {
    name: "Ashwagandha",
    tagline: "Clinically proven stress reduction",
    detail:
      "Ashwagandha withafenolides reduce cortisol by up to 30% in double-blind trials. Chronic stress suppresses immune function — so lowering cortisol is one of the highest-leverage things you can do for immunity. It also improves sleep quality, another critical pillar of immune health.",
    dose: "300mg",
    foundIn: [{ slug: "immunity", name: "IMMUNITY" }],
    image: ashwagandhaImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/23439798/",
    studyLabel: "Chandrasekhar et al. (2012) · Indian Journal of Psychological Medicine",
  },
  {
    name: "Vitamin C",
    tagline: "The original immune vitamin",
    detail:
      "Vitamin C is essential for white blood cell production, neutrophil function, and the skin barrier's antimicrobial defenses. It's a potent antioxidant that protects immune cells from oxidative damage during infection. We dose at 200mg — enough to matter, not enough to be gimmicky.",
    dose: "200mg",
    foundIn: [{ slug: "immunity", name: "IMMUNITY" }],
    image: vitaminCImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/29099763/",
    studyLabel: "Carr & Maggini (2017) · Nutrients",
  },
  {
    name: "Zinc",
    tagline: "Critical for every immune reaction",
    detail:
      "Zinc is required for the development and function of virtually every immune cell type. It's one of the most common micronutrient deficiencies worldwide, and even mild deficiency significantly impairs immune response. The citrate form we use is among the most bioavailable.",
    dose: "10mg",
    foundIn: [{ slug: "immunity", name: "IMMUNITY" }],
    image: zincImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/9701160/",
    studyLabel: "Prasad et al. (1997) · American Journal of Clinical Nutrition",
  },
  {
    name: "Rose Hip",
    tagline: "Vitamin C amplified",
    detail:
      "Rose hip contains more vitamin C per gram than citrus fruit, plus bioflavonoids that enhance C's absorption and potency. Its polyphenols have anti-inflammatory properties and have been shown to reduce oxidative stress markers. A botanical double-down on your immunity stack.",
    dose: "200mg",
    foundIn: [{ slug: "immunity", name: "IMMUNITY" }],
    image: roseHipImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/21564777/",
    studyLabel: "Christensen et al. (2008) · Phytomedicine",
  },
  {
    name: "Echinacea",
    tagline: "The classic herb that actually works",
    detail:
      "Meta-analyses confirm echinacea reduces both the incidence and duration of upper respiratory infections. Its alkylamides and polysaccharides stimulate macrophage and T-cell activity. Most effective when taken at first sign of illness — which is exactly how we position it.",
    dose: "150mg",
    foundIn: [{ slug: "immunity", name: "IMMUNITY" }],
    image: echinaceaImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/25058608/",
    studyLabel: "Karsch-Völk et al. (2015) · Cochrane Database",
  },
  // CALM
  {
    name: "Chamomile",
    tagline: "Apigenin: your brain's off switch",
    detail:
      "Chamomile's active compound apigenin binds to GABA-A receptors in the brain — the same pathway targeted by anti-anxiety medications, but gently and without dependency. Clinical trials show significant reduction in GAD (generalised anxiety disorder) scores with standardised chamomile extract.",
    dose: "150mg",
    foundIn: [{ slug: "calm", name: "CALM" }],
    image: chamomileImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/21132119/",
    studyLabel: "Amsterdam et al. (2012) · Phytomedicine",
  },
  {
    name: "Lemon Balm",
    tagline: "Quiets the mind, lifts the mood",
    detail:
      "Melissa officinalis inhibits GABA transaminase — the enzyme that breaks down calming GABA neurotransmitter. A well-designed pilot trial found it reduced anxiety by 18% and insomnia by 42% versus placebo. It's the herb for people whose minds won't switch off.",
    dose: "150mg",
    foundIn: [{ slug: "calm", name: "CALM" }],
    image: lemonBalmImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/21226218/",
    studyLabel: "Cases et al. (2011) · Mediterranean Journal of Nutrition",
  },
  {
    name: "Jujube Seed",
    tagline: "Ancient sleep aid with modern proof",
    detail:
      "Ziziphus jujuba seed has been used in Traditional Chinese Medicine as a sleep and anxiety remedy for over 2,000 years. Its saponins interact with serotonin and GABA receptors to promote sleep onset and quality. Studies confirm shorter sleep latency and improved deep sleep duration.",
    dose: "200mg",
    foundIn: [{ slug: "calm", name: "CALM" }],
    image: jujubeSeedImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/29173677/",
    studyLabel: "Chen et al. (2017) · Phytomedicine",
  },
  {
    name: "Poria Cocos",
    tagline: "Emotional balance from the root",
    detail:
      "Poria cocos (Fu Ling in TCM) is a fungal remedy with well-documented anxiolytic and sedative properties. Its triterpenoids modulate dopamine and serotonin signalling, supporting emotional stability and sleep quality. A key ingredient in some of the world's most studied TCM calming formulas.",
    dose: "200mg",
    foundIn: [{ slug: "calm", name: "CALM" }],
    image: poriacocosImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/25050432/",
    studyLabel: "Guo et al. (2014) · Molecular & Cellular Neuroscience",
  },
  {
    name: "Magnesium",
    tagline: "The relaxation mineral",
    detail:
      "Magnesium is involved in over 300 biochemical reactions, including nerve function and muscle relaxation. Deficiency — extremely common in modern diets — is directly linked to anxiety, insomnia, and heightened stress response. The glycinate form we use is the most bioavailable and gentlest on digestion.",
    dose: "100mg",
    foundIn: [{ slug: "calm", name: "CALM" }],
    image: magnesiumImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/28912817/",
    studyLabel: "Boyle et al. (2017) · Nutrients",
  },
  {
    name: "Scarlet Beebalm",
    tagline: "Tension relief and nervous calm",
    detail:
      "Monarda (Scarlet Beebalm) contains thymol and carvacrol — compounds with demonstrated calming and antispasmodic effects on the nervous system. It's used in herbal traditions to relieve tension headaches, nervous digestive complaints, and general stress-related discomfort.",
    dose: "120mg",
    foundIn: [{ slug: "calm", name: "CALM" }],
    image: beebalmImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/24669101/",
    studyLabel: "Youn et al. (2016) · Evidence-Based Complementary and Alternative Medicine",
  },
  // GLOW
  {
    name: "Marine Collagen",
    tagline: "Skin firmness from within",
    detail:
      "Hydrolysed marine collagen peptides are the most bioavailable form of collagen — absorbed up to 1.5x more efficiently than bovine. They stimulate fibroblasts to produce your skin's own collagen, elastin, and hyaluronic acid. Double-blind trials show measurable improvements in skin elasticity and hydration in 8 weeks.",
    dose: "2500mg",
    foundIn: [{ slug: "glow", name: "GLOW" }],
    image: marineCollagenImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/23949208/",
    studyLabel: "Proksch et al. (2014) · Skin Pharmacology and Physiology",
  },
  {
    name: "Hyaluronic Acid",
    tagline: "Holds 1000x its weight in water",
    detail:
      "Hyaluronic acid is the skin's natural moisture reservoir — but levels drop with age. Oral HA supplements have been shown to improve skin hydration and reduce wrinkle depth, working from the inside to plump and smooth. The low-molecular-weight form we use has the highest dermal absorption.",
    dose: "120mg",
    foundIn: [{ slug: "glow", name: "GLOW" }],
    image: hyaluronicAcidImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/24127612/",
    studyLabel: "Kawada et al. (2014) · Nutrition Journal",
  },
  {
    name: "CoQ10",
    tagline: "Cellular energy, youthful skin",
    detail:
      "CoQ10 is an antioxidant produced naturally in every cell, but levels decline with age. It powers mitochondrial energy production and protects against free radical damage — two processes central to skin ageing. Supplementation has been shown to reduce oxidative damage markers and improve skin smoothness.",
    dose: "80mg",
    foundIn: [{ slug: "glow", name: "GLOW" }],
    image: coq10Img,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/22642671/",
    studyLabel: "Žmitek et al. (2017) · BioFactors",
  },
  {
    name: "Resveratrol",
    tagline: "Anti-ageing at the cellular level",
    detail:
      "Trans-resveratrol activates sirtuins — proteins known as 'longevity genes' — and AMPK pathways, both associated with cellular repair and healthy ageing. In dermatology research, it reduces oxidative stress in skin cells, protects against UV damage, and supports collagen synthesis.",
    dose: "100mg",
    foundIn: [{ slug: "glow", name: "GLOW" }],
    image: resveratrolImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/20838622/",
    studyLabel: "Baur & Sinclair (2006) · Nature Reviews Drug Discovery",
  },
  {
    name: "Schisandra",
    tagline: "The five-flavour skin adaptogen",
    detail:
      "Schisandra chinensis is among the most complex adaptogens — a berry that supports liver detoxification, stress resilience, and skin radiance simultaneously. Its lignans (schisandrin A/B/C) protect cells from oxidative damage, improve mental clarity, and support the liver's role in clearing the metabolic waste that dulls skin.",
    dose: "1000mg",
    foundIn: [{ slug: "glow", name: "GLOW" }],
    image: schisandraImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/23596162/",
    studyLabel: "Panossian & Wikman (2008) · Pharmaceuticals",
  },
  {
    name: "Moringa",
    tagline: "The most nutrient-dense leaf on earth",
    detail:
      "Moringa oleifera leaves contain over 90 bioactive compounds — vitamins A, C, E, calcium, potassium, and all essential amino acids. This nutritional density supports cellular regeneration, antioxidant defence, and skin renewal from every angle. Gram for gram, one of nature's most complete superfoods.",
    dose: "500mg",
    foundIn: [{ slug: "glow", name: "GLOW" }],
    image: moringaImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/25374169/",
    studyLabel: "Gopalakrishnan et al. (2016) · Asian Pacific Journal of Cancer Prevention",
  },
  {
    name: "Pomegranate Extract",
    tagline: "Sunscreen you drink",
    detail:
      "Pomegranate's punicalagins and ellagic acid are among the most powerful antioxidants studied. They protect skin cells from UV-induced damage, support collagen cross-linking, and have been shown to inhibit skin-ageing enzymes. The extract we use is standardised to 40% ellagic acid — a meaningful therapeutic dose.",
    dose: "250mg",
    foundIn: [{ slug: "glow", name: "GLOW" }],
    image: pomegranateImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/24620221/",
    studyLabel: "Henning et al. (2013) · Journal of Nutritional Biochemistry",
  },
  {
    name: "Biotin",
    tagline: "Hair, skin, nails — the essential B vitamin",
    detail:
      "Biotin (B7) is the cofactor for enzymes involved in keratin synthesis — the structural protein in hair, skin, and nails. Clinical studies show that supplementation improves nail strength, reduces hair thinning, and supports skin barrier integrity. We include 5,000mcg, the clinically studied dose.",
    dose: "5000mcg",
    foundIn: [{ slug: "glow", name: "GLOW" }],
    image: biotinImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/28879195/",
    studyLabel: "Patel et al. (2017) · Skin Appendage Disorders",
  },
  {
    name: "Nicotinamide (B3)",
    tagline: "Skin renewal at the DNA level",
    detail:
      "Niacinamide supports NAD⁺ production — the cellular fuel needed for DNA repair and energy metabolism. Topically it's one of skincare's most studied ingredients; orally it supports skin barrier function, reduces inflammation, evens tone, and underpins the energy-intensive process of cellular renewal.",
    dose: "150mg",
    foundIn: [{ slug: "glow", name: "GLOW" }],
    image: nicotinamideImg,
    studyLink: "https://pubmed.ncbi.nlm.nih.gov/26679384/",
    studyLabel: "Jacobson et al. (2016) · Biochemical Pharmacology",
  },
];

const FILTERS = ["ALL", "FOCUS", "IMMUNITY", "CALM", "GLOW"] as const;
type Filter = (typeof FILTERS)[number];

const PRODUCT_COLORS: Record<string, string> = {
  FOCUS: "#D4EBD0",
  IMMUNITY: "#D4E4F0",
  CALM: "#EDE0F5",
  GLOW: "#F9E0DC",
};

const pillars = [
  {
    label: "Clinically dosed",
    body: "Every ingredient at a proven therapeutic level. No underdosing. No proprietary blends.",
  },
  {
    label: "70% organic",
    body: "Certified organic botanicals. No synthetic pesticides, no GMOs.",
  },
  {
    label: "Full transparency",
    body: "Every ingredient, every dose, on the label. Always.",
  },
  {
    label: "Third-party tested",
    body: "Batch-tested for purity and potency before it ships. Certificates available on request.",
  },
];

function IngredientModal({ ingredient, onClose }: { ingredient: Ingredient; onClose: () => void }) {
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [handleEsc]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl max-w-[680px] w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Image banner */}
        <div className="relative h-56 overflow-hidden rounded-t-2xl bg-[#f5f0eb]">
          <img
            src={typeof ingredient.image === "string" ? ingredient.image : ingredient.image.src}
            alt={ingredient.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-5 left-6">
            <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">
              {ingredient.foundIn[0].name} · {ingredient.dose} per serving
            </p>
            <h3 className="text-white text-3xl font-bold leading-tight">{ingredient.name}</h3>
          </div>
        </div>

        <div className="p-7 md:p-9">
          {/* Tagline */}
          <p className="text-sm font-semibold text-primary/60 uppercase tracking-widest mb-4">
            {ingredient.tagline}
          </p>

          {/* Detail */}
          <p className="text-[15px] text-foreground/70 leading-relaxed mb-8">{ingredient.detail}</p>

          {/* Find it in */}
          <div className="mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-3">
              Find it in
            </p>
            <div className="flex flex-wrap gap-2">
              {ingredient.foundIn.map((p) => (
                <Link
                  key={p.slug}
                  href={`/shop/${p.slug}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-primary border border-primary/20 hover:bg-primary hover:text-white transition-colors"
                  style={{ backgroundColor: PRODUCT_COLORS[p.name] }}
                >
                  NECTA {p.name}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Study link */}
          <a
            href={ingredient.studyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors border-t border-border pt-5 w-full"
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            <span className="underline underline-offset-2">
              View peer-reviewed study — {ingredient.studyLabel}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

const SciencePage = () => {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [selected, setSelected] = useState<Ingredient | null>(null);

  const filtered =
    filter === "ALL"
      ? ingredients
      : ingredients.filter((i) => i.foundIn.some((f) => f.name === filter));

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── HERO BANNER ── */}
      <section
        className="pt-24 pb-20 md:pt-32 md:pb-28"
        style={{
          background: "linear-gradient(135deg, #C8E8E5 0%, #D4CAEC 30%, #F0D8D4 65%, #EAD8C8 100%)",
        }}
      >
        <div className="necta-container max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40 mb-6">
            The Science
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 tracking-tight text-foreground">
            Not magic.
            <br />
            Just science.
          </h1>
          <p className="text-xl md:text-2xl text-foreground/55 font-light max-w-xl">
            31 clinically-backed ingredients. Effective doses. Every single one chosen because the research says it works — not because it sounds good on a label.
          </p>
        </div>
      </section>

      {/* ── PHILOSOPHY PILLARS ── */}
      <section className="bg-[#faf9f7] border-b border-border">
        <div className="necta-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
            {pillars.map((p) => (
              <div key={p.label} className="py-10 px-8 md:py-12">
                <h3 className="text-base font-bold text-foreground mb-3 leading-snug">{p.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INGREDIENTS GRID ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="necta-container">
          {/* Heading */}
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              The full library
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {filtered.length} active ingredients
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-12">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  filter === f
                    ? "bg-primary text-white"
                    : "bg-[#f2f0ec] text-foreground/60 hover:text-foreground"
                }`}
              >
                {f === "ALL" ? "All ingredients" : `NECTA ${f}`}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
            {filtered.map((ing) => (
              <button
                key={ing.name}
                onClick={() => setSelected(ing)}
                className="group flex flex-col items-center text-center focus:outline-none"
              >
                {/* Circle image */}
                <div className="relative w-full aspect-square rounded-full overflow-hidden bg-[#f5f0eb] mb-4 ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-300 group-hover:scale-105">
                  <img
                    src={typeof ing.image === "string" ? ing.image : ing.image.src}
                    alt={ing.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full">
                    <span className="text-white text-xs font-semibold uppercase tracking-wide">
                      Learn more
                    </span>
                  </div>
                </div>

                {/* Name */}
                <p className="text-sm font-bold text-foreground leading-snug mb-1">{ing.name}</p>

                {/* Find it in tag */}
                {ing.foundIn.map((f) => (
                  <span
                    key={f.slug}
                    className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: PRODUCT_COLORS[f.name], color: "#3a3530" }}
                  >
                    {f.name}
                  </span>
                ))}

                {/* Dose */}
                <p className="text-[10px] text-muted-foreground mt-1.5 font-mono">{ing.dose}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STANDARDS BANNER ── */}
      <section
        className="py-16 md:py-20"
        style={{
          background: "linear-gradient(135deg, #D6EBEA 0%, #E0DAEF 40%, #F2DDD4 100%)",
        }}
      >
        <div className="necta-container max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50 mb-4">
            Our standards
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 leading-tight">
            Held to the highest bar.
            <br />
            Then tested again.
          </h2>
          <p className="text-foreground/60 text-base md:text-lg leading-relaxed">
            We benchmark every formula against the clinical literature, then batch-test the
            finished product for purity and potency. If a study doesn't exist at the dose we
            use, we don't use the dose.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-white text-center">
        <div className="necta-container">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Ready to try them for yourself?
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-3.5 rounded-full hover:bg-primary/90 transition-colors text-sm"
            >
              Shop all products
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pick-and-mix"
              className="inline-flex items-center gap-2 border border-border text-foreground font-semibold px-8 py-3.5 rounded-full hover:bg-muted transition-colors text-sm"
            >
              Build your bundle
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {selected && (
        <IngredientModal ingredient={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default SciencePage;
