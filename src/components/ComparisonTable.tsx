import { Check, X, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { ProductData } from "@/data/products";

type CellValue = "yes" | "no" | "partial";

const rows: {
  feature: string;
  necta: CellValue;
  powders: CellValue;
  gummies: CellValue;
  infusions: CellValue;
}[] = [
  { feature: "Clinically relevant doses", necta: "yes", powders: "partial", gummies: "no", infusions: "no" },
  { feature: "Adds to drinks you already make", necta: "yes", powders: "partial", gummies: "no", infusions: "yes" },
  { feature: "Organic certified (70%+ by weight)", necta: "yes", powders: "partial", gummies: "no", infusions: "no" },
  { feature: "No mixing, blending, or shaking", necta: "yes", powders: "no", gummies: "yes", infusions: "yes" },
  { feature: "Covers Focus, Immunity, Calm & Glow", necta: "yes", powders: "no", gummies: "no", infusions: "no" },
  { feature: "Works in hot and cold drinks", necta: "yes", powders: "partial", gummies: "no", infusions: "yes" },
  { feature: "No sugar, no artificial flavours", necta: "yes", powders: "partial", gummies: "no", infusions: "no" },
  { feature: "Flexible subscription", necta: "yes", powders: "partial", gummies: "partial", infusions: "no" },
];

// SKU-specific card bg and accent
const skuCardBg: Record<string, string> = {
  focus: "#D6EBEA",
  immunity: "#F2DDD4",
  calm: "#E0DAEF",
  glow: "#F0DEDA",
};

const skuAccent: Record<string, string> = {
  focus: "#7BADA8",
  immunity: "#D4785A",
  calm: "#A89BC8",
  glow: "#C9897A",
};

const CellIcon = ({ value, accentColor }: { value: CellValue; accentColor: string }) => {
  if (value === "yes")
    return <Check className="h-4 w-4" style={{ color: accentColor }} />;
  if (value === "no")
    return <X className="h-4 w-4 text-foreground/20" />;
  return <Minus className="h-4 w-4 text-amber-500" />;
};

const columns = [
  { key: "necta" as const, label: "Necta", highlight: true },
  { key: "powders" as const, label: "Mushroom Powders" },
  { key: "gummies" as const, label: "Adaptogen Gummies" },
  { key: "infusions" as const, label: "Standard Infusions" },
];

interface ComparisonTableProps {
  product: ProductData;
}

const ComparisonTable = ({ product }: ComparisonTableProps) => {
  const cardBg = skuCardBg[product.slug] || skuCardBg.focus;
  const accent = skuAccent[product.slug] || skuAccent.focus;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="necta-container">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            Why Necta beats powders and gummies
          </h2>
          <p className="text-foreground/55">
            Not all functional supplements are created equal.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="text-left text-xs text-foreground/40 uppercase tracking-wider py-3 pr-4 w-[200px]">
                  Feature
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`text-center text-xs uppercase tracking-wider py-3 px-3 ${
                      col.highlight
                        ? "bg-foreground text-background rounded-t-xl font-medium"
                        : "text-foreground/40 bg-white"
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="text-sm text-foreground py-3.5 pr-4">
                    {row.feature}
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`text-center py-3.5 px-3`}
                      style={{
                        backgroundColor: col.highlight ? cardBg : "white",
                      }}
                    >
                      <div className="flex justify-center">
                        <CellIcon value={row[col.key]} accentColor={accent} />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Button size="lg" className="rounded-full gap-2" asChild>
            <Link to={`/shop/${product.slug}`}>
              Add {product.name} to your ritual <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
