/// <reference lib="webworker" />

/**
 * Premium Calculation Web Worker
 * Offloads heavy premium calculations from the main thread.
 */

interface PremiumCalcInput {
  premiumAmount: number;
  premiumFrequency: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  coverageAmount: number;
  policyType: string;
  startDate: string;
  endDate: string;
}

interface PremiumCalcResult {
  annualPremium: number;
  monthlyEquivalent: number;
  totalPaidToDate: number;
  remainingPayments: number;
  nextPaymentDate: string;
  discountTier: string;
  discountPercentage: number;
  effectivePremium: number;
  taxAmount: number;
  totalWithTax: number;
  coverageRatio: number;
  daysRemaining: number;
  projectedTotalCost: number;
}

addEventListener('message', ({ data }: { data: PremiumCalcInput }) => {
  // Simulate complex computation with some delay
  const result = calculatePremiumDetails(data);
  postMessage(result);
});

function calculatePremiumDetails(input: PremiumCalcInput): PremiumCalcResult {
  const { premiumAmount, premiumFrequency, coverageAmount, startDate, endDate } = input;

  // Calculate annual premium
  const frequencyMultiplier: Record<string, number> = {
    'monthly': 12,
    'quarterly': 4,
    'semi-annual': 2,
    'annual': 1,
  };
  const multiplier = frequencyMultiplier[premiumFrequency] || 12;
  const annualPremium = premiumAmount * multiplier;
  const monthlyEquivalent = annualPremium / 12;

  // Calculate dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, totalDays - daysPassed);

  // Total payments calculation
  const totalMonths = Math.ceil(totalDays / 30);
  const monthsPassed = Math.ceil(daysPassed / 30);
  const paymentsPerPeriod = multiplier;
  const totalPayments = Math.ceil(totalMonths / (12 / paymentsPerPeriod));
  const paymentsMade = Math.min(Math.ceil(monthsPassed / (12 / paymentsPerPeriod)), totalPayments);
  const remainingPayments = Math.max(0, totalPayments - paymentsMade);
  const totalPaidToDate = paymentsMade * premiumAmount;

  // Next payment date
  const lastPaymentDate = new Date(start);
  lastPaymentDate.setMonth(lastPaymentDate.getMonth() + paymentsMade * (12 / paymentsPerPeriod));
  const nextPaymentDate = lastPaymentDate.toISOString().split('T')[0];

  // Discount tiers based on annual premium
  let discountTier: string;
  let discountPercentage: number;
  if (annualPremium >= 50000) {
    discountTier = 'Platinum';
    discountPercentage = 15;
  } else if (annualPremium >= 25000) {
    discountTier = 'Gold';
    discountPercentage = 10;
  } else if (annualPremium >= 10000) {
    discountTier = 'Silver';
    discountPercentage = 5;
  } else {
    discountTier = 'Standard';
    discountPercentage = 0;
  }

  const effectivePremium = premiumAmount * (1 - discountPercentage / 100);

  // Tax calculation (18% GST on insurance)
  const taxRate = 0.18;
  const taxAmount = effectivePremium * taxRate;
  const totalWithTax = effectivePremium + taxAmount;

  // Coverage ratio
  const coverageRatio = coverageAmount / annualPremium;

  // Projected total cost
  const projectedTotalCost = totalPayments * totalWithTax;

  return {
    annualPremium,
    monthlyEquivalent,
    totalPaidToDate,
    remainingPayments,
    nextPaymentDate,
    discountTier,
    discountPercentage,
    effectivePremium,
    taxAmount,
    totalWithTax,
    coverageRatio,
    daysRemaining,
    projectedTotalCost,
  };
}
