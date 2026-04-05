import { useState, useEffect, useMemo } from "react";
import { Star, ThumbsUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  created_at: string;
  product: string;
  reviewer_name: string;
  reviewer_initial: string;
  rating: number;
  review_text: string;
  verified_purchase: boolean;
  helpful_count: number;
}

type SortMode = "recent" | "highest" | "verified";

export default function ReviewSection({ product }: { product: string }) {
  const { ref, isVisible } = useScrollAnimation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortMode>("recent");
  const [page, setPage] = useState(1);
  const [helpedIds, setHelpedIds] = useState<Set<string>>(new Set());
  const perPage = 10;

  useEffect(() => {
    fetchReviews();
  }, [product]);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product", product)
      .order("created_at", { ascending: false });
    setReviews((data as Review[]) || []);
    setLoading(false);
  };

  const sorted = useMemo(() => {
    const copy = [...reviews];
    if (sort === "highest") copy.sort((a, b) => b.rating - a.rating);
    if (sort === "verified") return copy.filter((r) => r.verified_purchase);
    return copy;
  }, [reviews, sort]);

  const totalPages = Math.ceil(sorted.length / perPage);
  const paged = sorted.slice((page - 1) * perPage, page * perPage);

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0.0";
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const maxDist = Math.max(...dist.map((d) => d.count), 1);

  const handleHelpful = async (id: string) => {
    if (helpedIds.has(id)) return;
    setHelpedIds((prev) => new Set(prev).add(id));
    await supabase.rpc("increment_helpful_count", { review_id: id });
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, helpful_count: r.helpful_count + 1 } : r)));
  };

  if (loading) return null;

  // Empty state when no reviews
  if (reviews.length === 0) {
    return (
      <section ref={ref} id="reviews-section" className="py-20 bg-background">
        <div className="necta-container max-w-6xl mx-auto text-center">
          <Star className="h-16 w-16 text-border mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground uppercase tracking-tight mb-3">
            NO REVIEWS YET
          </h2>
          <p className="text-lg text-muted-foreground font-body">
            Be the first to review this product after your purchase.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="reviews-section" className="py-20 bg-background">
      <div className="necta-container max-w-6xl mx-auto">
        {/* Header */}
        <div className={`flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10 scroll-fade-in ${isVisible ? "visible" : ""}`}>
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground uppercase tracking-tight mb-4">
              CUSTOMER REVIEWS
            </h2>
            <div className="flex items-end gap-4">
              <span className="text-5xl md:text-6xl font-heading font-extrabold text-foreground leading-none">{avg}</span>
              <div>
                <StarRow rating={parseFloat(avg)} size={24} />
                <p className="text-sm text-muted-foreground mt-1">Based on {reviews.length} reviews</p>
              </div>
            </div>
        </div>
        </div>

        {/* Distribution */}
        <div className={`mb-10 space-y-2 scroll-fade-in ${isVisible ? "visible" : ""}`} style={{ transitionDelay: "100ms" }}>
          {dist.map((d) => (
            <div key={d.star} className="flex items-center gap-3">
              <span className="w-10 text-sm font-accent font-medium text-foreground">{d.star} ★</span>
              <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full transition-all duration-700"
                  style={{ width: `${(d.count / maxDist) * 100}%` }}
                />
              </div>
              <span className="w-8 text-sm text-muted-foreground text-right">{d.count}</span>
            </div>
          ))}
        </div>

        {/* Sort tabs */}
        <div className="flex gap-6 mb-8 border-b border-border pb-3">
          {([["recent", "MOST RECENT"], ["highest", "HIGHEST RATED"], ["verified", "VERIFIED ONLY"]] as [SortMode, string][]).map(
            ([key, label]) => (
              <button
                key={key}
                onClick={() => { setSort(key); setPage(1); }}
                className={`text-xs font-body font-medium uppercase tracking-wider pb-2 transition-colors ${
                  sort === key ? "text-secondary border-b-2 border-secondary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>

        {/* Review cards */}
        <div className="space-y-4">
          {paged.map((r, i) => (
            <div
              key={r.id}
              className={`bg-background border border-border rounded-xl p-6 md:p-8 hover:border-muted-foreground/30 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 scroll-fade-in ${isVisible ? "visible" : ""}`}
              style={{ transitionDelay: `${(i + 3) * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-secondary-foreground font-heading font-bold text-sm md:text-base">{r.reviewer_initial}</span>
                  </div>
                  <div>
                    <p className="font-body font-semibold text-foreground uppercase text-sm">{r.reviewer_name}</p>
                    {r.verified_purchase && (
                      <p className="text-xs text-green-600 dark:text-green-400 font-body">✓ Verified Purchase</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StarRow rating={r.rating} size={16} />
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <p className="text-foreground font-body text-base leading-relaxed mb-4">"{r.review_text}"</p>
              <button
                onClick={() => handleHelpful(r.id)}
                disabled={helpedIds.has(r.id)}
                className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-lg px-4 py-2 hover:bg-muted/80 transition-colors disabled:opacity-60"
              >
                <ThumbsUp className="h-4 w-4" />
                Helpful ({r.helpful_count})
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              ← Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  p === page ? "bg-secondary text-secondary-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function StarRow({ rating, size }: { rating: number; size: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`transition-colors ${s <= Math.round(rating) ? "fill-secondary text-secondary" : "text-border"}`}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}

