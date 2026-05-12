'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, ShoppingBag, CheckCircle2, Eye, EyeOff, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';

interface OrderData {
  email: string;
  firstName: string;
  productName: string;
  amount: string;
  mode: string;
}

// 'magic'  = existing account, magic link sent
// 'signup' = no account, show create-account form
// 'done'   = already logged in or just signed up
// 'skipped'= user dismissed the card
type AccountState = 'checking' | 'magic' | 'signup' | 'done' | 'skipped';

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-primary/50">Loading…</p>
      </main>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  const { count, items, openCart, clearCart } = useCart();
  const isCartCheckout = searchParams?.get('source') === 'cart';

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(!!sessionId);
  const [accountState, setAccountState] = useState<AccountState>('checking');
  const [magicSent, setMagicSent] = useState(false);

  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (isCartCheckout) clearCart();
  }, [isCartCheckout]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/order-session?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then(async (data) => {
        if (data.email) {
          setOrder(data);

          // If already logged in, nothing to do
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            setAccountState('done');
            return;
          }

          // Check if account exists for this email
          const res = await fetch(`/api/check-account?email=${encodeURIComponent(data.email)}`);
          const { exists } = await res.json();

          // Whether or not they have an account, the webhook confirmation email
          // already contains a sign-in link — don't send a second email here.
          if (exists) {
            setAccountState('magic');
          } else {
            setAccountState('signup');
          }
        }
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleResendMagicLink = async () => {
    if (!order?.email) return;
    setAuthLoading(true);
    await fetch('/api/send-magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: order.email }),
    });
    setAuthLoading(false);
    setMagicSent(true);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order?.email || !password) return;
    setAuthLoading(true);
    setAuthError('');
    const { error } = await supabase.auth.signUp({
      email: order.email,
      password,
      options: {
        data: { full_name: order.firstName },
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });
    setAuthLoading(false);
    if (error) { setAuthError(error.message); return; }
    setAccountState('done');
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/account` },
    });
  };

  const showAccountCard = !loading && order?.email && accountState !== 'done' && accountState !== 'skipped' && accountState !== 'checking';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <div className="max-w-md w-full">
        {/* Success icon */}
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-primary mb-3">Your pre-order is confirmed.</h1>
        <p className="text-base text-primary/60 mb-2">
          Charged 1 November 2026 · Dispatched from 17 November 2026. Check your email for your confirmation.
        </p>
        <p className="text-sm text-primary/40 mb-8">
          Thank you for being here at the beginning.
        </p>

        {/* Account card */}
        {showAccountCard && (
          <div className="bg-white border border-border rounded-2xl p-6 mb-8 text-left">

            {/* Existing account — sign-in link is in the confirmation email */}
            {accountState === 'magic' && (
              <>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-base font-bold text-primary mb-1">Check your confirmation email</h2>
                <p className="text-xs text-primary/50 mb-4">
                  Your order confirmation has been sent to <strong>{order!.email}</strong>. It includes a button to sign in to your account — no password needed.
                </p>
                {!magicSent ? (
                  <button
                    onClick={handleResendMagicLink}
                    disabled={authLoading}
                    className="w-full border border-border text-primary font-medium py-3 rounded-lg text-sm hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    {authLoading ? 'Sending…' : "Didn't get it? Resend sign-in link"}
                  </button>
                ) : (
                  <p className="text-xs text-green-600 text-center">Sign-in link sent — check your inbox.</p>
                )}
              </>
            )}

            {/* No account — create one */}
            {accountState === 'signup' && (
              <>
                <h2 className="text-base font-bold text-primary mb-1">Save your order & subscription details</h2>
                <p className="text-xs text-primary/50 mb-4">
                  Create an account with <strong>{order!.email}</strong> to track your order and manage your subscription.
                </p>
                <form onSubmit={handleSignup} className="space-y-3">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Choose a password"
                      required
                      minLength={6}
                      className="w-full pl-10 pr-10 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/30">
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {authError && <p className="text-xs text-red-500">{authError}</p>}
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-primary text-white font-semibold py-3 rounded-lg text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {authLoading ? 'Creating account…' : 'Create my account'}
                  </button>
                </form>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                  <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-primary/40">or</span></div>
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-2 border border-border py-3 rounded-lg text-sm font-medium text-primary hover:bg-muted transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
              </>
            )}

            <button
              onClick={() => setAccountState('skipped')}
              className="w-full text-center text-xs text-primary/40 hover:text-primary mt-4 transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}

        {/* Signed in / account created confirmation */}
        {accountState === 'done' && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-sm font-medium text-green-700 text-left">
              You're signed in. <Link href="/account" className="underline">View your account →</Link>
            </p>
          </div>
        )}

        {/* Remaining basket */}
        {count > 0 && !isCartCheckout && (
          <div className="bg-white border border-border rounded-2xl p-5 mb-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <p className="font-semibold text-primary text-sm">
                You still have {count} item{count !== 1 ? 's' : ''} in your basket
              </p>
            </div>
            <div className="flex gap-2 mb-4">
              {items.slice(0, 4).map((item) => (
                <div key={item.id} className="relative w-14 h-14 rounded-lg bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center">
                  <Image
                    src={typeof item.image === 'string' ? item.image : (item.image as unknown as { src: string }).src}
                    alt={item.name}
                    fill
                    className="object-contain p-1"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                  {item.quantity > 1 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  )}
                </div>
              ))}
              {items.length > 4 && (
                <div className="w-14 h-14 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary/50">+{items.length - 4}</span>
                </div>
              )}
            </div>
            <button
              onClick={openCart}
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg text-sm hover:bg-primary/90 transition-colors"
            >
              View basket & checkout
            </button>
          </div>
        )}

        <Link
          href="/pre-order"
          className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors"
        >
          Back to pre-order
        </Link>
      </div>
    </main>
  );
}
