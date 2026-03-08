import { Routes } from '@angular/router';
import { PolicyDashboardComponent } from './policy-dashboard/policy-dashboard.component';
import { PolicyDetailComponent } from './policy-detail/policy-detail.component';

export const POLICY_ROUTES: Routes = [
  {
    path: '',
    component: PolicyDashboardComponent,
  },
  {
    path: ':id',
    component: PolicyDetailComponent,
  },
];
