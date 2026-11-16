import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { estimateSolarSavings } from "@/lib/solar-estimates";
export function HomeSavings() {
  const [bill, setBill] = useState(5000);
  const estimate = estimateSolarSavings(bill, 8);
  return (
    <section className="home-calculator brand-surface-band py-12 md:py-16">
      <div className="site-wrap grid gap-12 md:grid-cols-2 md:gap-16">
        <div data-enter="left">
          <p className="eyebrow">YOUR SOLAR SAVINGS</p>
          <h2 className="section-heading mt-5">Discover what solar could save you.</h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
            Start with your monthly electricity bill. Then explore the assumptions in the full
            calculator.
          </p>
          <label className="field-label mt-9" htmlFor="home-bill">
            Monthly electricity bill <span>INR</span>
          </label>
          <div className="input-prefix">
            <span>₹</span>
            <input
              id="home-bill"
              type="number"
              min={1}
              max={100000000}
              value={bill}
              onChange={(e) => setBill(Number(e.target.value))}
            />
          </div>
          <input
            type="range"
            aria-label="Adjust monthly bill"
            className="range-input"
            min={1000}
            max={50000}
            step={500}
            value={Math.min(50000, Math.max(1000, bill))}
            onChange={(e) => setBill(Number(e.target.value))}
          />
          <div className="bill-presets" aria-label="Common monthly bills">
            {[3000, 5000, 10000, 20000].map((amount) => (
              <button
                key={amount}
                type="button"
                aria-pressed={bill === amount}
                onClick={() => setBill(amount)}
              >
                ?{amount.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
          <div className="range-hints">
            <span>₹1,000</span>
            <span>₹50,000+</span>
          </div>
        </div>
        <div className="estimate-panel !static" data-enter="right">
          <p className="eyebrow eyebrow-light">YOUR SOLAR SNAPSHOT</p>
          <p className="mt-8 text-xs text-white/60">Potential annual bill savings</p>
          <p className="mt-3 font-display text-5xl font-semibold">
            {estimate ? "₹" + Math.round(estimate.annualSavingsInr).toLocaleString("en-IN") : "—"}
          </p>
          <div className="estimate-divider" />
          <div className="estimate-result">
            <div>
              <span>Illustrative system size</span>
              <strong>{estimate ? estimate.systemSizeKw.toFixed(1) + " kW" : "—"}</strong>
            </div>
            <div>
              <span>Monthly generation</span>
              <strong>{estimate ? Math.round(estimate.monthlyGenerationKwh) + " kWh" : "—"}</strong>
            </div>
          </div>
          <p className="mt-6 text-[11px] leading-6 text-white/60">
            Illustrative model: ₹8/kWh tariff, 80% bill offset, 4.5 peak-sun hours/day and 78%
            performance ratio. No subsidy included. Actual results depend on your site.
          </p>
          <Link to="/calculator" className="admin-save !bg-brand-orange !text-brand-ink">
            Personalize my estimate <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
