import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { faUniversity,faSave,faAngleRight,faTimes, faFolder,faLink, faFileAlt,faThumbsUp,faCalendar, faEye, faCloudDownload, faInfo,faAngleDown,faAngleUp,faHistory,faUser } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from "@fortawesome/free-regular-svg-icons"
import { InstitutionService } from 'src/app/services/institution.service';
import { FetchDocument } from 'src/app/services/fetch-document.service';
import { HttpClient } from '@angular/common/http';
import { BookmarkService } from 'src/app/services/bookmarks.service';
// import { ErrorDisplayComponent } from 'src/app/error-display/error-display.component';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { FetchbookmarkafterAddedorRemovedService } from 'src/app/services/fetchbookmarkafter-addedor-removed.service';
import {Title } from '@angular/platform-browser';
import { AuthGoogleService } from 'src/app/services/auth-google.service';

// import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  faUniversity = faUniversity;
  faFolder = faFolder;
  faLink=faLink;
  faTimes=faTimes;
  faSave=faSave;
  faAngleRight=faAngleRight;
  faFileAlt = faFileAlt;
  faHistory=faHistory;
  faCalendar = faCalendar;
  faAngleDown=faAngleDown;
  faEye = faEye;
  faInfo = faInfo;
  faThumbsUp=faThumbsUp;
  faUser=faUser;
  faCloudDownload = faCloudDownload;
  faBookmark = faBookmark;
  isInstitutionLoading:boolean = true;
  isCoursesLoading:boolean = true;
  showUserInstitution:boolean = false;
  showUserSpecificInstitutionsFile=false;
  showNotDataFound=false;
  shownotSignInMessage:boolean=false;
  ifUserSignIn:boolean=true;
  institutions: any[] = [];
  docData: any[] = [];
  userSpecificInstitutionPost: any = [];
  userData: any;
  thumbnailURL: string = '';
  userInstitute: string = '';
  isAuthenticated: boolean = false;
  showDropdown = false;
  selectedOption: string = 'Most Recent Post'; // Default selection
  faAngleUp = faAngleUp;
  isUserInstitutePostLoading:boolean=true;
  isUserDocumentLoading:boolean=true;
userId:string='';
fileKey:string='';
courseDetails: any[] = [];
displayLogin:boolean=false;
// isBookmarked: boolean=false;
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this.faAngleDown = faAngleUp; // Change to up arrow when dropdown is open
    } else {
      this.faAngleDown = faAngleDown; // Change to down arrow when dropdown is closed
    }
  }

 

  stopPropagation(event: Event): void {
    event.stopPropagation(); // Prevent the click event from propagating upwards
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.showDropdown) {
      return; // Dropdown is already closed
    }
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.sort_by')) {
      this.showDropdown = false; // Close dropdown if clicked outside
      this.faAngleDown = faAngleDown;
    }
  }
  
  constructor(
    private authenticated: AuthenticatedService,
    private userDataService: UserDataService,
    private institutionService: InstitutionService,
    private fetchDocumentService: FetchDocument,
    private http: HttpClient,
    private bookmarkService:BookmarkService,
    private titleService: Title,
    private authGoogleService: AuthGoogleService,
    private errorHandlerService:ErrorHandlerService,
    private fetchDataAfterAddedOremoved: FetchbookmarkafterAddedorRemovedService,
    private router: Router) { 
   
    }
  ngOnInit() {
    this.getInstitutions();
    
    this.fetchDocument();
    this.fetchCourse();
    this.titleService.setTitle("Tutdocs");
    this.checkAuthentication();
  }

  checkAuthentication(): void {
    this.isAuthenticated = this.authenticated.isAuthenticatedUser();

    if (this.isAuthenticated) {
      // this.userData = this.userDataService.getUserData();
      this.userData = this.userDataService.getUserData();
      if (this.userData) {
        this.userId = this.userData.user_id;
        const isValidToken = this.authenticated.checkTokenValidity();

        if (!isValidToken) {
          
          this.handleInvalidUser();
        } else {
          this.userInstitute = this.userData.study_at;
          this.fetchSpecificUserInstituFiles(this.userInstitute);
          this.showUserInstitution = true;
          
    
        }
      }
    } else {
      this.handleInvalidUser();
    }
  }

  private handleInvalidUser(): void {
    setTimeout(() => {
      this.isUserInstitutePostLoading=false
      this.ifUserSignIn=false;
    this.shownotSignInMessage=true
    }, 1000);
    
    

  }

  getInstitutions(): void {
    this.institutionService.fetchInstitutions()
      .subscribe(
        (data: any) => {
          
          if(data){
            this.institutions = data;
            // console.log(data)
            setTimeout(() => {
              this.isInstitutionLoading = false;
              }, 1000);
           
          }
         else{
          setTimeout(() => {
            this.isInstitutionLoading = false;
            }, 1000);

     
         }
        },
        (error: any) => {
          // console.log(error)
          setTimeout(() => {
            this.isInstitutionLoading = false;
            }, 1000);

     
        }
      );
  }

  fetchCourse():void{
    this.fetchDocumentService.getCourseDetails().subscribe(data => {
      if(data){
        this.courseDetails = data;
        setTimeout(() => {
          this.isCoursesLoading=false;
            
          }, 1000);

      }
      else{

      }

      // console.log(this.courseDetails)
    });
  }
  selectOption(option: string): void {
    this.selectedOption = option;
    this.isUserDocumentLoading=true;
    setTimeout(() => {
      this.isUserDocumentLoading=false;
      this.fetchDocument();
      }, 1000);
    this.showDropdown = false; 
    this.faAngleDown = faAngleDown;
  }
  fetchDocument(): void {
    const apiUrl = 'http://localhost/tutdocs/server-side/api/fetch_all_files_details.php'; // Replace with your actual server API endpoint
    const serverSortBy = this.mapToServerSortBy(this.selectedOption);
    const url = `${apiUrl}?sortBy=${serverSortBy}&order=DESC`;
    this.http.get(url)
        .subscribe(
        (fetched_data: any) => {
          if (fetched_data && fetched_data.fileDetails) {
            this.docData = fetched_data.fileDetails;
            if(this.docData&& this.docData.length>0){
            this.fetchBookmarkStatusForFiles(this.docData);
            // this.sortFilesByOption();
            setTimeout(() => {
              this.isUserDocumentLoading=false;
                
              }, 1000);
  
            }
           
            //console.log(this.docData);
          }
          // Assuming data is an array of institutions or objects containing institution details
        },
        (error: any) => {
          // console.error('Error fetching institutions:', error);
         


        }
      );
  }
  private mapToServerSortBy(clientSortBy: string): string {
    switch (clientSortBy) {
      case 'Most Recent Post':
        return 'upload_time';
      case 'Most Relevant Post':
        return 'download_count';
      case 'Most Viewed Post':
        return 'view_count';
      default:
        return 'upload_time'; // Default to 'upload_time' in case of unknown values
    }
  }
  
  fetchSpecificUserInstituFiles(user_institute: string): void {
    const url = 'http://localhost/tutdocs/server-side/api/fetch_all_files_details_from_user_institution.php';
    const data = { institute_name: user_institute };
    this.http.post(url, data).subscribe(
      (response: any) => {
        this.userSpecificInstitutionPost = response.fileDetails;
        // console.log(this.userSpecificInstitutionPost);
        if (this.userSpecificInstitutionPost && this.userSpecificInstitutionPost.length > 0) {
          setTimeout(() => {
          this.isUserInstitutePostLoading=false;
          this.showUserSpecificInstitutionsFile=true;
            this.fetchBookmarkStatusForFiles(this.userSpecificInstitutionPost);
          this.showNotDataFound=false;
          }, 1000);
        }
        else {
          setTimeout(() => {
            this.isUserInstitutePostLoading=false;
            this.showUserSpecificInstitutionsFile=false;
            this.showNotDataFound=true;
            }, 1000);
         
      

        }
      
      },
      (error) => {
        setTimeout(() => {
          this.isUserInstitutePostLoading=false;
          this.showUserSpecificInstitutionsFile=false;
          this.showNotDataFound=true;
          }, 1000);
      }
    );
  }

  getFileExtension(url: string): string {
    return url.split('.').pop()?.toLowerCase() || ''; // Extract file extension
  }

  // isImageFile(fileExtension: string): boolean {
  //   // Check if the file extension corresponds to an image format
  //   return ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension);
  // }
  addUnivi(){
    this.router.navigate(['/auth/login']);
  }
  openProfile(userID:string):void{
    this.router.navigate(['/profile/'+userID]);
  }

 
  fetchBookmarkStatusForFiles(files: any[]): void {
    files.forEach(file => {
      const fileKey = file.file_key;
      if (fileKey && this.userId) {
        this.bookmarkService.checkBookMark(this.userId, fileKey).subscribe(
          response => {
            file.isBookmarked = response.isBookmarked;
          },
          error => {
            // console.error('Error checking bookmark status:', error);
          }
        );
      }
    });
  }

  toggleBookmark(fileKey: string): void {
    if(  this.isAuthenticated = this.authenticated.isAuthenticatedUser()
    ){
    if (fileKey) {
      if (this.isBookmarked(fileKey)) {
        this.removeBookMark(fileKey);
      } else {
        this.addBookMark(fileKey);
      }
    }
  }
  else{
    this.displayLogin=true;
  }
  }

  addBookMark(fileKey: string): void {
    this.bookmarkService.addBookMark(this.userId, fileKey)
      .subscribe((response: any) => {
        if (response && response.success) {
          this.updateIsBookmarkedStatus(fileKey, true); // Update isBookmarked locally
          const msg="Added to study list";
          this.showMessage(msg);
          this.fetchDataAfterAddedOremoved.triggerUploadComplete();
        } else if (response && response.error) {
          // console.error('Failed to add:', response.error);
        } else {
          // console.error('Unexpected response:', response);
        }
      });
  }

  removeBookMark(fileKey: string): void {
    this.bookmarkService.removeBookMark(this.userId, fileKey)
      .subscribe((response: any) => {
        if (response && response.success) {
          this.updateIsBookmarkedStatus(fileKey, false); // Update isBookmarked locally
          const msg="Removed  from study list";
          this.fetchDataAfterAddedOremoved.triggerUploadComplete();
         this.showMessage(msg);
        } else if (response && response.error) {
          // console.error('Failed to remove:', response.error);
        } else {
          // console.error('Unexpected response:', response);
        }
      });
  }
  updateIsBookmarkedStatus(fileKey: string, status: boolean): void {
    if (this.userSpecificInstitutionPost?.length > 0) {
      const fileInUserSpecific = this.userSpecificInstitutionPost.find((file: any) => file.file_key === fileKey);
      if (fileInUserSpecific) {
        fileInUserSpecific.isBookmarked = status;
      }
    }
  
    if (this.docData?.length > 0) {
      const fileInDocData = this.docData.find((file: any) => file.file_key === fileKey);
      if (fileInDocData) {
        fileInDocData.isBookmarked = status;
      }
    }
  }
  
  isBookmarked(fileKey: string): boolean {
    if (this.userSpecificInstitutionPost?.length > 0) {
      const fileInUserSpecific = this.userSpecificInstitutionPost.find((file: any) => file.file_key === fileKey);
      if (fileInUserSpecific && fileInUserSpecific.isBookmarked) {
        return true;
      }
    }
  
    if (this.docData?.length > 0) {
      const fileInDocData = this.docData.find((file: any) => file.file_key === fileKey);
      if (fileInDocData && fileInDocData.isBookmarked) {
        return true;
      }
    }
  
    return false;
  }
  gotoInstitutions(institute_name:string) {
    const institute=institute_name;
    this.router.navigate(['/institutions'], { queryParams: { institute } });
    }
  
  viewDocument(fileKey: string): void {
    const document=fileKey;
    this.router.navigate(['view'], { queryParams: { document } });
  }
  openCourse(course: string,code: string): void {
    const queryParams = {
      course,
      code
    };
  
    this.router.navigate(['/courses'], { queryParams });
  }
  
  showMessage(msg: any) {
    // this.errorMsg = "Please fill the all required fileds";
    this.errorHandlerService.setError(msg);
  }
  formatViewCount(count: number | null): string {
    if (count !== null) {
      if (count < 1000) {
        return count.toString();
      } else if (count < 1000000) {
        return (count / 1000).toFixed(1) + 'K';
      } else if (count < 1000000000) {
        return (count / 1000000).toFixed(1) + 'M';
      } else {
        return (count / 1000000000).toFixed(1) + 'B';
      }
    } else {
      return '0';
    }
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




