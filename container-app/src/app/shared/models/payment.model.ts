export interface Payment {
  id: string;
  policyId: string;
  policyNumber: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  method: PaymentMethod;
  cardLast4?: string;
  transactionId: string;
}

export type PaymentStatus = 'success' | 'pending' | 'failed';

export type PaymentMethod = 'credit_card' | 'debit_card' | 'net_banking' | 'upi';

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  credit_card: 'Credit Card',
  debit_card: 'Debit Card',
  net_banking: 'Net Banking',
  upi: 'UPI',
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  success: '#22c55e',
  pending: '#f59e0b',
  failed: '#ef4444',
};
