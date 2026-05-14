import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllArticles } from '@/data/articles';

export const metadata: Metadata = {
  title: 'Learn — Adaptogens, Nootropics & Functional Wellness',
  description: 'Science-backed guides on adaptogens, nootropics, and functional ingredients. Learn how Lion\'s Mane, Ashwagandha, Reishi, and more actually work.',
  keywords: ['adaptogen guide', 'nootropics explained', 'functional wellness UK', 'lion\'s mane benefits', 'ashwagandha guide', 'reishi mushroom benefits', 'wellness education'],
  alternates: { canonical: 'https://www.nectalabs.com/learn' },
  openGraph: {
    title: 'Learn — Adaptogens, Nootropics & Functional Wellness | NECTA Labs',
    description: 'Science-backed guides on adaptogens, nootropics, and functional ingredients.',
    url: 'https://www.nectalabs.com/learn',
    images: [{ url: 'https://www.nectalabs.com/og-image.jpg' }],
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  Ingredients: 'bg-emerald-50 text-emerald-700',
  Wellness: 'bg-violet-50 text-violet-700',
  'How To': 'bg-amber-50 text-amber-700',
};

export default function LearnPage() {
  const articles = getAllArticles();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section
        className="pt-20 pb-10 md:pt-24 md:pb-12"
        style={{ background: 'linear-gradient(135deg, #D6EBEA 0%, #E0DAEF 50%, #F2DDD4 100%)' }}
      >
        <div className="necta-container text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-foreground/40 mb-3">NECTA Labs</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Learn</h1>
          <p className="text-sm text-foreground/55 max-w-md mx-auto">
            Science-backed guides on adaptogens, nootropics, and the ingredients in your daily ritual.
          </p>
        </div>
      </section>

      <div className="necta-container py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/learn/${article.slug}`}
              className="group flex flex-col border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Colour band by category */}
              <div
                className="h-2 w-full"
                style={{ background: article.relatedProduct ? 'hsl(var(--primary))' : '#e5e7eb' }}
              />
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${CATEGORY_COLORS[article.category] ?? 'bg-muted text-muted-foreground'}`}>
                    {article.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{article.readingTime}</span>
                </div>
                <h2 className="text-base font-bold text-foreground leading-snug mb-2 group-hover:underline underline-offset-2">
                  {article.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {article.description}
                </p>
                {article.relatedProduct && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="text-xs text-primary font-semibold">
                      Related: {article.relatedProduct.name} →
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
