import type { Metadata } from 'next';
import { Suspense } from 'react';
import SachetProductPage from '@/views/SachetProductPage';

const title = 'NECTA CALM Sachets — Chamomile & Lemon Balm | 7, 14, 30 or 90-Day Box';
const description =
  'CALM organic functional infusion sachets: Chamomile 150mg, Lemon Balm 150mg, Jujube Seed 200mg. Single-serve, tear-and-pour. Honey Caramel. From £12 for a 7-day trial.';
const canonical = 'https://www.nectalabs.com/shop/calm-sachets';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['calm sachets UK', 'ashwagandha sachets UK', 'stress relief sachets UK', 'adaptogen calm sachet', 'portable calm supplement UK', 'anxiety supplement sachet UK'],
  alternates: { canonical },
  openGraph: {
    title: `${title} | NECTA Labs`,
    description,
    url: canonical,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'NECTA CALM sachets' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/og-image.jpg'] },
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'NECTA CALM Organic Functional Infusion Sachets',
  description,
  image: 'https://www.nectalabs.com/og-image.jpg',
  sku: 'NECTA-CALM-SACHETS',
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
    { '@type': 'ListItem', position: 3, name: 'CALM Sachets', item: canonical },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is in NECTA CALM sachets?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Each NECTA CALM sachet contains Chamomile 150mg, Lemon Balm 150mg, and Jujube Seed 200mg — the same formula as the CALM pump bottle, in a single-serve tear-and-pour format. Honey Caramel flavour. Organic, vegan.',
      },
    },
    {
      '@type': 'Question',
      name: 'When should I take NECTA CALM sachets?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CALM sachets work at any time you need stress support. Morning for all-day cortisol regulation, afternoon during high-stress periods, or evening in warm oat milk or chamomile tea as part of a wind-down routine. The calming ingredients (chamomile, lemon balm) work well before bed for improved sleep quality without sedation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I take CALM sachets to work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes — this is one of the best use cases for sachet format. Keep a week's supply in your desk drawer. Tear one into your tea or coffee when the day gets stressful. No bottles, no measuring, no fridge needed. Sachets are the most practical format for workplace use.",
      },
    },
    {
      '@type': 'Question',
      name: 'How many CALM sachets come in a box?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'NECTA CALM sachets are available in 7-day (7 sachets), 14-day (14 sachets), 30-day (30 sachets), and 90-day (90 sachets) boxes. The 7-day box is ideal for a trial. The 30 and 90-day boxes offer the best value and ensure you have a continuous supply for the 4–8 weeks needed to see full adaptogenic benefits.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do CALM sachets help with anxiety?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CALM sachets contain ingredients with clinical evidence for anxiety and stress reduction. Lemon balm has GABAergic activity — multiple trials show reduced anxiety and improved mood. Chamomile significantly reduced generalised anxiety disorder symptoms in a 2009 University of Pennsylvania RCT. These are not sedatives — they support calm without drowsiness.',
      },
    },
  ],
};

export default function CalmSachetsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Suspense><SachetProductPage slug="calm-sachets" /></Suspense>
    </>
  );
}
