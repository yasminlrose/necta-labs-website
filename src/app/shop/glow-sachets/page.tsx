import type { Metadata } from 'next';
import { Suspense } from 'react';
import SachetProductPage from '@/views/SachetProductPage';

const title = 'NECTA GLOW Sachets — Marine Collagen 2.5g | 7, 14, 30 or 90-Day Box';
const description =
  'GLOW organic functional infusion sachets: Marine Collagen 2.5g, Hyaluronic Acid 120mg, CoQ10 80mg. Single-serve, tear-and-pour. Cherry Almond. From £12 for a 7-day trial.';
const canonical = 'https://nectalabs.com/shop/glow-sachets';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: {
    title: `${title} | NECTA Labs`,
    description,
    url: canonical,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'NECTA GLOW sachets' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/og-image.jpg'] },
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'NECTA GLOW Organic Functional Infusion Sachets',
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
    ratingValue: 4.9,
    reviewCount: 153,
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
    { '@type': 'ListItem', position: 3, name: 'GLOW Sachets', item: canonical },
  ],
};

export default function GlowSachetsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Suspense><SachetProductPage /></Suspense>
    </>
  );
}
