import type { Metadata } from 'next';
import { Suspense } from 'react';
import SachetProductPage from '@/views/SachetProductPage';

const title = 'NECTA IMMUNITY Sachets — Reishi 2g | 7, 14, 30 or 90-Day Box';
const description =
  'IMMUNITY organic functional infusion sachets: Reishi 2g, Elderberry 500mg, Ashwagandha 300mg. Single-serve, tear-and-pour. Hazelnut & Orange. From £12 for a 7-day trial.';
const canonical = 'https://www.nectalabs.com/shop/immunity-sachets';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['immunity sachets UK', 'reishi sachets UK', 'immune supplement sachets', 'functional mushroom sachet UK', 'elderberry sachet UK', 'immune support single serve UK'],
  alternates: { canonical },
  openGraph: {
    title: `${title} | NECTA Labs`,
    description,
    url: canonical,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'NECTA IMMUNITY sachets' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/og-image.jpg'] },
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'NECTA IMMUNITY Organic Functional Infusion Sachets',
  description,
  image: 'https://www.nectalabs.com/og-image.jpg',
  sku: 'NECTA-IMMUNITY-SACHETS',
  brand: { '@type': 'Brand', name: 'NECTA Labs' },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'GBP',
    price: 45,
    availability: 'https://schema.org/PreOrder',
    url: canonical,
    priceValidUntil: '2026-12-31',
    seller: { '@type': 'Organization', name: 'NECTA Labs' },
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.nectalabs.com' },
    { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://www.nectalabs.com/shop' },
    { '@type': 'ListItem', position: 3, name: 'IMMUNITY Sachets', item: canonical },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is in NECTA IMMUNITY sachets?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Each NECTA IMMUNITY sachet contains Reishi 2g (dual-extracted), Elderberry 500mg, and Ashwagandha 300mg — the same clinically-dosed formula as the pump bottle in a single-serve format. Hazelnut & Orange flavour. Organic, vegan.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does reishi at 2g compare to other mushroom supplements?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most reishi supplements contain 200–500mg. Clinical research uses 1–5g of standardised extract daily. NECTA IMMUNITY sachets contain 2g of dual-extracted reishi — within the clinical dose range where immune modulation and adaptogenic effects have been demonstrated. Most competitors are dosed at 10–25% of this.',
      },
    },
    {
      '@type': 'Question',
      name: 'When is the best time to take IMMUNITY sachets?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Any time of day — reishi and elderberry have no stimulant properties and are flexible on timing. Morning in coffee or tea is most convenient for daily habit consistency. Some people prefer evening as reishi supports sleep quality. The most important thing is daily consistency.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use IMMUNITY sachets during cold and flu season?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — IMMUNITY sachets are designed for exactly this use case. Reishi beta-glucans are some of the most studied compounds for immune modulation. Elderberry has specific antiviral properties studied for respiratory infections. The sachet format is also practical for travel and offices — the exact settings where immune challenges are highest.',
      },
    },
    {
      '@type': 'Question',
      name: 'How quickly do IMMUNITY sachets start working?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Immune modulation is cumulative. Daily use for 4–8 weeks builds the baseline immune support effect. Acute elderberry antiviral properties are faster-acting (relevant when you feel a cold coming on). For consistent immune resilience, treat IMMUNITY sachets as a daily maintenance supplement rather than an acute intervention.',
      },
    },
  ],
};

export default function ImmunitySachetsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Suspense><SachetProductPage slug="immunity-sachets" /></Suspense>
    </>
  );
}
