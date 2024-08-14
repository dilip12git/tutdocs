import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faSchool,faSearch } from '@fortawesome/free-solid-svg-icons';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { InstitutionService } from 'src/app/services/institution.service';
@Component({
  selector: 'app-high-school',
  templateUrl: './high-school.component.html',
  styleUrls: ['./high-school.component.css']
})
export class HighSchoolComponent {

  faSchool=faSchool;
  faSearch=faSearch;
  searchQuery: string = '';
  searchResults: any[] = [];
  selectedResult: any = null;
  isSearching:boolean=false;
  institutions: any[] = [];
  isLoading:boolean=true;
  repeatCount = 10;
  repeatArray = Array(this.repeatCount).fill(0);
  constructor(
    private router: Router,
    // private route: ActivatedRoute,
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private institutionService: InstitutionService,

  ) {
  }
  ngOnInit(): void {
   this.getInstitutions();
  }


  getInstitutions(): void {
    this.institutionService.fetchSchool()
      .subscribe(
        (data: any) => {
          
          if(data){
            this.institutions = data;
            // console.log("Institute data:",this.institutions)
            setTimeout(() => {
              this.isLoading = false;
              }, 1000);
           
          }
         else{
          setTimeout(() => {
            this.isLoading = false;
            }, 1000);

     
         }
        },
        (error: any) => {
          setTimeout(() => {
            this.isLoading = false;
            }, 1000);

     
        }
      );
  }



  performSearch() {
    this.isSearching=true;
    if (this.searchQuery.trim() !== '') {
      const apiUrl = `http://localhost/tutdocs/server-side/api/search-institutions/index.php?query=${this.searchQuery}`;
      this.http.get<any[]>(apiUrl)
        .subscribe(data => {
          setTimeout(() => {
            this.isSearching=false;
           }, 500);
          // Filter results based on the search query and limit to top 5 matches
          this.searchResults = data.filter(result =>
            result.institution_name.toLowerCase().includes(this.searchQuery.toLowerCase())
          ).slice(0, 5); // Show only the first 5 matches
        }, error => {
          //console.error('Error fetching data:', error);
          const msg='Error fetching data';
          this.showMessage(msg);
          setTimeout(() => {
            this.isSearching=false;
           }, 500);

        });
    } else {
      this.searchResults = []; // Clear search results if query is empty
      setTimeout(() => {
        this.isSearching=false;
       }, 500);
    }
  }
  selectResult(result: any) {
    this.selectedResult = result; // Set the selected result
    this.searchQuery = result.institution_name; // Assign the selected result to the input field
    this.searchResults = [];
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.searchResults.length == 0) {
      return; 
    }
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.search-results')) {
      this.searchResults = [];
    }
  }
  gotoInstitutions(institute_name:string) {
    const institute=institute_name;
    this.router.navigate(['/institutions'], { queryParams: { institute } });
    }
    
  showMessage(msg:any){
    // this.errorMsg = "Please fill the all required fileds";
    this.errorHandlerService.setError(msg);
  }
}


