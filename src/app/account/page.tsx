import type { Metadata } from 'next';
import { Suspense } from 'react';
import AccountPage from '@/views/AccountPage';

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your NECTA Labs subscriptions, orders, and account settings.',
  robots: { index: false, follow: false },
};

export default function AccountRoute() {
  return (
    <Suspense>
      <AccountPage />
    </Suspense>
  );
}
