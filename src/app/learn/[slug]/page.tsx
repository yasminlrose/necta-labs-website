import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getArticle, getAllArticles } from '@/data/articles';

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

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const canonical = `https://www.nectalabs.com/learn/${slug}`;

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

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />

      <div className="necta-container py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/learn" className="hover:text-foreground transition-colors">Learn</Link>
            <span>/</span>
            <span className="text-foreground truncate">{article.title}</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                {article.category}
              </span>
              <span className="text-xs text-muted-foreground">{article.readingTime}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-4">
              {article.title}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              {article.description}
            </p>
          </div>

          {/* Article body */}
          <div
            className="prose prose-sm md:prose-base max-w-none
              prose-headings:font-bold prose-headings:text-foreground
              prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
              prose-p:text-foreground/75 prose-p:leading-relaxed
              prose-li:text-foreground/75
              prose-strong:text-foreground prose-strong:font-semibold
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-ul:space-y-1 prose-ol:space-y-1"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Related product CTA */}
          {article.relatedProduct && (
            <div className="mt-14 p-6 rounded-2xl border border-border bg-muted/30">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Featured In</p>
              <p className="text-base font-bold text-foreground mb-1">{article.relatedProduct.name}</p>
              <p className="text-sm text-muted-foreground mb-4">
                The formula built around the ingredients covered in this article — clinically dosed, organic, UK made.
              </p>
              <Link
                href={`/shop/${article.relatedProduct.slug}`}
                className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors"
              >
                View {article.relatedProduct.name} →
              </Link>
            </div>
          )}

          {/* Back to Learn */}
          <div className="mt-10 pt-10 border-t border-border">
            <Link href="/learn" className="text-sm font-semibold text-primary hover:underline">
              ← Back to Learn
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
