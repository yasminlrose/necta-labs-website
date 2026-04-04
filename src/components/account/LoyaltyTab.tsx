import { Star, Gift, Zap, TrendingUp, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

// Loyalty/rewards — coming soon content with teaser UI

interface RewardItem {
  id: string;
  title: string;
  description: string;
  points: number;
  available: boolean;
  code?: string;
}

const DEMO_REWARDS: RewardItem[] = [
  {
    id: "rew_001",
    title: "£5 off your next order",
    description: "Redeem 500 points for a £5 discount",
    points: 500,
    available: true,
    code: "NECTA5",
  },
  {
    id: "rew_002",
    title: "Free sachet sample pack",
    description: "Try all 4 flavours — added to your next delivery",
    points: 750,
    available: false,
  },
  {
    id: "rew_003",
    title: "15% off one order",
    description: "One-time 15% discount on any order",
    points: 1000,
    available: false,
  },
  {
    id: "rew_004",
    title: "Free subscription month",
    description: "Get one month of your subscription for free",
    points: 2000,
    available: false,
  },
];

const DEMO_ACTIVITY = [
  { id: 1, description: "Subscription renewal — Focus Infusion", points: "+50", date: "22 Mar 2026" },
  { id: 2, description: "Subscription renewal — Calm Sachets", points: "+40", date: "22 Mar 2026" },
  { id: 3, description: "Subscription renewal — Focus Infusion", points: "+50", date: "22 Feb 2026" },
  { id: 4, description: "Welcome bonus", points: "+100", date: "15 Nov 2025" },
];

const DEMO_POINTS = 240;
const NEXT_TIER_POINTS = 500;
const TIER = "Wellness Explorer";
const NEXT_TIER = "Vitality Member";

const LoyaltyTab = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const progressPct = Math.min((DEMO_POINTS / NEXT_TIER_POINTS) * 100, 100);

  return (
    <div className="space-y-5">
      {/* Coming soon banner */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center gap-2">
        <Zap className="h-4 w-4 text-amber-500 flex-shrink-0" />
        <p className="text-xs text-amber-700">
          <strong>Rewards programme launching soon.</strong> Your points are already accumulating — you'll be able to redeem them when we go live.
        </p>
      </div>

      {/* Points card */}
      <div className="bg-primary rounded-2xl p-6 text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-8 -translate-x-4" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            <span className="text-xs text-primary-foreground/60 font-medium uppercase tracking-wider">
              {TIER}
            </span>
          </div>
          <p className="text-4xl font-bold mb-1">{DEMO_POINTS.toLocaleString()}</p>
          <p className="text-sm text-primary-foreground/60">points balance</p>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-primary-foreground/60 mb-2">
              <span>{DEMO_POINTS} pts</span>
              <span>{NEXT_TIER_POINTS} pts — {NEXT_TIER}</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-primary-foreground/50 mt-2">
              {NEXT_TIER_POINTS - DEMO_POINTS} more points to reach {NEXT_TIER}
            </p>
          </div>
        </div>
      </div>

      {/* How you earn */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-primary text-sm mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[hsl(var(--necta-focus))]" />
          How to earn points
        </h3>
        <div className="space-y-3">
          {[
            { action: "Every subscription renewal", points: "50 pts per item" },
            { action: "One-off purchase (per £1 spent)", points: "1 pt / £1" },
            { action: "Referring a friend", points: "200 pts" },
            { action: "Writing a product review", points: "100 pts" },
            { action: "Birthday bonus (coming soon)", points: "250 pts" },
          ].map(({ action, points }) => (
            <div key={action} className="flex items-center justify-between">
              <p className="text-sm text-primary/70">{action}</p>
              <span className="text-xs font-semibold text-primary px-2 py-1 bg-muted rounded-full">
                {points}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Available rewards */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-primary text-sm mb-4 flex items-center gap-2">
          <Gift className="h-4 w-4 text-[hsl(var(--necta-calm))]" />
          Rewards
        </h3>
        <div className="space-y-3">
          {DEMO_REWARDS.map((reward) => {
            const canRedeem = DEMO_POINTS >= reward.points;
            const locked = !reward.available;
            return (
              <div
                key={reward.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  canRedeem && !locked
                    ? "border-primary/20 bg-primary/5"
                    : "border-border opacity-60"
                }`}
              >
                <div>
                  <p className={`text-sm font-medium ${canRedeem && !locked ? "text-primary" : "text-primary/60"}`}>
                    {reward.title}
                  </p>
                  <p className="text-xs text-primary/50">{reward.description}</p>
                  <p className="text-xs font-semibold text-primary/40 mt-1">{reward.points.toLocaleString()} pts</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  {reward.available && reward.code ? (
                    <button
                      onClick={() => handleCopy(reward.code!)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
                    >
                      {copiedCode === reward.code ? (
                        <><CheckCircle2 className="h-3.5 w-3.5" /> Copied</>
                      ) : (
                        <><Copy className="h-3.5 w-3.5" /> {reward.code}</>
                      )}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-3 py-2 border border-border rounded-lg text-xs font-medium text-primary/30"
                    >
                      {canRedeem ? "Redeem" : `${reward.points - DEMO_POINTS} more pts`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity log */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-primary text-sm mb-4">Points activity</h3>
        <div className="space-y-1">
          {DEMO_ACTIVITY.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
              <div>
                <p className="text-sm text-primary/70">{item.description}</p>
                <p className="text-xs text-primary/40">{item.date}</p>
              </div>
              <span className="text-sm font-semibold text-green-600">{item.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyTab;
