import type { Metadata } from 'next';
import StockistApplyPage from '@/views/StockistApplyPage';

export const metadata: Metadata = {
  title: 'Apply to Stock NECTA Labs | Wholesale Enquiries',
  description: 'Apply to become a NECTA Labs stockist. We work with independent wellness spaces, gyms, spas, cafés, and health retailers.',
};

export default function StockistApplyRoute() {
  return <StockistApplyPage />;
}
