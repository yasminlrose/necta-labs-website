import Link from 'next/link';
import { getAllArticles } from '@/data/articles';

const FEATURED_SLUGS = [
  'mushroom-coffee-benefits',
  'ashwagandha-benefits',
  'how-to-lower-cortisol-naturally',
  'what-is-an-adaptogen',
];

export default function LearnTeaserSection() {
  const all = getAllArticles();
  const featured = FEATURED_SLUGS.map((s) => all.find((a) => a.slug === s)).filter(Boolean) as ReturnType<typeof getAllArticles>;

  return (
    <section className="py-16 md:py-20 bg-muted/30 border-t border-border">
      <div className="necta-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/40 mb-2">The Science</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">From the Lab</h2>
          </div>
          <Link
            href="/learn"
            className="text-sm font-semibold text-primary hover:underline underline-offset-2 hidden md:block"
          >
            View all articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((article) => (
            <Link
              key={article.slug}
              href={`/learn/${article.slug}`}
              className="group flex flex-col bg-white border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                {article.category}
              </span>
              <h3 className="text-sm font-bold text-foreground leading-snug mb-2 group-hover:underline underline-offset-2 flex-1">
                {article.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {article.description}
              </p>
              <span className="mt-4 text-xs font-semibold text-primary">
                Read article →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/learn" className="text-sm font-semibold text-primary hover:underline">
            View all articles →
          </Link>
        </div>
      </div>
    </section>
  );
}
