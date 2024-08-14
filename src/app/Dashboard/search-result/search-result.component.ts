import { Component } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';
import  {faUniversity,faFileAlt,faFolder} from '@fortawesome/free-solid-svg-icons'
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent {
  faUniversity=faUniversity;
  faFileAlt=faFileAlt;
  faFolder=faFolder;
  searchQuery: string = '';
  isloadingSearch:boolean=true;
  searchResults: any[] = [];
  institutionSearchResults: any[] = [];
  userNameSearchResults: any[] = [];
  postSearchResault: any[] = [];
  selectedTab: string = 'all'; // Default selected tab
   userId:string='';
  isAuthenticated: boolean = false;
  userData:any;
  constructor(private route: ActivatedRoute,
    private router:Router,
    private errorHandlerService:ErrorHandlerService,
     private searchService: SearchService) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;

     }

  ngOnInit(): void {
    this.isloadingSearch=true;
    
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'];
      if (this.searchQuery) {
        this.performSearch();
       
      }
      
    });
}

  openTab(tabName: string): void {
    this.selectedTab = tabName;
  }
  performSearch(): void {
    //overall search
    this.searchService.search(this.searchQuery).subscribe(
      (results) => {
        this.searchResults = Array.isArray(results) ? results : [results];
       // console.log('Search Results:', this.searchResults);
     setTimeout(() => {

  this.isloadingSearch=false;
     }, 1000);
      },
      (error) => {
        // console.error('Error fetching search results:', error);
      }
    );


//user or userid search
    this.searchService.searchUser(this.searchQuery).subscribe(
      (resultsUsers) => {
        if(resultsUsers){
        this.userNameSearchResults = Array.isArray(resultsUsers) ? resultsUsers : [resultsUsers];
       // console.log('userNameSearchResults:', this.userNameSearchResults);
        }
        // Handle the search results here
      },
      (error) => {
        // console.error('Error fetching search results:', error);
      }
    );



//user institution search
    this.searchService.searchInstitution(this.searchQuery).subscribe(
      (resultsInstitute) => {
        if(resultsInstitute){
          this.institutionSearchResults = Array.isArray(resultsInstitute) ? resultsInstitute : [resultsInstitute];
       // console.log('Search Results:', this.institutionSearchResults);
     
        }
        
        // Handle the search results here
      },
      (error) => {
        // console.error('Error fetching search results:', error);
      }
    );



    this.searchService.searchPost(this.searchQuery).subscribe(
      (resultsPost) => {
        if(resultsPost){
        this.postSearchResault = Array.isArray(resultsPost) ? resultsPost : [resultsPost];
        // console.log('postSearchResault:', this.postSearchResault);
        }
        // Handle the search results here
      },
      (error) => {
        // console.error('Error fetching search results:', error);
      }
    );
  }
  openProfile(userID:string):void{
    this.router.navigate(['/profile/'+userID])
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
  gotoInstitutions(institute_name:string) {
    const institute=institute_name;
    this.router.navigate(['/institutions'], { queryParams: { institute } });
    }
}
