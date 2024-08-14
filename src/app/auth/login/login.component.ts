import { Component } from '@angular/core';
import { AuthGoogleService } from 'src/app/services/auth-google.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { GenerateUserIdService } from 'src/app/services/generate-user-id.service';
import * as CryptoJS from 'crypto-js';
import { HttpClient } from '@angular/common/http';
import { CustomValidator } from 'src/app/auth/custom-email.validator';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { Router } from '@angular/router';
import { faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  currentUserId: string = '';
  userEmail:string='';
  userPass:any;
  hashPass:any;
  errorMessage:string='';
  isAuthenticated: boolean = false;
  userData:any;
  uploadingData = false;
  faEyeSlash=faEyeSlash;
  faEye=faEye;
  showPassword: boolean = false;

  constructor(
    private authGoogleService:AuthGoogleService,
    private errHandlerService:ErrorHandlerService,
    private http:HttpClient,
    private authenticated: AuthenticatedService,
    private userDataService: UserDataService,
    private router:Router
    ) { }


  ngOnInit(): void {

      this.checkAuthentication();
      }
      toggleShowPassword(field: string): void {
        if (field === 'userPass') {
          this.showPassword = !this.showPassword;
        } 
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

    const userNameValidation = validator({ value: this.userEmail } as any); // Validate userName

    if (userNameValidation !== null) {
      this.errorMessage = 'Invalid Email';
      this.showMessage(this.errorMessage);
      return;
    }
    else if(!this.userPass){
      this.errorMessage="Invalid password";
      this.showMessage(this.errorMessage);
    }
    else if (this.userPass.length <= 6) {
      this.errorMessage = "Longer Password Required > 6";
      this.showMessage(this.errorMessage);
    }
    else{
      this.uploadingData=true;
      
    const hashedPassword = CryptoJS.SHA256(this.userPass).toString(CryptoJS.enc.Hex);
    this.hashPass = hashedPassword.substring(0, 20);
    // console.log('Truncated Hashed Password:', this.hashPass);

   const checkData={
    username : this.userEmail,
    password :this.hashPass

    }
    // console.log(checkData)
    this.http.post<any>('http://localhost/tutdocs/auth/login.php', checkData)
    .subscribe(
      (response) => {
       
        if (response.status === 'success') {
          // this.errorMessage = 'Successfully Logged in !'; // Clear error message if any
          // this.showMessage(this.errorMessage)
          this.fetch_user_data(this.userEmail);
          this.sendWelcomeBackEmail(this.userEmail);

        } else {
          // Handle login error, display error message
          this.errorMessage = response.message;
          this.showMessage(this.errorMessage);
          this.uploadingData = false;
        }
      },
    (error) => {
      // console.log("error", error);
      
      // Handle HTTP error, e.g., display error message
      this.errorMessage = JSON.stringify(error.message); // Convert object to string
      this.showMessage(this.errorMessage);
      this.uploadingData = false;
    }
  );
  }
  }
  sendWelcomeBackEmail(email:string) {
    const loginData = {
      email:email
    };
  
    this.http.post('http://localhost/tutdocs/auth/sendWelcomeBackMail.php', loginData)
      .subscribe(response => {
        // console.log('Welcome back email sent successfully', response);
      }, error => {
        // console.error('Error sending welcome back email', error);
      });
  }
  fetch_user_data(username: string): void {
    this.uploadingData = true;

    if (username) {
      const apiUrl = 'http://localhost/tutdocs/auth/fetch-user-data.php';
      this.http.post<any>(apiUrl, { username }).subscribe(
        (response: any) => {
          if (response.exists === true) {
            setTimeout(() => {
              const userData = response.userData;
              // console.log(userData);
              localStorage.setItem('uData', JSON.stringify(userData));
              const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
              localStorage.setItem('tokenExpiration', expirationTime.toString());
             this.router.navigate(['/home']);
             this.errorMessage='You have successfully signed in !';
             this.showMessage(this.errorMessage); // Assuming to navigate to "add" if data is uploaded
              this.authenticated.setAuthenticated(true);
              this.uploadingData = false;
            }, 1000);
          } else {
            //console.log('UserID does not exist');

          }
          this.uploadingData = false; // Set the loading flag to false
        },
        (error: any) => {
          //console.error('Error checking userID existence:', error);
          // Handle the error case here
          this.uploadingData = false; // Set the loading flag to false
        }
      );
    } else {
     // console.error('Please provide a userID.');
      this.uploadingData = false; // Set the loading flag to false
    }
  }
  
  googleLogin(){
    this.authGoogleService.login();
  }
  showMessage(msg:any){
    // this.errorMsg = "Please fill the all required fileds";
    this.errHandlerService.setError(msg);
  }
}
