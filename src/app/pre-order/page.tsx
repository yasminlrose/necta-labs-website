import type { Metadata } from 'next';
import PreOrderPage from '@/views/PreOrderPage';

export const metadata: Metadata = {
  title: 'Pre-Order — Organic Functional Infusions',
  description: 'Reserve your NECTA Labs organic functional infusions before launch. Limited quantities available.',
  alternates: { canonical: 'https://nectalabs.com/pre-order' },
  openGraph: { url: 'https://nectalabs.com/pre-order', images: [{ url: '/og-image.jpg' }] },
};

export default function PreOrderRoute() {
  return <PreOrderPage />;
}
