import { Policy } from '../models/policy.model';
import { Payment } from '../models/payment.model';

export const MOCK_POLICIES: Policy[] = [
  {
    id: 'pol-001',
    policyNumber: 'HLT-2024-001',
    holderName: 'Vinita',
    type: 'health',
    premiumAmount: 1500,
    premiumFrequency: 'monthly',
    startDate: '2025-10-15',
    endDate: '2026-10-14',
    status: 'active',
    coverageAmount: 500000,
    nominee: 'Priya Kumar',
    description: 'Comprehensive health insurance covering hospitalization, daycare procedures, and critical illness.'
  },
  {
    id: 'pol-002',
    policyNumber: 'LIF-2024-002',
    holderName: 'Vinita',
    type: 'life',
    premiumAmount: 3500,
    premiumFrequency: 'quarterly',
    startDate: '2025-09-01',
    endDate: '2045-08-31',
    status: 'active',
    coverageAmount: 2500000,
    nominee: 'Priya Kumar',
    description: 'Term life insurance with accidental death benefit and critical illness rider.'
  },
  {
    id: 'pol-003',
    policyNumber: 'AUT-2024-003',
    holderName: 'Vinita',
    type: 'auto',
    premiumAmount: 850,
    premiumFrequency: 'semi-annual',
    startDate: '2025-03-01',
    endDate: '2026-12-31',
    status: 'active',
    coverageAmount: 750000,
    nominee: 'N/A',
    description: 'Comprehensive auto insurance with zero depreciation, roadside assistance, and engine protect.'
  },
  {
    id: 'pol-004',
    policyNumber: 'HOM-2023-004',
    holderName: 'Vinita',
    type: 'home',
    premiumAmount: 2200,
    premiumFrequency: 'annual',
    startDate: '2023-09-01',
    endDate: '2024-08-31',
    status: 'expired',
    coverageAmount: 3000000,
    nominee: 'Priya Kumar',
    description: 'Home insurance covering structure, contents, natural disasters, and third-party liability.'
  },
  {
    id: 'pol-005',
    policyNumber: 'TRV-2024-005',
    holderName: 'Vinita',
    type: 'travel',
    premiumAmount: 450,
    premiumFrequency: 'monthly',
    startDate: '2026-03-05',
    endDate: '2026-09-04',
    status: 'pending',
    coverageAmount: 1000000,
    nominee: 'Self',
    description: 'International travel insurance with medical evacuation, trip cancellation, and baggage loss coverage.'
  },
  {
    id: 'pol-006',
    policyNumber: 'HLT-2023-006',
    holderName: 'Vinita',
    type: 'health',
    premiumAmount: 1200,
    premiumFrequency: 'monthly',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    status: 'cancelled',
    coverageAmount: 300000,
    nominee: 'Priya Kumar',
    description: 'Basic health insurance plan — cancelled and upgraded to comprehensive plan.'
  }
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay-001',
    policyId: 'pol-001',
    policyNumber: 'HLT-2024-001',
    amount: 1500,
    date: '2026-02-15',
    status: 'success',
    method: 'credit_card',
    cardLast4: '4242',
    transactionId: 'TXN-2026-FEB-001'
  },
  {
    id: 'pay-002',
    policyId: 'pol-001',
    policyNumber: 'HLT-2024-001',
    amount: 1500,
    date: '2026-01-15',
    status: 'success',
    method: 'credit_card',
    cardLast4: '4242',
    transactionId: 'TXN-2026-JAN-001'
  },
  {
    id: 'pay-003',
    policyId: 'pol-002',
    policyNumber: 'LIF-2024-002',
    amount: 3500,
    date: '2025-12-01',
    status: 'success',
    method: 'net_banking',
    transactionId: 'TXN-2025-DEC-002'
  },
  {
    id: 'pay-004',
    policyId: 'pol-003',
    policyNumber: 'AUT-2024-003',
    amount: 850,
    date: '2026-03-01',
    status: 'pending',
    method: 'upi',
    transactionId: 'TXN-2026-MAR-003'
  },
  {
    id: 'pay-005',
    policyId: 'pol-005',
    policyNumber: 'TRV-2024-005',
    amount: 450,
    date: '2026-03-05',
    status: 'failed',
    method: 'debit_card',
    cardLast4: '8888',
    transactionId: 'TXN-2026-MAR-005'
  }
];

export function seedMockData(): void {
  if (!localStorage.getItem('insurance_policies')) {
    localStorage.setItem('insurance_policies', JSON.stringify(MOCK_POLICIES));
  }
  if (!localStorage.getItem('insurance_payments')) {
    localStorage.setItem('insurance_payments', JSON.stringify(MOCK_PAYMENTS));
  }
}
