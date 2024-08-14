import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { AuthGoogleService } from 'src/app/services/auth-google.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { RecievedInstituteNameService } from 'src/app/services/recieved-institute-name.service';
// import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserDataService } from 'src/app/services/user-data.service';
import { AuthenticatedService } from 'src/app/services/authenticated.service';

@Component({
  selector: 'app-add-institution',
  templateUrl: './add-institution.component.html',
  styleUrls: ['./add-institution.component.css']
})
export class AddInstitutionComponent implements OnInit {
  @Output() closeDialog: EventEmitter<any> = new EventEmitter<any>(); // Add this line
  userData: any; 
  selectedOption: string = '';
  country: string = '';
  institutionName: string = '';
  websiteUrl: string = '';
  errorMessage: string='';
  uploadingData = false;
  userID:any;
  msg:string='';
  userEmail:any;
  isAuthenticated: boolean = false;
  constructor(
    private http: HttpClient,
    private authGoogleService: AuthGoogleService,
    private router: Router, private route: ActivatedRoute,
    private errorHandlerService: ErrorHandlerService,
    private recievedInstituteService:RecievedInstituteNameService,
    private userDataService:UserDataService,
    private authenticated:AuthenticatedService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddInstitutionComponent>,
    ) {
      this.userEmail = data.email; // Access passed data via MAT_DIALOG_DATA
      // console.log('Received data in AddInstitutionComponent:', this.userEmail);
    }

    ngOnInit() {
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
   
    if (
      !this.selectedOption ||
      !this.country ||
      !this.institutionName
    ) {
      // If any required field is empty, display an error message or perform necessary actions
      this.errorMessage = 'Please fill in all required fields.';
      this.showMessage(this.errorMessage);
      return; // Prevent form submission if any field is empty
    }
   
    this.uploadingData = true;
    const formData = {
      selectedOption: this.selectedOption,
      country: this.country,
      institutionName: this.institutionName,
      websiteUrl: this.websiteUrl,
      username: this.userEmail // Include user's email in the form data
    };
// console.log(this.userEmail);

this.http.post('http://localhost/tutdocs/server-side/api/add-institutions/index.php', formData)
.subscribe(
  (response) => {
    // console.log('Response:', response); // Log the response here

    // Handle other actions based on the response
    this.msg = "Successfully added!";
    this.showMessage(this.msg);
    this.recievedInstituteService.setInstitutionName(this.institutionName);
    this.dialogRef.close();
    this.closeDialog.emit();
  },
  (error) => {
    // console.error('Error submitting form:', error);
    this.msg = "Something went wrong, please try again!";
    this.showMessage(this.msg);
    this.uploadingData = false;
  }
);
  }
  showMessage(msg:any){
    // this.errorMsg = "Please fill the all required fileds";
    this.errorHandlerService.setError(msg);
  }
}
