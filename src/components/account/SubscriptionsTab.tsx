import { useState } from "react";
import {
  RefreshCw, Pause, SkipForward, X, ChevronDown,
  TrendingUp, Package, Calendar, CheckCircle2, Clock
} from "lucide-react";
import CancelSubscriptionModal from "./CancelSubscriptionModal";
import PauseSubscriptionModal from "./PauseSubscriptionModal";
import bottleFocusImg from "@/assets/bottle-focus.jpeg";
import sachetCalmImg from "@/assets/sachet-calm.png";

// ─── Types matching Recharge's subscription model ────────────────────────────
// TODO: Replace mock data with real Recharge API calls via your backend proxy.
// See: https://developer.rechargepayments.com/2021-11/subscriptions/subscriptions_retrieve
export interface Subscription {
  id: string;
  product_title: string;
  variant_title: string;
  format: string;
  price: number;
  order_interval_frequency: number;
  order_interval_unit: "week" | "month";
  status: "active" | "paused" | "cancelled";
  next_charge_scheduled_at: string;
  created_at: string;
  savings_per_year: number;
  image: string;
}

const FREQUENCY_OPTIONS = [
  { label: "Every 2 weeks", value: 2, unit: "week" },
  { label: "Every 4 weeks", value: 4, unit: "week" },
  { label: "Every 6 weeks", value: 6, unit: "week" },
  { label: "Every 8 weeks", value: 8, unit: "week" },
  { label: "Every month", value: 1, unit: "month" },
  { label: "Every 2 months", value: 2, unit: "month" },
  { label: "Every 3 months", value: 3, unit: "month" },
];

// Demo data — replace with API response in production
const DEMO_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub_001",
    product_title: "NECTA Focus Infusion",
    variant_title: "Elderflower & Lemon",
    format: "500ml Pump Bottle",
    price: 24.99,
    order_interval_frequency: 4,
    order_interval_unit: "week",
    status: "active",
    next_charge_scheduled_at: "2026-04-18",
    created_at: "2025-11-15",
    savings_per_year: 75.00,
    image: bottleFocusImg,
  },
  {
    id: "sub_002",
    product_title: "NECTA Calm Sachets",
    variant_title: "Lavender & Chamomile",
    format: "30-Sachet Pack",
    price: 18.99,
    order_interval_frequency: 4,
    order_interval_unit: "week",
    status: "active",
    next_charge_scheduled_at: "2026-04-22",
    created_at: "2026-01-08",
    savings_per_year: 57.00,
    image: sachetCalmImg,
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function frequencyLabel(sub: Subscription) {
  if (sub.order_interval_unit === "month") {
    return sub.order_interval_frequency === 1
      ? "Every month"
      : `Every ${sub.order_interval_frequency} months`;
  }
  return `Every ${sub.order_interval_frequency} weeks`;
}

interface SubscriptionCardProps {
  sub: Subscription;
  onPause: (id: string) => void;
  onCancel: (id: string) => void;
  onSkip: (id: string) => void;
  onFrequencyChange: (id: string, freq: number, unit: string) => void;
}

const SubscriptionCard = ({ sub, onPause, onCancel, onSkip, onFrequencyChange }: SubscriptionCardProps) => {
  const [showFreqDropdown, setShowFreqDropdown] = useState(false);
  const currentFreq = `${sub.order_interval_frequency}_${sub.order_interval_unit}`;

  const statusColor =
    sub.status === "active"
      ? "bg-green-50 text-green-700"
      : sub.status === "paused"
      ? "bg-amber-50 text-amber-700"
      : "bg-red-50 text-red-600";

  const statusIcon =
    sub.status === "active" ? (
      <CheckCircle2 className="h-3 w-3" />
    ) : (
      <Clock className="h-3 w-3" />
    );

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden">
      {/* Card header */}
      <div className="p-5 flex gap-4">
        <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
          <img
            src={sub.image}
            alt={sub.product_title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-primary text-sm leading-tight">{sub.product_title}</h3>
              <p className="text-xs text-primary/50 mt-0.5">{sub.variant_title}</p>
              <p className="text-xs text-primary/40">{sub.format}</p>
            </div>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${statusColor}`}>
              {statusIcon}
              {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3">
            <div>
              <p className="text-lg font-bold text-primary">£{sub.price.toFixed(2)}</p>
              <p className="text-xs text-primary/40">{frequencyLabel(sub)}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-xs text-primary/50">Next delivery</p>
              <p className="text-xs font-medium text-primary">{formatDate(sub.next_charge_scheduled_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Savings banner */}
      <div className="mx-5 mb-4 px-3 py-2 bg-green-50 rounded-lg flex items-center gap-2">
        <TrendingUp className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
        <p className="text-xs text-green-700">
          You're saving <strong>£{sub.savings_per_year.toFixed(0)}/year</strong> vs one-off purchases
        </p>
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 grid grid-cols-2 gap-2">
        {/* Frequency selector */}
        <div className="col-span-2 relative">
          <button
            onClick={() => setShowFreqDropdown(!showFreqDropdown)}
            className="w-full flex items-center justify-between px-3 py-2.5 border border-border rounded-lg text-sm text-primary hover:border-primary/30 transition-colors"
          >
            <span className="flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5 text-primary/40" />
              {frequencyLabel(sub)}
            </span>
            <ChevronDown className={`h-3.5 w-3.5 text-primary/40 transition-transform ${showFreqDropdown ? "rotate-180" : ""}`} />
          </button>
          {showFreqDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-lg z-10 overflow-hidden">
              {FREQUENCY_OPTIONS.map((opt) => (
                <button
                  key={`${opt.value}_${opt.unit}`}
                  onClick={() => {
                    onFrequencyChange(sub.id, opt.value, opt.unit);
                    setShowFreqDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors ${
                    currentFreq === `${opt.value}_${opt.unit}`
                      ? "font-semibold text-primary bg-muted"
                      : "text-primary/70"
                  }`}
                >
                  {opt.label}
                  {currentFreq === `${opt.value}_${opt.unit}` && (
                    <span className="ml-2 text-xs text-primary/40">(current)</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => onSkip(sub.id)}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-border rounded-lg text-xs font-medium text-primary/70 hover:text-primary hover:border-primary/30 transition-colors"
        >
          <SkipForward className="h-3.5 w-3.5" />
          Skip next
        </button>

        <button
          onClick={() => onPause(sub.id)}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-border rounded-lg text-xs font-medium text-primary/70 hover:text-primary hover:border-primary/30 transition-colors"
        >
          <Pause className="h-3.5 w-3.5" />
          Pause
        </button>

        <button
          onClick={() => onCancel(sub.id)}
          className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 text-xs text-primary/40 hover:text-red-500 transition-colors"
        >
          <X className="h-3 w-3" />
          Cancel subscription
        </button>
      </div>
    </div>
  );
};

const SubscriptionsTab = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(DEMO_SUBSCRIPTIONS);
  const [cancelTarget, setCancelTarget] = useState<Subscription | null>(null);
  const [pauseTarget, setPauseTarget] = useState<Subscription | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handlePause = (id: string) => {
    const sub = subscriptions.find((s) => s.id === id);
    if (sub) setPauseTarget(sub);
  };

  const handleConfirmPause = (months: number) => {
    if (!pauseTarget) return;
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === pauseTarget.id ? { ...s, status: "paused" as const } : s))
    );
    showToast(`${pauseTarget.product_title} paused for ${months} month${months > 1 ? "s" : ""}.`);
    setPauseTarget(null);
  };

  const handleCancel = (id: string) => {
    const sub = subscriptions.find((s) => s.id === id);
    if (sub) setCancelTarget(sub);
  };

  const handleConfirmCancel = (reason: string) => {
    if (!cancelTarget) return;
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === cancelTarget.id ? { ...s, status: "cancelled" as const } : s))
    );
    showToast(`Cancellation confirmed. 7-day notice applied.`);
    console.log("Cancel reason:", reason); // TODO: Send to analytics / CRM
    setCancelTarget(null);
  };

  const handleSkip = (id: string) => {
    const sub = subscriptions.find((s) => s.id === id);
    if (!sub) return;
    showToast(`Next delivery of ${sub.product_title} skipped.`);
  };

  const handleFrequencyChange = (id: string, freq: number, unit: string) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, order_interval_frequency: freq, order_interval_unit: unit as "week" | "month" }
          : s
      )
    );
    const sub = subscriptions.find((s) => s.id === id);
    showToast(`Delivery frequency updated for ${sub?.product_title}.`);
  };

  const active = subscriptions.filter((s) => s.status !== "cancelled");
  const totalSavings = active.reduce((sum, s) => sum + s.savings_per_year, 0);

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      {active.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-muted rounded-xl p-4">
            <p className="text-xs text-primary/50 mb-1">Active subscriptions</p>
            <p className="text-2xl font-bold text-primary">{active.filter((s) => s.status === "active").length}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-xs text-green-600/70 mb-1">Annual savings</p>
            <p className="text-2xl font-bold text-green-700">£{totalSavings.toFixed(0)}</p>
          </div>
          <div className="hidden md:block bg-muted rounded-xl p-4">
            <p className="text-xs text-primary/50 mb-1">Monthly spend</p>
            <p className="text-2xl font-bold text-primary">
              £{active.reduce((sum, s) => sum + s.price, 0).toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Subscription cards */}
      {active.length === 0 ? (
        <div className="text-center py-16 bg-muted/50 rounded-2xl">
          <Package className="h-10 w-10 text-primary/20 mx-auto mb-3" />
          <h3 className="font-semibold text-primary mb-2">No active subscriptions</h3>
          <p className="text-sm text-primary/50 mb-6 max-w-xs mx-auto">
            Subscribe to any NECTA product to save up to 30% and never run out.
          </p>
          <a
            href="/shop"
            className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors"
          >
            Shop & Subscribe
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {active.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              sub={sub}
              onPause={handlePause}
              onCancel={handleCancel}
              onSkip={handleSkip}
              onFrequencyChange={handleFrequencyChange}
            />
          ))}
        </div>
      )}

      {/* Integration notice */}
      <div className="border border-dashed border-primary/20 rounded-xl p-4 text-center">
        <p className="text-xs text-primary/40">
          Subscription data is managed via{" "}
          <strong className="text-primary/60">Recharge</strong>. Changes made here sync automatically.
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-white text-sm font-medium px-5 py-3 rounded-full shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      {/* Modals */}
      {cancelTarget && (
        <CancelSubscriptionModal
          isOpen={!!cancelTarget}
          productTitle={cancelTarget.product_title}
          onConfirm={handleConfirmCancel}
          onPauseInstead={() => {
            setCancelTarget(null);
            setPauseTarget(cancelTarget);
          }}
          onClose={() => setCancelTarget(null)}
        />
      )}
      {pauseTarget && (
        <PauseSubscriptionModal
          isOpen={!!pauseTarget}
          productTitle={pauseTarget.product_title}
          nextDeliveryDate={pauseTarget.next_charge_scheduled_at}
          onConfirm={handleConfirmPause}
          onClose={() => setPauseTarget(null)}
        />
      )}
    </div>
  );
};

export default SubscriptionsTab;
