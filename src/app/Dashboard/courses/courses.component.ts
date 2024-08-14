import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {faFolder,faAdd,faSearch,faTimes,faUniversity,faFileAlt,faCheck} from '@fortawesome/free-solid-svg-icons';
import { AuthGoogleService } from 'src/app/services/auth-google.service';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { FetchbookmarkafterAddedorRemovedService } from 'src/app/services/fetchbookmarkafter-addedor-removed.service';
import { FollowCourseService } from 'src/app/services/follow-course.service';
import { UniversityDocumentsService } from 'src/app/services/university-documents.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courseName: string='';
  courseCode: string='';
  faFolder=faFolder;
  faCheck=faCheck;
  faTimes=faTimes;
  faUniversity=faUniversity;
  faAdd=faAdd;
  faSearch=faSearch;
  faFileAlt=faFileAlt;
  courseFilesDetails:any[]=[];
  isCoursePost:boolean=true;
  fileCount:number=0;
  isAuthenticated: boolean = false;
  userData:any;
  userId:string='';
  isFollowed=false;
  isCourse:boolean=true;
  showFollowButtonAnimation=true;
  displayLogin: boolean=false;

  constructor(private route: ActivatedRoute,
    private universityDocumentsService:UniversityDocumentsService,
    private userDataService: UserDataService,
    private authenticated: AuthenticatedService,
    private router:Router,
    private authGoogleService: AuthGoogleService,
    private errorHandlerService: ErrorHandlerService,
    private fetchDataAfterAddedOremoved: FetchbookmarkafterAddedorRemovedService,
    private followCourseService:FollowCourseService,


    
    ) { }

  ngOnInit(): void {
   
    // Subscribe to the queryParams observable
    this.route.queryParams.subscribe(params => {
      // Retrieve the values of course_name and course_code from the query parameters
      this.courseName = params['course'];
      this.courseCode = params['code'];
        setTimeout(() => {
          this.isCourse=false;
        }, 1000);
      // Now you can use these values in your component
      // console.log('Course Name:', this.courseName);
      // console.log('Course Code:', this.courseCode);
      this.CourseDocuments( this.courseName);
      this.checkAuthentication();
      this.checkIsFollowed();
    });
  }



  checkAuthentication(): void {
    this.isAuthenticated = this.authenticated.isAuthenticatedUser();
    if (this.isAuthenticated) {
      this.userData = this.userDataService.getUserData();
      if (this.userData) {
        this.userId=this.userData.user_id;

      
      } else {
        // Handle scenario where userData is not found
      }
      const isValidToken = this.authenticated.checkTokenValidity();
      if (!isValidToken) {
        // Handle invalid or expired token
      }
    }
      else {
    
    
  }
}


  CourseDocuments(course_name: string): void {
    this.universityDocumentsService.fetchCourseDocuments(course_name).subscribe(
      (response: any) => {
        // Handle the response data here
        // console.log(response);
        if(response && response.fileDetails){
          this.courseFilesDetails=response.fileDetails;
          this.fileCount=response.fileCount;
          if(this.courseFilesDetails.length>0){
            setTimeout(() => {
              this.isCoursePost=false;
    
            }, 1000);
         
          }
          else{
            this.isCoursePost=false;
          }
   
        }
        else{
          this.isCoursePost=false;
  
        }
        // ... your other logic
      },
      (error) => {
        // Handle the error here
        // console.error(error);
        setTimeout(() => {
          this.isCoursePost=false;
   
  
        }, 1000);
      
        // ... your other error handling logic
      }
    );
  }

  toggleFollow(courseName:string): void {
    if(  this.isAuthenticated = this.authenticated.isAuthenticatedUser()
    ){
    if (courseName) {
      if (!this.isFollowed) {
        this.followCourses(courseName);
      } else {
        this.unFollowCourses(courseName);
      }
    }
  }
  else{
   this.displayLogin=true;
  }
  }
  checkIsFollowed(){
    if (this.courseName && this.userId) {
      this.followCourseService.checkFollowed(this.userId, this.courseName).subscribe(
        response => {
          this.isFollowed = response.isFollowed;
          if(response){
            setTimeout(() => {
          this.showFollowButtonAnimation=false;

            }, 1000);
          }
          // console.log("Response:",response)
        },
        error => {
          // console.error('Error checking bookmark status:', error);
        }
      );
    }
    else{
      setTimeout(() => {
        this.showFollowButtonAnimation=false;

          }, 1000);
    }
  }
  
  followCourses(CourseName: string): void {
    this.followCourseService.followCourses(this.userId, CourseName,this.courseCode)
      .subscribe((response: any) => {
        if (response && response.success) {
          // this.updateIsBookmarkedStatus(fileKey, true); // Update isBookmarked locally
          this.isFollowed=true;
          const msg="Added to your courses";
          this.showMessage(msg);
          this.fetchDataAfterAddedOremoved.triggerUploadComplete();
        } else if (response && response.error) {
          // console.error('Failed to add:', response.error);
        } else {
          // console.error('Unexpected response:', response);
        }
      });
  }
  
  unFollowCourses(CourseName: string): void {
    this.followCourseService.unFollowed(this.userId, CourseName)
      .subscribe((response: any) => {
        if (response && response.success) {
          // this.updateIsBookmarkedStatus(fileKey, false); // Update isBookmarked locally
          this.isFollowed=false;
          const msg="Removed  from your courses";
          this.fetchDataAfterAddedOremoved.triggerUploadComplete();
         this.showMessage(msg);
        } else if (response && response.error) {
          // console.error('Failed to remove:', response.error);
        } else {
          // console.error('Unexpected response:', response);
        }
      });
  }
  showMessage(msg:any){
    this.errorHandlerService.setError(msg);
  }
  viewDocument(fileKey:string):void{
    const document =fileKey;
    this.router.navigate(['view'], { queryParams: { document } });
  }
  gotoInstitutions(institute_name:string) {
    const institute=institute_name;
    this.router.navigate(['/institutions'], { queryParams: { institute } });
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
