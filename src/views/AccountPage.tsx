'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard, Package, CreditCard, History,
  Settings, Star, LogOut, ShieldCheck, Lock
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubscriptionsTab from "@/components/account/SubscriptionsTab";
import BillingTab from "@/components/account/BillingTab";
import OrderHistoryTab from "@/components/account/OrderHistoryTab";
import AccountSettingsTab from "@/components/account/AccountSettingsTab";
import LoyaltyTab from "@/components/account/LoyaltyTab";
import { useAuth } from "@/contexts/AuthContext";

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

const AccountPage = () => {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = (searchParams?.get("tab") as TabId) ?? "subscriptions";
  const [activeTab, setActiveTab] = useState<TabId>(
    tabs.some((t) => t.id === tabFromUrl) ? tabFromUrl : "subscriptions"
  );

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  const handleTabChange = (id: TabId) => {
    setActiveTab(id);
    router.push(`/account?tab=${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

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
            {/* Avatar */}
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

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-2xl font-bold text-white">2</p>
              <p className="text-xs text-primary-foreground/50 mt-0.5">Active subs</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-2xl font-bold text-white">£132</p>
              <p className="text-xs text-primary-foreground/50 mt-0.5">Saved p/year</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-2xl font-bold text-white">240</p>
              <p className="text-xs text-primary-foreground/50 mt-0.5">Points</p>
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
            {/* Tab header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {currentTabConfig.icon}
              </div>
              <h2 className="text-lg font-bold text-primary">{currentTabConfig.label}</h2>
            </div>

            {/* Tab panels */}
            {activeTab === "subscriptions" && <SubscriptionsTab />}
            {activeTab === "billing" && <BillingTab />}
            {activeTab === "orders" && <OrderHistoryTab />}
            {activeTab === "settings" && <AccountSettingsTab />}
            {activeTab === "loyalty" && <LoyaltyTab />}

            {/* Mobile sign-out */}
            <div className="mt-10 md:hidden">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-3 border border-border rounded-lg text-sm text-primary/60 hover:text-primary hover:border-primary/30 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>

            {/* Trust footer */}
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
                <span>Powered by Supabase & Recharge</span>
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
