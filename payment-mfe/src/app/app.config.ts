import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { PAYMENT_ROUTES } from './payment.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(PAYMENT_ROUTES),
  ]
};
