import { Routes } from '@angular/router';
import * as moduleFederationRuntime from '@angular-architects/module-federation-runtime';
import { HomeComponent } from './home/home.component';
import { REMOTE_CONFIG } from './remote-config';

const loadRemoteModule = (moduleFederationRuntime as any).loadRemoteModule as <T = unknown>(options: {
  type: 'script' | 'module' | 'manifest';
  remoteName?: string;
  remoteEntry?: string;
  exposedModule: string;
}) => Promise<T>;

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'policies',
    loadChildren: () =>
      loadRemoteModule({
        type: 'script',
        remoteName: REMOTE_CONFIG.policyMfe.remoteName,
        remoteEntry: REMOTE_CONFIG.policyMfe.remoteEntry,
        exposedModule: REMOTE_CONFIG.policyMfe.exposedModule,
      }).then(m => (m as { POLICY_ROUTES: Routes }).POLICY_ROUTES),
  },
  {
    path: 'payments',
    loadChildren: () =>
      loadRemoteModule({
        type: 'script',
        remoteName: REMOTE_CONFIG.paymentMfe.remoteName,
        remoteEntry: REMOTE_CONFIG.paymentMfe.remoteEntry,
        exposedModule: REMOTE_CONFIG.paymentMfe.exposedModule,
      }).then(m => (m as { PAYMENT_ROUTES: Routes }).PAYMENT_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
