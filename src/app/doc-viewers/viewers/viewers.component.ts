import { Component, ElementRef, HostListener, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faListCheck, faBook, faBookBookmark, faAdd, faAngleUp, faAngleRight, faThumbsUp,
 faAngleLeft, faMagnifyingGlassPlus, faAddressCard, faInfoCircle, faTimes, faUserPlus,
  faMagnifyingGlassMinus, faHome, faUniversity, faCloudDownload, faMailForward, faEllipsisH,
  faSchool, faUser, faArrowRightFromBracket, faBell, faEye, faComments
} from '@fortawesome/free-solid-svg-icons';
import {faQuestionCircle,faCommentAlt,faBookmark,faFolder} from '@fortawesome/free-regular-svg-icons';
import { faSearch, faAngleDown, faHistory, faCloudUpload, faPlus, faUserGear, faBars, faFile, } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { FetchFileReviewsService } from 'src/app/services/fetch-file-reviews.service';
import { BookmarkService } from 'src/app/services/bookmarks.service';
import { FetchbookmarkafterAddedorRemovedService } from 'src/app/services/fetchbookmarkafter-addedor-removed.service';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { ViewService } from 'src/app/services/view.service';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { FollowUnfollowService } from 'src/app/services/follow.service';
import { AuthGoogleService } from 'src/app/services/auth-google.service';
import { NotificationsService } from 'src/app/services/notifications.service';
@Component({
  selector: 'app-viewers',
  templateUrl: './viewers.component.html',
  styleUrls: ['./viewers.component.css']
})
export class ViewersComponent {
  university = faUniversity;
  uploadIcon = faCloudUpload;
  faHome = faHome;
  faComments=faCommentAlt;
  faQuestionCircle=faQuestionCircle;
  faBell = faBell;
  faAddressCard = faAddressCard;
  faUserPlus = faUserPlus;
  faWhatsapp = faWhatsapp;
  faFacebook = faFacebook;
  faEye = faEye;
  faHistory = faHistory;
  faTimes = faTimes;
  faBookmark = faBookmark;
  faAngleRight = faAngleRight;
  showFileNotFoundMessage: boolean = false;
  faPlus = faPlus;
  noOfunViewednotification: number = 0;
  zoom = 1.0; // Initial zoom level
  followerCount: string = '0';
  followingCount: string = '0';
  isFollowed: boolean = false;
  isFollowedBy: boolean = false;
  followButton: boolean = true;
  faInfoCircle = faInfoCircle;
  recentlyViewedList: any[] = [];
  isRecentlyViewed: boolean = true;
  faThumbsUp = faThumbsUp;
  faMailForward = faMailForward;
  faCloudDownload = faCloudDownload;
  faMagnifyingGlassPlus = faMagnifyingGlassPlus;
  faAngleLeft = faAngleLeft;
  faMagnifyingGlassMinus = faMagnifyingGlassMinus;
  faEllipsisH = faEllipsisH;
  faBook = faListCheck;
  book = faBook;
  folder = faFolder;
  isLiked = false;
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
  posted_by_user_id: string = '';
  fileKey: string = '';
  //  fileDetails:any;
  isLoadingReviews: boolean = true;
  isPDF: boolean = false;
  isImage: boolean = false;
  isDoc: boolean = false;
  displayLogin: boolean = false;
  fileType: string = ''; // Assuming this is set based on file type (pdf, image, doc)
  safeFileUrl: SafeResourceUrl | undefined;
  pdfData: any; // Set this for PDF files
  docUrl: any;
  officeLiveViewerUrl: string = 'https://view.officeapps.live.com/op/embed.aspx?src=';

  userData: any;
  uploaded_userData: any;
  recieved_course_name: string = '';
  userId: string = '';
  fileDetails: any;
  fetchRelatedFileDetails: any[] = [];
  fileCount: string = '0';

  guestUserName = 'Guest User';
  guestInstitution = '+ Add your university or school';
  defaultProfilePicture = 'assets/icon/default_profile.png'; // Path to your default profile picture
  // searchQuery: string = '';
  showContent: string | null = null;
  isSidebarOpen = false;
  isFileInfOpen = false;
  isAuthenticated: boolean = false;
  isOptionContainerOpen: boolean = false;
  msg: string = '';
  // recivedKeyAndUserId:any;
  searchQuery: string = '';
  isSearchBarOpen: boolean = false;
  totalFiles: string = '0';
  bookMarkedList: any[] = [];
  isBookmarkAdded: boolean = true;
  views: string = '0';
  isBookMarked = false;
  likes: string = '0';
  isOpenShareContainer: boolean = false;
  Link: any;
  title: string = '';
  shareLink: string = '';
  metaImage_url: string = '';
  metaDescription: string = '';
  fUserId: string = '';
  totalDownloads: string = '0';
  totalLikes: string = '0';
  followedCoursesList: any[] = [];
  isFollowedCourse: boolean = true;
  time: any;
  constructor(
    private sanitizer: DomSanitizer,
    private userDataService: UserDataService,
    private authenticated: AuthenticatedService,
    private router: Router,
    private elementRef: ElementRef,
    private errorHandlerService: ErrorHandlerService,
    private fetchFileReviewsService: FetchFileReviewsService,
    private bookmarkService: BookmarkService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private titleService: Title,
    private noficationsService: NotificationsService,

    private authGoogleService: AuthGoogleService,
    private followUnfollowService: FollowUnfollowService,
    private meta: Meta,
    private viewService: ViewService,
    private fetchDataAfterAddedOremoved: FetchbookmarkafterAddedorRemovedService,
  ) {
    this.time = new Date();
    // console.log('Current Date and Time:', this.time);
  }

  ngOnInit() {
    this.checkAuthentication();

    this.route.queryParams.subscribe(params => {
      const fileKey = params['document'];

      if (fileKey) {
        // console.log("fileKey:",fileKey)
        this.fileKey = fileKey;
        this.fetchFileDetails(this.fileKey);
        const isViewUpdated = sessionStorage.getItem('isFileViewUpdated');
        if (!isViewUpdated) {
          this.updateView(this.fileKey);
          sessionStorage.setItem('isFileViewUpdated', 'true');
        }

        this.checkIfUserIsLiked();
        this.addToUserViewedList();
        this.checkIsBookMarked();
        this.checkIfUserIsFollowed();
        this.fetchUnviewedNotification(this.userId);

        this.shareLink = "http://localhost/tutdocs/view?document=" + this.fileKey;

      }

    });
    if (!this.userId) {
      this.followButton = true;

    }
    else if (this.userId === this.fUserId) {
      this.followButton = false;
    }

    this.fetchNumberOfFiles();
    this.fetchBookmark(this.userId);
    this.fetchRecentlyViewed(this.userId);
    this.fetchFollowedCourses(this.userId);
    this.fetchDataAfterAddedOremoved.uploadComplete$.subscribe(() => {
      this.fetchBookmark(this.userId);
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
  fetchUnviewedNotification(userId: string): void {
    if (userId) {
      this.noficationsService.getNoOfUnviewedNotification(userId).subscribe(
        (reponse: any) => {
          if (reponse && reponse.success) {
            // console.log(reponse);
            this.noOfunViewednotification = reponse.totalUnviewedNotifications;

            // console.log(this.noOfunViewednotification);
          }
        });
    }
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
  closeFileInfo() {
    this.isFileInfOpen = false;
  }
  onRouterLinkClick() {
    this.closeSidebar();
    this.closeMenuOption();
    this.closeFileInfo();
  }
  closeMenuOption(): void {
    this.isOptionContainerOpen = false;
  }


  profileClick(userID: string) {
    if (this.authenticated.isAuthenticatedUser()) {
      // If authenticated, navigate to the search route
      this.router.navigate(['profile/' + userID]);
    } else {
      // If not authenticated, open the login dialog
      // this.router.navigate(['/auth/login']);
      this.displayLogin = true;
    }
  }
  uploadDocument() {
    if (this.authenticated.isAuthenticatedUser()) {
      this.router.navigate(['/upload'], { queryParams: { origin: 'home' } })
        .then(nav => {
          if (nav) {
            // console.log('Navigation successful');
          } else {
            //console.error('Navigation failed');
          }
        });
      // If authenticated, navigate to the search route
      //this.router.navigate(['/document-upload']);
    } else {
      this.displayLogin = true;

    }
  }


  logOut() {
    this.authenticated.logout();
    this.router.navigate(['']);
    this.msg = 'Logout Successfully';
    this.showMessage(this.msg);
  }
  gotoLogin() {
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
    this.isFileInfOpen=false;

  }
  toggleFileInfo(event: Event) {
    event.stopPropagation(); // Prevent event bubbling
    this.isFileInfOpen = !this.isFileInfOpen;
    this.isOptionContainerOpen=false;
    this.isSidebarOpen=false;
  }
  toggleOptionContainer(event: Event) {
    event.stopPropagation(); // Prevent event propagation to document
    this.isOptionContainerOpen = !this.isOptionContainerOpen;
    this.isFileInfOpen=false;
    this.isSidebarOpen=false;
    
  }
  toggleShare(event: Event) {
    event.stopPropagation(); // Prevent event bubbling
    this.isOpenShareContainer = !this.isOpenShareContainer;
    this.isFileInfOpen=false;
    this.isSidebarOpen=false;
    this.isOptionContainerOpen=false;
  }
  closeShareOption() {
    this.isOpenShareContainer = false;
  

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
    const fileInfo = this.elementRef.nativeElement.querySelector('.file_info_container');
    const toggleButton = this.elementRef.nativeElement.querySelector('.h-menu-bars-container');
    const optionContainer = this.elementRef.nativeElement.querySelector('.h-option-container');
    const searchToggleButton = this.elementRef.nativeElement.querySelector('.h-search-bar-icon-container');
    const searchBarCOntainer = this.elementRef.nativeElement.querySelector('.h-site-search-container');
    const fileInfoToggleButton = this.elementRef.nativeElement.querySelector('.file_info_button');


    if (sidebar && !sidebar.contains(event.target) && toggleButton !== event.target) {
      this.isSidebarOpen = false;
    }
    if (fileInfo && !fileInfo.contains(event.target) && fileInfoToggleButton !== event.target) {
      this.isFileInfOpen = false;
    }
    if (optionContainer && !optionContainer.contains(event.target)) {
      this.isOptionContainerOpen = false;
    }

    if (searchBarCOntainer && !searchBarCOntainer.contains(event.target) && searchToggleButton !== event.target) {
      this.isSearchBarOpen = false;
    }

  }

  showMessage(msg: any) {
    this.errorHandlerService.setError(msg);
  }
  performSearch(): void {
    if (this.searchQuery && this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }



  fetchNumberOfFiles(): void {
    this.fetchFileReviewsService.getNumberOfFilesForUser(this.userId).subscribe(
      (data: any) => {
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

  fetchBookmark(user_id: string) {
    if (user_id) {
      this.bookmarkService.getBookMarked(user_id)
        .subscribe((data) => {
          //  console.log("bookmarked data",data)
          //  this.bookMarkedList = data;

          if (data) {

            this.bookMarkedList = data;
            if (this.bookMarkedList.length > 0) {
              this.isBookmarkAdded = true;

            }

          }
          else {
            this.isBookmarkAdded = false;
          }



        });
    }
    else {

    }
  }


  zoomIn(): void {
    this.zoom += 0.1; // Increase the zoom level by 0.1
  }

  zoomOut(): void {
    if (this.zoom > 0.1) {
      this.zoom -= 0.1; // Decrease the zoom level by 0.1
    }
  }
  currentPage = 1; // Initial page number
  totalPages = 0; // Total pages in the PDF document

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1; // Increment the current page
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage -= 1; // Decrement the current page
    }
  }

  onPageRendered(): void {
    // Logic to handle page rendered event
  }

  onPdfLoadComplete(pdf: any): void {
    // Get total number of pages when PDF is loaded
    this.totalPages = pdf.numPages;
  }

  fetchFileDetails(file_key: string): void {
    if (file_key) {
      this.viewService.fetchFileOpenDetails(file_key)
        .subscribe(
          (data) => {
            // console.log("fileData:",data)
            if (data.fileData && data.fileData.length !== 0) {
              this.fileDetails = data.fileData;
              this.handleFileType(this.fileDetails[0].file_url); // Assuming fileDetails is an array
              // // console.log(this.fileDetails)
              this.views = this.formatViewCount(this.fileDetails[0].view_count);
              this.likes = this.formatViewCount(this.fileDetails[0].like_count);
              this.fetchUserUploadbyDetails(this.fileDetails[0].user_id);
              this.countFollowerAndFollowing(this.fileDetails[0].user_id);
              this.fUserId = this.fileDetails[0].user_id;
              if (this.userId === this.fUserId) {
                this.followButton = false;
              }
              this.title = this.fileDetails[0].file_title;
              this.metaDescription = this.fileDetails[0].file_description;
              this.metaImage_url = this.fileDetails[0].thumnail_url;
              // console.log("title:",this.title)
              // this.titleService.setTitle(this.title);
              setTimeout(() => {
                this.isLoadingReviews = false;

              }, 1000);
              this.checkIfUserIsFollowed();
      
            }
            else {
              setTimeout(() => {
                this.isLoadingReviews = false;
                this.showFileNotFoundMessage = true;
              }, 1000);
              // console.log('No file details found');
            }

            if (data && data.relatedFiles) {
              this.fetchRelatedFileDetails = data.relatedFiles;
              // console.log("Related files:",this.fetchRelatedFileDetails)
            }
            if (data && data.file_count) {
              this.fileCount = this.formatViewCount(data.file_count);
            }

          }
        );
    } else {
      // Handle case when user_id is not available
    }
  }
  fetchUserUploadbyDetails(user_id: string): void {
    if (user_id) {
      const apiUrl = 'http://localhost/tutdocs/auth/fetch_user_data_with_userId.php';
      this.http.post<any>(apiUrl, { user_id }).subscribe(
        (response: any) => {
          if (response.exists === true) {
            this.uploaded_userData = response.userData;
            // console.log('UserData', this.uploaded_userData);
          } else {
            // console.log(response);
          }
        },
        (error: any) => {
          // console.error('Error', error);
        }
      );
    } else {
      // console.error('User Not Signed In !');
    }

  }



  handleFileType(fileURL: string) {
    // console.log(fileURL)
    const extension = this.getFileExtension(fileURL);
    if (extension === 'pdf') {
      this.fileType = 'pdf';
      // this.pdfData = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
      const url = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL,
        this.sanitizer.bypassSecurityTrustResourceUrl(fileURL));
      this.pdfData = url;

    } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
      this.fileType = 'image';
      this.safeFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
    }
    else if (['doc', 'docx'].includes(extension)) {
      this.fileType = 'doc';
      const url = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL,
        this.sanitizer.bypassSecurityTrustResourceUrl(fileURL));
      this.docUrl = url;

    } else {
      // console.error('Unsupported file type:', extension);
    }
  }



  getFileExtension(fileURL: string): string {
    return fileURL.split('.').pop()?.toLowerCase() || '';
  }
  showUserProfile(userID: string) {
    this.router.navigate(['/profile/' + userID]);
    // this.closeSidebar();
  }
  downloadFile(fileUrl: string, fileName: string): void {
    if (this.isAuthenticated) {
      const file_name = 'tutdocs_' + fileName;

      this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = file_name;

        // Set the type based on file extension
        const fileExtension = file_name.toLowerCase().split('.').pop();
        if (fileExtension === 'docx') {
          a.type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        } else if (fileExtension === 'doc') {
          a.type = 'application/msword';
        }

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this.downloadCounter();
        setTimeout(() => {
          const msg = "Downloaded!";
          this.showMessage(msg);

        }, 1000);
      }, error => {
        // console.error('Error downloading file:', error);
        // Handle error if needed
      });
    }
    else {
      this.displayLogin = true;

    }
  }
  downloadCounter() {
    if (this.fileKey) {
      this.viewService.updateDownload(this.fileKey)
        .subscribe(
          (response) => {
            if (response) {
              // console.log(response);
            }
          }
        );
    } else {
      // Handle case when user_id is not available
    }

  }
  viewDocument(fileKey: string): void {
    const document = fileKey;
    this.router.navigate(['/view'], { queryParams: { document } });
  }


  updateView(fileKey: string): void {
    if (fileKey) {
      this.viewService.updateFileView(fileKey)
        .subscribe(
          (response) => {
            if (response) {
              // console.log(response);
            }
          }
        );
    } else {
      // Handle case when user_id is not available
    }
  }

  toggleLike(userId: string, fileKey: string, file_title: string): void {
    if (this.isAuthenticated) {

      this.viewService.likeUnlike(userId, fileKey).subscribe(
        response => {
          // console.log(response)
          this.isLiked = !this.isLiked;
          this.showMessage(response.message);
          this.fetchFileDetails(this.fileKey);
          if (response.message === "Liked") {
            this.sendNotification(this.uploaded_userData.user_id, file_title);
          }

        },
        error => {
          // console.error('Error:', error);
        }
      );


    }
    else {
      this.displayLogin = true;

    }
  }
  sendNotification(user_id: string, file_title: string) {
    if (user_id && this.userId !== user_id) {
      const name = this.userData.name;
      const profile = this.userData.profile_picture;
      const url = '/view?document=' + this.fileKey;
      this.noficationsService.sendNotifications(user_id, name, profile, url, file_title, this.time)
        .subscribe((response: any) => {
          // console.log(response)

        });
    }
  }
  checkIfUserIsLiked(): void {
    this.viewService.checkIfIsLiked(this.userId, this.fileKey)
      .subscribe((response: any) => {
        if (response && response.isLiked) {
          this.isLiked = true;
          // console.log(response);
        } else {
          this.isLiked = false;
          // console.log(response);
        }

      });
  }
  addToUserViewedList() {
    if (this.isAuthenticated) {
      this.viewService.addViewedList(this.userId, this.fileKey)
        .subscribe((response: any) => {
          if (response && response.success) {
            // console.log(response);

          } else {

            // console.log(response);
          }

        });
    }
    else {
      // this.displayLogin = true;


    }
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

  toggleBookmark(): void {
    if (this.isAuthenticated = this.authenticated.isAuthenticatedUser()
    ) {
      if (this.fileKey) {
        if (this.isBookMarked) {
          this.removeBookMark(this.fileKey);
        } else {
          this.addBookMark(this.fileKey);
        }
      }
    }
    else {
      this.displayLogin = true;

    }
  }
  checkIsBookMarked() {
    if (this.fileKey && this.userId) {
      this.bookmarkService.checkBookMark(this.userId, this.fileKey).subscribe(
        response => {
          this.isBookMarked = response.isBookmarked;
        },
        error => {
          // console.error('Error checking bookmark status:', error);
        }
      );
    }
  }

  addBookMark(fileKey: string): void {
    this.bookmarkService.addBookMark(this.userId, fileKey)
      .subscribe((response: any) => {
        if (response && response.success) {
          // this.updateIsBookmarkedStatus(fileKey, true); // Update isBookmarked locally
          this.isBookMarked = true;
          const msg = "Added to study list";
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
          // this.updateIsBookmarkedStatus(fileKey, false); // Update isBookmarked locally
          this.isBookMarked = false;
          const msg = "Removed  from study list";
          this.fetchDataAfterAddedOremoved.triggerUploadComplete();
          this.showMessage(msg);
        } else if (response && response.error) {
          // console.error('Failed to remove:', response.error);
        } else {
          // console.error('Unexpected response:', response);
        }
      });
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

  checkIfUserIsFollowed(): void {
    this.followUnfollowService.checkIfUserIsFollowed(this.userId, this.fUserId)
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
          this.isFollowedBy = true;
        } else {
          // console.log('Open profile user does not follow the logged-in user');
        }
      });
  }

  followOrUnfollowUser(): void {
    if (this.authenticated.isAuthenticatedUser()) {
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
    else {
      this.displayLogin = true;

    }
  }

  followUser(): void {
    this.followUnfollowService.followUser(this.userId, this.fUserId, this.time)
      .subscribe((response: any) => {
        if (response && response.success) {
          this.isFollowed = true; // Update follow status
          // console.log('User followed successfully');
          this.countFollowerAndFollowing(this.fUserId);

        } else if (response && response.error) {
          // console.error('Failed to follow user:', response.error);
        } else {
          // console.error('Unexpected response:', response);
        }
      });
  }

  unfollowUser(): void {
    this.followUnfollowService.unfollowUser(this.userId, this.fUserId)
      .subscribe((response: any) => {
        if (response && response.success) {
          this.isFollowed = false; // Update follow status
          this.countFollowerAndFollowing(this.fUserId);

        } else if (response && response.error) {
          // console.error('Failed to unfollow user:', response.error);
        } else {

          // console.error('Unexpected response:', response);
        }
      });
  }
  countFollowerAndFollowing(user_id: string): void {
    this.followUnfollowService.getFollowerFollowingCounts(user_id)
      .subscribe((data) => {
        this.followerCount = this.formatViewCount(data.follower_count);
        this.followingCount = this.formatViewCount(data.following_count);
        //console.log(this.followerCount,this.followingCount,this.followerDetails,this.followingDetails);
      });
  }
  gotoInstitutions(institute_name: string) {
    const institute = institute_name;
    this.router.navigate(['/institutions'], { queryParams: { institute } });
  }

  openCourse(course: string, code: string): void {
    const queryParams = {
      course,
      code
    };

    this.router.navigate(['/courses'], { queryParams });
  }
  fetchFollowedCourses(user_id: string): void {
    if (user_id) {
      this.bookmarkService.getFollowedCourses(user_id)
        .subscribe((data) => {
          //  console.log("FollowedCurses",data)
          //  this.bookMarkedList = data;

          if (data) {

            this.followedCoursesList = data;
            if (this.followedCoursesList.length > 0) {
              this.isFollowedCourse = true;

            } else {
              this.isFollowedCourse = false;
            }

          }
          else {
            this.isFollowedCourse = false;
          }



        });
    }
    else {

    }
  }

  fetchRecentlyViewed(user_id: string) {
    if (user_id) {
      this.bookmarkService.getRecentlyViewed(user_id)
        .subscribe((data) => {
          //  console.log("RecentlyViewed",data)
          //  this.bookMarkedList = data;

          if (data) {

            this.recentlyViewedList = data;
            if (this.recentlyViewedList.length > 0) {
              this.isRecentlyViewed = true;

            } else {
              this.isRecentlyViewed = false;
            }

          }
          else {
            this.isRecentlyViewed = false;
          }



        });
    }
    else {

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
