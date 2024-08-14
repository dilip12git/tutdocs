import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faCloudUpload, faFileAlt,faMailForward,faCheck} from '@fortawesome/free-solid-svg-icons';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { UserDataService } from 'src/app/services/user-data.service';
import * as CryptoJS from 'crypto-js';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { FileDataService } from 'src/app/services/file-data.service';
@Component({
  selector: 'app-choose-file',
  templateUrl: './choose-file.component.html',
  styleUrls: ['./choose-file.component.css']
})
export class ChooseFileComponent implements OnInit {
  faCloudUpload = faCloudUpload;
  faMailForward=faMailForward;
  faFileAlt = faFileAlt;
  faCheck=faCheck;
  sentencesToType = [
    'lecture notes',
    'mandatory assignments',
    'practice materials',
    'summaries'
    // Add more sentences as needed
  ];
  uploadingData = false;
  typedText = '';
  currentSentenceIndex = 0;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  uploadedFiles: File[] = []; // Change the type to File[]
  allowedFileTypes: string[] = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  maxSize: number = 8 * 1024 * 1024;
  userId:string=''; // Replace with your userId logic
  isAuthenticated: boolean = false;
  userData: any;
  percentDone: number = 0;
  msg:string='';
  fileKey:string='';
  userName:string='';
  fileDropRef: any;
  fileSize:string='';
  // file_id:any;

  constructor(
    private http: HttpClient,
    private authenticated: AuthenticatedService,
    private userDataService: UserDataService,
    private router: Router,
    private fileDataService:FileDataService,
    private errorHandlerService: ErrorHandlerService,

  ) { }

  ngOnInit() {
    this.checkAuthentication();
    this.typeSentences();
    
  }

  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // Add styles to indicate drag over
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // Remove styles when leaving the drop area
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length === 1) {
      this.uploadedFiles = [];
      this.handleFiles(files);
    } else {
      // Handle error message for dropping multiple files or none
      const msg="Please drag and drop only one file at a time.";
     this.showMessage(msg);
    }
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      this.uploadedFiles = [];
      this.handleFiles(inputElement.files);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  handleFiles(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = file.type;
      const fileSize = file.size;
      const fileName = file.name;

      if (this.allowedFileTypes.includes(fileType) && fileSize <= this.maxSize) {
        const formattedSize = this.formatFileSize(fileSize);
        this.fileSize=formattedSize;
        this.uploadedFiles.push(file); // Store the file object directly
        // Set uploaded files to service

         this.fileKey = this.createFileKey(this.userId, fileName,  fileSize);
        //  console.log(this.fileKey);
         const data = {
          userId: this.userId,
          fileKey: this.fileKey,
          fileName:fileName,
          fileSize:formattedSize,
          files: this.uploadedFiles // Assuming your service accepts uploadedFiles
        };
  
        this.fileDataService.setFiles(data);
       
      } else {
        const msg="Invalid file type or size";
        this.showMessage(msg);
      }
    }
  }
  navigateToComponentB(){
    this.percentDone=100;
    this.uploadingData=true;
    this.checkFileExistence(this.userId,this.fileKey);
  }
  checkFileExistence(userId: string, fileKey: string) {
    const checkData = {
      userId: userId,
      fileKeys: fileKey
    };
  
    // Make a POST request to check file existence on the PHP server
    this.http.post<any>('http://localhost/tutdocs/users-files/check_file_existence.php', checkData)
      .subscribe(
        (response) => {
          //console.log('Check File Existence Success:', response);
  
          if (response.exists) {
            // File exists, show message
            this.msg="You have already uploaded this file";
            this.showMessage(this.msg);
            this.uploadingData = false;
            this.percentDone = 0;
          } else {
            // File does not exist, navigate to another component
            this.router.navigate(['/add-files-details']);
            this.uploadingData = false;
            this.percentDone = 0;
          }
        },
        (error) => {
        //  console.error('Error occurred:', error);
          this.uploadingData = false;
          this.percentDone = 0;
  
          // Handle error cases here
        }
      );
  }
  

  formatFileSize(size: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let formattedSize = size;
    let unitIndex = 0;
    while (formattedSize >= 1024 && unitIndex < units.length - 1) {
      formattedSize /= 1024;
      unitIndex++;
    }

    return formattedSize.toFixed(2) + ' ' + units[unitIndex];
  }

  checkAuthentication(): void {
    this.isAuthenticated = this.authenticated.isAuthenticatedUser();

    if (this.isAuthenticated) {
      this.userData = this.userDataService.getUserData();
      if (this.userData) {
       // console.log("User data", this.userData);
        this.userId = this.userData.user_id;
        this.userName=this.userData.name;
        // console.log(this.userName);
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
  createFileKey(userId: string, fileName: string, size: any): string {
    const dataToHash = userId+fileName + size;
    const hashedData = CryptoJS.MD5(dataToHash).toString();
    const truncatedHashedData = hashedData.substring(0, 20); // Take the first 15 characters
    const fileKey = `t${truncatedHashedData}`;
    // console.log(fileKey)
    return fileKey;
  }
   
  typeSentences() {
    const currentSentence = this.sentencesToType[this.currentSentenceIndex];
    const textArray = currentSentence.split('');
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      this.typedText += textArray[currentIndex];
      currentIndex++;

      if (currentIndex === textArray.length) {
        clearInterval(typingInterval);
        setTimeout(() => {
          this.clearTextAndMoveToNext();
        }, 1000); // Delay before removing text (milliseconds)
      }
    }, 100); // Typing speed (milliseconds)
  }

 


  clearTextAndMoveToNext() {
    const textToRemove = this.typedText;
    let currentIndex = textToRemove.length;
    const removingInterval = setInterval(() => {
      this.typedText = textToRemove.substring(0, currentIndex);
      currentIndex--;

      if (currentIndex < 0) {
        clearInterval(removingInterval);
        setTimeout(() => {
          this.currentSentenceIndex++;

          if (this.currentSentenceIndex === this.sentencesToType.length) {
            this.currentSentenceIndex = 0; // Reset to the first sentence
          }

          this.typeSentences();
        }, 1000); // Delay before typing the next sentence (milliseconds)
      }
    }, 100); // Removing speed (milliseconds)
  }
  showMessage(msg:any){
   // this.errorMsg = "Please fill the all required fileds";
    this.errorHandlerService.setError(msg);
  }
}
