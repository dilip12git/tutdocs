import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { CustomValidator } from 'src/app/auth/custom-email.validator';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  userEmail: string = '';
  errorMessage: string = '';
  isAuthenticated: boolean = false;
  userData: any;
  uploadingData = false;
  resetSuccess: boolean = false;
  faCheck=faCheck;
  constructor(
    private errHandlerService: ErrorHandlerService,
    private http: HttpClient,
    private authenticated: AuthenticatedService,
    private userDataService: UserDataService,
    private router: Router
  ) { }


  ngOnInit(): void {

    this.checkAuthentication();
  }
  checkAuthentication(): void {
    this.isAuthenticated = this.authenticated.isAuthenticatedUser();
    if (this.isAuthenticated) {
      this.userData = this.userDataService.getUserData();
      if (this.userData) {
        const isValidToken = this.authenticated.checkTokenValidity();
        if (!isValidToken) {
          // console.log("Invalid token");
        } else {
          this.router.navigate(['/home']);

        }
      }
    } else {
      // invalid
    }
  }
  submitForm() {
    const validator = CustomValidator(); // Instantiate your custom validator function
    const validUserEmail = validator({ value: this.userEmail } as any); // Validate userName
    if (validUserEmail !== null) {
      this.errorMessage = 'Invalid Email';
      this.showMessage(this.errorMessage);
      return;
    }
    else if(!this.userEmail){
      this.errorMessage = 'Invalid Email';
      this.showMessage(this.errorMessage);
    }
    else{
      this.sendResetLink();
      console.log(this.userEmail);
    }
  }
  sendResetLink() {
    const resetLinkUrl = 'http://localhost/tutdocs/auth/reset_password.php'; // Replace with your actual reset link API endpoint
    // const username = 'dilipg44u@gmail.com'; // Replace this with the actual username or email input from your form
  
    const data = {
      username: this.userEmail
    };
  
    this.http.post<any>(resetLinkUrl, data)
      .subscribe(
        response => {
           // Password reset successful
        this.resetSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
          this.resetSuccess = false;

      }, 3000);
        },
        error => {
          // console.error('Error sending reset link:', error);
          // Handle error cases and provide feedback to the user
        }
      );
  }
  
  
  showMessage(msg: any) {
    // this.errorMsg = "Please fill the all required fileds";
    this.errHandlerService.setError(msg);
  }
}
