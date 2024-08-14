import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchDocument {
  private apiUrl = 'http://localhost/tutdocs/server-side/api/fetch_all_files_details.php'; // Replace this URL with your PHP endpoint
  private courseApi='http://localhost/tutdocs/users-files/fetch_popular_course.php';
  private instituteApi='http://localhost/tutdocs/users-files/fetch_popular_courses_of_institute.php';
  private instituteReviewsApi='http://localhost/tutdocs/users-files/reviews/fetch_institute_review.php';
  // private fetchFileDetailsApi='http://localhost/tutdocs/users-files/fetch_fileDetails_by_file_key.php';
  constructor(private http: HttpClient) {}
  fetchInstitutions(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  getCourseDetails(): Observable<any> {
    return this.http.get(`${this.courseApi}`);
  }
  getInstituteCourseDetails(institute_name: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { institute_name };
  
    return this.http.post(`${this.instituteApi}`, body, { headers });
  }
  getInstituteReviews(institute_name: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { institute_name };
  
    return this.http.post(`${this.instituteReviewsApi}`, body, { headers });
  }
  fetchDetails(fileKey: string,userId: string) {
    const Data = {
      fileKey: fileKey,
      userId: userId
    };
    return this.http.post<any>('http://localhost/tutdocs/users-files/fetch_fileDetails_by_file_key.php', Data );
  }

}
