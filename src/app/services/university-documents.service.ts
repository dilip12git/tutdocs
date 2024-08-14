import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UniversityDocumentsService {

  private apiUrl = 'http://localhost/tutdocs/server-side/api/university/most_popular_documents.php';
  private RecentapiUrl = 'http://localhost/tutdocs/server-side/api/university/recent_documents.php';
  private CourseapiUrl = 'http://localhost/tutdocs/server-side/api/university/courses_documents.php';

  constructor(private http: HttpClient) {}

  fetchMostPopularDocuments(instituteName: string): Observable<any> {
    const data = { institute_name: instituteName };
    return this.http.post(this.apiUrl, data);
  }

  fetchRecentDocuments(instituteName: string): Observable<any> {
    const data = { institute_name: instituteName };
    return this.http.post(this.RecentapiUrl, data);
  }
  fetchCourseDocuments(CourseName: string): Observable<any> {
    const data = { course_name: CourseName };
    return this.http.post(this.CourseapiUrl, data);
  }
}
