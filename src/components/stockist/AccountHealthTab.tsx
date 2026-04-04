import { TrendingUp, Calendar, ShoppingBag, Award, Mail, Phone, Star } from "lucide-react";

// Demo data — replace with live data from Shopify B2B / CRM

const ACCOUNT_DATA = {
  status: "active" as const,
  tier: "Silver",
  tier_next: "Gold",
  tier_bottles_this_month: 28,
  tier_next_threshold: 50,
  months_as_stockist: 5,
  lifetime_orders: 4,
  lifetime_value: 1511.60,
  average_order_value: 377.90,
  last_order_date: "2026-04-03",
  next_reorder_reminder: "2026-05-03",
  account_manager: {
    name: "Yasmin Reyes",
    email: "yasmin@nectalabs.com",
    phone: "+44 7700 900000",
    response_time: "within 4 hours",
    avatar_initials: "YR",
  },
};

const TIER_THRESHOLDS = [
  { tier: "Bronze", range: "6–20 bottles/mo",  bottles: 6,  color: "#C8956C", perks: ["Wholesale pricing", "Standard support", "Marketing materials"] },
  { tier: "Silver", range: "21–50 bottles/mo", bottles: 21, color: "#9CA3AF", perks: ["Priority shipping", "Dedicated account manager", "Quarterly check-ins"] },
  { tier: "Gold",   range: "50+ bottles/mo",   bottles: 50, color: "#EAB308", perks: ["Volume pricing discount", "Exclusive new products first", "Monthly business review"] },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const AccountHealthTab = () => {
  const { account_manager: am } = ACCOUNT_DATA;
  const tierProgress = Math.min((ACCOUNT_DATA.tier_bottles_this_month / ACCOUNT_DATA.tier_next_threshold) * 100, 100);
  const bottlesNeeded = ACCOUNT_DATA.tier_next_threshold - ACCOUNT_DATA.tier_bottles_this_month;

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
          <h3 className="text-2xl font-bold text-white mb-4">
            {(ACCOUNT_DATA.months_as_stockist >= 12
              ? `${Math.floor(ACCOUNT_DATA.months_as_stockist / 12)} year${Math.floor(ACCOUNT_DATA.months_as_stockist / 12) > 1 ? "s" : ""}`
              : `${ACCOUNT_DATA.months_as_stockist} months`)} as a NECTA stockist
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total orders",    value: ACCOUNT_DATA.lifetime_orders.toString() },
              { label: "Lifetime value",  value: `£${ACCOUNT_DATA.lifetime_value.toFixed(0)}` },
              { label: "Avg order",       value: `£${ACCOUNT_DATA.average_order_value.toFixed(0)}` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 rounded-xl p-3">
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-primary-foreground/50 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tier status */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-primary text-sm">Stockist tier</h3>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: TIER_THRESHOLDS.find((t) => t.tier === ACCOUNT_DATA.tier)?.color }}>
            {ACCOUNT_DATA.tier[0]}
          </div>
          <div>
            <p className="font-bold text-primary text-sm">{ACCOUNT_DATA.tier} Stockist</p>
            <p className="text-xs text-primary/50">
              {ACCOUNT_DATA.tier_bottles_this_month} bottles this month
            </p>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-xs text-primary/50 mb-1.5">
            <span>{ACCOUNT_DATA.tier_bottles_this_month} bottles</span>
            <span>{ACCOUNT_DATA.tier_next_threshold} bottles → {ACCOUNT_DATA.tier_next}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${tierProgress}%` }}
            />
          </div>
          <p className="text-xs text-primary/50 mt-1.5">
            Order <strong>{bottlesNeeded} more bottles this month</strong> to reach {ACCOUNT_DATA.tier_next} tier
          </p>
        </div>

        {/* Tier comparison */}
        <div className="space-y-2 mt-5">
          {TIER_THRESHOLDS.map((tier) => (
            <div
              key={tier.tier}
              className={`p-3 rounded-xl border ${tier.tier === ACCOUNT_DATA.tier ? "border-primary/20 bg-primary/5" : "border-border"}`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: tier.color }}>
                  {tier.tier[0]}
                </div>
                <span className="text-sm font-semibold text-primary">{tier.tier}</span>
                <span className="text-xs text-primary/40">{tier.range}</span>
                {tier.tier === ACCOUNT_DATA.tier && (
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

      {/* Key dates */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-primary text-sm mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Key dates
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <p className="text-sm text-primary/70">Last order placed</p>
            <p className="text-sm font-medium text-primary">{formatDate(ACCOUNT_DATA.last_order_date)}</p>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <p className="text-sm text-primary/70">Next reorder reminder</p>
            <p className="text-sm font-medium text-primary">{formatDate(ACCOUNT_DATA.next_reorder_reminder)}</p>
          </div>
          <div className="flex justify-between items-center py-2">
            <p className="text-sm text-primary/70">Stockist since</p>
            <p className="text-sm font-medium text-primary">November 2025</p>
          </div>
        </div>
      </div>

      {/* Account manager */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-primary text-sm mb-4 flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          Your account manager
        </h3>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0">
            {am.avatar_initials}
          </div>
          <div>
            <p className="font-semibold text-primary">{am.name}</p>
            <p className="text-xs text-primary/50">Account Manager · NECTA Labs</p>
            <p className="text-xs text-green-600 mt-0.5">Responds {am.response_time}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href={`mailto:${am.email}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-border rounded-xl text-sm font-medium text-primary hover:border-primary/30 hover:bg-muted transition-colors"
          >
            <Mail className="h-4 w-4" />
            Email
          </a>
          <a
            href={`tel:${am.phone}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-border rounded-xl text-sm font-medium text-primary hover:border-primary/30 hover:bg-muted transition-colors"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
        </div>
      </div>

      {/* Monthly insights */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-primary text-sm mb-1 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-600" />
          Monthly insights
        </h3>
        <p className="text-xs text-primary/40 mb-4">Based on your order history</p>
        <div className="space-y-3">
          {[
            { label: "Avg servings sold / month", value: "~450", sub: "At 28 bottles × 16 avg servings" },
            { label: "Your est. monthly revenue",  value: "~£900", sub: "At £2.00 per serving add-on" },
            { label: "Your est. gross margin",     value: "~34%",  sub: "After NECTA cost" },
            { label: "Bottles reordered per month",value: "~26",   sub: "3-month average" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm text-primary/70">{label}</p>
                <p className="text-xs text-primary/40">{sub}</p>
              </div>
              <p className="text-base font-bold text-primary">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountHealthTab;
