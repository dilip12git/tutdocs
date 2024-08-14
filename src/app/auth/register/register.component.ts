import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthGoogleService } from 'src/app/services/auth-google.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { GenerateUserIdService } from 'src/app/services/generate-user-id.service';
import { CustomValidator } from 'src/app/auth/custom-email.validator';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { EmailVerificationService } from 'src/app/services/verify-email.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  faEyeSlash=faEyeSlash;
  faEye=faEye;
  userData:any;
  userName: string = '';
  userPassword: any;
  currentUserId: string = '';
  userEmail: string = '';
  confirmPassword: any;
  errorMessage:string='';
  hashPass:any;
  default_picture:string='';
  uploadData:any;
  isAuthenticated: boolean = false;
  isMailSent:boolean=true;
  showMailSentMessage:boolean=false;
  uploadingData = false;
  constructor(private generateUserIdService: GenerateUserIdService,
    private authGoogleService: AuthGoogleService,
    private errHandlerService: ErrorHandlerService,
    private authenticated: AuthenticatedService,
    private userDataService: UserDataService,
    private http: HttpClient,
    private router:Router,
    private emailVerificationService:EmailVerificationService
  ) { }
  ngOnInit(): void {
  this.checkAuthentication();
  }
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  toggleShowPassword(field: string): void {
    if (field === 'userPassword') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
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
        this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/home']);
        }
      }
    } else {
      // invalid
    }
  }
  submitForm() {
    this.uploadingData=true;
    const validator = CustomValidator(); // Instantiate your custom validator function
    const userNameValidation = validator({ value: this.userEmail } as any); // Validate userName
    if (userNameValidation !== null) {
      this.errorMessage = 'Invalid Email';
      this.showMessage(this.errorMessage);
      this.uploadingData=false;
      return;
    }
    else if(!this.userPassword || ! this.userName){
      this.errorMessage="Fill all required fields";
      this.showMessage(this.errorMessage);
      this.uploadingData=false;

    }
    else if (this.userPassword.length <= 6) {
      this.errorMessage = "Weak Password !, Create Longer Password";
      this.showMessage(this.errorMessage);
      this.uploadingData=false;

    }
    else if (this.confirmPassword.trim() !== this.userPassword.trim()) {
      this.errorMessage = "Passwords don't match!";
      this.showMessage(this.errorMessage);
      this.uploadingData=false;

    }
    else{
    this.generateUserIdService.generateUserID(this.userName, this.userEmail);
    this.currentUserId = this.generateUserIdService.getUserID();
    // console.log('Generated UserID:', this.generateUserIdService);
    const hashedPassword = CryptoJS.SHA256(this.userPassword).toString(CryptoJS.enc.Hex);
    this.hashPass = hashedPassword.substring(0, 20);
    // console.log('Hashed Password:', this.hashPass);
    this.uploadData={
    name:this.userName,
    username : this.userEmail,
    password:this.hashPass,
    user_id:this.currentUserId,
    picture:this.default_picture
    }
    this.checkUserExist(this.userEmail);
  // console.log(this.uploadData)
    }
  }
  checkUserExist(username:string){
    //this.uploadingData = true;

    if (username) {
      const apiUrl = 'http://localhost/tutdocs/auth/fetch-user-data.php';
      this.http.post<any>(apiUrl, { username }).subscribe(
        (response: any) => {
          if (response.exists === true) {
            this.errorMessage="This email already used for another account !";
            this.showMessage(this.errorMessage)
            this.uploadingData=false;
          } else {
            // console.log('UserID does not exist');
            this.uploadingData=true;
            
            // this.passEncriptedData(this.uploadData);
            this.sendVerificationLink(this.uploadData);
          
          }
        },
        (error: any) => {
          this.uploadingData=false;
         
        }
      );
    } else {
    }
  }
  sendVerificationLink(userData:any):void{
    console.log(userData)
  this.emailVerificationService.sendVerificationLink(userData).subscribe(
    (response) => {

      if(response && response.message==="success"){
        this.isMailSent=false;
        this.showMailSentMessage=true;
        console.log(response);
        this.uploadingData=false;

      }
      else{
        this.isMailSent=true;
        this.showMailSentMessage=false;
        this.uploadingData=false;

      }
     
    },
    (error) => {
      this.isMailSent=true;
      this.showMailSentMessage=false;
      // console.error('Error storing user data:', error);
      this.uploadingData=false;

    }
  );
}
  passEncriptedData(uploadData:any) {
    const d = CryptoJS.AES.encrypt(JSON.stringify(uploadData), 'key@123').toString();
    this.router.navigate(['/add'], { queryParams: { d } });
  }
  // passData(uploadData: { name: string; username: string; password: any; user_id: string; picture: string; }) {
   
  // }
  googleLogin(){
    this.authGoogleService.login();
  }
  showMessage(msg:any){
    // this.errorMsg = "Please fill the all required fileds";
    this.errHandlerService.setError(msg);
  }
}
