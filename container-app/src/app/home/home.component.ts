import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Policy, POLICY_TYPE_ICONS, STATUS_COLORS } from '../shared/models/policy.model';
import { Payment, PAYMENT_STATUS_COLORS } from '../shared/models/payment.model';
import { StorageService } from '../shared/services/storage.service';
import { getPolicyPaymentState } from '../shared/utils/payment-due';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  policies: Policy[] = [];
  payments: Payment[] = [];
  stats = {
    totalPolicies: 0,
    activePolicies: 0,
    totalPremium: 0,
    totalPaid: 0,
    duePolicies: 0,
  };
  recentPayments: Payment[] = [];
  duePolicies: Array<{ policy: Policy; reason: string; nextDueDate: string }> = [];

  readonly POLICY_TYPE_ICONS = POLICY_TYPE_ICONS;
  readonly STATUS_COLORS = STATUS_COLORS;
  readonly PAYMENT_STATUS_COLORS = PAYMENT_STATUS_COLORS;

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    this.policies = this.storage.get<Policy[]>('insurance_policies') || [];
    this.payments = this.storage.get<Payment[]>('insurance_payments') || [];

    this.stats.totalPolicies = this.policies.length;
    this.stats.activePolicies = this.policies.filter(p => p.status === 'active').length;
    this.stats.totalPremium = this.policies
      .filter(p => p.status === 'active')
      .reduce((sum, p) => sum + p.premiumAmount, 0);
    this.stats.totalPaid = this.payments
      .filter(p => p.status === 'success')
      .reduce((sum, p) => sum + p.amount, 0);
    this.duePolicies = this.policies
      .map(policy => ({ policy, paymentState: getPolicyPaymentState(policy, this.payments) }))
      .filter(item => item.paymentState.isPayable)
      .map(item => ({
        policy: item.policy,
        reason: item.paymentState.reason,
        nextDueDate: item.paymentState.nextDueDate,
      }))
      .slice(0, 3);
    this.stats.duePolicies = this.duePolicies.length;

    this.recentPayments = this.payments.slice(0, 3);
  }
}
