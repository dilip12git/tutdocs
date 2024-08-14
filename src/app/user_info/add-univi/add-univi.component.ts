import { Component, HostListener, OnInit } from '@angular/core';
import { AuthGoogleService } from 'src/app/services/auth-google.service';
import { faUniversity } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserDataUploadService } from 'src/app/services/user-data-upload.service';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import * as CryptoJS from 'crypto-js';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
// import { PopupSignComponent } from 'src/app/popup_sign/popup_sign.component';
import { AddInstitutionComponent } from '../add-institution/add-institution.component';
import { RecievedInstituteNameService } from 'src/app/services/recieved-institute-name.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { EmailVerificationService } from 'src/app/services/verify-email.service';

@Component({
  selector: 'app-add-univi',
  templateUrl: './add-univi.component.html',
  styleUrls: ['./add-univi.component.css']
})
export class AddUniviComponent implements OnInit {
  userData: any; // Define a variable to hold user data
  universityicon = faUniversity;
  instituteNameFromForm: string = '';
  uploadingData = false;
  searchQuery: string = '';
  searchResults: any[] = [];
  selectedResult: any = null;
  errorMSG: string = '';
  selectedOption: string = '';
  // userID: any;
  currentUserId:string='';
  userName:string='';
  userEmail:string='';
  picture:string='';
  userPass:string='';
  msg:string='';
  receivedData:any;
  isAuthenticated: boolean = false;
  token:string='';
  isSearching:boolean=false;
  selectedRadioOption:string='';
  LabelForStudyAt:string="I study at";
  // asAteacherLabelForStudyAt:string="I am teaching at";
LabelForJoinDate:string="I started studying in";
  // asAteacherLabelForJoinDate:string="I started teaching in";
  constructor(private authGoogleService: AuthGoogleService,
    private router: Router,
    private route: ActivatedRoute,
    private userDataUploadService: UserDataUploadService,
    private http: HttpClient,
    private authenticated: AuthenticatedService,
    private userDataService: UserDataService,
    private errorHandlerService: ErrorHandlerService,
    private dialog: MatDialog,
    private recievedInstituteNameService: RecievedInstituteNameService,
    private verifyEmailServices:EmailVerificationService



  ) {
  }



  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const data = params['d'];
      if (data) {
        const decrypted = CryptoJS.AES.decrypt(data, 'key@123').toString(CryptoJS.enc.Utf8);
        this.receivedData = JSON.parse(decrypted);
      // console.log('Received Data:', this.receivedData);
      this.picture=this.receivedData.picture;
      this.userEmail=this.receivedData.username;
      this.userName=this.receivedData.name;
      this.currentUserId=this.receivedData.user_id;
      this.userPass=this.receivedData.password;
      this.token=this.receivedData.token;
      if(!this.userPass){
        const generatedPassword = this.generateRandomPassword(8);
        this.userPass = this.encryptPassword(generatedPassword);
        // console.log(this.userPass)
      }
      }
      // Access and utilize the received data in ComponentB as needed
    });
    this.recievedInstituteNameService.addedInstitutionName$.subscribe((institutionName: string) => {
      this.searchQuery = institutionName;
      // console.log('Received Institution Name:', this.searchQuery);
    this.searchResults = [];

      // Use the received institutionName in your component logic as needed
    });
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

  openAddInstitutionDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = '350px';
    dialogConfig.minWidth = '350px';

    const passEmail = { 
      email:this.userEmail
    };

    dialogConfig.data = {
      email: passEmail // Pass institutionData to the dialog
    };

    const dialogRef = this.dialog.open(AddInstitutionComponent, dialogConfig);
  }



  onOptionChange(event: any): void {
    this.selectedRadioOption = event.target.value;
    // console.log('Selected option:', this.selectedRadioOption);
    if(this.selectedRadioOption=="Student"){
      this.LabelForStudyAt="I study at";
      this.LabelForJoinDate="I started studying in";
    }
    else if(this.selectedRadioOption=="Teacher"){
      this.LabelForStudyAt="I am teaching at";
      this.LabelForJoinDate="I started teaching in";
    }

   }
  // Function to handle the selection of an option
  selectOption(option: string) {
    this.selectedOption = option; // Update the selected option
  }
  performSearch() {
    this.isSearching=true;
    if (this.searchQuery.trim() !== '') {
      const apiUrl = `http://localhost/tutdocs/server-side/api/search-institutions/index.php?query=${this.searchQuery}`;
      this.http.get<any[]>(apiUrl)
        .subscribe(data => {
          setTimeout(() => {
            this.isSearching=false;
           }, 500);
          // Filter results based on the search query and limit to top 5 matches
          this.searchResults = data.filter(result =>
            result.institution_name.toLowerCase().includes(this.searchQuery.toLowerCase())
          ).slice(0, 5); // Show only the first 5 matches
        }, error => {
          //console.error('Error fetching data:', error);
          this.msg='Error fetching data';
          this.showMessage(this.msg);
          setTimeout(() => {
            this.isSearching=false;
           }, 500);

        });
    } else {
      this.searchResults = []; // Clear search results if query is empty
      setTimeout(() => {
        this.isSearching=false;
       }, 500);
    }
  }
  selectResult(result: any) {
    this.selectedResult = result; // Set the selected result
    this.searchQuery = result.institution_name; // Assign the selected result to the input field
    this.searchResults = [];
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.searchResults.length == 0) {
      return; 
    }
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.search-results')) {
      this.searchResults = [];
    }
  }
  uploadUserData() {
    if (
      this.searchQuery &&
      typeof this.searchQuery === 'string' &&
      this.selectedOption &&
      this.selectedRadioOption &&
      this.currentUserId
    ) {
      const trimmedQuery = this.searchQuery.trim();
      // const userToken = this.authGoogleService.getStoredAccessToken() as string;
      const dataToUpload = {
        institution_name: trimmedQuery,
        selectedOption: this.selectedOption,
        user_type:this.selectedRadioOption,
        username:this.userEmail,
        name:this.userName,
        password:this.userPass,
        picture:this.picture,
        user_id:this.currentUserId

      };
      // console.log(dataToUpload)
      this.uploadingData = true;
      this.userDataUploadService.uploadUserData(dataToUpload).subscribe(
        (response) => {
        //  console.log('Data uploaded successfully:', response);
         this.msg='You have successfully signed in !';
         this.showMessage(this.msg);
          this.fetch_user_data(this.userEmail);
          this.sendRegistrationMail(this.userEmail,this.userName);
        },
        (error) => {

          // console.error('Error uploading data:', error);
          this.msg='Error while sign in, please try again';
          this.showMessage(this.msg);
          this.uploadingData = false;
        }
      );
    } else {
      this.errorMSG = 'Please fill all the required fields';
      this.showMessage(this.errorMSG);
      this.uploadingData = false;
    }
  }
  sendRegistrationMail(email:string,name:string):void{
    
      const registrationData = {
        email:email,
        name:name
      };
    
      this.http.post('http://localhost/tutdocs/auth/sendRegistrationMail.php', registrationData)
        .subscribe(response => {
          // console.log('Email sent successfully', response);
        }, error => {
          // console.error('Error sending email', error);
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
              if(this.token){
                this.deleteTokenData(username);
              }
              else{
                this.router.navigate(['/home']);
                this.msg='You have successfully signed in !';
                this.showMessage(this.msg); // Assuming to navigate to "add" if data is uploaded
                this.authenticated.setAuthenticated(true);
                this.uploadingData = false;
              }
          
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
  deleteTokenData(username:string){
    this.verifyEmailServices.deleteTokenAndUserData(username).subscribe(
      (response) => {

        if (response && response.message === 'success') {
          // this.msg = 'User data deleted successfully';
          //  console.log('User data deleted successfully',response);
          this.router.navigate(['/home']);
          this.msg='You have successfully signed in !';
          this.showMessage(this.msg); // Assuming to navigate to "add" if data is uploaded
          this.authenticated.setAuthenticated(true);
          this.uploadingData = false;
        } else {
          this.msg = 'Error deleting user data';
          this.showMessage(this.msg); 
          // console.error('Error deleting user data',response.error);
          // Handle other response scenarios if necessary
        }
      },
      (error) => {
        this.msg = 'Error deleting user data';
        // console.error('Error:', error);
        // Handle error scenarios
      }
    );
  }

  generateRandomPassword(length: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; ++i) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  encryptPassword(password: string): string {
    const encryptedPassword = CryptoJS.AES.encrypt(password, 'key@123').toString();
    return encryptedPassword;
  }

  showMessage(msg:any){
    // this.errorMsg = "Please fill the all required fileds";
    this.errorHandlerService.setError(msg);
  }
}  