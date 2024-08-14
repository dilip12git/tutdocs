import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faFolder,faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FetchDocument } from 'src/app/services/fetch-document.service';

@Component({
  selector: 'app-all-courses',
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.css']
})
export class AllCoursesComponent implements OnInit{

  faAngleRight=faAngleRight;
  faFolder = faFolder;
  courseDetails: any[] = [];
  isCoursesLoading:boolean=true;

  constructor(
    private fetchDocumentService: FetchDocument,
    private router:Router
  ){}

  ngOnInit(): void {
    this.fetchDocumentService.getCourseDetails().subscribe(data => {
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
  openCourse(course: string,code: string): void {
    const queryParams = {
      course,
      code
    };
  
    this.router.navigate(['/courses'], { queryParams });
  }
  }


