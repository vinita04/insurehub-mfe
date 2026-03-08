import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Policy, POLICY_TYPE_LABELS } from '../shared/models/policy.model';
import { Payment, PaymentMethod, PAYMENT_METHOD_LABELS } from '../shared/models/payment.model';
import { StorageService } from '../shared/services/storage.service';
import { EventBusService, MFE_EVENTS } from '../shared/services/event-bus.service';

interface PaymentData {
  policyId: string;
  policyNumber: string;
  amount: number;
  policyType: string;
}

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.scss',
})
export class PaymentFormComponent implements OnInit, OnDestroy {
  policies: Policy[] = [];
  selectedPolicyId = '';
  selectedPolicy: Policy | null = null;
  amount: number = 0;
  paymentMethod: PaymentMethod = 'credit_card';
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';
  upiId = '';
  isProcessing = false;
  paymentSuccess = false;
  errors: Record<string, string> = {};
  crossMfeData: PaymentData | null = null;
  private subscription: Subscription | null = null;

  readonly PAYMENT_METHOD_LABELS = PAYMENT_METHOD_LABELS;
  readonly paymentMethods: PaymentMethod[] = ['credit_card', 'debit_card', 'net_banking', 'upi'];

  constructor(
    private storage: StorageService,
    private eventBus: EventBusService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.policies = (this.storage.get<Policy[]>('insurance_policies') || [])
      .filter(p => p.status === 'active');

    // Listen for cross-MFE payment data
    this.subscription = this.eventBus.on<PaymentData>(MFE_EVENTS.NAVIGATE_TO_PAYMENT)
      .subscribe(data => {
        this.crossMfeData = data;
        this.selectedPolicyId = data.policyId;
        this.amount = data.amount;
        this.onPolicyChange();
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onPolicyChange(): void {
    this.selectedPolicy = this.policies.find(p => p.id === this.selectedPolicyId) || null;
    if (this.selectedPolicy && !this.crossMfeData) {
      this.amount = this.selectedPolicy.premiumAmount;
    }
  }

  onCardNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Strip everything except digits
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 16);
    this.cardNumber = input.value;
    this.validateField('cardNumber');
  }

  onCvvInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 4);
    this.cardCvv = input.value;
    this.validateField('cardCvv');
  }

  onExpiryInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Allow digits and slash only, auto-insert slash after 2 digits
    let val = input.value.replace(/[^0-9/]/g, '');
    if (val.length === 2 && !val.includes('/')) {
      val += '/';
    }
    input.value = val.slice(0, 5);
    this.cardExpiry = input.value;
    this.validateField('cardExpiry');
  }

  validateField(field: string): void {
    delete this.errors[field];
    if (field === 'cardNumber') {
      if (this.cardNumber && (this.cardNumber.length !== 16 || !/^\d+$/.test(this.cardNumber))) {
        this.errors['cardNumber'] = 'Enter a valid 16-digit card number';
      }
    }
    if (field === 'cardExpiry') {
      if (this.cardExpiry) {
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(this.cardExpiry)) {
          this.errors['cardExpiry'] = 'Enter expiry as MM/YY';
        } else {
          const parts = this.cardExpiry.split('/');
          const exp = new Date(2000 + parseInt(parts[1], 10), parseInt(parts[0], 10) - 1);
          const now = new Date();
          if (exp < new Date(now.getFullYear(), now.getMonth())) {
            this.errors['cardExpiry'] = 'Card has expired';
          }
        }
      }
    }
    if (field === 'cardCvv') {
      if (this.cardCvv && !/^\d{3,4}$/.test(this.cardCvv)) {
        this.errors['cardCvv'] = 'Enter a valid 3 or 4 digit CVV';
      }
    }
    if (field === 'upiId') {
      if (this.upiId && !this.upiId.includes('@')) {
        this.errors['upiId'] = 'Enter a valid UPI ID (e.g. name@upi)';
      }
    }
  }

  validate(): boolean {
    this.errors = {};
    if (!this.selectedPolicy) {
      this.errors['policy'] = 'Please select a policy';
    }
    if (!this.amount || this.amount <= 0) {
      this.errors['amount'] = 'Enter a valid amount';
    }
    if (this.paymentMethod === 'credit_card' || this.paymentMethod === 'debit_card') {
      const digits = this.cardNumber.replace(/\s/g, '');
      if (!digits || digits.length !== 16 || !/^\d+$/.test(digits)) {
        this.errors['cardNumber'] = 'Enter a valid 16-digit card number';
      }
      if (!this.cardExpiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(this.cardExpiry)) {
        this.errors['cardExpiry'] = 'Enter expiry as MM/YY';
      } else {
        const parts = this.cardExpiry.split('/');
        const exp = new Date(2000 + parseInt(parts[1], 10), parseInt(parts[0], 10) - 1);
        const now = new Date();
        if (exp < new Date(now.getFullYear(), now.getMonth())) {
          this.errors['cardExpiry'] = 'Card has expired';
        }
      }
      if (!this.cardCvv || !/^\d{3,4}$/.test(this.cardCvv)) {
        this.errors['cardCvv'] = 'Enter a valid 3 or 4 digit CVV';
      }
    }
    if (this.paymentMethod === 'upi') {
      if (!this.upiId || !this.upiId.includes('@')) {
        this.errors['upiId'] = 'Enter a valid UPI ID (e.g. name@upi)';
      }
    }
    return Object.keys(this.errors).length === 0;
  }

  get isFormValid(): boolean {
    if (!this.selectedPolicy || !this.amount) return false;
    if (this.paymentMethod === 'credit_card' || this.paymentMethod === 'debit_card') {
      const digits = this.cardNumber.replace(/\s/g, '');
      if (digits.length !== 16 || !this.cardExpiry || !this.cardCvv) return false;
    }
    if (this.paymentMethod === 'upi' && !this.upiId.includes('@')) return false;
    return Object.keys(this.errors).length === 0;
  }

  processPayment(): void {
    if (!this.validate()) return;

    this.isProcessing = true;

    // Simulate payment processing delay
    setTimeout(() => {
      const newPayment: Payment = {
        id: 'pay-' + Date.now(),
        policyId: this.selectedPolicy!.id,
        policyNumber: this.selectedPolicy!.policyNumber,
        amount: this.amount,
        date: new Date().toISOString().split('T')[0],
        status: 'success',
        method: this.paymentMethod,
        cardLast4: this.cardNumber ? this.cardNumber.slice(-4) : undefined,
        transactionId: 'TXN-' + Date.now(),
      };

      // Save to localStorage
      const payments = this.storage.get<Payment[]>('insurance_payments') || [];
      payments.unshift(newPayment);
      this.storage.set('insurance_payments', payments);

      // Emit payment completed event
      this.eventBus.emit(MFE_EVENTS.PAYMENT_COMPLETED, newPayment, 'payment-mfe');

      this.isProcessing = false;
      this.paymentSuccess = true;
    }, 2000);
  }

  viewHistory(): void {
    this.router.navigate(['/payments/history']);
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

  makeAnother(): void {
    this.paymentSuccess = false;
    this.crossMfeData = null;
    this.selectedPolicyId = '';
    this.selectedPolicy = null;
    this.amount = 0;
    this.cardNumber = '';
    this.cardExpiry = '';
    this.cardCvv = '';
    this.upiId = '';
  }
}
