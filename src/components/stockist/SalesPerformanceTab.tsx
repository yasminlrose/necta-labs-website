import { useState } from "react";
import { PoundSterling, BarChart3 } from "lucide-react";

function getProfitAtServings(servings: number, pricePerServing: number, costPerServing: number) {
  return (pricePerServing - costPerServing) * servings;
}

const SalesPerformanceTab = () => {
  const [servingsPerMonth, setServingsPerMonth] = useState(280);
  const [pricePerServing, setPricePerServing] = useState(2.00);

  const costPerServing = 1.32; // Based on £22 / 16.7 servings
  const monthlyProfit = getProfitAtServings(servingsPerMonth, pricePerServing, costPerServing);
  const annualProfit = monthlyProfit * 12;
  const grossMarginPct = ((pricePerServing - costPerServing) / pricePerServing) * 100;

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
        <p className="text-xs text-primary/40 mb-5">Estimate your revenue and margins</p>

        <div className="space-y-5 mb-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-medium text-primary/70">Servings sold per month</label>
              <span className="text-sm font-bold text-primary">{servingsPerMonth}</span>
            </div>
            <input
              type="range"
              min={50}
              max={1000}
              step={10}
              value={servingsPerMonth}
              onChange={(e) => setServingsPerMonth(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-primary/30 mt-1">
              <span>50</span>
              <span>1,000</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-medium text-primary/70">Your price per serving</label>
              <span className="text-sm font-bold text-primary">£{pricePerServing.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={1.50}
              max={3.00}
              step={0.10}
              value={pricePerServing}
              onChange={(e) => setPricePerServing(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-primary/30 mt-1">
              <span>£1.50</span>
              <span>£3.00</span>
            </div>
          </div>
        </div>

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
          <div className="flex justify-between text-sm">
            <span className="text-primary/60">Your cost per serving</span>
            <span className="font-medium text-primary">£{costPerServing.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-primary/60">Gross margin</span>
            <span className="font-bold text-green-600">{grossMarginPct.toFixed(0)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-primary/60">Revenue per month</span>
            <span className="font-medium text-primary">£{(servingsPerMonth * pricePerServing).toFixed(0)}</span>
          </div>
        </div>
        <p className="text-xs text-primary/30 mt-4">
          Cost per serving based on £22 / 16.7 servings (250ml bottle). Actual margins vary with order size.
        </p>
      </div>
    </div>
  );
};

export default SalesPerformanceTab;
