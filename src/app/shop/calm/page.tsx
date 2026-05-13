import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProductPage from '@/views/ProductPage';

const title = 'NECTA CALM — Chamomile & Lemon Balm for Stress Relief';
const description =
  'CALM organic functional infusion: Chamomile 150mg, Lemon Balm 150mg, Jujube Seed 200mg. Stress relief without drowsiness. Honey Caramel flavour. Pump bottle from £25/mo.';
const canonical = 'https://www.nectalabs.com/shop/calm';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['stress relief drink UK', 'chamomile supplement', 'lemon balm drink', 'anxiety relief infusion', 'calm supplement', 'adaptogen stress', 'natural stress relief UK'],
  alternates: { canonical },
  openGraph: {
    title: `${title} | NECTA Labs`,
    description,
    url: canonical,
    images: [{ url: 'https://www.nectalabs.com/bottle-calm.jpeg', width: 1200, height: 630, alt: 'NECTA CALM pump bottle' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['https://www.nectalabs.com/bottle-calm.jpeg'] },
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'NECTA CALM Organic Functional Infusion',
  description,
  image: 'https://www.nectalabs.com/bottle-calm.jpeg',
  sku: 'NECTA-CALM-250',
  brand: { '@type': 'Brand', name: 'NECTA Labs' },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'GBP',
    price: 25,
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
    { '@type': 'ListItem', position: 3, name: 'CALM', item: canonical },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What ingredients are in NECTA CALM?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'NECTA CALM contains Chamomile 150mg, Lemon Balm 150mg, and Jujube Seed 200mg — all at clinically researched doses. It is organic, UK-made, and Honey Caramel flavoured.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does NECTA CALM make you drowsy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. NECTA CALM is formulated for stress relief without drowsiness. The combination of Chamomile, Lemon Balm, and Jujube Seed promotes calm focus rather than sedation, making it suitable for daytime use.',
      },
    },
    {
      '@type': 'Question',
      name: 'How quickly does NECTA CALM work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most customers notice a difference within 7–14 days of consistent daily use. Some ingredients like Lemon Balm can produce a sense of calm within 30–60 minutes of a single dose.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I add NECTA CALM to tea or coffee?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. NECTA CALM is fully stable in hot and cold beverages. Add 2 pumps to tea, coffee, matcha, or any drink at any temperature.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is NECTA CALM vegan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, NECTA CALM is fully vegan. All ingredients are plant-derived.',
      },
    },
  ],
};

export default function CalmPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Suspense><ProductPage slug="calm" /></Suspense>
    </>
  );
}
