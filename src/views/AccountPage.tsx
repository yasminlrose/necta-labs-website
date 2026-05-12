'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard, Package, CreditCard, History,
  Settings, Star, LogOut, ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff
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

interface PreOrder {
  id: string;
  product_slug: string;
  format: string | null;
  size: string | null;
  quantity: number;
  status: string;
  created_at: string;
}

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

function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 border border-border py-3 rounded-xl text-sm font-medium text-primary hover:bg-muted transition-colors"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Continue with Google
    </button>
  );
}

function Divider() {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"/></div>
      <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-primary/40">or</span></div>
    </div>
  );
}

// ── Sign-in / create account form ─────────────────────────────────────────
function SignInView() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  // sign-in state
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siShowPwd, setSiShowPwd] = useState(false);
  const [siLoading, setSiLoading] = useState(false);
  const [siError, setSiError] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  // sign-up state
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suShowPwd, setSuShowPwd] = useState(false);
  const [suLoading, setSuLoading] = useState(false);
  const [suError, setSuError] = useState("");
  const [suDone, setSuDone] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSiLoading(true); setSiError("");
    const { error } = await supabase.auth.signInWithPassword({ email: siEmail, password: siPassword });
    setSiLoading(false);
    if (error) setSiError(error.message);
  };

  const handleMagicLink = async () => {
    if (!siEmail.trim()) { setSiError("Enter your email first."); return; }
    setSiLoading(true); setSiError("");
    const res = await fetch("/api/send-magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: siEmail.trim() }),
    });
    setSiLoading(false);
    if (!res.ok) {
      const data = await res.json() as { error?: string };
      setSiError(data.error ?? "Failed to send link. Try again.");
      return;
    }
    setMagicSent(true);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (suPassword.length < 8) { setSuError("Password must be at least 8 characters."); return; }
    setSuLoading(true); setSuError("");
    const { data, error } = await supabase.auth.signUp({
      email: suEmail,
      password: suPassword,
      options: {
        data: { full_name: suName },
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });
    setSuLoading(false);
    if (error) { setSuError(error.message); return; }
    // If email confirmation is disabled, session is returned immediately → auth
    // context picks it up and shows the dashboard automatically.
    // If confirmation is required, show the "check your email" message.
    if (!data.session) setSuDone(true);
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
            <h1 className="text-2xl font-bold text-primary mb-2">Your account</h1>
            <p className="text-sm text-primary/50">View your pre-order, founding member perks, and subscription details.</p>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-border">
              {(["signin", "signup"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                    tab === t ? "text-primary border-b-2 border-primary -mb-px" : "text-primary/40 hover:text-primary"
                  }`}
                >
                  {t === "signin" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* ── SIGN IN ── */}
              {tab === "signin" && (
                magicSent ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-6 w-6 text-green-600"/>
                    </div>
                    <h2 className="font-semibold text-primary mb-2">Check your email</h2>
                    <p className="text-sm text-primary/50 leading-relaxed">
                      We sent a sign-in link to <strong>{siEmail}</strong>. Click it to access your account.
                    </p>
                    <button onClick={() => setMagicSent(false)} className="mt-4 text-xs text-primary/40 hover:text-primary underline">
                      Back
                    </button>
                  </div>
                ) : (
                  <>
                    <form onSubmit={handleSignIn} className="space-y-3">
                      <input
                        type="email"
                        value={siEmail}
                        onChange={(e) => setSiEmail(e.target.value)}
                        placeholder="Email address"
                        required
                        className="w-full px-4 py-3 border border-border rounded-xl text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                      />
                      <div className="relative">
                        <input
                          type={siShowPwd ? "text" : "password"}
                          value={siPassword}
                          onChange={(e) => setSiPassword(e.target.value)}
                          placeholder="Password"
                          required
                          className="w-full px-4 pr-10 py-3 border border-border rounded-xl text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                        />
                        <button type="button" onClick={() => setSiShowPwd(!siShowPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/30">
                          {siShowPwd ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                        </button>
                      </div>
                      {siError && <p className="text-xs text-red-500">{siError}</p>}
                      <button
                        type="submit"
                        disabled={siLoading}
                        className="w-full bg-primary text-white font-semibold py-3 rounded-xl text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
                      >
                        {siLoading ? "Signing in…" : "Sign in"}
                      </button>
                    </form>

                    <button
                      type="button"
                      onClick={handleMagicLink}
                      disabled={siLoading}
                      className="w-full mt-2 py-3 border border-border rounded-xl text-sm text-primary/60 hover:text-primary hover:border-primary/40 transition-colors flex items-center justify-center gap-2"
                    >
                      <Mail className="h-4 w-4"/> Email me a sign-in link instead
                    </button>

                    <Divider />
                    <GoogleButton onClick={handleGoogle} />
                  </>
                )
              )}

              {/* ── CREATE ACCOUNT ── */}
              {tab === "signup" && (
                suDone ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-6 w-6 text-green-600"/>
                    </div>
                    <h2 className="font-semibold text-primary mb-2">Confirm your email</h2>
                    <p className="text-sm text-primary/50 leading-relaxed">
                      We sent a confirmation link to <strong>{suEmail}</strong>. Click it to activate your account.
                    </p>
                  </div>
                ) : (
                  <>
                    <form onSubmit={handleSignUp} className="space-y-3">
                      <input
                        type="text"
                        value={suName}
                        onChange={(e) => setSuName(e.target.value)}
                        placeholder="Full name"
                        className="w-full px-4 py-3 border border-border rounded-xl text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                      />
                      <input
                        type="email"
                        value={suEmail}
                        onChange={(e) => setSuEmail(e.target.value)}
                        placeholder="Email address"
                        required
                        className="w-full px-4 py-3 border border-border rounded-xl text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                      />
                      <div className="relative">
                        <input
                          type={suShowPwd ? "text" : "password"}
                          value={suPassword}
                          onChange={(e) => setSuPassword(e.target.value)}
                          placeholder="Password (min 8 characters)"
                          required
                          minLength={8}
                          className="w-full px-4 pr-10 py-3 border border-border rounded-xl text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                        />
                        <button type="button" onClick={() => setSuShowPwd(!suShowPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/30">
                          {suShowPwd ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                        </button>
                      </div>
                      {suError && <p className="text-xs text-red-500">{suError}</p>}
                      <button
                        type="submit"
                        disabled={suLoading}
                        className="w-full bg-primary text-white font-semibold py-3 rounded-xl text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
                      >
                        {suLoading ? "Creating account…" : "Create account"}
                      </button>
                    </form>

                    <Divider />
                    <GoogleButton onClick={handleGoogle} />
                  </>
                )
              )}
            </div>
          </div>

          <p className="text-center text-xs text-primary/35 mt-5">
            Placed a pre-order? Sign in with the email you used at checkout.
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

  const [orders, setOrders] = useState<PreOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    supabase
      .from("pre_orders")
      .select("*")
      .eq("email", user.email)
      .order("created_at", { ascending: false })
      .then(async ({ data }) => {
        setOrders(data ?? []);
        setOrdersLoading(false);
        // If user has orders but no name set yet, refresh the session so any
        // name synced by the webhook shows up without requiring a sign-out
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((data ?? []).length > 0 && !(user as any).user_metadata?.full_name) {
          await supabase.auth.refreshSession();
        }
      });
  }, [user?.email]);

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

  const displayName = (user.user_metadata?.full_name as string) || user.email || "there";
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
          <div className={`grid gap-3 mt-6 ${!ordersLoading && orders.length > 0 ? "grid-cols-3" : "grid-cols-1"}`}>
            <div className={`bg-white/10 rounded-xl p-3 ${!ordersLoading && orders.length > 0 ? "col-span-2" : ""}`}>
              <p className="text-xs text-primary-foreground/50 mb-1">Pre-order status</p>
              {ordersLoading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin mt-1" />
              ) : orders.length > 0 ? (
                <>
                  <p className="text-sm font-bold text-white">Confirmed ✓</p>
                  <p className="text-xs text-primary-foreground/40 mt-0.5">Charged 1 Nov · Ships from 17 Nov 2026</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-bold text-white/60">No pre-order yet</p>
                  <p className="text-xs text-primary-foreground/40 mt-0.5">
                    <a href="/pre-order" className="underline hover:text-white transition-colors">Pre-order now →</a>
                  </p>
                </>
              )}
            </div>
            {!ordersLoading && orders.length > 0 && (
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-xs text-primary-foreground/50 mb-1">Loyalty</p>
                <p className="text-sm font-bold text-white">Founder</p>
                <p className="text-xs text-primary-foreground/40 mt-0.5">First 100</p>
              </div>
            )}
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

            {activeTab === "subscriptions" && <SubscriptionsTab orders={orders} />}
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
