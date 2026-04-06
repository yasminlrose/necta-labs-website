import type { Metadata } from 'next';
import { Suspense } from 'react';
import StockistPortalPage from '@/views/StockistPortalPage';

export const metadata: Metadata = {
  title: 'Stockist Portal',
  description: 'NECTA Labs stockist management portal.',
  robots: { index: false, follow: false },
};

export default function StockistPortalRoute() {
  return (
    <Suspense>
      <StockistPortalPage />
    </Suspense>
  );
}
