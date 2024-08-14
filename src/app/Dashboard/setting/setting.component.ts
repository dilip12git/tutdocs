import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { faCamera, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent {

  faCamera = faCamera;
  faTimes = faTimes;
  faCheck = faCheck;
  uploadingData = false;
  isAuthenticated: boolean = false;
  isLoading: boolean = false;
  userData: any;
  userId: string = '';
  userName: string = '';
  userEmail: string = '';
  started_on: string = '';
  study_at: string = '';
  userType: string = "";
  validationError: string = '';
  userInstitute: string = '';
  selectedFile: File | null = null;
 
  picture:string='';
  address:string='';
  contact:string='';
  studying_year:string='';
  branch:string='';
  constructor(
    private userDataService: UserDataService,
    private authenticated: AuthenticatedService,
    private router: Router,
    private errorHandlerService: ErrorHandlerService,
    private http: HttpClient) { }

  ngOnInit() {
    this.checkAuthentication();
  }

  checkAuthentication(): void {
    this.isAuthenticated = this.authenticated.isAuthenticatedUser();
    if (this.isAuthenticated) {
      this.userData = this.userDataService.getUserData();
      if (this.userData) {
        this.userId = this.userData.user_id;
        this.userName = this.userData.name;
        this.userEmail = this.userData.username;
        this.userInstitute = this.userData.study_at;
        this.started_on = this.userData.started_on;
        this.picture=this.userData.profile_picture;
        this.address=this.userData.address;
        this.studying_year=this.userData.studying_year;
        this.branch=this.userData.branch;
        this.contact=this.userData.contact_no;
        this.userType=this.userData.user_type;
      } else {
        this.router.navigate(['/home']);
      }
      const isValidToken = this.authenticated.checkTokenValidity();
      if (!isValidToken) {
        this.router.navigate(['/home']);
      }
    }
    else {
    }
  }


  // onOptionChange(event: any): void {
  //   this.userType = event.target.value;
  //  }
  @ViewChild('fileInput') fileInput!: ElementRef;
  changeProfile(): void {
    this.fileInput.nativeElement.click();
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0] as File;
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const imageDataUrl = reader.result as string;
        this.userData.profile_picture = imageDataUrl;
      };
    }
  }
  submitForm() {
    // console.log(this.studying_year);
  
    if (
      this.userName &&
      this.userType &&
      this.started_on &&
      this.userInstitute &&
      this.picture
    ) {
  
      const formData = new FormData();
      formData.append('user_id', this.userId);
      formData.append('name', this.userName);
      formData.append('username', this.userEmail);
      formData.append('institution_name', this.userInstitute);
      formData.append('started_on', this.started_on);
      formData.append('user_type', this.userType);
      formData.append('picture',  this.picture);
      formData.append('address',  this.address);
      formData.append('contact_no',  this.contact);
      formData.append('branch',  this.branch);
      formData.append('studying_year',  this.studying_year);
      // Check if a file is selected before appending it to the formData
      if (this.selectedFile) {
        formData.append('file', this.selectedFile, this.selectedFile.name);
      }
  
      console.log('Final FormData:', formData);
  
      this.http.post('http://localhost/tutdocs/auth/edit_profile.php', formData)
        .subscribe(
          (response: any) => {
            if (response && response.success) {
              // console.log('Update successful', response);
              this.fetch_user_data(this.userEmail);
            }
          },
          (error) => {
            // console.error('Update failed', error);
          }
        );
    } else {
      // console.log('Form data not valid. Validation error:', this.validationError);
      this.validationError = "Fill all required fields";
      this.showMessage(this.validationError);
    }
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
              this.router.navigate(['/setting']);
              const msg = 'Updated Successfully';
              this.showMessage(msg); 
              this.authenticated.setAuthenticated(true);
              this.uploadingData = false;
            }, 1000);
          } else {

          }
          this.uploadingData = false; 
        },
        (error: any) => {
          this.uploadingData = false;
        }
      );
    } else {
      this.uploadingData = false;
    }
  }

  showMessage(msg: any) {
    this.errorHandlerService.setError(msg);
  }
}
