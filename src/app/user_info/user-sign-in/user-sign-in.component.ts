import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGoogleService } from 'src/app/services/auth-google.service';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { UserDataUploadService } from '../../services/user-data-upload.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { GenerateUserIdService } from 'src/app/services/generate-user-id.service';
import * as CryptoJS from 'crypto-js';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-user-sign-in',
  templateUrl: './user-sign-in.component.html',
  styleUrls: ['./user-sign-in.component.css']
})
export class UserSignInComponent implements OnInit {

  userData: any;
  uploadingData = false;
  msg: string = '';
  userName: string = '';
  userEmail: string = '';
  picture: string = '';
  currentUserId: string = '';
  isAuthenticated: boolean = false;

  constructor(
    private authGoogleService: AuthGoogleService,
    private router: Router,
    // private userDataService: UserDataUploadService,
    private authenticated: AuthenticatedService,
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private generateUserIdService: GenerateUserIdService,
    private userDataService:UserDataService,


  ) { }

  ngOnInit() {
    this.uploadingData = true;
    setTimeout(() => {
      const data = this.authGoogleService.getProfile();
      if (data) {
        this.userData = JSON.parse(JSON.stringify(data));
        this.userName = this.userData.given_name;
        this.userEmail = this.userData.email;
        this.picture = this.userData.picture;
        this.generateUserIdService.generateUserID(this.userName, this.userEmail);
        this.currentUserId = this.generateUserIdService.getUserID();
        this.validateUserData(this.userEmail);
      } else {
        //console.error('User data is not available.');
      }
    }, 1000);
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
  validateUserData(username: string): void {
    if (username) {
      const apiUrl = 'http://localhost/tutdocs/auth/fetch-user-data.php';
      this.http.post<any>(apiUrl, { username }).subscribe(
        (response: any) => {
          if (response.exists === true) {
            setTimeout(() => {
              const userData = response.userData;
              localStorage.setItem('uData', JSON.stringify(userData));
              const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
              localStorage.setItem('tokenExpiration', expirationTime.toString());
              this.msg = "Signed in successfully !";
              this. sendWelcomeBackEmail(this.userEmail);
              this.showMessage(this.msg);
              this.router.navigate(['/home']); 
              this.authenticated.setAuthenticated(true);
              this.uploadingData = false;
            }, 1000);
          } else {
            //console.log('UserID does not exist');
            //Perform actions for when the user does not exist
            const uploadData={
              name:this.userName,
              username : this.userEmail,
              user_id:this.currentUserId,
              picture:this.picture
              }
              this.passEncriptedData(uploadData);
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
      //console.error('Please provide a userID.');
      this.uploadingData = false; // Set the loading flag to false
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
  passEncriptedData(uploadData:any) {
    const d = CryptoJS.AES.encrypt(JSON.stringify(uploadData), 'key@123').toString();
    this.router.navigate(['/add'], { queryParams: { d } });
  }
  showMessage(msg: any) {
    // this.errorMsg = "Please fill the all required fileds";
    this.errorHandlerService.setError(msg);
  }
}  
