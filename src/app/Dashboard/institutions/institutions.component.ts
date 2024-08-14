import { HttpClient } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faUniversity,faSearch,faAngleRight,faEye,faFolder } from '@fortawesome/free-solid-svg-icons';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { FetchDocument } from 'src/app/services/fetch-document.service';
import { UniversityDocumentsService } from 'src/app/services/university-documents.service';

@Component({
  selector: 'app-institutions',
  templateUrl: './institutions.component.html',
  styleUrls: ['./institutions.component.css']
})
export class InstitutionsComponent {
  intitutionName:string='';
  faUniversity=faUniversity;
  faSearch=faSearch;
  faFolder=faFolder;
  faEye=faEye;
  faAngleRight=faAngleRight;
  searchCourseQuery: string = '';
  searchCourseResults: any[] = [];
  selectedCourseResult: any = null;
  selectedCourseName:string='';
  isSearching:boolean=false;
  institutions: any[] = [];
  isInstitutionLoading:boolean = true;
  popularDocsDetails: any = [];
  recentDocsDetails: any = [];
  isPopularPost:boolean=true;
  isInstitutionData:boolean=true;
  isRecentPost:boolean=true;
  courseDetails: any[] = [];
  instituteReviews:any;
  isCoursesLoading:boolean = true;
  rTotalFiles:string='';
  rTotalLikes:string='';
  rTotalViews:string='';
  rTotalDownload:string='';
  constructor(
    private route:ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private universityDocumentsService:UniversityDocumentsService,
    private errorHandlerService: ErrorHandlerService,
    private fetchDocumentService: FetchDocument
  ){}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const intitutionName = params['institute'];

      if (intitutionName) {
        // console.log("fileKey:",intitutionName)
        this.intitutionName=intitutionName
        this.popularDocuments(this.intitutionName);
        this.RecentDocuments(this.intitutionName);
        this.fetchCourse();
        this.fetchReviews();
        
      }
      
    });
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
        const msg = 'Network error occurred. Please try again.'; // Set the error message
        this.showMessage(msg);
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
  this.searchCourseQuery = result.course_name;
  // this.courseCode=result.course_code;
  this.selectedCourseName = result.course_name;
  // this.selectedCourseCode = result.course_code;
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


popularDocuments(institute_name: string): void {
  this.universityDocumentsService.fetchMostPopularDocuments(institute_name).subscribe(
    (response: any) => {
      // Handle the response data here
      // console.log(response.fileDetails);
      if(response && response.fileDetails){
        this.popularDocsDetails=response.fileDetails;
        if(this.popularDocsDetails.length>0){
           
        setTimeout(() => {
          this.isPopularPost=false;
        }, 1000);
      
          this.isInstitutionData=true;
        } else{
          this.isInstitutionData=false;
        }
      
      }
      else{
        this.isInstitutionData=false;

      }
      // ... your other logic
    },
    (error) => {
      // Handle the error here
      // console.error(error);
      this.isInstitutionData=false;
      setTimeout(() => {
        this.isPopularPost=false;
  

      }, 1000);
      // ... your other error handling logic
    }
  );
}

RecentDocuments(institute_name: string): void {
  this.universityDocumentsService.fetchRecentDocuments(institute_name).subscribe(
    (response: any) => {
      // Handle the response data here
      // console.log(response.recentFileDetails);
      if(response && response.recentFileDetails){
        this.recentDocsDetails=response.recentFileDetails;
        if(this.recentDocsDetails.length>0){
          setTimeout(() => {
            this.isRecentPost=false;
  
          }, 1000);
          this.isInstitutionData=true;
        }
        else{
          this.isInstitutionData=false;
        }
 
      }
      else{
        this.isInstitutionData=false;

      }
      // ... your other logic
    },
    (error) => {
      // Handle the error here
      // console.error(error);
      this.isInstitutionData=false;
      setTimeout(() => {
        this.isRecentPost=false;
 

      }, 1000);
    
      // ... your other error handling logic
    }
  );
}
fetchCourse():void{
  this.fetchDocumentService.getInstituteCourseDetails(this.intitutionName).subscribe(data => {
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
fetchReviews():void{
  this.fetchDocumentService.getInstituteReviews(this.intitutionName).subscribe(data => {
    if(data){
      // console.log(data)
      this.instituteReviews = data;
        this.rTotalDownload=this.instituteReviews.total_download_count;
        this.rTotalLikes=this.instituteReviews.total_like_count;
        this.rTotalViews=this.instituteReviews.total_view_count;
        this.rTotalFiles=this.instituteReviews.total_files;

      setTimeout(() => {
        this.isCoursesLoading=false;
          
        }, 1000);

    }
    else{

    }

    // console.log(this.courseDetails)
  });
}
openCourse(course: string,code: string): void {
  const queryParams = {
    course,
    code
  };

  this.router.navigate(['/courses'], { queryParams });
}

showMessage(msg:any){
  // this.errorMsg = "Please fill the all required fileds";
  this.errorHandlerService.setError(msg);
}
viewDocument(fileKey:string):void{
  const document =fileKey;
  this.router.navigate(['view'], { queryParams: { document } });
}
}
