import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UserDataService } from 'src/app/services/user-data.service';
import * as CryptoJS from 'crypto-js';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-new-password',
  templateUrl: './create-new-password.component.html',
  styleUrls: ['./create-new-password.component.css']
})
export class CreateNewPasswordComponent {
  faCheck=faCheck;
token: string='';
  newPassword: string='';
  confirmPassword:string='';
  errorMessage:string='';
  resetSuccess: boolean = false;
   hashPass:string='';

  
  apiUrl = 'http://localhost/tutdocs/auth'; // Replace with your backend API URL

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
      private errHandlerService: ErrorHandlerService,
      private router:Router
    ) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }
  faEyeSlash=faEyeSlash;
  faEye=faEye;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  toggleShowPassword(field: string): void {
    if (field === 'newPassword') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
  submitForm() {
     if(!this.newPassword || !this.confirmPassword){
      this.errorMessage="Fill all required fields";
      this.showMessage(this.errorMessage);
     }
     else if(this.newPassword.length<=6){
      this.errorMessage="Weak password, Create strong and longer !";
      this.showMessage(this.errorMessage);
     }
     else if (this.confirmPassword.trim() !== this.newPassword.trim()) {
      this.errorMessage = "Passwords doesn't match!";
      this.showMessage(this.errorMessage);
    }
    else{
      const hashedPassword = CryptoJS.SHA256(this.newPassword).toString(CryptoJS.enc.Hex);
      this.hashPass = hashedPassword.substring(0, 20);
      // console.log(this.token);
      // console.log(this.hashPass)
      this.resetPassword();
    }
    }
    
    resetPassword() {
      const resetUrl = `${this.apiUrl}/create_new_password.php`;
      const data = { token: this.token, new_password: this.hashPass };
  
      this.http.post<any>(resetUrl, data).subscribe(
        (response) => {
          // console.log("Server response:", response);
          // Password reset successful
          if (response.success) {
            // Show success message and redirect after 3 seconds
            this.resetSuccess = true;
            this.showMessage("Password reset successful");
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 3000);
          } else {
            // Show error message received from the server
            this.showMessage(response.message);
          }
        },
        error => {
          // Handle error (e.g., display error message)
          // console.error('Password reset failed:', error);
        }
      );
    }
    
    showMessage(msg: any) {
      this.errHandlerService.setError(msg);
    }
  }