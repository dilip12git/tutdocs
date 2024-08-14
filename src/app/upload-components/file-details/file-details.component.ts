import { HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { faAdd, faFileAlt, faCheck, faUniversity, faFolder, faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import * as CryptoJS from 'crypto-js';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { FileDataService } from 'src/app/services/file-data.service';
import { RecievedCourseDataService } from 'src/app/services/recieved-course-data.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { AddCoursesComponent } from 'src/app/upload-components/add-courses/add-courses.component'
@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.css']
})
export class FileDetailsComponent implements OnInit {
  faCloudUpload = faCloudUpload;
  faAdd = faAdd;
  faFile = faFileAlt;
  faCheck = faCheck;
  faUniversity = faUniversity;
  faFolder = faFolder;

  fileDetails: any;
  searchResults: any[] = [];
  selectedResult: any = null;
  userInstitute_name: string = '';
  searchCourseQuery: string = '';
  selectedOption: string = '';
  selectedAcademicYear: string = '';

  searchCourseResults: any[] = []; // Array to store search results
  showCourseResults: boolean = false; // Flag to toggle displaying search results
  selectedCourseResult: any;
  receivedCourseName: string = '';
  fileName: string = '';
  fileSize: string = '';
  fileDescription: string = '';
  errorMsg: string = '';
  // uploadingData: false | undefined;
  courseName: string = '';
  courseCode: string = '';
  userID: any;
  selectedCourseCode: any;
  selectedCourseName: any;
  msg: string = '';
  recievedCourseName: any;
  recievedCourseCode: any;
  fileTtile: string = '';

  userId: string = '';
  isAuthenticated: boolean = false;
  userData: any;
  uploadingDataStatus = false;
  userName: string = '';
  files: File[] = [];
  receivedUserId: string = '';
  receivedFileKey: string = '';
  // : any[] = []; // Update the type as needed
  receivedFiles: File[] = []; // Change the type to File[]
  uploadProgress = 0;
  isSearching: boolean = false;
  selectedRadioOption: string = '';
  userProfile: string = '';
  generatingStatus: boolean = false;
  time: any;
  // uploadedFiles: { name: string, size: string, fileObject: File }[] = [];
  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private authenticated: AuthenticatedService,
    private userDataService: UserDataService,
    private router: Router,
    private dialog: MatDialog,
    private fileDataService: FileDataService,
    private recievedCourseDataService: RecievedCourseDataService,
    private cdr: ChangeDetectorRef,
    private errorHandlerService: ErrorHandlerService) {

    this.time = new Date();
    // console.log('Current Date and Time:', this.time);
  }

  ngOnInit() {
    this.checkAuthentication();
    const fileData = this.fileDataService.getFiles();
    // console.log('File Data:', fileData); // Check the retrieved data in console

    if (fileData) {
      this.receivedUserId = fileData.userId;
      this.receivedFileKey = fileData.fileKey;
      this.receivedFiles = fileData.files;
      this.fileName = fileData.fileName;
      this.fileSize = fileData.fileSize;

    } else {
      // console.log('No data received from the service.');
    }

    if (!this.receivedUserId && this.userID !== this.receivedUserId) {
      this.router.navigate(['/upload']);

    }
    // this.receivedUserId=fileData.

    this.recievedCourseDataService.addedCourseData$.subscribe(data => {
      this.searchCourseQuery = data.courseName;
      this.receivedCourseName = data.courseName;
      this.recievedCourseCode = data.courseCode;
    });
    // console.log(this.selectedAcademicYear);

  }

  checkAuthentication(): void {
    this.isAuthenticated = this.authenticated.isAuthenticatedUser();

    if (this.isAuthenticated) {
      this.userData = this.userDataService.getUserData();
      if (this.userData) {
        // console.log("User data", this.userData);
        this.userID = this.userData.user_id;
        this.userName = this.userData.name;
        this.userInstitute_name = this.userData.study_at;
        this.userProfile = this.userData.profile_picture;
        // console.log("profile",this.userProfile)

      } else {
        // console.log("userData not found");
      }
      const isValidToken = this.authenticated.checkTokenValidity();
      if (!isValidToken) {
        this.router.navigate(['/home']);
      }
    } else {
      this.router.navigate(['/home']);
    }
  }
  // Variable to store the selected option

  onOptionChange(event: any): void {
    this.selectedRadioOption = event.target.value;
    // console.log('Selected option:', this.selectedRadioOption);

  }
  performCourseSearch() {
    this.isSearching = true;
    if (this.searchCourseQuery.trim() !== '') {
      const apiUrl = `http://localhost/tutdocs/server-side/api/search-course.php?query=${this.searchCourseQuery}`;
      this.http.get<any[]>(apiUrl)
        .subscribe(data => {
          setTimeout(() => {
            this.isSearching = false;
          }, 500);
          // Filter results based on the search query and limit to top 5 matches
          this.searchCourseResults = data.filter(result =>
            result.course_name.toLowerCase().includes(this.searchCourseQuery.toLowerCase()) ||
            result.course_code.toLowerCase().includes(this.searchCourseQuery.toLowerCase())
          ).slice(0, 5); // Show only the first 5 matches
        }, error => {
          //console.error('Error fetching data:', error);
          //console.error('An error occurred:', error);
          this.msg = 'Network error occurred. Please try again.'; // Set the error message
          this.showMessage(this.msg);
          setTimeout(() => {
            this.isSearching = false;
          }, 500);

        });
    } else {
      this.searchCourseResults = [];
      setTimeout(() => {
        this.isSearching = false;
      }, 500);
    }
  }
  selectCourseResult(result: any) {
    this.selectedCourseResult = result;
    this.searchCourseQuery = result.course_name;
    // this.courseCode=result.course_code;
    this.selectedCourseName = result.course_name;
    this.selectedCourseCode = result.course_code;
    this.searchCourseResults = [];
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.searchCourseResults.length == 0) {
      return;
    }
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.search-results')) {
      this.searchCourseResults = [];
    }
  }
  addCourse(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = '350px';
    dialogConfig.minWidth = '350px';
    const dialogRef = this.dialog.open(AddCoursesComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.searchCourseResults = [];
    });
  }

  submitForm() {
    // this.uploadingData = true;
    if (this.receivedCourseName && this.recievedCourseCode) {
      this.courseName = this.receivedCourseName;
      this.courseCode = this.recievedCourseCode;
    }
    else if (this.selectedCourseName && this.selectedCourseCode) {
      this.courseName = this.selectedCourseName;
      this.courseCode = this.selectedCourseCode;
    }

    if (
      !this.courseCode ||
      !this.courseName ||
      !this.fileName ||
      !this.fileSize ||
      !this.selectedAcademicYear ||
      !this.selectedRadioOption ||
      !this.fileDescription ||
      !this.userInstitute_name
    ) {
      this.errorMsg = "Please fill in all required fileds";
      this.showMessage(this.errorMsg);
      //  console.log (this.errorMsg="Please fill the all required fileds");
    }
    else {
      // this.uploadFilesToServer(this.receivedUserId, this.receivedFileKey, this.receivedFiles);
      this.uploadFiles(
        this.receivedUserId,
        this.receivedFileKey,
        this.userName,
        this.courseCode,
        this.courseName,
        this.selectedRadioOption,
        this.selectedAcademicYear,
        this.fileDescription,
        this.userInstitute_name,
        this.fileSize,
        this.fileName,
        this.receivedFiles
      );
    }
  }
  async uploadFiles(
    userId: string,
    fileKey: string,
    uploadby: string,
    courseCode: string,
    courseName: string,
    fileType: string,
    academic_year: string,
    file_desc: string,
    institute_name: string,
    file_size: string,
    file_title: string,
    files: File[]
  ): Promise<void> {
    this.uploadingDataStatus = true;
  
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('fileKey', fileKey);
    formData.append('upload_by', uploadby);
    formData.append('courseCode', courseCode);
    formData.append('courseName', courseName);
    formData.append('fileType', fileType);
    formData.append('academic_year', academic_year);
    formData.append('institute_name', institute_name);
    formData.append('file_size', file_size);
    formData.append('file_title', file_title);
    formData.append('fileDescription', file_desc);
    files.forEach((file) => formData.append('files[]', file, file.name));
  
    try {
      const response: any = await this.http.post('http://localhost/tutdocs/users-files/upload_file.php', formData).toPromise();
      console.log('Response:', response); // Log the response for debugging
      this.msg = response.success ? 'Successfully uploaded !' : response.error || 'Failed to upload';
      this.uploadingDataStatus = false;
      this.cdr.detectChanges();
      if (response.success) {
        const data = response.data;
        this.generateThumbnail(data.userId, data.fileKey, data.extension, data.fileName);
        this.showMessage(this.msg);
      } else {
        this.showMessage(this.msg);
      }
    } catch (error) {
      // console.error('Error:', error);
      // this.msg = 'Failed to upload';
      this.uploadingDataStatus = false;
      this.showMessage(error);
    } finally {
      this.uploadingDataStatus = false;
      this.cdr.detectChanges();
    }
  }
  
  async generateThumbnail(userId: string, fileKey: string, file_extension: string, file_name: string): Promise<void> {
    this.generatingStatus = true;
    const data = new FormData();
    data.append('userId', userId);
    data.append('fileKey', fileKey);
    data.append('file_extension', file_extension);
    data.append('file_name', file_name);

    try {
      const response: any = await this.http.post('http://localhost/tutdocs/users-files/generateThumbnail.php', data).toPromise();
      console.log(response);
      if (response && response.success) {
        this.passDetails();
        this.sendMailToFollower(this.userID, this.userName, this.receivedFileKey, this.fileName, this.userProfile, this.time);
        this.showMessage(this.msg);
      }
      else{
        this.passDetails();
        this.sendMailToFollower(this.userID, this.userName, this.receivedFileKey, this.fileName, this.userProfile, this.time);
        this.showMessage(this.msg);
      }
    } catch (error) {
      this.showMessage(error);
      console.error('Error generating thumbnail:', error);
    } finally {
      this.generatingStatus = false;
      this.cdr.detectChanges();
    }
  }


  sendMailToFollower(userId: string, userName: string, fileKey: string, file_title: string, profle_picutre: string, current_time: any): void {
    const data = {
      userId: userId,
      upload_by: userName,
      fileKey: fileKey,
      file_title: file_title,
      profle_picutre: profle_picutre,
      current_time: current_time
    }
    this.http.post('http://localhost/tutdocs/users-files/sendMail.php', data).subscribe(
      (response: any) => {

        console.log(response)
        this.showMessage(this.msg);
     

      }
    );
  }
  passDetails() {
    const origin = 'add-files-details';
    this.router.navigate(['/done'], { queryParams: { data: this.userID, origin: origin } });
  }
  showMessage(msg: any) {
    this.errorHandlerService.setError(msg);
  }


}
