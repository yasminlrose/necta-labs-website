import type { Metadata } from 'next';
import { Suspense } from 'react';
import SachetProductPage from '@/views/SachetProductPage';

const title = 'NECTA CALM Sachets — Chamomile & Lemon Balm | 7, 14, 30 or 90-Day Box';
const description =
  'CALM organic functional infusion sachets: Chamomile 150mg, Lemon Balm 150mg, Jujube Seed 200mg. Single-serve, tear-and-pour. Honey Caramel. From £12 for a 7-day trial.';
const canonical = 'https://nectalabs.com/shop/calm-sachets';

export const metadata: Metadata = {
  title,
  description,
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
  brand: { '@type': 'Brand', name: 'NECTA Labs' },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'GBP',
    price: 45,
    availability: 'https://schema.org/PreOrder',
    url: canonical,
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.7,
    reviewCount: 86,
    bestRating: 5,
    worstRating: 1,
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nectalabs.com' },
    { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://nectalabs.com/shop' },
    { '@type': 'ListItem', position: 3, name: 'CALM Sachets', item: canonical },
  ],
};

export default function CalmSachetsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Suspense><SachetProductPage /></Suspense>
    </>
  );
}
