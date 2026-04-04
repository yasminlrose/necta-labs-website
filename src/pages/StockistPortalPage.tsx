import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ShoppingCart, History, TrendingUp, BarChart3,
  Megaphone, MessageSquare, Settings, LogOut, Building2, Award
} from "lucide-react";
import NectaLogo from "@/components/NectaLogo";
import StockistAuthModal from "@/components/stockist/StockistAuthModal";
import OrdersTab from "@/components/stockist/OrdersTab";
import ReorderTab from "@/components/stockist/ReorderTab";
import AccountHealthTab from "@/components/stockist/AccountHealthTab";
import SalesPerformanceTab from "@/components/stockist/SalesPerformanceTab";
import MarketingTab from "@/components/stockist/MarketingTab";
import MessagingTab from "@/components/stockist/MessagingTab";
import StockistSettingsTab from "@/components/stockist/StockistSettingsTab";
import { useAuth } from "@/contexts/AuthContext";

type TabId = "reorder" | "orders" | "health" | "performance" | "marketing" | "messages" | "settings";

const tabs: { id: TabId; label: string; mobileLabel: string; icon: React.ReactNode }[] = [
  { id: "reorder",     label: "Quick Reorder",       mobileLabel: "Reorder",     icon: <ShoppingCart className="h-4 w-4" /> },
  { id: "orders",      label: "Order History",        mobileLabel: "Orders",      icon: <History className="h-4 w-4" /> },
  { id: "health",      label: "Account Health",       mobileLabel: "Account",     icon: <TrendingUp className="h-4 w-4" /> },
  { id: "performance", label: "Sales Performance",    mobileLabel: "Sales",       icon: <BarChart3 className="h-4 w-4" /> },
  { id: "marketing",   label: "Marketing & POS",      mobileLabel: "Marketing",   icon: <Megaphone className="h-4 w-4" /> },
  { id: "messages",    label: "Messages",             mobileLabel: "Messages",    icon: <MessageSquare className="h-4 w-4" /> },
  { id: "settings",    label: "Account Settings",     mobileLabel: "Settings",    icon: <Settings className="h-4 w-4" /> },
];

const TIER_COLOR: Record<string, string> = {
  Bronze: "#C8956C",
  Silver: "#9CA3AF",
  Gold: "#EAB308",
};

const StockistPortalPage = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [authOpen, setAuthOpen] = useState(false);

  const tabFromUrl = (searchParams.get("tab") as TabId) ?? "reorder";
  const [activeTab, setActiveTab] = useState<TabId>(
    tabs.some((t) => t.id === tabFromUrl) ? tabFromUrl : "reorder"
  );

  const isStockist = user?.user_metadata?.is_stockist === true;
  const tier = "Silver"; // TODO: derive from order history

  useEffect(() => {
    if (!loading) {
      if (!user || !isStockist) {
        setAuthOpen(true);
      }
    }
  }, [user, loading, isStockist]);

  const handleTabChange = (id: TabId) => {
    setActiveTab(id);
    setSearchParams({ tab: id });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/stockist");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated / not a stockist — show auth modal over placeholder
  if (!user || !isStockist) {
    return (
      <>
        <div className="min-h-screen bg-muted/30 flex flex-col">
          {/* Minimal header */}
          <div className="bg-white border-b border-border py-4 px-6 flex items-center justify-between">
            <NectaLogo />
            <p className="text-xs text-primary/50 hidden sm:block">Stockist Portal</p>
          </div>
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Building2 className="h-8 w-8 text-primary/50" />
              </div>
              <h1 className="text-2xl font-bold text-primary mb-2">Stockist Portal</h1>
              <p className="text-sm text-primary/50 mb-6 max-w-xs">
                Sign in with your approved stockist account to manage orders and access your dashboard.
              </p>
              <button
                onClick={() => setAuthOpen(true)}
                className="bg-primary text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-primary/90 transition-colors"
              >
                Sign in to portal
              </button>
              <p className="mt-4 text-xs text-primary/40">
                Not yet a stockist?{" "}
                <button onClick={() => { setAuthOpen(true); }} className="text-primary underline">Apply here</button>
              </p>
            </div>
          </div>
        </div>
        <StockistAuthModal isOpen={authOpen} onClose={() => { setAuthOpen(false); if (!user || !isStockist) navigate("/stockist"); }} />
      </>
    );
  }

  const businessName = (user.user_metadata?.business_name as string) || "Your Business";
  const contactName = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "there";
  const venueType = (user.user_metadata?.venue_type as string) || "";
  const currentTab = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Portal header */}
      <div className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="necta-container">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <NectaLogo />
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-primary/20 text-lg">·</span>
                <span className="text-xs font-semibold text-primary/50 uppercase tracking-wider">Wholesale Portal</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Tier badge */}
              <div
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold"
                style={{ backgroundColor: TIER_COLOR[tier] ?? "#9CA3AF" }}
              >
                <Award className="h-3 w-3" />
                {tier}
              </div>
              <div className="hidden md:block text-right">
                <p className="text-xs font-semibold text-primary leading-tight">{businessName}</p>
                <p className="text-[10px] text-primary/40 leading-tight">{venueType}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs font-medium text-primary/60 hover:text-primary hover:border-primary/30 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="necta-container py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-primary-foreground/60 text-xs mb-0.5">Welcome back</p>
              <h1 className="text-lg font-bold text-white">{contactName} · {businessName}</h1>
            </div>
            <button
              onClick={() => handleTabChange("reorder")}
              className="flex-shrink-0 flex items-center gap-2 bg-white text-primary text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/90 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              Quick reorder
            </button>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-white border-b border-border sticky top-14 z-40 shadow-sm">
        <div className="necta-container">
          <div className="flex overflow-x-auto gap-0 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-3.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-primary/50 hover:text-primary hover:border-primary/20"
                }`}
              >
                {tab.icon}
                <span className="hidden lg:inline">{tab.label}</span>
                <span className="lg:hidden">{tab.mobileLabel}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <main className="necta-container py-6">
        <div className="max-w-2xl mx-auto">
          {/* Tab heading */}
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {currentTab.icon}
            </div>
            <h2 className="text-base font-bold text-primary">{currentTab.label}</h2>
          </div>

          {activeTab === "reorder"     && <ReorderTab />}
          {activeTab === "orders"      && <OrdersTab />}
          {activeTab === "health"      && <AccountHealthTab />}
          {activeTab === "performance" && <SalesPerformanceTab />}
          {activeTab === "marketing"   && <MarketingTab />}
          {activeTab === "messages"    && <MessagingTab />}
          {activeTab === "settings"    && <StockistSettingsTab />}

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-primary/30">
              NECTA Labs Wholesale Portal · {new Date().getFullYear()}
            </p>
            <a
              href="mailto:wholesale@nectalabs.com"
              className="text-xs text-primary/40 hover:text-primary transition-colors"
            >
              wholesale@nectalabs.com
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StockistPortalPage;
