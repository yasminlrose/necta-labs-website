import type { Metadata } from 'next';
import WaitlistPage from '@/views/WaitlistPage';

export const metadata: Metadata = {
  title: 'Founding Waitlist — Be First',
  description: 'First 100 founding members get 15% off every NECTA Labs order, forever. One pump of clinically dosed adaptogens into any drink. Join the waitlist.',
  alternates: { canonical: 'https://www.nectalabs.com/waitlist' },
  openGraph: {
    title: 'Join the NECTA Labs Founding Waitlist',
    description: 'First 100 founding members get 15% off every order, forever. Functional adaptogens that go in any drink.',
    url: 'https://www.nectalabs.com/waitlist',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'NECTA Labs — Functional Infusions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join the NECTA Labs Founding Waitlist',
    description: 'First 100 founding members get 15% off every order, forever.',
    images: ['/og-image.jpg'],
  },
};

export default function WaitlistRoute() {
  return <WaitlistPage />;
}
