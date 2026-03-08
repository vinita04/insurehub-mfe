import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Policy, PolicyType, POLICY_TYPE_LABELS, STATUS_COLORS } from '../shared/models/policy.model';
import { StorageService } from '../shared/services/storage.service';
import { Payment } from '../shared/models/payment.model';
import { PolicyPaymentState, getPolicyPaymentState } from '../shared/utils/payment-due';

const POLICY_MATERIAL_ICONS: Record<PolicyType, string> = {
  health: 'local_hospital',
  life: 'shield',
  auto: 'directions_car',
  home: 'home',
  travel: 'flight',
};

@Component({
  selector: 'app-policy-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './policy-dashboard.component.html',
  styleUrl: './policy-dashboard.component.scss',
})
export class PolicyDashboardComponent implements OnInit {
  policies: Policy[] = [];
  filteredPolicies: Policy[] = [];
  paymentStates: Record<string, PolicyPaymentState> = {};
  activeFilter: string = 'all';

  readonly POLICY_TYPE_LABELS = POLICY_TYPE_LABELS;
  readonly STATUS_COLORS = STATUS_COLORS;

  filters = [
    { key: 'all', label: 'All Policies' },
    { key: 'active', label: 'Active' },
    { key: 'expired', label: 'Expired' },
    { key: 'pending', label: 'Pending' },
  ];

  constructor(
    private storage: StorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const payments = this.storage.get<Payment[]>('insurance_payments') || [];
    this.policies = this.storage.get<Policy[]>('insurance_policies') || [];
    this.paymentStates = this.policies.reduce<Record<string, PolicyPaymentState>>((acc, policy) => {
      acc[policy.id] = getPolicyPaymentState(policy, payments);
      return acc;
    }, {});
    this.applyFilter('all');
  }

  applyFilter(filter: string): void {
    this.activeFilter = filter;
    this.filteredPolicies = filter === 'all'
      ? this.policies
      : this.policies.filter(p => p.status === filter);
  }

  viewPolicy(policy: Policy): void {
    this.router.navigate(['/policies', policy.id]);
  }

  getTypeIcon(type: PolicyType): string {
    return POLICY_MATERIAL_ICONS[type] || 'description';
  }

  getPaymentState(policyId: string): PolicyPaymentState | null {
    return this.paymentStates[policyId] || null;
  }
}
