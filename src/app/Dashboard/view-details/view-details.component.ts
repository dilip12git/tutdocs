import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { FetchDocument } from 'src/app/services/fetch-document.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { faEdit,faFolder,faCircleInfo,faFileAlt, faMailForward } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.css']
})
export class ViewDetailsComponent implements OnInit{
  faFileEdit=faEdit;
  faFolder=faFolder;
  faInfo=faCircleInfo;
  faFileAlt=faFileAlt;
  faMailForward=faMailForward;
  isAuthenticated: boolean = false;
  userData:any;
  userId:any;
  fileKey:string='';
  fileDetails:any;
  constructor(
    private fileServices:FetchDocument,
    private userDataService: UserDataService,
    private authenticated: AuthenticatedService,
    private route: ActivatedRoute,
    private router:Router,
    private http: HttpClient,

  
  ){
  
  }
    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.fileKey = params['detail'];
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
          // console.log("Details",response)
          if (response && response.success === "success") {
              this.fileDetails=response.data;
            
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
  viewDocument(fileKey: string): void {
    const document=fileKey;
    this.router.navigate(['/view'], { queryParams: { document } });
  }
  editFile(file_key:string){
    const edit=file_key;
    this.router.navigate(['/edit'], { queryParams: { edit } });
  }
}
