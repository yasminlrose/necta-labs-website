import type { Metadata } from 'next';
import HowItWorksPage from '@/views/HowItWorksPage';

export const metadata: Metadata = {
  title: 'How It Works — Organic Functional Infusions',
  description: 'Learn how NECTA Labs organic functional infusions work — clinically-dosed adaptogens in every pump. Add to coffee, tea, or any drink.',
  alternates: { canonical: 'https://nectalabs.com/how-it-works' },
  openGraph: { url: 'https://nectalabs.com/how-it-works', images: [{ url: '/og-image.jpg' }] },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nectalabs.com' },
    { '@type': 'ListItem', position: 2, name: 'How It Works', item: 'https://nectalabs.com/how-it-works' },
  ],
};

export default function HowItWorksRoute() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <HowItWorksPage />
    </>
  );
}
