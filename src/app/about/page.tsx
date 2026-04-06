import type { Metadata } from 'next';
import AboutPage from '@/views/AboutPage';

export const metadata: Metadata = {
  title: 'Our Story — About NECTA Labs',
  description: 'Meet the founder behind NECTA Labs. Organic functional infusions designed to make adaptogens effortless for your daily ritual.',
  alternates: { canonical: 'https://nectalabs.com/about' },
  openGraph: { url: 'https://nectalabs.com/about', images: [{ url: '/og-image.jpg' }] },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nectalabs.com' },
    { '@type': 'ListItem', position: 2, name: 'About', item: 'https://nectalabs.com/about' },
  ],
};

export default function AboutRoute() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <AboutPage />
    </>
  );
}
