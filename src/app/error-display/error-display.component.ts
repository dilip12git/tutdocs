// error-display.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { faTimes, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-error-display',
  template: `
    <div *ngIf="errorMessage" class="error-message">
      {{ errorMessage }}
      <button (click)="clearErrorMessage()"><fa-icon [icon]="faTimes"></fa-icon></button>
    </div>
  `,
  styles: [`
    .error-message {
      position: fixed;
      bottom: 30px;
      display:flex;
      flex-direction:row;
      justify-content:space-between;
      align-items:center;
      gap:20px;
      right: 20px;
      min-width:200px;
      padding: 16px 10px;
      color: white;
      background-image: linear-gradient(45deg, #04ad42, #3092FA);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border-radius:10px;
      z-index:20;
      transform: scale(0);
      transform-origin: bottom right;
      animation-name: openContainer;
      animation-duration: 0.3s;
      animation-fill-mode: forwards;
}

@keyframes openContainer {
    from {
        transform: scale(0);
    }
    to {
        transform: scale(1);
    }
}

    button{
      background:transparent;
      outline:none;
      border:none
    }
    fa-icon{
      font-size:larger;
      cursor: pointer;
      color:white;
    }
    fa-icon:hover{
      color:red;
    }
  `]
})
export class ErrorDisplayComponent implements OnInit, OnDestroy {
  errorMessage: string | null = null;
  errorMessageSubscription!: Subscription;
  faTimes = faTimes;
  faTriangleExclamation = faTriangleExclamation;
  constructor(private errorHandlerService: ErrorHandlerService) { }

  ngOnInit(): void {
    this.errorMessageSubscription = this.errorHandlerService.errorMessage$.subscribe(message => {
      this.errorMessage = message;
      this.setAutoClearTimer();
    });
  }

  ngOnDestroy(): void {
    this.errorMessageSubscription.unsubscribe();
  }

  setAutoClearTimer(): void {
    timer(20000) // 5000 milliseconds (5 seconds)
      .pipe(take(1))
      .subscribe(() => {
        this.clearErrorMessage();
      });
  }

  clearErrorMessage(): void {
    this.errorHandlerService.clearError();
    this.errorMessage = null;
  }
}
