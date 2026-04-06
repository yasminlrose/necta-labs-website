import type { Metadata } from 'next';
import ShopPage from '@/views/ShopPage';

export const metadata: Metadata = {
  title: 'Shop Organic Functional Infusions',
  description: 'Shop all NECTA Labs organic functional infusions — FOCUS, IMMUNITY, CALM & GLOW. Pump bottles and sachets. Free UK delivery over £35.',
  alternates: { canonical: 'https://nectalabs.com/shop' },
  openGraph: {
    title: 'Shop Organic Functional Infusions | NECTA Labs',
    description: 'Shop all NECTA Labs organic functional infusions — FOCUS, IMMUNITY, CALM & GLOW.',
    url: 'https://nectalabs.com/shop',
    images: [{ url: '/og-image.jpg' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nectalabs.com' },
    { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://nectalabs.com/shop' },
  ],
};

export default function ShopPageRoute() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ShopPage />
    </>
  );
}
