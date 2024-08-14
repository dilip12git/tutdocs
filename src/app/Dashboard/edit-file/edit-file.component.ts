import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { faEdit,faFolder } from '@fortawesome/free-solid-svg-icons';
import { FetchDocument } from 'src/app/services/fetch-document.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';


@Component({
  selector: 'app-edit-file',
  templateUrl: './edit-file.component.html',
  styleUrls: ['./edit-file.component.css']
})
export class EditFileComponent implements OnInit{
  faFileEdit=faEdit;
  faFolder=faFolder;
  isUpdating:boolean=false;
  isAuthenticated: boolean = false;
  userData:any;
  userId:any;
  fileKey:string='';
  fileDetails:any;
  fileName:string='';
  fileTitle:string='';
  fileSize:string='';
  uploadDate:string='';
   docType:string='';
   academicYear:string='';
   isSearching:boolean=false;
   searchCourseResults: any[] = []; // Array to store search results
  showCourseResults: boolean = false; // Flag to toggle displaying search results
  selectedCourseResult: any;
  searchCourseQuery: string = '';
  selectedCourseCode: any;
  selectedCourseName: any;
  courseCode:string='';
  courseName:string='';
  docDescription:string='';
  course:string='';
  code:string='';
  error:boolean=false;
  apiUrl:string='http://localhost/tutdocs/users-files';
constructor(
  private fileServices:FetchDocument,
  private userDataService: UserDataService,
  private authenticated: AuthenticatedService,
  private route: ActivatedRoute,
  private router:Router,
  private http: HttpClient,
  private errorHandlerService: ErrorHandlerService

){

}
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.fileKey = params['edit'];
    });
    if(this.authenticated.isAuthenticatedUser()){
      this.userData=this.userDataService.getUserData();
      this.userId=this.userData.user_id;
      this.fetchFileDetails(this.userId,this.fileKey);
      // console.log(this.docType)
    }
    else{
      this.router.navigate(['/home']);
    }

  }



fetchFileDetails(userId:any,fileKey:string):void{
  if (fileKey && userId) {
    this.fileServices.fetchDetails(fileKey,userId)
    .subscribe(
      response => {
        // console.log("Reponse!",response)
        if (response && response.success === "success") {
            this.fileDetails=response.data;
            this.fileName=this.fileDetails.file_name;
            this.fileTitle=this.fileDetails.file_title;
            this.fileSize=this.fileDetails.file_size;
            this.uploadDate=this.fileDetails.upload_date;
            this.academicYear=this.fileDetails.academic_year;
            this.docType=this.fileDetails.file_type;
            this.courseCode=this.fileDetails.course_code;
            this.courseName=this.fileDetails.course_name;
            this.docDescription=this.fileDetails.file_description;

            this.searchCourseQuery=this.courseName + "-" + this.courseCode;
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


performCourseSearch() {
  this.isSearching=true;
  if (this.searchCourseQuery.trim() !== '') {
    const apiUrl = `http://localhost/tutdocs/server-side/api/search-course.php?query=${this.searchCourseQuery}`;
    this.http.get<any[]>(apiUrl)
      .subscribe(data => {
       setTimeout(() => {
        this.isSearching=false;
       }, 500);
        // Filter results based on the search query and limit to top 5 matches
        this.searchCourseResults = data.filter(result =>
          result.course_name.toLowerCase().includes(this.searchCourseQuery.toLowerCase()) ||
          result.course_code.toLowerCase().includes(this.searchCourseQuery.toLowerCase())
        ).slice(0, 5); // Show only the first 5 matches
      }, error => {
        //console.error('Error fetching data:', error);
        //console.error('An error occurred:', error);
        // this.msg = 'Network error occurred. Please try again.'; // Set the error message
        // this.showMessage(this.msg);
        setTimeout(() => {
          this.isSearching=false;
         }, 500);

      });
  } else {
    this.searchCourseResults = [];
    setTimeout(() => {
      this.isSearching=false;
     }, 500);
  }
}
selectCourseResult(result: any) {
  this.selectedCourseResult = result;
  this.searchCourseQuery = result.course_name +  "-" + result.course_code;
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

submitForm(){
  this.isUpdating=true;
  if(this.selectedCourseName && this.selectedCourseCode){
     this.course=this.selectedCourseName;
     this.code=this.selectedCourseCode;
  }
  else{
    this.course=this.courseName;
    this.code=this.courseCode;
  }

  if (!this.fileTitle ||
    !this.course ||
    !this.code ||
    !this.docDescription ||
    !this.docType ||
    !this.academicYear

) {
  this.error = true;
  setTimeout(() => {
    this.error = false;
  }, 1000);
}
else{
  const data={
    userId:this.userId,
    fileKey:this.fileKey,
    file_title:this.fileTitle,
    course_code:this.code,
    course_name:this.course,
    file_type:this.docType,
    file_description:this.docDescription,
    academic_year:this.academicYear
  }

  this.http.post(`${this.apiUrl}/update_file.php`, data)
  .subscribe((response: any) => {
    if (response && response.success) {
      this.isUpdating=false;
      this.fetchFileDetails(this.userId,this.fileKey);
      const msg=response.success;
      this.showMessage(msg);
    }
   
  }, error => {
    // console.error(error); // Handle the error
  });


}

}

showMessage(msg: any) {
  this.errorHandlerService.setError(msg);
}
}
