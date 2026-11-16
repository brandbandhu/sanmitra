export const SOLAR_ASSUMPTIONS = {
  peakSunHoursPerDay: 4.5,
  performanceRatio: 0.78,
  targetBillOffset: 0.8,
  estimatedInstalledCostPerKw: 55_000,
  estimatedGridEmissionsKgPerKwh: 0.7,
} as const;

export type SolarEstimate = {
  systemSizeKw: number;
  monthlyGenerationKwh: number;
  annualSavingsInr: number;
  estimatedPaybackYears: number;
  annualCarbonReductionKg: number;
};

export function estimateSolarSavings(monthlyBillInr: number, tariffInrPerKwh = 8): SolarEstimate | null {
  if (!Number.isFinite(monthlyBillInr) || monthlyBillInr <= 0) return null;
  if (!Number.isFinite(tariffInrPerKwh) || tariffInrPerKwh <= 0) return null;

  const monthlyGenerationKwh =
    (monthlyBillInr * SOLAR_ASSUMPTIONS.targetBillOffset) / tariffInrPerKwh;
  const monthlyGenerationPerKw =
    SOLAR_ASSUMPTIONS.peakSunHoursPerDay * 30 * SOLAR_ASSUMPTIONS.performanceRatio;
  const systemSizeKw = monthlyGenerationKwh / monthlyGenerationPerKw;
  const annualSavingsInr = monthlyGenerationKwh * tariffInrPerKwh * 12;

  return {
    systemSizeKw,
    monthlyGenerationKwh,
    annualSavingsInr,
    estimatedPaybackYears:
      (systemSizeKw * SOLAR_ASSUMPTIONS.estimatedInstalledCostPerKw) / annualSavingsInr,
    annualCarbonReductionKg:
      monthlyGenerationKwh * 12 * SOLAR_ASSUMPTIONS.estimatedGridEmissionsKgPerKwh,
  };
}