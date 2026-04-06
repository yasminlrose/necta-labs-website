import Link from 'next/link';

export const metadata = { title: 'Order Confirmed — NECTA Labs' };

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <div className="max-w-md w-full">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-primary mb-3">You're all set.</h1>
        <p className="text-base text-primary/60 mb-2">
          Your order is confirmed. We've sent a confirmation to your email.
        </p>
        <p className="text-sm text-primary/40 mb-8">
          If anything changes with your timeline, we'll let you know straight away.
        </p>

        <Link
          href="/shop"
          className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors"
        >
          Back to shop
        </Link>
      </div>
    </main>
  );
}
