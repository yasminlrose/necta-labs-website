import { ExternalLink, Leaf, FlaskConical, Flower2, Droplets, Brain } from "lucide-react";
import type { ProductData } from "@/data/products";

// Study links per ingredient per SKU
const studyLinks: Record<string, Record<string, { citation: string; url: string }>> = {
  focus: {
    "Lion's Mane": { citation: "Mori et al., Phytotherapy Research, 2009", url: "https://pubmed.ncbi.nlm.nih.gov/18844328/" },
    "L-Theanine": { citation: "Nobre et al., Asia Pacific J Clin Nutr, 2008", url: "https://pubmed.ncbi.nlm.nih.gov/17182482/" },
    "Rhodiola Rosea": { citation: "Shevtsov et al., Phytomedicine, 2003", url: "https://pubmed.ncbi.nlm.nih.gov/12725561/" },
    "Ginkgo Biloba": { citation: "Kennedy et al., Psychopharmacology, 2000", url: "https://pubmed.ncbi.nlm.nih.gov/11128006/" },
    "Bacopa Monnieri": { citation: "Stough et al., Psychopharmacology, 2001", url: "https://pubmed.ncbi.nlm.nih.gov/11498727/" },
  },
  immunity: {
    "Reishi Mushroom": { citation: "Jin et al., Cochrane Database, 2016", url: "https://pubmed.ncbi.nlm.nih.gov/27045603/" },
    "Elderberry Extract": { citation: "Hawkins et al., J Int Med Res, 2019", url: "https://pubmed.ncbi.nlm.nih.gov/30670130/" },
    "Ashwagandha": { citation: "Chandrasekhar et al., Indian J Psych Med, 2012", url: "https://pubmed.ncbi.nlm.nih.gov/23439798/" },
    "Vitamin C": { citation: "Carr & Maggini, Nutrients, 2017", url: "https://pubmed.ncbi.nlm.nih.gov/29099763/" },
    "Quercetin": { citation: "Li et al., Nutrients, 2016", url: "https://pubmed.ncbi.nlm.nih.gov/26999194/" },
  },
  calm: {
    "Chamomile Extract": { citation: "Srivastava et al., Mol Med Rep, 2010", url: "https://pubmed.ncbi.nlm.nih.gov/21132119/" },
    "Lemon Balm": { citation: "Cases et al., Med J Nutr Metab, 2011", url: "https://pubmed.ncbi.nlm.nih.gov/21130907/" },
    "Jujube Seed": { citation: "Yeung et al., Phytomedicine, 2012", url: "https://pubmed.ncbi.nlm.nih.gov/22739410/" },
    "Pine Sponge (Poria)": { citation: "Ríos, J Ethnopharmacol, 2011", url: "https://pubmed.ncbi.nlm.nih.gov/21146598/" },
    "Scarlet Beebalm": { citation: "Zheljazkov et al., HortScience, 2013", url: "https://pubmed.ncbi.nlm.nih.gov/23542124/" },
  },
  glow: {
    "Marine Collagen": { citation: "Proksch et al., Skin Pharmacol Physiol, 2014", url: "https://pubmed.ncbi.nlm.nih.gov/23949208/" },
    "Hyaluronic Acid": { citation: "Kawada et al., Nutr J, 2014", url: "https://pubmed.ncbi.nlm.nih.gov/25014997/" },
    "CoQ10": { citation: "Hoppe et al., BioFactors, 1999", url: "https://pubmed.ncbi.nlm.nih.gov/10416024/" },
    "Trans-Resveratrol": { citation: "Baur & Sinclair, Nature Rev Drug Disc, 2006", url: "https://pubmed.ncbi.nlm.nih.gov/16955076/" },
    "Schisandra": { citation: "Panossian & Wikman, J Ethnopharmacol, 2008", url: "https://pubmed.ncbi.nlm.nih.gov/18515024/" },
  },
};

// SKU accent and card colours
const skuColors: Record<string, { accent: string; cardBg: string }> = {
  focus: { accent: "#7BADA8", cardBg: "#D6EBEA" },
  immunity: { accent: "#D4785A", cardBg: "#F2DDD4" },
  calm: { accent: "#A89BC8", cardBg: "#E0DAEF" },
  glow: { accent: "#C9897A", cardBg: "#F0DEDA" },
};

// Rotating botanical icons
const botanicalIcons = [Brain, Leaf, FlaskConical, Flower2, Droplets];

function getProofIngredients(product: ProductData) {
  const slugStudies = studyLinks[product.slug] || {};
  return product.ingredients
    .filter((ing) => ing.name in slugStudies)
    .slice(0, 5)
    .map((ing) => ({
      name: ing.name,
      dose: ing.dose,
      benefit: ing.benefit,
      study: slugStudies[ing.name],
    }));
}

interface IngredientProofStripProps {
  product: ProductData;
}

const IngredientProofStrip = ({ product }: IngredientProofStripProps) => {
  const ingredients = getProofIngredients(product);
  const colors = skuColors[product.slug] || skuColors.focus;

  if (ingredients.length === 0) return null;

  return (
    <section
      className="py-14 md:py-20 overflow-hidden"
      style={{ backgroundColor: colors.cardBg }}
    >
      {/* Heading */}
      <div className="necta-container mb-10 text-center">
        <h2 className="text-2xl md:text-3xl text-foreground mb-3">
          Every ingredient. Every dose. Proven.
        </h2>
        <p className="text-sm md:text-base text-foreground/55 max-w-xl mx-auto">
          We don't use ingredients for label claims. Every active in {product.name} is
          at or above its published therapeutic dose.
        </p>
      </div>

      {/* Scrollable cards */}
      <div className="overflow-x-auto scrollbar-hide">
        <div
          className="flex gap-4 px-6 md:px-12 pb-2"
          style={{ minWidth: "max-content" }}
        >
          {ingredients.map(({ name, dose, benefit, study }, idx) => {
            const IconComponent = botanicalIcons[idx % botanicalIcons.length];
            return (
              <div
                key={name}
                className="w-[260px] md:w-[280px] flex-shrink-0 rounded-[20px] bg-white p-6 flex flex-col"
                style={{ border: `1px solid ${colors.cardBg}` }}
              >
                {/* Botanical icon */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: colors.cardBg }}
                >
                  <IconComponent
                    className="h-5 w-5"
                    style={{ color: colors.accent }}
                  />
                </div>

                {/* Name & dose */}
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {name}
                </h3>
                <p className="text-sm text-foreground/40 mb-3">
                  {dose} per serving
                </p>

                {/* Benefit */}
                <p className="text-sm text-foreground/55 leading-relaxed mb-4 flex-1">
                  {benefit}
                </p>

                {/* Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] uppercase tracking-wider font-medium text-background bg-foreground rounded-full px-2.5 py-1">
                    Clinically Proven
                  </span>
                </div>

                {/* Study link */}
                <a
                  href={study.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs transition-colors hover:opacity-70"
                  style={{ color: colors.accent }}
                >
                  <ExternalLink className="h-3 w-3" />
                  View Study — {study.citation}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default IngredientProofStrip;
