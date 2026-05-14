import type { Metadata } from 'next';
import { Suspense } from 'react';
import SachetProductPage from '@/views/SachetProductPage';

const title = "NECTA FOCUS Sachets — Lion's Mane 500mg | 7, 14, 30 or 90-Day Box";
const description =
  'FOCUS organic functional infusion sachets: Lion\'s Mane 500mg, L-Theanine 80mg, Rhodiola 200mg. Single-serve, tear-and-pour. Vanilla Bean. From £12 for a 7-day trial.';
const canonical = 'https://www.nectalabs.com/shop/focus-sachets';

export const metadata: Metadata = {
  title,
  description,
  keywords: ["lion's mane sachets UK", 'adaptogen sachets UK', 'nootropic sachets UK', 'focus supplement sachets', 'lion\'s mane single serve', 'portable nootropic UK'],
  alternates: { canonical },
  openGraph: {
    title: `${title} | NECTA Labs`,
    description,
    url: canonical,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'NECTA FOCUS sachets' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/og-image.jpg'] },
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'NECTA FOCUS Organic Functional Infusion Sachets',
  description,
  image: 'https://www.nectalabs.com/og-image.jpg',
  sku: 'NECTA-FOCUS-SACHETS',
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
    { '@type': 'ListItem', position: 3, name: 'FOCUS Sachets', item: canonical },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is in NECTA FOCUS sachets?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Each NECTA FOCUS sachet contains Lion's Mane 500mg, L-Theanine 80mg, and Rhodiola Rosea 200mg — the same clinically-researched doses as the pump bottle, in a single-serve tear-and-pour format. Vanilla Bean flavour. Organic, vegan.",
      },
    },
    {
      '@type': 'Question',
      name: 'How do you use NECTA FOCUS sachets?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tear the sachet and pour into any hot or cold drink — coffee, tea, matcha, water, or a smoothie. Stir and drink as normal. One sachet = one complete daily serving. No measuring, no equipment needed.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are NECTA FOCUS sachets better than the pump bottle?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Same formula, different format. Sachets are ideal for travel, office use, and gym bags — they\'re portable, TSA-compliant, and require zero equipment. The pump bottle is best for daily home use (more precise, adjustable dose). Many people use both: pump bottle at home, sachets when away.',
      },
    },
    {
      '@type': 'Question',
      name: 'How quickly will I notice results from NECTA FOCUS sachets?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "L-Theanine's calming focus effect can be felt within 30–60 minutes of your first sachet, especially alongside your morning coffee. Rhodiola's fatigue-reducing effects build over 2–4 weeks. Lion's Mane works cumulatively over 4–12 weeks of daily use.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I take NECTA FOCUS sachets on a plane?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Sachets are flat, lightweight, and compliant with airline hand luggage rules. A week\'s supply fits easily in a small bag or pocket. There are no liquid restrictions on sachets, making them the ideal travel format for daily adaptogen use.',
      },
    },
  ],
};

export default function FocusSachetsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Suspense><SachetProductPage slug="focus-sachets" /></Suspense>
    </>
  );
}
