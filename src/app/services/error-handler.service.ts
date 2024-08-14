// error-handler.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private errorMessageSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public errorMessage$: Observable<string | null> = this.errorMessageSubject.asObservable();

  constructor() {}

  setError(message: string | null): void {
    this.errorMessageSubject.next(message);
  }

  clearError(): void {
    this.errorMessageSubject.next(null);
  }
}
