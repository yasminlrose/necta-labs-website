import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProductPage from '@/views/ProductPage';

const title = 'NECTA IMMUNITY — Reishi 2g for Daily Immune Defence';
const description =
  'IMMUNITY organic functional infusion: Reishi 2g, Elderberry 500mg, Ashwagandha 300mg. Daily immune defence and resilience. Hazelnut & Orange flavour. Pump bottle 250ml from £29.';
const canonical = 'https://www.nectalabs.com/shop/immunity';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['reishi mushroom supplement UK', 'immune support drink', 'elderberry supplement', 'ashwagandha drink UK', 'immunity infusion', 'natural immune booster UK', 'functional mushroom drink'],
  alternates: { canonical },
  openGraph: {
    title: `${title} | NECTA Labs`,
    description,
    url: canonical,
    images: [{ url: 'https://www.nectalabs.com/bottle-immunity.jpeg', width: 1200, height: 630, alt: 'NECTA IMMUNITY pump bottle' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['https://www.nectalabs.com/bottle-immunity.jpeg'] },
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'NECTA IMMUNITY Organic Functional Infusion',
  description,
  image: 'https://www.nectalabs.com/bottle-immunity.jpeg',
  sku: 'NECTA-IMMUNITY-250',
  brand: { '@type': 'Brand', name: 'NECTA Labs' },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'GBP',
    price: 29,
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
    { '@type': 'ListItem', position: 3, name: 'IMMUNITY', item: canonical },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What ingredients are in NECTA IMMUNITY?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'NECTA IMMUNITY contains Reishi 2g, Elderberry 500mg, and Ashwagandha 300mg — all at clinically researched doses. It is organic, UK-made, and Hazelnut & Orange flavoured.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does NECTA IMMUNITY support the immune system?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Reishi mushroom at 2g has been shown in clinical research to modulate immune function. Elderberry 500mg provides antioxidant support, and Ashwagandha 300mg helps reduce cortisol — chronic stress is one of the biggest suppressors of immune function.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I take NECTA IMMUNITY every day?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All ingredients are used at doses consistent with long-term daily safety. We recommend 2 pumps per day in any hot or cold drink. Consult a healthcare professional if you are pregnant, breastfeeding, or on medication.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is NECTA IMMUNITY vegan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, NECTA IMMUNITY is fully vegan. All ingredients are plant or mushroom-derived.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I add NECTA IMMUNITY to drinks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use 2 pumps (approx. 30ml) per day, added to any hot or cold drink — coffee, tea, juice, or water. Fully stable at any temperature.',
      },
    },
  ],
};

export default function ImmunityPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Suspense><ProductPage slug="immunity" /></Suspense>
    </>
  );
}
