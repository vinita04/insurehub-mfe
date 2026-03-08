import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface MfeEvent<T = any> {
  type: string;
  payload: T;
  source: string;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private eventStream$ = new Subject<MfeEvent>();

  constructor(private ngZone: NgZone) {
    // Listen for CustomEvents from other MFEs
    window.addEventListener('mfe-event', (event: Event) => {
      const customEvent = event as CustomEvent<MfeEvent>;
      this.ngZone.run(() => {
        this.eventStream$.next(customEvent.detail);
      });
    });
  }

  /**
   * Emit a cross-MFE event via window CustomEvent
   */
  emit<T>(type: string, payload: T, source: string): void {
    const mfeEvent: MfeEvent<T> = {
      type,
      payload,
      source,
      timestamp: Date.now(),
    };
    window.dispatchEvent(new CustomEvent('mfe-event', { detail: mfeEvent }));
  }

  /**
   * Listen for events of a specific type
   */
  on<T>(type: string): Observable<T> {
    return this.eventStream$.pipe(
      filter(event => event.type === type),
      map(event => event.payload as T)
    );
  }

  /**
   * Listen for all MFE events
   */
  onAll(): Observable<MfeEvent> {
    return this.eventStream$.asObservable();
  }
}

// Event type constants
export const MFE_EVENTS = {
  NAVIGATE_TO_PAYMENT: 'navigate-to-payment',
  PAYMENT_COMPLETED: 'payment-completed',
  POLICY_SELECTED: 'policy-selected',
  USER_UPDATED: 'user-updated',
} as const;
