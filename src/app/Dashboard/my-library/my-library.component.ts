import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { BookmarkService } from 'src/app/services/bookmarks.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { FetchbookmarkafterAddedorRemovedService } from 'src/app/services/fetchbookmarkafter-addedor-removed.service';
import { UserDataService } from 'src/app/services/user-data.service';
import {faBookmark,faHistory,faCloudDownload,faEye,faThumbsUp, faFolder,faFileAlt,faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FollowCourseService } from 'src/app/services/follow-course.service';

@Component({
  selector: 'app-my-library',
  templateUrl: './my-library.component.html',
  styleUrls: ['./my-library.component.css']
})
export class MyLibraryComponent {
  faBookmark=faBookmark;
  faHistory=faHistory;
  faFolder=faFolder;
  faMinus=faTrashAlt;
  faCloudDownload=faCloudDownload;
  faEye=faEye;
  faThumbsUp=faThumbsUp;
  faFileAlt=faFileAlt;
  userId:string='';
  userData: any;
  isAuthenticated: boolean = false;
    isRecviewedDoc:boolean=true;
    isBookMarkedDoc:boolean=true;
    isRecentlyViewdLoading:boolean=true;
    isFollowedCoursesLoading:boolean=true;
    isBookeMarkedLoading:boolean=true;
    isMyDocLoading:boolean=true;
    isCourses:boolean=true;
    isPostDoc:boolean=true;
    bookMarkedList:any[] = [];
    recentlyViewedList:any[]=[];
    followedCoursesList:any[]=[];
  fileDestails: any = [];

  constructor(
    private authenticated: AuthenticatedService,
    private userDataService: UserDataService,
    private http: HttpClient,
    private bookmarkService:BookmarkService,
    private titleService: Title,
    private errorHandlerService:ErrorHandlerService,
    private fetchDataAfterAddedOremoved: FetchbookmarkafterAddedorRemovedService,
    private followCourseService:FollowCourseService,
    private router: Router) { 
   
    }
  ngOnInit() {
    this.titleService.setTitle("Tutdocs");
    this.checkAuthentication();
    this.fetchBookmark( this.userId);
    this.fetchRecentlyViewed(this.userId);
    this.fetchFollowedCourses(this.userId);
    this.fetchUserUploadedFiles(this.userId);
    this.fetchDataAfterAddedOremoved.uploadComplete$.subscribe(() => {
      this.fetchBookmark( this.userId);
    this.fetchRecentlyViewed(this.userId);
    this.fetchFollowedCourses(this.userId);


    });
  }

  checkAuthentication(): void {
    this.isAuthenticated = this.authenticated.isAuthenticatedUser();
    if (this.isAuthenticated) {
      this.userData = this.userDataService.getUserData();
      if (this.userData) {
        this.userId = this.userData.user_id;
      }
    } else {
    
    }
  }

  fetchBookmark(user_id:string){
    if(user_id){
      this.bookmarkService.getBookMarked(user_id)
      .subscribe((data) => {
        //  console.log("bookmarked data",data)
         //  this.bookMarkedList = data;
         
        if(data){
      
            this.bookMarkedList = data;
            if(this.bookMarkedList.length>0){
            this.isBookMarkedDoc=true;
            setTimeout(() => {
              this.isBookeMarkedLoading=false;
            }, 1000);
           
          } else{
            setTimeout(() => {
              this.isBookeMarkedLoading=false;
            }, 1000);
            this.isBookMarkedDoc=false;
          }
          
        }
        else{
          this.isBookMarkedDoc=false;
        }
        


      });
    }
    else{
      
    }
  }
  fetchFollowedCourses(user_id:string):void{
    if(user_id){
      this.bookmarkService.getFollowedCourses(user_id)
      .subscribe((data) => {
        //  console.log("FollowedCurses",data)
         //  this.bookMarkedList = data;
         
        if(data){
      
            this.followedCoursesList = data;
            setTimeout(() => {
              this.isFollowedCoursesLoading=false;
            }, 1000);
            if(this.followedCoursesList.length > 0){
            this.isCourses=true;
           
           
          } else{
            this.isCourses=false;
          }
          
        }
        else{
          this.isCourses=false;
        }
        


      });
    }
    else{
      
    }
  }
  fetchRecentlyViewed(user_id:string){
    if(user_id){
      this.bookmarkService.getRecentlyViewed(user_id)
      .subscribe((data) => {
        //  console.log("RecentlyViewed",data)
         //  this.bookMarkedList = data;
         
        if(data){
      
            this.recentlyViewedList = data;
            setTimeout(() => {
              this.isRecentlyViewdLoading=false;
            }, 1000);
            if(this.recentlyViewedList.length > 0){
            this.isRecviewedDoc=true;
        
           
          } else{
            this.isRecviewedDoc=false;
          }
          
        }
        else{
          this.isRecviewedDoc=false;
        }
        


      });
    }
    else{
      
    }
  }


  fetchUserUploadedFiles(userId: string): void {
    const url = 'http://localhost/tutdocs/users-files/fetch_user_uploaded_files.php';
    const data = { user_id: userId};
    this.http.post(url, data).subscribe(
      (response: any) => {
        this.fileDestails = response.fileDetails;
        setTimeout(() => {
          this.isMyDocLoading=false;
        }, 1000);
        if (this.fileDestails && this.fileDestails.length > 0) {
        //  console.log(this.fileDestails)
         this.isPostDoc=true;
         
  
        } else {
          this.isPostDoc=false;
        }
      },
      (error) => {
        this.isPostDoc=false;
       
      }
    );
  }


  removeBookMark(fileKey: string): void {
    this.bookmarkService.removeBookMark(this.userId, fileKey)
      .subscribe((response: any) => {
        if (response && response.success) {
          // console.log("Response",response)
          const msg="Removed  from study list";
          this.showMessage(msg)
          this.fetchDataAfterAddedOremoved.triggerUploadComplete();
          this.fetchBookmark(this.userId);
        } else if (response && response.error) {
          // console.error('Failed to remove:', response.error);
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
  gotoInstitutions(institute_name:string) {
    const university=institute_name;
    this.router.navigate(['/institutions'], { queryParams: { university } });
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
}
