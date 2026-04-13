'use client';

import { Award, Mail, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const TIER_THRESHOLDS = [
  { tier: "Bronze", range: "6–20 bottles/mo",  color: "#C8956C", perks: ["Wholesale pricing", "Standard support", "Marketing materials"] },
  { tier: "Silver", range: "21–50 bottles/mo", color: "#9CA3AF", perks: ["Priority shipping", "Dedicated account manager", "Quarterly check-ins"] },
  { tier: "Gold",   range: "50+ bottles/mo",   color: "#EAB308", perks: ["Volume pricing discount", "Exclusive new products first", "Monthly business review"] },
];

const AccountHealthTab = () => {
  const { user } = useAuth();
  const businessName = (user?.user_metadata?.business_name as string) || "Your Business";
  const venueType = (user?.user_metadata?.venue_type as string) || "";
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  // New stockists start at Bronze
  const currentTier = "Bronze";

  return (
    <div className="space-y-5">
      {/* Status card */}
      <div className="bg-primary rounded-2xl p-6 text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-primary-foreground/60 uppercase tracking-wider font-medium">Account active</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{businessName}</h3>
          {venueType && <p className="text-sm text-primary-foreground/50 mb-4">{venueType}</p>}
          <div className="flex items-center gap-2 text-xs text-primary-foreground/50">
            <Calendar className="h-3.5 w-3.5" />
            Stockist since {joinedDate}
          </div>
        </div>
      </div>

      {/* Tier info */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-primary text-sm">Stockist tiers</h3>
        </div>
        <p className="text-xs text-primary/50 mb-4">
          Your tier is based on average monthly bottles ordered. You start at Bronze and move up automatically as your orders grow.
        </p>
        <div className="space-y-2">
          {TIER_THRESHOLDS.map((tier) => (
            <div
              key={tier.tier}
              className={`p-3 rounded-xl border ${tier.tier === currentTier ? "border-primary/20 bg-primary/5" : "border-border"}`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: tier.color }}
                >
                  {tier.tier[0]}
                </div>
                <span className="text-sm font-semibold text-primary">{tier.tier}</span>
                <span className="text-xs text-primary/40">{tier.range}</span>
                {tier.tier === currentTier && (
                  <span className="ml-auto text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">Current</span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tier.perks.map((perk) => (
                  <span key={perk} className="text-xs text-primary/60 bg-muted px-2 py-0.5 rounded-full">{perk}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account manager */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-primary text-sm mb-4 flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Your account manager
        </h3>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
            YR
          </div>
          <div>
            <p className="font-semibold text-primary">Yasmin</p>
            <p className="text-xs text-primary/50">Founder, NECTA Labs</p>
            <p className="text-xs text-green-600 mt-0.5">Responds within 1 business day</p>
          </div>
        </div>
        <a
          href="mailto:wholesale@nectalabs.com"
          className="w-full flex items-center justify-center gap-2 py-3 border border-border rounded-xl text-sm font-medium text-primary hover:border-primary/30 hover:bg-muted transition-colors"
        >
          <Mail className="h-4 w-4" />
          wholesale@nectalabs.com
        </a>
      </div>
    </div>
  );
};

export default AccountHealthTab;
