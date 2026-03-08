import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Payment, PAYMENT_METHOD_LABELS, PAYMENT_STATUS_COLORS } from '../shared/models/payment.model';
import { StorageService } from '../shared/services/storage.service';
import { resetMockData } from '../shared/data/mock-data';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-history.component.html',
  styleUrl: './payment-history.component.scss',
})
export class PaymentHistoryComponent implements OnInit {
  payments: Payment[] = [];
  totalPaid = 0;
  successfulPaymentCount = 0;
  paidPolicyCount = 0;

  readonly PAYMENT_METHOD_LABELS = PAYMENT_METHOD_LABELS;
  readonly PAYMENT_STATUS_COLORS = PAYMENT_STATUS_COLORS;

  constructor(
    private storage: StorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.payments = this.storage.get<Payment[]>('insurance_payments') || [];
    const successfulPayments = this.payments.filter(p => p.status === 'success');
    this.successfulPaymentCount = successfulPayments.length;
    this.paidPolicyCount = new Set(successfulPayments.map(payment => payment.policyId)).size;
    this.totalPaid = successfulPayments
      .reduce((sum, p) => sum + p.amount, 0);
  }

  goBack(): void {
    this.router.navigate(['/payments']);
  }

  getMethodIcon(method: string): string {
    const icons: Record<string, string> = {
      credit_card: 'credit_card',
      debit_card: 'account_balance',
      net_banking: 'account_balance',
      upi: 'phone_android',
    };
    return icons[method] || 'payments';
  }

  resetSimulation(): void {
    const shouldReset = window.confirm('Clear the shared demo data and reseed the app to its initial 2025-2026 state?');
    if (!shouldReset) return;

    resetMockData();
    window.location.reload();
  }
}
