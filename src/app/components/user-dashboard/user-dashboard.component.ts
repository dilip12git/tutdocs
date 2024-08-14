import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faUniversity,faTimes,faHome, faListCheck,faHistory, faBook, faBookBookmark, faAdd, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faSearch, faAngleDown, faCloudUpload,faPlus,faBell, faUserGear, faUser,faAddressCard, faArrowRightFromBracket, faBars, faFile, faSchool } from '@fortawesome/free-solid-svg-icons';
import {faQuestionCircle,faCommentAlt,faBookmark,faFolder} from '@fortawesome/free-regular-svg-icons';

import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { FetchFileReviewsService } from 'src/app/services/fetch-file-reviews.service';
import { BookmarkService } from 'src/app/services/bookmarks.service';
import { FetchbookmarkafterAddedorRemovedService } from 'src/app/services/fetchbookmarkafter-addedor-removed.service';
import { AuthGoogleService } from 'src/app/services/auth-google.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  university = faUniversity;
  uploadIcon = faCloudUpload;
  faHome = faHome;
  faBell=faBell;
  faQuestionCircle=faQuestionCircle;
  faTimes=faTimes;
  faComments=faCommentAlt;
  faHistory=faHistory;
  faBookmark = faBookmark;
  faPlus=faPlus;
  faListCheck = faListCheck;
  book = faBook;
  faAddressCard=faAddressCard;
  folder = faFolder;
  studyList = faBookBookmark;
  dropDownArrow = faAngleDown;
  faAdd = faAdd;
  dropUpArrow = faAngleUp;
  search = faSearch;
  faAngleDown = faAngleDown;
  faGear = faUserGear;
  faUser = faUser;
  faBars = faBars;
  faCloudUpload = faCloudUpload;
  faUniversity = faUniversity;
  faSchool = faSchool;
  faFile = faFile;
  logoutIcon = faArrowRightFromBracket;
  userData: any;
  guestUserName = 'Guest User';
  guestInstitution = 'Add your institution';
  defaultProfilePicture = 'assets/icon/default_profile.png'; // Path to your default profile picture
  // searchQuery: string = '';
  showContent: string | null = null;
  isSidebarOpen = false;
  isAuthenticated: boolean = false;
  isOptionContainerOpen: boolean = false;
  displayLogin:boolean=false;
  msg:string='';
  searchQuery: string = '';
  isSearchBarOpen: boolean = false;
  userId:string='';
  totalFiles: string = '0';
  bookMarkedList:any[] = [];
  recentlyViewedList:any[]=[];
  followedCoursesList:any[]=[];
  isFollowedCourse:boolean=true;
  isRecentlyViewed:boolean=true;
  isBookmarkAdded:boolean=true;
  totalDownloads:string='0';
  totalLikes:string='0';
  noOfunViewednotification:number=0;
currentYear: number;

  constructor(
    private userDataService: UserDataService,
    private authenticated: AuthenticatedService,
    private router: Router,
    private elementRef: ElementRef,
    private errorHandlerService: ErrorHandlerService,
    private fetchFileReviewsService:FetchFileReviewsService,
    private bookmarkService:BookmarkService,
    private route:ActivatedRoute,
    private noficationsService: NotificationsService,
    private authGoogleService: AuthGoogleService,
    private fetchDataAfterAddedOremoved: FetchbookmarkafterAddedorRemovedService,
    
  ) { 
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit() {
    this.checkAuthentication();
    this.fetchNumberOfFiles();
    
    this.route.queryParams.subscribe(params => {
      const searchTerm = params['q'];
      this.searchQuery=searchTerm;
    });
    this.fetchBookmark( this.userId);
    this.fetchRecentlyViewed(this.userId);
    this.fetchFollowedCourses(this.userId);
    this.fetchUnviewedNotification(this.userId);
    this.fetchDataAfterAddedOremoved.uploadComplete$.subscribe(() => {
      this.fetchBookmark( this.userId);
    this.fetchRecentlyViewed(this.userId);
    this.fetchFollowedCourses(this.userId);
    this.fetchUnviewedNotification(this.userId);


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
       
        this.userData = {
          name: this.guestUserName,
          study_at: this.guestInstitution,
          profile_picture: this.defaultProfilePicture // Assign the default profile picture path
        };
      }
    
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  onRouterLinkClick() {
    this.closeSidebar();
    this.closeMenuOption();
  }
  closeMenuOption():void{
  this.isOptionContainerOpen=false;
}


  profileClick(userID: string) {
    if (this.authenticated.isAuthenticatedUser()) {
      // If authenticated, navigate to the search route
      this.router.navigate(['profile/'+userID]);
    } else {
      // If not authenticated, open the login dialog
      // this.router.navigate(['/auth/login']);
      this.displayLogin=true;
    }
  }
  uploadDocument() {
    if (this.authenticated.isAuthenticatedUser()) {
      this.router.navigate(['/upload']);
    } else {
      this.displayLogin=true;

    }
  }


  logOut() {
    this.authenticated.logout();
    this.router.navigate(['']);
    this.msg='Logout Successfully';
    this.showMessage(this.msg);
  }
  gotoLogin(){
    this.router.navigate(['/auth/login']);
  }

  toggleContent(item: string) {
    if (this.showContent === item) {
      this.showContent = null; // Hide content if already shown
    } else {
      this.showContent = item; // Show content of the selected item
    }
  }
  toggleSideMenu(event: Event) {
    event.stopPropagation(); // Prevent event bubbling
    this.isSidebarOpen = !this.isSidebarOpen;
    this.isOptionContainerOpen=false;
  }

  toggleOptionContainer(event: Event) {
    event.stopPropagation(); // Prevent event propagation to document
    this.isOptionContainerOpen = !this.isOptionContainerOpen;
    this.isSidebarOpen=false;
  }
 
  @ViewChild('searchInput') searchInput!: ElementRef;
  toggleSearchBar(event: Event): void {
    event.stopPropagation();
    this.isSearchBarOpen = !this.isSearchBarOpen;
    if (this.isSearchBarOpen && this.searchInput) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      });
    }
  }


 
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const sidebar = this.elementRef.nativeElement.querySelector('.sidebar-container');
    const toggleButton = this.elementRef.nativeElement.querySelector('.h-menu-bars-container');
    const optionContainer = this.elementRef.nativeElement.querySelector('.h-option-container');
    const searchToggleButton=this.elementRef.nativeElement.querySelector('.h-search-bar-icon-container');
    const searchBarCOntainer=this.elementRef.nativeElement.querySelector('.h-site-search-container');

    if (sidebar && !sidebar.contains(event.target) && toggleButton !== event.target) {
      this.isSidebarOpen = false;
    }

    if (optionContainer && !optionContainer.contains(event.target)) {
      this.isOptionContainerOpen = false;
    }
 
    if (searchBarCOntainer && !searchBarCOntainer.contains(event.target) && searchToggleButton!==event.target) {
      this.isSearchBarOpen = false;
    }
  }

  showMessage(msg:any){
    this.errorHandlerService.setError(msg);
  }
  performSearch(): void {
    if (this.searchQuery && this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

 fetchUnviewedNotification(userId:string):void{
  if (userId) {
    this.noficationsService.getNoOfUnviewedNotification(userId).subscribe(
      (reponse: any) => {
        if(reponse && reponse.success){
          // console.log(reponse);
           this.noOfunViewednotification=reponse.totalUnviewedNotifications;
           
          // console.log(this.noOfunViewednotification);
        }
      });
  }
 }

  fetchNumberOfFiles(): void {
    this.fetchFileReviewsService.getNumberOfFilesForUser(this.userId).subscribe(
      (data:any) => {
        //  console.log("counts:", data);

      this.totalFiles = this.formatViewCount(data.total_files);
      this.totalDownloads = this.formatViewCount(data.total_downloads)
      this.totalLikes = this.formatViewCount(data.total_likes)

      // console.log('Total files:', this.totalFiles);
      },
      (error) => {
        // console.error('Error fetching files:', error);
      }
    );
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
            this.isBookmarkAdded=true;
           
          } else{
            this.isBookmarkAdded=false;
          }
          
        }
        else{
          this.isBookmarkAdded=false;
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
            if(this.followedCoursesList.length > 0){
            this.isFollowedCourse=true;
           
          } else{
            this.isFollowedCourse=false;
          }
          
        }
        else{
          this.isFollowedCourse=false;
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
            if(this.recentlyViewedList.length>0){
            this.isRecentlyViewed=true;
           
          } else{
            this.isRecentlyViewed=false;
          }
          
        }
        else{
          this.isRecentlyViewed=false;
        }
        


      });
    }
    else{
      
    }
  }
 gotoInstitutions(institute_name:string) {
    const university=institute_name;
    this.router.navigate(['/institutions'], { queryParams: { university } });
    }

    openCourse(course: string,code: string): void {
      const queryParams = {
        course,
        code
      };
    
      this.router.navigate(['/courses'], { queryParams });
    }
    viewDocument(fileKey:string):void{
      const document =fileKey;
      this.router.navigate(['view'], { queryParams: { document } });
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
