import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProductPage from '@/views/ProductPage';

const title = "NECTA FOCUS — Lion's Mane 500mg for Mental Clarity";
const description =
  "FOCUS organic functional infusion: Lion's Mane 500mg, L-Theanine 80mg, Rhodiola 200mg. Mental clarity without the crash. Vanilla Bean flavour. Pump bottle from £25/mo.";
const canonical = 'https://nectalabs.com/shop/focus';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: {
    title: `${title} | NECTA Labs`,
    description,
    url: canonical,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'NECTA FOCUS infusion' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/og-image.jpg'] },
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'NECTA FOCUS Organic Functional Infusion',
  description,
  brand: { '@type': 'Brand', name: 'NECTA Labs' },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'GBP',
    price: 25,
    availability: 'https://schema.org/PreOrder',
    url: canonical,
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.8,
    reviewCount: 127,
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
    { '@type': 'ListItem', position: 3, name: 'FOCUS', item: canonical },
  ],
};

export default function FocusPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Suspense><ProductPage /></Suspense>
    </>
  );
}
