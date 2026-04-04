import { useState } from "react";
import { TrendingUp, PoundSterling, Users, Zap } from "lucide-react";

const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
const ORDER_BOTTLES = [6, 18, 22, 26, 26, 28]; // bottles ordered per month

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
  const avgStockistServings = 320;

  const maxBottles = Math.max(...ORDER_BOTTLES);

  return (
    <div className="space-y-5">
      {/* Monthly order trend */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-primary text-sm mb-1">Bottles ordered per month</h3>
        <p className="text-xs text-primary/40 mb-5">Your order history (last 6 months)</p>
        <div className="flex items-end gap-2 h-32">
          {MONTHS.map((month, i) => {
            const bottles = ORDER_BOTTLES[i];
            const heightPct = maxBottles > 0 ? (bottles / maxBottles) * 100 : 0;
            const isLatest = i === MONTHS.length - 1;
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-primary tabular-nums">{bottles}</span>
                <div className="w-full flex items-end" style={{ height: "80px" }}>
                  <div
                    className={`w-full rounded-t-lg transition-all ${isLatest ? "bg-primary" : "bg-muted"}`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-xs text-primary/40">{month}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-primary/40 mt-3 text-center">
          Trend: +{Math.round(((ORDER_BOTTLES[ORDER_BOTTLES.length - 1] - ORDER_BOTTLES[0]) / ORDER_BOTTLES[0]) * 100)}% since first order
        </p>
      </div>

      {/* Profit calculator */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <PoundSterling className="h-4 w-4 text-green-600" />
          <h3 className="font-semibold text-primary text-sm">Profit calculator</h3>
        </div>
        <p className="text-xs text-primary/40 mb-5">Adjust to match your venue's performance</p>

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
      </div>

      {/* Benchmark comparison */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-primary text-sm">How you compare</h3>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-primary/50 mb-1.5">
              <span>You: {servingsPerMonth} servings/mo</span>
              <span>Avg stockist: {avgStockistServings}</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden relative">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min((servingsPerMonth / avgStockistServings) * 100, 100)}%` }}
              />
              <div
                className="absolute top-0 h-full w-0.5 bg-primary/30"
                style={{ left: "100%" }}
              />
            </div>
            <p className="text-xs text-primary/40 mt-1.5">
              {servingsPerMonth >= avgStockistServings
                ? `${Math.round(((servingsPerMonth - avgStockistServings) / avgStockistServings) * 100)}% above average — great performance!`
                : `${Math.round(((avgStockistServings - servingsPerMonth) / avgStockistServings) * 100)}% below average. Increase visibility to grow.`}
            </p>
          </div>
        </div>
      </div>

      {/* Optimisation tips */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-amber-500" />
          <h3 className="font-semibold text-primary text-sm">Growth suggestions</h3>
        </div>
        <div className="space-y-3">
          {[
            {
              tip: "Switch 2 bottles to 500ml",
              impact: "Increase servings by ~33 per switch with only £8 more spend",
              action: "Reorder",
            },
            {
              tip: "Add GLOW to your menu",
              impact: "Skin health is trending — GLOW is our fastest growing SKU",
              action: "Try it",
            },
            {
              tip: "Display signage near the till",
              impact: "Stockists with visible POS signage sell 2× more servings",
              action: "Get materials",
            },
          ].map(({ tip, impact, action }) => (
            <div key={tip} className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
              <span className="text-base mt-0.5">💡</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-primary">{tip}</p>
                <p className="text-xs text-primary/50 mt-0.5">{impact}</p>
              </div>
              <button className="text-xs font-medium text-primary border border-primary/20 px-2 py-1 rounded-lg hover:bg-primary hover:text-white transition-colors flex-shrink-0">
                {action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesPerformanceTab;
