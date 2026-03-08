import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { POLICY_ROUTES } from './policy.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(POLICY_ROUTES),
  ]
};
