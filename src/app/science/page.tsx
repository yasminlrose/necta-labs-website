import type { Metadata } from 'next';
import SciencePage from '@/views/SciencePage';

export const metadata: Metadata = {
  title: 'The Science — Ingredients & Research',
  description: 'Explore the research behind NECTA Labs organic functional infusions. Every adaptogen, mushroom, and botanical clinically dosed and third-party tested.',
  alternates: { canonical: 'https://nectalabs.com/science' },
  openGraph: { url: 'https://nectalabs.com/science', images: [{ url: '/og-image.jpg' }] },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nectalabs.com' },
    { '@type': 'ListItem', position: 2, name: 'Science', item: 'https://nectalabs.com/science' },
  ],
};

export default function ScienceRoute() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SciencePage />
    </>
  );
}
