import type { Metadata } from 'next';
import StockistPage from '@/views/StockistPage';

export const metadata: Metadata = {
  title: 'Become a Stockist',
  description: 'Stock NECTA Labs organic functional infusions in your café, gym, or wellness space. UK wholesale enquiries welcome.',
  alternates: { canonical: 'https://nectalabs.com/stockist' },
  openGraph: { url: 'https://nectalabs.com/stockist', images: [{ url: '/og-image.jpg' }] },
};

export default function StockistRoute() {
  return <StockistPage />;
}
