import { Component, ElementRef, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { UserDataService } from 'src/app/services/user-data.service';
import * as CryptoJS from 'crypto-js';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { faCheck,faHome,faCloudUpload,faFileAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.css']
})
export class DoneComponent implements OnInit {
  decryptedDetails: any;
  userID: string='';
  fileKey: string = '';
  isAuthenticated: boolean = false;
  userData: any;
  msg: string = '';
  fileData: any;
  isPDF: boolean = false;
  isImage: boolean = false;
  isDoc: boolean = false;
  fileType: string = ''; // Assuming this is set based on file type (pdf, image, doc)
  safeFileUrl: SafeResourceUrl | undefined;
  pdfData: any; // Set this for PDF files
  docUrl:any;
  uploadingStatus = true;
  faCheck=faCheck;
  faHome=faHome;
  faCloudUpload=faCloudUpload;
  faFile=faFileAlt;
  fName:any;
  fSize:any;
  recievedUserId:string='';
  origin:string='';
  isLoading:boolean=true;
  constructor(
    private route: ActivatedRoute,
    // private http: HttpClient,
    private authenticated: AuthenticatedService,
    private userDataService: UserDataService,
    private router: Router,
    private errorHandlerService: ErrorHandlerService,
    // private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.recievedUserId = params['data'];
      this.origin = params['origin'];
    });
    setTimeout(() => {
      this.isLoading=false;
      }, 2000);
    this.checkAuthentication();
    setTimeout(()=>{
      this.router.navigate(['/home']);
    },10000)
  }
  checkAuthentication(): void {
    this.isAuthenticated = this.authenticated.isAuthenticatedUser();
    if (this.isAuthenticated) {
      this.userData = this.userDataService.getUserData();
      if (this.userData) {
        this.userID = this.userData.user_id;
      }
      const isValidToken = this.authenticated.checkTokenValidity();
      if (!isValidToken) {
        this.router.navigate(['/home']);
        this.msg = "Invalid user, Sign in again";
        this.showMessage(this.msg);
      }
    } else {
      this.router.navigate(['/home']);
      this.msg = "Invalid user, Sign in again";
      this.showMessage(this.msg);
    }
    if (this.userID !== this.recievedUserId && this.origin !== "add-files-details") {
      this.router.navigate(['/home']);
    }
  }


  showMessage(msg: any): void {
    this.errorHandlerService.setError(msg);
  }

}
