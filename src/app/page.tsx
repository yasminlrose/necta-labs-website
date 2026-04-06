import type { Metadata } from 'next';
import Index from '@/views/Index';

export const metadata: Metadata = {
  title: 'NECTA Labs — Organic Functional Infusions for Coffee & Tea',
  description: 'Premium organic functional infusions with Lion\'s Mane, Reishi, Ashwagandha & more. Add to any drink. Research-backed doses. UK made. Join the waitlist.',
  alternates: { canonical: 'https://nectalabs.com' },
  openGraph: {
    title: 'NECTA Labs — Organic Functional Infusions for Coffee & Tea',
    description: 'Premium organic functional infusions with Lion\'s Mane, Reishi, Ashwagandha & more. Add to any drink. Research-backed doses. UK made.',
    url: 'https://nectalabs.com',
    images: [{ url: '/og-image.jpg' }],
  },
};

export default function HomePage() {
  return <Index />;
}
