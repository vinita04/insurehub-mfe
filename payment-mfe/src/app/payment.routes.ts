import { Routes } from '@angular/router';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';

export const PAYMENT_ROUTES: Routes = [
  {
    path: '',
    component: PaymentFormComponent,
  },
  {
    path: 'history',
    component: PaymentHistoryComponent,
  },
];
