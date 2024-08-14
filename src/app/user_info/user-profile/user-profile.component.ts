import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { ParamMap, Router } from '@angular/router';
import { faUniversity,faTimes,faCheck,faAngleRight,faEllipsisH,faGraduationCap,faContactBook,faCloudUploadAlt,faPhone,faEnvelope,faLocationArrow, faEye,faMailForward, faCloudDownload,faCalendarAlt,faThumbsUp,faFolder, faInfoCircle, faAdd, faTrash, faPen, faEdit, faEllipsisVertical, faArrowRightFromBracket, faFileDownload, faCloudUpload, faInfo, faFileAlt, faHistory, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faCopy } from '@fortawesome/free-regular-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { faWhatsapp,faFacebook } from '@fortawesome/free-brands-svg-icons';
import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { FollowUnfollowService } from 'src/app/services/follow.service';
import { Observable, Subscription } from 'rxjs';
import { FileDeleteService } from 'src/app/services/deletefiles.service';
import { BookmarkService } from 'src/app/services/bookmarks.service';
import { FetchbookmarkafterAddedorRemovedService } from 'src/app/services/fetchbookmarkafter-addedor-removed.service';
import { ViewService } from 'src/app/services/view.service';
import { FetchFileReviewsService } from 'src/app/services/fetch-file-reviews.service';
import { AuthGoogleService } from 'src/app/services/auth-google.service';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy{
  @ViewChild('elementToScrollTo') elementToScrollTo!: ElementRef;


  private routeSubscription!: Subscription;
  universityIcon = faUniversity;
  faEllipsisVertical = faEllipsisVertical;
  editIcon = faEdit;
  faPhone=faPhone;
  faEllipsisH=faEllipsisH;
  faEnvelope=faEnvelope;
  faCloudUploadAlt=faCloudUploadAlt;
  faContactBook=faContactBook;
  faCheck=faCheck;
  faGraduationCap=faGraduationCap;
  faTimes=faTimes;
  faAngleRight=faAngleRight;
  faWhatsapp=faWhatsapp;
  faLocationArrow=faLocationArrow;
  faFacebook=faFacebook;
  faMailForward=faMailForward;
  faThumbsUp=faThumbsUp;
  faTrash = faTrash;
  faFolder=faFolder
  faCalendarAlt=faCalendarAlt;
  faInfoCircle = faInfoCircle;
  faPen = faPen;
  faAdd = faAdd;
  faCloudDownload = faCloudDownload;
  faEye = faEye;
  faHistory = faHistory;
  logoutIcon = faArrowRightFromBracket;
  faHeart = faHeart;
  faFileDownload = faFileDownload;
  faCloudUpload = faCloudUpload;
  faFileAlt = faFileAlt;
  userData: any;
  isOpenShareContainer:boolean = false;
  uploadingData = false;
  ifUserIfExist: boolean = true;
  userNotExitsMessage: boolean = false;
  faInfo = faInfo;
  faCopy = faCopy;
  selectedOption: string = 'Most Recent Post'; // Default selection
  faAngleUp = faAngleUp;
  faAngleDown = faAngleDown;
  showDropdown = false;
  // showOptionEdit: boolean[] = [];
  openProfileUserId: any;
  userId: any;
  myData: any;
  showConfirmation:boolean = false;
  isAuthenticated: boolean = false;
  userIdToCopy: string = '';
  fileDestails: any = [];
  ifCurrentUser: boolean = false;
  ifCurrentUserShowEditButton: boolean = false;
  showPostContent = true;
  showReviewsContent = false;
  showFollowersContent = false;
  showFollowingContent = false;
  showIfPostNotFound = true;
  showIfPostFound=false;
  showIfReviewNotFound = true;
  showIfReviewFound = false;
  showIfFolowerFound = false;
  showIfFolowingFound = false;
  showIfFollowingsNotFound = true;
  showIfFollowersNotFound = true;
  followButton = true;
  isProfileLoading: boolean = true;
  isLoadingUserUpload: boolean = true;
  coursesDetails:any[] = [];
  loggedInUserId: string = '';
  userIdToFollow: string = '';
  userIdToUnfollow: string = ''; 
  isFollowed: boolean = false;
  isFollowedBy:boolean=false;
  progress: number = 0;
  followerCount: string = '0';
  followingCount: string = '0';
  followerDetails: any[] = [];
  followingDetails: any[] = [];
  currentfollowerDetails: any[] = [];
  currentfollowingDetails: any[] = [];
   fileKey:string='';
  fileUrlToDelete: string='';
  fileKeyToDelete: string='';
  fileThumnails_url:string='';
  shareLink:string='';
  userType:string='';
  userStudyTitle:string='';
  totalFiles: string='0';
  totalDownloads:string='0';
  totalLikes:string='0';
  totalViews:string='0';
  displayLogin:boolean=false;
  time:any;
  constructor(
    private userDataService: UserDataService,
    private authenticated: AuthenticatedService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private followUnfollowService: FollowUnfollowService,
    private cdr: ChangeDetectorRef,
    private fileServices:FileDeleteService,
    private fetchFileReviewsService:FetchFileReviewsService,
    private viewService:ViewService,
    private bookmarkService:BookmarkService,
    private authGoogleService: AuthGoogleService,

    private fetchDataAfterAddedOremoved: FetchbookmarkafterAddedorRemovedService,


  ) {
      // Set the route reuse strategy to always return false
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.time = new Date();
      // console.log('Current Date and Time:', this.time);
  }

  ngOnInit() {
    
    this.routeSubscription = this.route.paramMap.subscribe((params: ParamMap) => {
      this.openProfileUserId = params.get('userID');

      this.isProfileLoading = true;
      this.isLoadingUserUpload = true;
     this.fetch_user_data(this.openProfileUserId);
       this.userIdToCopy = "http://localhost/tutdocs/profile/" + this.openProfileUserId;
       this.fetchUserUploadedFiles(this.openProfileUserId);
       this.fetchUserUploadedCourses(this.openProfileUserId);
       this.countFollowerAndFollowing(this.openProfileUserId);
       this.fetchNumberOfFiles(this.openProfileUserId);

      if (this.authenticated.isAuthenticatedUser()) {
        this.myData = this.userDataService.getUserData();
        this.userId = this.myData.user_id;


        if (this.userId === this.openProfileUserId) {
          this.loggedInUserId = this.userId;
          this.ifCurrentUserShowEditButton = true;
          this.followButton = false;

          setTimeout(() => {
            this.isProfileLoading = false;
           
          }, 1000);

        } else {
          this.userIdToFollow = this.openProfileUserId;
          this.loggedInUserId = this.userId;
          this.userIdToUnfollow = this.openProfileUserId;
        this.ifCurrentUserShowEditButton = false;

        }
      } else {
    
        this.userIdToFollow = this.openProfileUserId;
        this.loggedInUserId = this.userId;
        this.userIdToUnfollow = this.openProfileUserId;
      }
   this.checkIfUserIsFollowed();
  });
  }
  fetchUserUploadedCourses(openProfileUserId: any) {
    const url = 'http://localhost/tutdocs/users-files/fetch_spcific_user_courses.php';
    const body = { userid: openProfileUserId };
    this.http.post(url, body).subscribe(
      (response:any) => {
        // console.log('Response:', response);
        this.coursesDetails=response;
        // console.log('Response:', this.coursesDetails);

        // Handle the response data here
      },
      (error) => {
        console.error('Error:', error);
        // Handle any errors
      }
    );
  }
  scrollToElement(): void {
    if (this.elementToScrollTo && this.elementToScrollTo.nativeElement) {
      this.elementToScrollTo.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  showContent(section: string): void {
    this.showPostContent = section === 'post';
    this.showReviewsContent = section === 'reviews';
    this.showFollowersContent = section === 'followers';
    this.showFollowingContent = section === 'followings';
  }
  copyText(): void {
    const textToCopy = "http://localhost/tutdocs/profile/" + this.openProfileUserId;
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    const msg = "Copied";
    this.showMessage(msg);
  }

  fetch_user_data(user_id: string): void {
    this.ifUserIfExist = false;
    if (user_id) {
      const apiUrl = 'http://localhost/tutdocs/auth/fetch_user_data_with_userId.php';
      this.http.post<any>(apiUrl, { user_id }).subscribe(
        (response: any) => {
          if (response.exists === true) {
            this.userData = response.userData;
            this.userType=this.userData.user_type;
            this.ifUserIfExist = true;
            //  console.log(this.userData);
            // this.uploadingData = false;
            this.ifCurrentUser = false;
           if(this.userType && this.userType=="Teacher"){
              this.userStudyTitle="Teaching at";
           }
           else{
            this.userStudyTitle="Study at";
           }
            setTimeout(() => {
              this.isProfileLoading = false;

            }, 1000);

          } else {
            // console.log('UserID does not exist', response);
            this.ifUserIfExist = false;
            this.userNotExitsMessage = true;

          }
          this.uploadingData = false; // Set the loading flag to false
        },
        (error: any) => {
          // console.error('Error checking userID existence:', error);
          this.ifUserIfExist = false;
          this.userNotExitsMessage = true;
          this.uploadingData = false; // Set the loading flag to false
        }
      );
    } else {
      // console.error('Please provide a userID.');
      this.uploadingData = false; // Set the loading flag to false
      this.ifUserIfExist = false;
      this.userNotExitsMessage = true;
    }
  }
  showMessage(msg: any) {
    this.errorHandlerService.setError(msg);
  }


  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this.faAngleDown = faAngleUp; // Change to up arrow when dropdown is open
    } else {
      this.faAngleDown = faAngleDown; // Change to down arrow when dropdown is closed
    }
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    this.showDropdown = false; // Hide dropdown after selection
    this.faAngleDown = faAngleDown; // Change to down arrow after an option is selected
    this.isLoadingUserUpload = true;

    setTimeout(() => {
      this.isLoadingUserUpload = false;
    this.fetchUserUploadedFiles(this.openProfileUserId,this.selectedOption);

    }, 1000);
    // You can add further logic based on the selected option if needed
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
  fetchUserUploadedFiles(userId: string, selectedOption: string = 'Most Recent Post'): void {
    const url = 'http://localhost/tutdocs/users-files/fetch_user_uploaded_files.php';
    const data = { user_id: userId, sortBy: '', order: '' };
  
    // Map the selectedOption to server-side values
    switch (selectedOption) {
      case 'Most Recent Post':
        data.sortBy = 'upload_time';
        data.order = 'DESC';
        // console.log(data);
        break;
      case 'Most Relevant Post':
        data.sortBy = 'download_count';
        data.order = 'DESC';
        // console.log(data);

        break;
      case 'Most Viewed Post':
        data.sortBy = 'view_count';
        data.order = 'DESC';
        // console.log(data);

        break;
      // Add more cases as needed for additional options
      default:
        // Default to 'Most Recent Post' in case of unknown values
        data.sortBy = 'upload_time';
        data.order = 'DESC';
        // console.log(data);

        break;
    }
  
    this.http.post(url, data).subscribe(
      (response: any) => {
        this.fileDestails = response.fileDetails;
        if (this.fileDestails && this.fileDestails.length > 0) {
          this.fetchBookmarkStatusForFiles(this.fileDestails);
          this.fileKey = this.fileDestails.file_key;
          setTimeout(() => {
            this.isLoadingUserUpload = false;
          }, 1000);
          this.showIfPostNotFound = false;
          this.showIfPostFound = true;
        } else {
          setTimeout(() => {
            this.isLoadingUserUpload = false;
          }, 1000);
          this.showIfPostNotFound = true;
          this.showIfPostFound = false;
        }
      },
      (error) => {
        // console.error('An error occurred:', error);
        this.showIfPostNotFound = true;
        this.showIfPostFound = false;
      }
    );
  }
  
  

  checkIfUserIsFollowed(): void {
    this.followUnfollowService.checkIfUserIsFollowed(this.loggedInUserId, this.userIdToFollow)
      .subscribe((response: any) => {
        if (response && response.isFollowing) {
          this.isFollowed = true;
          // console.log('User is followed');
        } else {
          this.isFollowed = false;
          // console.log('User is not followed');
        }
  
        if (response && response.isFollowedBy) {
          // console.log('Open profile user follows the logged-in user');
          this.isFollowedBy=true;
        } else {
          // console.log('Open profile user does not follow the logged-in user');
        }
      });
  }
  
  followOrUnfollowUser(): void {
    if(this.authenticated.isAuthenticatedUser()){
    if (this.isFollowed && this.isFollowedBy) {
      this.unfollowUser();
    } else if (!this.isFollowed && this.isFollowedBy) {
      this.followUser();
    } else if (this.isFollowed && !this.isFollowedBy) {
      this.unfollowUser();
    } else {
      this.followUser();
    }
  }
  else{
    this.displayLogin=true;
  }
  }
  
  followUser(): void {
    this.followUnfollowService.followUser(this.loggedInUserId, this.userIdToFollow,this.time)
      .subscribe((response: any) => {
        if (response && response.success) {
          this.isFollowed = true; // Update follow status
          // console.log('User followed successfully');
       this.countFollowerAndFollowing(this.openProfileUserId);

        } else if (response && response.error) {
          // console.error('Failed to follow user:', response.error);
        } else {
          // console.error('Unexpected response:', response);
        }
      });
  }
  
  unfollowUser(): void {
    this.followUnfollowService.unfollowUser(this.loggedInUserId, this.userIdToUnfollow)
      .subscribe((response: any) => {
        if (response && response.success) {
          this.isFollowed = false; // Update follow status
       this.countFollowerAndFollowing(this.openProfileUserId);
          
        } else if (response && response.error) {
         // console.error('Failed to unfollow user:', response.error);
        } else {
        
         // console.error('Unexpected response:', response);
        }
      });
  }
  currentFollowerAndFollowing(user_id:string):void{
    this.followUnfollowService.getCurrentFollowerFollowing(user_id)
    .subscribe((data) => {
        this.currentfollowerDetails = data.follower_details;
        this.currentfollowingDetails = data.following_details; 
     // console.log(this.currentfollowerDetails,this.currentfollowingDetails);
    });
  }
  countFollowerAndFollowing(user_id:string):void{
    this.followUnfollowService.getFollowerFollowingCounts(user_id)
    .subscribe((data) => {
      this.followerCount = this.formatViewCount(data.follower_count);
        this.followerDetails = data.follower_details;
        this.followingCount = this.formatViewCount(data.following_count);
        this.followingDetails = data.following_details;
        
        if (this.followerDetails.length > 0) {
          this.showIfFolowerFound = true;
          this.showIfFollowersNotFound = false;
          this.identifyFollowersWithoutFollowBack();
         
          // this.identifyFollowingRelationship();
        } else {
          this.showIfFolowerFound = false;
          this.showIfFollowersNotFound = true;
        }
        if(this.followingDetails.length > 0){
          this.showIfFolowingFound = true;
          this.showIfFollowingsNotFound = false;
          this.identifyFollowingWithoutFollowBack();
        }
        else{
          this.showIfFolowingFound = false;
          this.showIfFollowingsNotFound = true;
        }
        
       
      //console.log(this.followerCount,this.followingCount,this.followerDetails,this.followingDetails);
    });
}
identifyFollowersWithoutFollowBack(): void {
  if(this.userId===this.openProfileUserId){
  this.followerDetails.forEach(follower => {
    const isFollowing = this.followingDetails.some(following => {
      return following.user_id === follower.user_id;
    });
    if (!isFollowing) {

        follower.showFollowBackButton = true; 
      
    }
    else{
      follower.showfollowingtext=true;
    }
  });
}

}
identifyFollowingWithoutFollowBack(): void {
  if (this.userId === this.openProfileUserId) {
    this.followingDetails.forEach(following => {
      const isFollower = this.followerDetails.some(follower => {
        return follower.user_id === following.user_id;
      });

      if (!isFollower) {
        following.showUnfollowButton = true;
      } else {
        following.showfollowingtext = true;
      }
    });
  } else {
    // console.log("User profile doesn't match the logged-in user.");
  }
}

followBack(loggedInUserId: string, follower: any) {
  this.followUnfollowService.followUser(loggedInUserId, follower.user_id,this.time)
    .subscribe((response: any) => {
      if (response && response.success) {
        follower.showFollowBackButton = false;
        follower.showfollowingtext=true;
       this.countFollowerAndFollowing(this.openProfileUserId);

        // console.log('User followed successfully');
      } else if (response && response.error) {
        // console.error('Failed to follow user:', response.error);
      } else {
        // console.error('Unexpected response:', response);
      }
    });

  }
  unfollow(loggedInUserId: string, following: any) {
    this.followUnfollowService.unfollowUser(loggedInUserId, following.user_id)
    .subscribe((response: any) => {
      if (response && response.success) {
        following.showUnfollowButton = false;
        following.showfollowingtext=false;
        following.showFollowButton = true;
       this.countFollowerAndFollowing(this.openProfileUserId);

      } else if (response && response.error) {
       // console.error('Failed to unfollow user:', response.error);
      } else {
      
       // console.error('Unexpected response:', response);
      }
    });
    }

    follow(loggedInUserId:string, following:any): void {
      this.followUnfollowService.followUser(loggedInUserId, following.user_id,this.time)
        .subscribe((response: any) => {
          if (response && response.success) {
            following.showUnfollowButton = true;
            following.showFollowButton = false;
           following.showfollowingButton=false;
           this.countFollowerAndFollowing(this.openProfileUserId);

            // console.log('User followed successfully');
          } else if (response && response.error) {
            // console.error('Failed to follow user:', response.error);
          } else {
            // console.error('Unexpected response:', response);
          }
        });
    }
    
showUserProfile(userID: string) {
    this.router.navigate(['/profile/'+userID]);
  }
  downloadFile(fileUrl:string,fileName:string,fileKey:string): void {
    // Replace this with your file URL
    if(this.authenticated.isAuthenticatedUser()){
     const file_name='tutdocs_'+fileName;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: Blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.setAttribute('download', file_name); // Replace with your desired file name
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(url);
      this.downloadCounter(fileKey);
      setTimeout(() => {
        const msg="Downloaded !";
      this.showMessage(msg);
      }, 1000);
      
    }, error => {
      setTimeout(() => {
        const msg="Failed to Download!";
      this.showMessage(msg);
      }, 1000);
      // console.error('Error downloading file:', error);
      // Handle error if needed
    });
  }
  else{
    this.displayLogin=true;
  }
  }
 

   deleteFiles(file_url:string,fileKey:string,fileThumnails_url:string): void {
    this.fileUrlToDelete = file_url;
    this.fileKeyToDelete = fileKey;
    this.fileThumnails_url=fileThumnails_url
    this.showConfirmation = true;
    }

     confirmDelete(): void {
      if (this.fileUrlToDelete && this.fileKeyToDelete) {
      this.fileServices.deleteFileAndData(this.fileUrlToDelete,this.fileKeyToDelete,this.fileThumnails_url, this.userId)
      .subscribe(
        response => {
          // console.log("File deleted successfully !",response)
          if (response && response.success === "success") {
            this.fetchUserUploadedFiles(this.userId);
          
           // console.log('File and associated data deleted successfully:', response);
            const msg="File deleted successfully !";
             this.showMessage(msg);
            this.showConfirmation = false;
            this.fileUrlToDelete = ''; 
            this.fileKeyToDelete = ''; 
            this.fileThumnails_url = ''; 
          
          }
          
        else{
         //console.error('Error deleting file and data:', response);
        }

        },
        error => {
         // console.error('Error deleting file and data:', error);
          // Handle error: Show an error message, handle error state, etc.
        }
      );
      }
     else{
      //console.log("not delete item found")
     }
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
    if (this.fileDestails?.length > 0) {
      const fileInUserSpecific = this.fileDestails.find((file: any) => file.file_key === fileKey);
      if (fileInUserSpecific) {
        fileInUserSpecific.isBookmarked = status;
      }
    }
  

  }
  
  isBookmarked(fileKey: string): boolean {
    if (this.fileDestails?.length > 0) {
      const fileInUserSpecific = this.fileDestails.find((file: any) => file.file_key === fileKey);
      if (fileInUserSpecific && fileInUserSpecific.isBookmarked) {
        return true;
      }
    }
  
  
    return false;
  }
  
  cancelDelete(): void {
    this.showConfirmation = false;
  }
  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
  downloadCounter(file_key:string){
    if (file_key) {
      this.viewService.updateDownload(file_key)
        .subscribe(
          (response) => {
            if (response) {
              console.log(response);
              this.fetchUserUploadedFiles(this.openProfileUserId);
            }
            }
        );
    } else {
      // Handle case when user_id is not available
    }
  
  }

  closeShareOption(){
    this.isOpenShareContainer = false;

  }
  shareFile(fileKey:string){
    this.isOpenShareContainer = !this.isOpenShareContainer;
    this.shareLink='http://localhost/tutdocs/view?document='+fileKey;
    // console.log(this.shareLink);
     
  }
  gotoInstitutions(institute_name:string) {
    const institute=institute_name;
    this.router.navigate(['/institutions'], { queryParams: { institute } });
    }
  openWhatsApp() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
    // Encode the shareLink before appending it to the URL
    const encodedLink = encodeURIComponent(this.shareLink);
  
    if (isMobile) {
      window.location.href = 'whatsapp://send?text=' + encodedLink;
    } else {
      window.open('https://web.whatsapp.com/send?text=' + encodedLink);
    }
  }
  openFacebook() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
    // Encode the shareLink before appending it to the URL
    const encodedLink = encodeURIComponent(this.shareLink);
  
    if (isMobile) {
      // For mobile devices, use the mobile Facebook sharing URL
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodedLink);
    } else {
      // For non-mobile devices, use the regular Facebook sharing URL
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodedLink);
    }
  }
  copyShareLink(): void {
    const textarea = document.createElement('textarea');
    textarea.value = this.shareLink;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    const msg = "Link Copied";
    this.showMessage(msg);
  }
  viewDocument(fileKey: string): void {
    const document=fileKey;
    this.router.navigate(['/view'], { queryParams: { document } });
  }
  openCourse(course: string,code: string): void {
    const queryParams = {
      course,
      code
    };
  
    this.router.navigate(['/courses'], { queryParams });
  }

  editFile(file_key:string){
    const edit=file_key;
    this.router.navigate(['/edit'], { queryParams: { edit } });
  }
  viewFileDetails(file_key:string){
    const detail=file_key;
    this.router.navigate(['/view-details'], { queryParams: { detail } });
  }



  fetchNumberOfFiles(userId:string): void {
    this.fetchFileReviewsService.getNumberOfFilesForUser(userId).subscribe(
      (data:any) => {
        //  console.log("counts:", data);

      this.totalFiles = this.formatViewCount(data.total_files);
      this.totalDownloads =this.formatViewCount(data.total_downloads);
      this.totalLikes = this.formatViewCount(data.total_likes);
      this.totalViews = this.formatViewCount(data.total_views);
      

      // console.log('Total files:', this.totalFiles);
      },
      (error) => {
        // console.error('Error fetching files:', error);
      }
    );
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
  

