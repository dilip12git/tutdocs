import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog,MatDialogRef  } from '@angular/material/dialog';
import { RecievedCourseDataService } from 'src/app/services/recieved-course-data.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { faMailForward } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-courses',
  templateUrl: './add-courses.component.html',
  styleUrls: ['./add-courses.component.css']
})
export class AddCoursesComponent {
  @Output() closeDialog: EventEmitter<any> = new EventEmitter<any>(); // Add this line
  userID:any;
  userData:any;
  courseName:string='';
  courseCode:string='';
  errorMsg:string='';
  faMailForward=faMailForward;
  uploadingData = false;

constructor(    private dialog: MatDialog,
  private http:HttpClient,
  private userDataService:UserDataService,
  private recievedCourseDataService:RecievedCourseDataService,
  private dialogRef: MatDialogRef<AddCoursesComponent>
  ) {
  
}

ngOnInit() {
  this.userData = this.userDataService.getUserData();
  this.userID=this.userData.user_id;
  // console.log(this.userID);

}

submitForm() {
  
  if (
    !this.courseName ||
    !this.courseCode 
  ) {
    this.errorMsg = 'Please fill in all required fields.';
    return; // Prevent form submission if any field is empty
  }
  this.uploadingData = true;
  const formData = {
    courseName: this.courseName,
    courseCode: this.courseCode,
    userID: this.userID
  };
    // Send data to your backend API
    this.http.post<any>('http://localhost/tutdocs/server-side/api/add-course.php', formData)
      .subscribe(response => {
        // console.log('Course added:', response);
        this.uploadingData = false;
    
        // Use this.courseName and this.courseCode from the component properties
        this.recievedCourseDataService.setCourseData({
          courseName: this.courseName,
          courseCode: this.courseCode
        });
    
        this.dialogRef.close();
        this.closeDialog.emit();
      }, error => {
        // console.error('Error adding course:', error);
        // Handle error
      });
  }
}