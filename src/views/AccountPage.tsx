'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard, Package, CreditCard, History,
  Settings, Star, LogOut, ShieldCheck, Lock, Mail, ArrowRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubscriptionsTab from "@/components/account/SubscriptionsTab";
import BillingTab from "@/components/account/BillingTab";
import OrderHistoryTab from "@/components/account/OrderHistoryTab";
import AccountSettingsTab from "@/components/account/AccountSettingsTab";
import LoyaltyTab from "@/components/account/LoyaltyTab";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type TabId = "subscriptions" | "billing" | "orders" | "settings" | "loyalty";

const tabs: { id: TabId; label: string; icon: React.ReactNode; mobileLabel: string }[] = [
  { id: "subscriptions", label: "My Subscriptions", mobileLabel: "Subscriptions", icon: <Package className="h-4 w-4" /> },
  { id: "billing",       label: "Billing & Payment", mobileLabel: "Billing",        icon: <CreditCard className="h-4 w-4" /> },
  { id: "orders",        label: "Order History",     mobileLabel: "Orders",         icon: <History className="h-4 w-4" /> },
  { id: "settings",      label: "Account Settings",  mobileLabel: "Settings",       icon: <Settings className="h-4 w-4" /> },
  { id: "loyalty",       label: "Loyalty & Rewards", mobileLabel: "Rewards",        icon: <Star className="h-4 w-4" /> },
];

function getInitials(name: string | undefined, email: string | undefined): string {
  if (name) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  }
  if (email) return email[0].toUpperCase();
  return "U";
}

function getMemberSince(dateStr: string | undefined): string {
  if (!dateStr) return "Recently joined";
  return new Date(dateStr).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

// ── Sign-in form shown when user is not authenticated ──────────────────────
function SignInView() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/account` },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSent(true);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/account` },
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-muted/30 flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/40 mb-3">NECTA Labs</p>
            <h1 className="text-2xl font-bold text-primary mb-2">Sign in to your account</h1>
            <p className="text-sm text-primary/50">View your pre-order, founding member perks, and subscription details.</p>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            {sent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="font-semibold text-primary mb-2">Check your email</h2>
                <p className="text-sm text-primary/50 leading-relaxed">
                  We've sent a sign-in link to <strong>{email}</strong>. Click it to access your account — no password needed.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 text-xs text-primary/40 hover:text-primary transition-colors underline"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <>
                <form onSubmit={handleMagicLink} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-primary/60 mb-1.5">Email address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 border border-border rounded-xl text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                    />
                  </div>
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {loading ? "Sending…" : "Send sign-in link"}
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </button>
                </form>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                  <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-primary/40">or</span></div>
                </div>

                <button
                  onClick={handleGoogle}
                  className="w-full flex items-center justify-center gap-2 border border-border py-3 rounded-xl text-sm font-medium text-primary hover:bg-muted transition-colors"
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
          </div>

          <p className="text-center text-xs text-primary/35 mt-5">
            No account yet? Place a pre-order and one will be created for you.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

// ── Main account dashboard ─────────────────────────────────────────────────
const AccountPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = (searchParams?.get("tab") as TabId) ?? "subscriptions";
  const [activeTab, setActiveTab] = useState<TabId>(
    tabs.some((t) => t.id === tabFromUrl) ? tabFromUrl : "subscriptions"
  );

  const handleTabChange = (id: TabId) => {
    setActiveTab(id);
    router.push(`/account?tab=${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // Show spinner while auth is initialising
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  // Not signed in — show sign-in form
  if (!user) return <SignInView />;

  const displayName = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "there";
  const initials = getInitials(user.user_metadata?.full_name as string, user.email);
  const memberSince = getMemberSince(user.created_at);
  const currentTabConfig = tabs.find((t) => t.id === activeTab)!;

  return (
    <>
      <Header />

      {/* Account hero */}
      <div className="bg-primary text-primary-foreground">
        <div className="necta-container py-8 md:py-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-white">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-primary-foreground/60 text-sm">Welcome back</p>
              <h1 className="text-xl md:text-2xl font-bold text-white truncate">{displayName}</h1>
              <p className="text-primary-foreground/50 text-xs mt-0.5">Member since {memberSince}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-sm text-primary-foreground/60 hover:text-white hover:border-white/40 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>

          {/* Pre-order status */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 rounded-xl p-3 col-span-2">
              <p className="text-xs text-primary-foreground/50 mb-1">Pre-order status</p>
              <p className="text-sm font-bold text-white">Confirmed ✓</p>
              <p className="text-xs text-primary-foreground/40 mt-0.5">Ships November 2026</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-xs text-primary-foreground/50 mb-1">Loyalty</p>
              <p className="text-sm font-bold text-white">Founder</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="sticky top-[68px] z-40 bg-white border-b border-border shadow-sm">
        <div className="necta-container">
          <div className="flex overflow-x-auto gap-0 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-primary/50 hover:text-primary hover:border-primary/20"
                }`}
              >
                {tab.icon}
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.mobileLabel}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <main className="bg-muted/30 min-h-screen">
        <div className="necta-container py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {currentTabConfig.icon}
              </div>
              <h2 className="text-lg font-bold text-primary">{currentTabConfig.label}</h2>
            </div>

            {activeTab === "subscriptions" && <SubscriptionsTab />}
            {activeTab === "billing"       && <BillingTab />}
            {activeTab === "orders"        && <OrderHistoryTab email={user.email ?? ""} />}
            {activeTab === "settings"      && <AccountSettingsTab />}
            {activeTab === "loyalty"       && <LoyaltyTab />}

            <div className="mt-10 md:hidden">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-3 border border-border rounded-lg text-sm text-primary/60 hover:text-primary hover:border-primary/30 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 py-6 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs text-primary/30">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>GDPR compliant</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-primary/30">
                <Lock className="h-3.5 w-3.5" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-primary/30">
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Powered by Supabase</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AccountPage;
