import type { Metadata } from 'next';
import { Suspense } from 'react';
import PickAndMixPage from '@/views/PickAndMixPage';

export const metadata: Metadata = {
  title: 'Pick & Mix — Build Your Bundle',
  description: 'Mix any NECTA Labs organic functional infusions. Duo Bundle saves 10%, Trio saves 15%, Full Collection saves 25%.',
  alternates: { canonical: 'https://nectalabs.com/pick-and-mix' },
  openGraph: {
    title: 'Pick & Mix Bundle Builder | NECTA Labs',
    description: 'Build your own bundle of NECTA Labs organic functional infusions and save up to 25%.',
    url: 'https://nectalabs.com/pick-and-mix',
    images: [{ url: '/og-image.jpg' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nectalabs.com' },
    { '@type': 'ListItem', position: 2, name: 'Pick and Mix', item: 'https://nectalabs.com/pick-and-mix' },
  ],
};

export default function PickAndMixRoute() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Suspense>
        <PickAndMixPage />
      </Suspense>
    </>
  );
}
