import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailVerificationService } from 'src/app/services/verify-email.service';
import * as CryptoJS from 'crypto-js';
import  {faCheck,faTimes}  from '@fortawesome/free-solid-svg-icons';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit{
  verified_email:string='';
  userData:any;
  faCheck=faCheck;
  faTimes=faTimes;
  isAuthenticated: boolean = false;
 tokenVerifiedMessage:boolean=false;

  constructor(
    private route: ActivatedRoute,
    private emailVerifyService: EmailVerificationService,
    private router:Router,
    private errorHandlerService: ErrorHandlerService,
    private authenticated:AuthenticatedService
    // Inject your verification service
  ) {
 
  }
  ngOnInit(): void {
    if(this.isAuthenticated=this.authenticated.isAuthenticatedUser()){
      this.tokenVerifiedMessage=false;
      const msg="You have already logged in !";
      this.showMessage(msg);
      setTimeout(() => {
     this.router.navigate(['/home']);
       }, 500);

    }
    else{
      this.verifyToken();

    }
  }

  showMessage(msg:any){
    this.errorHandlerService.setError(msg);
  }
  verifyToken(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
    //  console.log(token)
        this.emailVerifyService.verifyEmail(token).subscribe(
          (response) => {
          // console.log(response);
           if (response && response.message === 'success' && response.user_data) {
            this.verified_email = response.user_data.username; // Storing verified email
            this.userData = response.user_data; // Storing user data
            this.tokenVerifiedMessage=true;
      
              const dataToUpload={
                name:this.userData.name,
                user_id:this.userData.user_id,
                username:this.userData.username,
                picture:this.userData.picture,
                password:this.userData.password,
                token:this.userData.verification_token
              }
              setTimeout(() => {
               this.passEncriptedData(dataToUpload);
              }, 500);
          } else {
          this.tokenVerifiedMessage=false;
            
          }
        },
        (error) => {
         // console.error('Error:', error);
          this.tokenVerifiedMessage=false;

        

          // Handle error scenarios
        }
        );
      }
      else{
        
        this.tokenVerifiedMessage=false;

        //console.log("No token")
      }
    }
      );
    }


    passEncriptedData(uploadData:any) {
      const d = CryptoJS.AES.encrypt(JSON.stringify(uploadData), 'key@123').toString();
      this.router.navigate(['/add'], { queryParams: { d } });
    }
  }

  