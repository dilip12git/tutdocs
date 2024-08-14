import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticatedService } from './services/authenticated.service';
import { Router } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { AuthGoogleService } from './services/auth-google.service';
import { OneSignal } from 'onesignal-ngx';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  faTimes=faTimes;
  title = 'Tutdocs';
  displayLogin: boolean = false;
  isAuthenticated: boolean = false;
  isOnline: boolean = false;
  showOfflineMessage: boolean = false;
  private onlineCheckInterval: any;
  private authCheckInterval: any;
  private authCheckCount: number = 0;
  showSplashScreen = true;
  

  constructor(
    private authGoogleService: AuthGoogleService,
    private router: Router,
  )
    {
   

    this.isOnline = navigator.onLine;
    this.onlineCheckInterval = setInterval(() => {
      this.checkConnection();
    }, 5000); // Check every 5 seconds

    // setTimeout(() => {
    //   this.checkAuthentication();
    // }, 5000); // After 5 seconds
  }

  ngOnInit(): void {
 
    setTimeout(() => {
      this.showSplashScreen = false;
    }, 2000); // Show splash screen for 5 seconds

    
  }

  ngOnDestroy() {
    clearInterval(this.onlineCheckInterval);
    clearInterval(this.authCheckInterval);
  }

  private checkConnection() {
    this.isOnline = navigator.onLine;
    this.showOfflineMessage = !this.isOnline;
  }

 
  closeConnectionInfoBox() {
    this.showOfflineMessage = false;
  }

  closeLogin() {
    this.displayLogin = false;
  }

  login() {
    this.displayLogin = false;
    this.router.navigate(['/auth/login']);
  }

  register() {
    this.displayLogin = false;
    this.router.navigate(['auth/register']);
  }

  loginWithGoogle() {
    this.displayLogin = false;
    this.authGoogleService.login();
  }

}
// function requestNotificationPermission() {
//   throw new Error('Function not implemented.');
// }

