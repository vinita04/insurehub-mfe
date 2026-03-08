import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Policy, PolicyType, POLICY_TYPE_LABELS, STATUS_COLORS } from '../shared/models/policy.model';
import { StorageService } from '../shared/services/storage.service';
import { EventBusService, MFE_EVENTS } from '../shared/services/event-bus.service';

const POLICY_MATERIAL_ICONS: Record<PolicyType, string> = {
  health: 'local_hospital',
  life: 'shield',
  auto: 'directions_car',
  home: 'home',
  travel: 'flight',
};

// Inline premium calculation (fallback when Worker fails cross-origin)
function calculatePremiumDetails(input: any): any {
  const { premiumAmount, premiumFrequency, coverageAmount, startDate, endDate } = input;
  const multipliers: Record<string, number> = { monthly: 12, quarterly: 4, 'semi-annual': 2, annual: 1 };
  const mult = multipliers[premiumFrequency] || 12;
  const annualPremium = premiumAmount * mult;
  const monthlyEquivalent = annualPremium / 12;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / 86400000);
  const daysPassed = Math.ceil((now.getTime() - start.getTime()) / 86400000);
  const daysRemaining = Math.max(0, totalDays - daysPassed);

  const totalMonths = Math.ceil(totalDays / 30);
  const monthsPassed = Math.ceil(daysPassed / 30);
  const paymentsPerYear = mult;
  const totalPayments = Math.ceil(totalMonths / (12 / paymentsPerYear));
  const paymentsMade = Math.min(Math.ceil(monthsPassed / (12 / paymentsPerYear)), totalPayments);
  const remainingPayments = Math.max(0, totalPayments - paymentsMade);
  const totalPaidToDate = paymentsMade * premiumAmount;

  const lastPayment = new Date(start);
  lastPayment.setMonth(lastPayment.getMonth() + paymentsMade * (12 / paymentsPerYear));
  const nextPaymentDate = lastPayment.toISOString().split('T')[0];

  let discountTier: string, discountPercentage: number;
  if (annualPremium >= 50000) { discountTier = 'Platinum'; discountPercentage = 15; }
  else if (annualPremium >= 25000) { discountTier = 'Gold'; discountPercentage = 10; }
  else if (annualPremium >= 10000) { discountTier = 'Silver'; discountPercentage = 5; }
  else { discountTier = 'Standard'; discountPercentage = 0; }

  const effectivePremium = premiumAmount * (1 - discountPercentage / 100);
  const taxAmount = effectivePremium * 0.18;
  const totalWithTax = effectivePremium + taxAmount;
  const coverageRatio = coverageAmount / annualPremium;
  const projectedTotalCost = totalPayments * totalWithTax;

  return { annualPremium, monthlyEquivalent, totalPaidToDate, remainingPayments, nextPaymentDate,
    discountTier, discountPercentage, effectivePremium, taxAmount, totalWithTax, coverageRatio,
    daysRemaining, projectedTotalCost };
}

@Component({
  selector: 'app-policy-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './policy-detail.component.html',
  styleUrl: './policy-detail.component.scss',
})
export class PolicyDetailComponent implements OnInit, OnDestroy {
  policy: Policy | null = null;
  premiumCalc: any = null;
  isCalculating = true;
  workerUsed = false;
  private worker: Worker | null = null;

  readonly POLICY_TYPE_LABELS = POLICY_TYPE_LABELS;
  readonly STATUS_COLORS = STATUS_COLORS;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    private eventBus: EventBusService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const policies = this.storage.get<Policy[]>('insurance_policies') || [];
    this.policy = policies.find(p => p.id === id) || null;
    if (this.policy) {
      this.startPremiumCalculation(this.policy);
    }
  }

  ngOnDestroy(): void {
    this.worker?.terminate();
  }

  getTypeIcon(type: PolicyType): string {
    return POLICY_MATERIAL_ICONS[type] || 'description';
  }

  private startPremiumCalculation(policy: Policy): void {
    const input = {
      premiumAmount: policy.premiumAmount,
      premiumFrequency: policy.premiumFrequency,
      coverageAmount: policy.coverageAmount,
      policyType: policy.type,
      startDate: policy.startDate,
      endDate: policy.endDate,
    };

    try {
      if (typeof Worker !== 'undefined') {
        this.worker = new Worker(new URL('../workers/premium-calc.worker', import.meta.url));
        this.worker.onmessage = ({ data }) => {
          this.premiumCalc = data;
          this.isCalculating = false;
          this.workerUsed = true;
        };
        this.worker.onerror = () => {
          // Fallback to main thread if Worker fails (e.g., cross-origin in MFE container)
          this.premiumCalc = calculatePremiumDetails(input);
          this.isCalculating = false;
        };
        this.worker.postMessage(input);
      } else {
        this.premiumCalc = calculatePremiumDetails(input);
        this.isCalculating = false;
      }
    } catch {
      // Fallback for SecurityError in cross-origin context
      this.premiumCalc = calculatePremiumDetails(input);
      this.isCalculating = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/policies']);
  }

  payPremium(): void {
    if (!this.policy) return;
    this.eventBus.emit(MFE_EVENTS.NAVIGATE_TO_PAYMENT, {
      policyId: this.policy.id,
      policyNumber: this.policy.policyNumber,
      amount: this.premiumCalc?.totalWithTax || this.policy.premiumAmount,
      policyType: this.policy.type,
    }, 'policy-mfe');
    this.router.navigate(['/payments']);
  }
}
