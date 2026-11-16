import { describe, expect, it } from "vitest";

import { estimateSolarSavings } from "@/lib/solar-estimates";

describe("solar savings estimate", () => {
  it("estimates an 80% bill offset for a ₹5,000 bill at ₹8 per kWh", () => {
    const estimate = estimateSolarSavings(5_000, 8);

    expect(estimate?.monthlyGenerationKwh).toBe(500);
    expect(estimate?.annualSavingsInr).toBe(48_000);
    expect(estimate?.systemSizeKw).toBeCloseTo(500 / (4.5 * 30 * 0.78), 6);
  });

  it("does not calculate for a missing bill or zero tariff", () => {
    expect(estimateSolarSavings(0, 8)).toBeNull();
    expect(estimateSolarSavings(5_000, 0)).toBeNull();
  });
});
