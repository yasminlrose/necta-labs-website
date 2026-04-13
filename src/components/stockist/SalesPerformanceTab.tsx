import { useState } from "react";
import { PoundSterling, BarChart3 } from "lucide-react";

const SERVINGS_PER_BOTTLE = 16.7; // 250ml bottle
const WHOLESALE_COST_PER_BOTTLE = 22; // £22 per 250ml bottle
const COST_PER_SERVING = WHOLESALE_COST_PER_BOTTLE / SERVINGS_PER_BOTTLE; // £1.317…

const SalesPerformanceTab = () => {
  const [servingsPerMonth, setServingsPerMonth] = useState(280);
  const [pricePerServing, setPricePerServing] = useState(2.00);

  const monthlyProfit = (pricePerServing - COST_PER_SERVING) * servingsPerMonth;
  const annualProfit = monthlyProfit * 12;
  const grossMarginPct = ((pricePerServing - COST_PER_SERVING) / pricePerServing) * 100;
  const revenuePerMonth = servingsPerMonth * pricePerServing;
  const bottlesNeeded = Math.ceil(servingsPerMonth / SERVINGS_PER_BOTTLE);

  return (
    <div className="space-y-5">
      {/* Empty state for order history */}
      <div className="bg-white border border-border rounded-2xl p-6 text-center">
        <BarChart3 className="h-6 w-6 text-primary/20 mx-auto mb-3" />
        <p className="text-sm font-medium text-primary mb-1">Order history will appear here</p>
        <p className="text-xs text-primary/40">
          Once you've placed wholesale orders, your monthly volume and sales trend will show here.
        </p>
      </div>

      {/* Profit calculator */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <PoundSterling className="h-4 w-4 text-green-600" />
          <h3 className="font-semibold text-primary text-sm">Profit calculator</h3>
        </div>
        <p className="text-xs text-primary/40 mb-5">Adjust the sliders to estimate your margins</p>

        <div className="space-y-6 mb-6">
          {/* Slider 1: Servings */}
          <div>
            <div className="flex justify-between mb-1">
              <div>
                <label className="text-sm font-semibold text-primary">Servings sold per month</label>
                <p className="text-xs text-primary/40">How many individual NECTA servings you sell to customers</p>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <span className="text-xl font-bold text-primary">{servingsPerMonth}</span>
                <p className="text-xs text-primary/40">servings</p>
              </div>
            </div>
            <input
              type="range"
              min={50}
              max={1000}
              step={10}
              value={servingsPerMonth}
              onChange={(e) => setServingsPerMonth(Number(e.target.value))}
              className="w-full accent-primary mt-2"
            />
            <div className="flex justify-between text-xs text-primary/30 mt-1">
              <span>50 servings</span>
              <span>1,000 servings</span>
            </div>
          </div>

          {/* Slider 2: Price per serving */}
          <div>
            <div className="flex justify-between mb-1">
              <div>
                <label className="text-sm font-semibold text-primary">What you charge per serving</label>
                <p className="text-xs text-primary/40">The price you add to each drink for the customer</p>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <span className="text-xl font-bold text-primary">£{pricePerServing.toFixed(2)}</span>
                <p className="text-xs text-primary/40">per serving</p>
              </div>
            </div>
            <input
              type="range"
              min={1.50}
              max={3.00}
              step={0.10}
              value={pricePerServing}
              onChange={(e) => setPricePerServing(Number(e.target.value))}
              className="w-full accent-primary mt-2"
            />
            <div className="flex justify-between text-xs text-primary/30 mt-1">
              <span>£1.50 — min. recommended</span>
              <span>£3.00 — premium pricing</span>
            </div>
          </div>
        </div>

        {/* Bottles needed callout */}
        <div className="bg-primary/5 border border-primary/10 rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-primary">Bottles to order per month</p>
            <p className="text-xs text-primary/50">{servingsPerMonth} servings ÷ {SERVINGS_PER_BOTTLE} servings per bottle</p>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-2xl font-bold text-primary">{bottlesNeeded}</span>
            <p className="text-xs text-primary/50">×250ml bottles</p>
          </div>
        </div>

        {/* Profit results */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-xs text-green-600/70 mb-1">Monthly profit</p>
            <p className="text-2xl font-bold text-green-700">£{monthlyProfit.toFixed(0)}</p>
          </div>
          <div className="bg-muted rounded-xl p-4">
            <p className="text-xs text-primary/50 mb-1">Annual profit</p>
            <p className="text-2xl font-bold text-primary">£{annualProfit.toFixed(0)}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm py-1.5 border-b border-border">
            <span className="text-primary/60">Your wholesale cost per serving</span>
            <span className="font-medium text-primary">£{COST_PER_SERVING.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm py-1.5 border-b border-border">
            <span className="text-primary/60">Gross margin</span>
            <span className="font-bold text-green-600">{grossMarginPct.toFixed(0)}%</span>
          </div>
          <div className="flex justify-between text-sm py-1.5">
            <span className="text-primary/60">Revenue per month</span>
            <span className="font-medium text-primary">£{revenuePerMonth.toFixed(0)}</span>
          </div>
        </div>

        <p className="text-xs text-primary/30 mt-4">
          Based on £{WHOLESALE_COST_PER_BOTTLE} wholesale per 250ml bottle · {SERVINGS_PER_BOTTLE} servings per bottle. Actual margins vary with 500ml bottles (£30, 33.3 servings).
        </p>
      </div>
    </div>
  );
};

export default SalesPerformanceTab;
