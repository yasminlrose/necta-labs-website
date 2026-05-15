import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getArticle, getAllArticles, type Article } from '@/data/articles';
import { articleFaqs } from '@/data/faqs';
import { products } from '@/data/products';

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: 'Article Not Found' };
  const canonical = `https://www.nectalabs.com/learn/${slug}`;
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical },
    openGraph: {
      title: `${article.title} | NECTA Labs`,
      description: article.description,
      url: canonical,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: [{ url: 'https://www.nectalabs.com/og-image.jpg', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: article.title, description: article.description },
  };
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; heroBg: string }> = {
  Ingredients: { bg: 'bg-emerald-50 text-emerald-700', text: 'text-emerald-700', heroBg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 40%, #6ee7b7 100%)' },
  Wellness:    { bg: 'bg-violet-50 text-violet-700',   text: 'text-violet-700',   heroBg: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 40%, #c4b5fd 100%)' },
  'How To':    { bg: 'bg-amber-50 text-amber-700',     text: 'text-amber-700',    heroBg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 40%, #fcd34d 100%)' },
  Nootropics:  { bg: 'bg-blue-50 text-blue-700',       text: 'text-blue-700',     heroBg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 40%, #93c5fd 100%)' },
};

const PRODUCT_HERO: Record<string, string> = {
  focus:    'linear-gradient(135deg, #C8E8E5 0%, #a8d4d0 40%, #7bbdb7 100%)',
  immunity: 'linear-gradient(135deg, #F2DDD4 0%, #e8c4b0 40%, #d4906e 100%)',
  calm:     'linear-gradient(135deg, #E0DAEF 0%, #ccc4e8 40%, #a898d8 100%)',
  glow:     'linear-gradient(135deg, #F0DEDA 0%, #e4c4bc 40%, #c88880 100%)',
};

const PRODUCT_ACCENT: Record<string, string> = {
  focus: '#5B9E99', immunity: '#C06040', calm: '#8878C0', glow: '#B06455',
};

function getRelatedArticles(current: Article, all: Article[]): Article[] {
  const sameCategory = all.filter((a) => a.slug !== current.slug && a.category === current.category);
  const others = all.filter((a) => a.slug !== current.slug && a.category !== current.category);
  return [...sameCategory, ...others].slice(0, 3);
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const related = getRelatedArticles(article, getAllArticles());

  const canonical = `https://www.nectalabs.com/learn/${slug}`;
  const faqs = articleFaqs[slug] ?? [];

  const relatedProductData = article.relatedProduct?.slug
    ? products[article.relatedProduct.slug as keyof typeof products]
    : null;

  const heroBg = article.relatedProduct?.slug
    ? (PRODUCT_HERO[article.relatedProduct.slug] ?? CATEGORY_STYLES[article.category]?.heroBg ?? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)')
    : (CATEGORY_STYLES[article.category]?.heroBg ?? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)');

  const accentColor = article.relatedProduct?.slug
    ? (PRODUCT_ACCENT[article.relatedProduct.slug] ?? '#1E2D3D')
    : '#1E2D3D';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Organization', name: 'NECTA Labs', url: 'https://www.nectalabs.com' },
    publisher: {
      '@type': 'Organization',
      name: 'NECTA Labs',
      logo: { '@type': 'ImageObject', url: 'https://www.nectalabs.com/favicon.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    image: 'https://www.nectalabs.com/og-image.jpg',
    keywords: article.keywords.join(', '),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.nectalabs.com' },
      { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://www.nectalabs.com/learn' },
      { '@type': 'ListItem', position: 3, name: article.title, item: canonical },
    ],
  };

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  } : null;

  const catStyle = CATEGORY_STYLES[article.category] ?? { bg: 'bg-muted text-muted-foreground', text: 'text-foreground', heroBg: '' };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <Header />

      {/* ── Hero banner ── */}
      <div style={{ background: heroBg }} className="w-full pt-10 pb-0">
        <div className="necta-container max-w-3xl px-5 md:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-primary/40 mb-6">
            <Link href="/" className="hover:text-primary/70 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/learn" className="hover:text-primary/70 transition-colors">Learn</Link>
            <span>/</span>
            <span className="text-primary/60 truncate">{article.title}</span>
          </nav>

          {/* Category + meta */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${catStyle.bg}`}>
              {article.category}
            </span>
            <span className="text-xs text-primary/50">{article.readingTime}</span>
            <span className="text-xs text-primary/40">
              {new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-primary leading-tight mb-5">
            {article.title}
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-primary/60 leading-relaxed max-w-2xl mb-8">
            {article.description}
          </p>

          {/* Ingredient key-facts strip (if related product) */}
          {relatedProductData && (
            <div className="flex flex-wrap gap-2 mb-8">
              {relatedProductData.ingredients.slice(0, 4).map((ing) => (
                <span
                  key={ing.name}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-sm shadow-sm"
                  style={{ color: accentColor }}
                >
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: accentColor }} />
                  {ing.name} {ing.dose}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Product image strip (if related product) */}
        {relatedProductData && (
          <div className="necta-container max-w-3xl px-5 md:px-8 flex items-end gap-4">
            <div className="relative h-28 w-20 shrink-0">
              <Image
                src={relatedProductData.bottleImage}
                alt={`NECTA ${relatedProductData.name}`}
                fill
                className="object-contain object-bottom"
              />
            </div>
            <div className="pb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-1">Featured formula</p>
              <p className="text-sm font-bold text-primary">NECTA {relatedProductData.name}</p>
              <p className="text-xs text-primary/50 italic">{relatedProductData.flavor}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Article body ── */}
      <div className="necta-container max-w-3xl px-5 md:px-8 py-12 md:py-16">

        <article
          className="
            prose prose-base md:prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-primary prose-headings:leading-tight
            prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-14 prose-h2:mb-5 prose-h2:pt-4
            prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4
            prose-h4:text-base prose-h4:mt-6 prose-h4:mb-2 prose-h4:font-semibold
            prose-p:text-primary/70 prose-p:leading-relaxed prose-p:mb-6
            prose-li:text-primary/70 prose-li:mb-2
            prose-strong:text-primary prose-strong:font-semibold
            prose-a:font-medium prose-a:no-underline hover:prose-a:underline
            prose-ul:space-y-2 prose-ol:space-y-2
            prose-blockquote:border-l-4 prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-primary/50
            prose-table:text-sm prose-th:font-semibold prose-th:text-primary prose-td:text-primary/70
            [&>*:first-child]:mt-0
          "
          style={{ '--tw-prose-links': accentColor } as React.CSSProperties}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* ── Full ingredient breakdown (if related product) ── */}
        {relatedProductData && (
          <div className="mt-16 rounded-2xl overflow-hidden border border-border">
            <div className="px-6 py-5" style={{ background: heroBg }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-1">Full Formula</p>
              <h3 className="text-xl font-bold text-primary">NECTA {relatedProductData.name} — Every ingredient, every dose</h3>
              <p className="text-sm text-primary/50 mt-1">{relatedProductData.heroIngredientsSummary}</p>
            </div>
            <div className="bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-primary/40 uppercase tracking-wide">Ingredient</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-primary/40 uppercase tracking-wide">Dose</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-primary/40 uppercase tracking-wide hidden sm:table-cell">Benefit</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedProductData.ingredients.map((ing, i) => (
                    <tr key={ing.name} className={`border-b border-border/40 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-5 py-3 font-semibold text-primary text-sm">{ing.name}</td>
                      <td className="px-4 py-3 text-right font-bold text-sm whitespace-nowrap" style={{ color: accentColor }}>{ing.dose}</td>
                      <td className="px-5 py-3 text-primary/55 text-xs leading-snug hidden sm:table-cell">{ing.benefit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-white border-t border-border">
              <Link
                href={`/pre-order#${article.relatedProduct?.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full text-white transition-all hover:opacity-90"
                style={{ backgroundColor: accentColor }}
              >
                Pre-order NECTA {relatedProductData.name} →
              </Link>
            </div>
          </div>
        )}

        {/* ── FAQ ── */}
        {faqs.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map(({ q, a }, i) => (
                <div key={i} className="border border-border rounded-xl p-6">
                  <h3 className="text-base font-bold text-primary mb-3">{q}</h3>
                  <p className="text-sm text-primary/60 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Related Articles ── */}
        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">Read Next</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => {
                const relStyle = CATEGORY_STYLES[rel.category] ?? { bg: 'bg-muted text-muted-foreground', heroBg: '#f3f4f6' };
                return (
                  <Link
                    key={rel.slug}
                    href={`/learn/${rel.slug}`}
                    className="group flex flex-col rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-24 w-full" style={{ background: relStyle.heroBg }} />
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${relStyle.bg}`}>
                          {rel.category}
                        </span>
                        <span className="text-[10px] text-primary/40">{rel.readingTime}</span>
                      </div>
                      <p className="text-sm font-semibold text-primary group-hover:underline underline-offset-2 leading-snug">
                        {rel.title}
                      </p>
                      <p className="text-xs text-primary/50 leading-relaxed line-clamp-2">{rel.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-12 pt-10 border-t border-border">
          <Link href="/learn" className="text-sm font-semibold text-primary/60 hover:text-primary transition-colors hover:underline">
            ← Back to Learn
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
