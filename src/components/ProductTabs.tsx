import { useState } from "react";
import { Star, Coffee, Wine, Leaf as LeafIcon, BadgeCheck, ThumbsUp, CupSoda } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductData } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

type TabId = "how-to-use" | "ingredients" | "nutrition" | "reviews";

const tabs: { id: TabId; label: string }[] = [
  { id: "how-to-use", label: "How to Use" },
  { id: "ingredients", label: "Ingredients" },
  { id: "nutrition", label: "Nutrition" },
  { id: "reviews", label: "Reviews" },
];

// SKU accent colours for active tab underline
const skuAccentColors: Record<string, string> = {
  focus: "#7BADA8",
  immunity: "#D4785A",
  calm: "#A89BC8",
  glow: "#C9897A",
};

// SKU card background colours
const skuCardBgColors: Record<string, string> = {
  focus: "#D6EBEA",
  immunity: "#F2DDD4",
  calm: "#E0DAEF",
  glow: "#F0DEDA",
};

// Base ingredients per SKU
const baseIngredients: Record<string, string> = {
  focus: "Vegetable Glycerin (organic), Purified Water, Natural Vanilla Flavouring, Citric Acid, Potassium Sorbate",
  immunity: "Vegetable Glycerin (organic), Purified Water, Natural Hazelnut & Orange Flavouring, Citric Acid, Potassium Sorbate",
  calm: "Vegetable Glycerin (organic), Purified Water, Natural Honey Caramel Flavouring, Citric Acid, Potassium Sorbate",
  glow: "Vegetable Glycerin (organic), Purified Water, Natural Cherry Almond Flavouring, Citric Acid, Potassium Sorbate",
};

interface ProductTabsProps {
  product: ProductData;
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabId>("how-to-use");
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [visibleReviews, setVisibleReviews] = useState(5);

  const accentColor = skuAccentColors[product.slug] || skuAccentColors.focus;
  const cardBg = skuCardBgColors[product.slug] || skuCardBgColors.focus;

  // Fetch reviews from database
  const { data: reviews = [] } = useQuery({
    queryKey: ["product-reviews", product.slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_reviews")
        .select("*")
        .eq("product", product.slug)
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating.toFixed(1);

  const reviewCount = reviews.length > 0 ? reviews.length : product.reviewCount;

  const filteredReviews = starFilter
    ? reviews.filter((r) => r.rating === starFilter)
    : reviews;

  // Star distribution
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const maxDist = Math.max(...dist.map((d) => d.count), 1);

  const handleHelpful = async (reviewId: string) => {
    await supabase.rpc("increment_helpful_count", { review_id: reviewId });
  };

  return (
    <section className="border-t border-border bg-white">
      {/* Tab bar — sticky below header */}
      <div className="sticky top-[105px] z-30 bg-white border-b border-border">
        <div className="necta-container">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-6 py-4 text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "text-foreground"
                    : "border-transparent text-foreground/40 hover:text-foreground/60"
                }`}
                style={{
                  borderBottomColor: activeTab === tab.id ? accentColor : "transparent",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="py-12 md:py-16">
        <div className="necta-container max-w-3xl mx-auto">

          {/* HOW TO USE */}
          {activeTab === "how-to-use" && (
            <div className="space-y-8">
              <div className="space-y-4 text-base text-foreground/55 leading-[1.8]">
                <p>
                  Add 15ml (one pump or one sachet) to your coffee, tea, matcha, smoothie, or cocktail.
                </p>
                <p>
                  One pump delivers a full clinical dose of every active ingredient.
                </p>
              </div>

              {/* Icons row */}
              <div className="grid grid-cols-3 gap-4 py-6">
                {[
                  { icon: Coffee, label: "Morning coffee" },
                  { icon: LeafIcon, label: "Matcha bowl" },
                  { icon: CupSoda, label: "Cocktail glass" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-3 text-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: cardBg }}
                    >
                      <Icon className="h-6 w-6 text-foreground/55" />
                    </div>
                    <span className="text-sm text-foreground/55">{label}</span>
                  </div>
                ))}
              </div>

              <p className="text-base text-foreground/55 leading-[1.8]">
                Start with one pump. Build to two if desired. No stimulants, no crash.
              </p>
            </div>
          )}

          {/* INGREDIENTS */}
          {activeTab === "ingredients" && (
            <div className="space-y-8">
              <div
                className="rounded-2xl p-6 md:p-8"
                style={{ backgroundColor: cardBg }}
              >
                <h3 className="text-lg font-medium text-foreground mb-6">
                  Active ingredients per 15ml serving
                </h3>
                <div className="space-y-0">
                  {product.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3"
                      style={{
                        borderBottom: i < product.ingredients.length - 1
                          ? "1px solid rgba(30, 45, 61, 0.1)"
                          : "none",
                      }}
                    >
                      <span className="text-sm text-foreground">{ing.name}</span>
                      <span className="text-sm font-medium text-foreground">{ing.dose}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-foreground/55 mb-2 uppercase tracking-wider">
                  Other ingredients
                </h3>
                <p className="text-sm text-foreground/45 leading-relaxed">
                  {baseIngredients[product.slug] || baseIngredients.focus}
                </p>
              </div>

              <div
                className="rounded-xl p-5"
                style={{ backgroundColor: cardBg }}
              >
                <p className="text-sm text-foreground/60">
                  70%+ organic by weight. Soil Association certified. No artificial flavours, colours, or sweeteners.
                </p>
              </div>
            </div>
          )}

          {/* NUTRITION */}
          {activeTab === "nutrition" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-foreground mb-4">
                Nutritional information per 15ml serving
              </h3>

              <div className="border border-foreground/15 rounded-xl overflow-hidden bg-background">
                {[
                  { label: "Energy", value: "42 kcal" },
                  { label: "Fat", value: "0g" },
                  { label: "Carbohydrates", value: "0g" },
                  { label: "  of which sugars", value: "0g", indent: true },
                  { label: "Protein", value: "0g" },
                  { label: "Salt", value: "0g" },
                ].map(({ label, value, indent }, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-5 py-3 ${
                      i < 5 ? "border-b border-foreground/10" : ""
                    } ${indent ? "pl-8" : ""}`}
                  >
                    <span className={`text-sm ${indent ? "text-foreground/45" : "text-foreground"}`}>
                      {label}
                    </span>
                    <span className="text-sm text-foreground font-medium">{value}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-foreground/40">
                Nutritional values are approximate. Active ingredient doses are per 15ml serving.
              </p>
            </div>
          )}

          {/* REVIEWS */}
          {activeTab === "reviews" && (
            <div className="space-y-8">
              {/* Summary */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-6 pb-6 border-b border-border">
                <div className="text-center sm:text-left">
                  <p className="text-4xl font-medium text-foreground">{avgRating}</p>
                  <div className="flex items-center gap-0.5 mt-1 justify-center sm:justify-start">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(Number(avgRating))
                            ? "fill-foreground text-foreground"
                            : "text-foreground/20"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-foreground/40 mt-1">{reviewCount} reviews</p>
                </div>

                {/* Star distribution bars */}
                <div className="flex-1 space-y-1.5">
                  {dist.map((d) => (
                    <div key={d.star} className="flex items-center gap-2">
                      <span className="w-8 text-xs font-medium text-foreground/55">{d.star} ★</span>
                      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${(d.count / maxDist) * 100}%`,
                            backgroundColor: accentColor,
                          }}
                        />
                      </div>
                      <span className="w-6 text-xs text-foreground/40 text-right">{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Star filter pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStarFilter(null)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    !starFilter
                      ? "border-foreground text-foreground"
                      : "border-border text-foreground/40 hover:border-foreground/30"
                  }`}
                >
                  All
                </button>
                {[5, 4, 3, 2, 1].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStarFilter(s)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1 ${
                      starFilter === s
                        ? "border-foreground text-foreground"
                        : "border-border text-foreground/40 hover:border-foreground/30"
                    }`}
                  >
                    {s} <Star className="h-3 w-3 fill-current" />
                  </button>
                ))}
              </div>

              {/* Review cards */}
              {filteredReviews.length > 0 ? (
                <div className="space-y-5">
                  {filteredReviews.slice(0, visibleReviews).map((review) => (
                    <div
                      key={review.id}
                      className="bg-white rounded-xl p-5 md:p-6 border border-border"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-foreground">
                            {review.reviewer_initial}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-foreground">
                              {review.reviewer_name}
                            </span>
                            {review.verified_purchase && (
                              <span
                                className="ml-2 inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: cardBg, color: "hsl(210 35% 18%)" }}
                              >
                                <BadgeCheck className="h-3 w-3" /> Verified Purchase
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-foreground/30">
                          {new Date(review.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < review.rating
                                ? "fill-foreground text-foreground"
                                : "text-foreground/20"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-sm text-foreground/60 leading-relaxed">
                        {review.review_text}
                      </p>

                      <button
                        onClick={() => handleHelpful(review.id)}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs text-foreground/30 hover:text-foreground/50 transition-colors"
                      >
                        <ThumbsUp className="h-3 w-3" /> Helpful ({review.helpful_count})
                      </button>
                    </div>
                  ))}

                  {filteredReviews.length > visibleReviews && (
                    <div className="text-center">
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => setVisibleReviews((v) => v + 5)}
                      >
                        Load more reviews
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-foreground/40 uppercase tracking-wider mb-2">
                    No reviews yet
                  </p>
                  <p className="text-sm text-foreground/30">
                    Be the first to review {product.name} after launch.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductTabs;
