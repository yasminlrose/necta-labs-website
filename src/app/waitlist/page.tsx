import type { Metadata } from 'next';
import WaitlistPage from '@/views/WaitlistPage';

export const metadata: Metadata = {
  title: 'Join the Waitlist',
  description: 'Be first to know when NECTA Labs organic functional infusions launch. Join the waitlist for early access and exclusive offers.',
  alternates: { canonical: 'https://nectalabs.com/waitlist' },
  openGraph: { url: 'https://nectalabs.com/waitlist', images: [{ url: '/og-image.jpg' }] },
};

export default function WaitlistRoute() {
  return <WaitlistPage />;
}
