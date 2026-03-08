export interface Policy {
  id: string;
  policyNumber: string;
  holderName: string;
  type: PolicyType;
  premiumAmount: number;
  premiumFrequency: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  startDate: string;
  endDate: string;
  status: PolicyStatus;
  coverageAmount: number;
  nominee: string;
  description: string;
}

export type PolicyType = 'health' | 'life' | 'auto' | 'home' | 'travel';

export type PolicyStatus = 'active' | 'expired' | 'pending' | 'cancelled';

export const POLICY_TYPE_LABELS: Record<PolicyType, string> = {
  health: 'Health Insurance',
  life: 'Life Insurance',
  auto: 'Auto Insurance',
  home: 'Home Insurance',
  travel: 'Travel Insurance',
};

export const POLICY_TYPE_ICONS: Record<PolicyType, string> = {
  health: '🏥',
  life: '🛡️',
  auto: '🚗',
  home: '🏠',
  travel: '✈️',
};

export const STATUS_COLORS: Record<PolicyStatus, string> = {
  active: '#22c55e',
  expired: '#ef4444',
  pending: '#f59e0b',
  cancelled: '#94a3b8',
};
