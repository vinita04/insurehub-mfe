import { Payment } from '../models/payment.model';
import { Policy } from '../models/policy.model';

export interface PolicyPaymentState {
  policyId: string;
  nextDueDate: string;
  lastSuccessfulPaymentDate: string | null;
  isPayable: boolean;
  isOverdue: boolean;
  reason: string;
}

const FREQUENCY_MONTHS: Record<Policy['premiumFrequency'], number> = {
  monthly: 1,
  quarterly: 3,
  'semi-annual': 6,
  annual: 12,
};

function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00`);
}

function formatDate(value: Date): string {
  return value.toISOString().split('T')[0];
}

function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

export function getPolicyPaymentState(policy: Policy, payments: Payment[], now = new Date()): PolicyPaymentState {
  const successfulPayments = payments
    .filter(payment => payment.policyId === policy.id && payment.status === 'success')
    .sort((a, b) => b.date.localeCompare(a.date));

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDate = parseDate(policy.startDate);
  const endDate = parseDate(policy.endDate);
  const lastSuccessfulPaymentDate = successfulPayments[0]?.date ?? null;
  const lastAnchorDate = lastSuccessfulPaymentDate ? parseDate(lastSuccessfulPaymentDate) : startDate;
  const nextDueDate = policy.status === 'pending'
    ? startDate
    : addMonths(lastAnchorDate, lastSuccessfulPaymentDate ? FREQUENCY_MONTHS[policy.premiumFrequency] : 0);

  if (policy.status === 'expired' || policy.status === 'cancelled' || endDate < today) {
    return {
      policyId: policy.id,
      nextDueDate: formatDate(nextDueDate),
      lastSuccessfulPaymentDate,
      isPayable: false,
      isOverdue: false,
      reason: 'Policy is not payable',
    };
  }

  if (policy.status === 'pending') {
    const isPayable = startDate <= today;
    return {
      policyId: policy.id,
      nextDueDate: formatDate(nextDueDate),
      lastSuccessfulPaymentDate,
      isPayable,
      isOverdue: isPayable,
      reason: isPayable ? 'Activation payment pending' : 'Activation payment not due yet',
    };
  }

  const isOverdue = nextDueDate < today;
  const isPayable = nextDueDate <= today;

  return {
    policyId: policy.id,
    nextDueDate: formatDate(nextDueDate),
    lastSuccessfulPaymentDate,
    isPayable,
    isOverdue,
    reason: isOverdue
      ? `Premium overdue since ${formatDate(nextDueDate)}`
      : isPayable
        ? `Premium due on ${formatDate(nextDueDate)}`
        : `Paid through ${formatDate(addMonths(nextDueDate, -FREQUENCY_MONTHS[policy.premiumFrequency]))}`,
  };
}
