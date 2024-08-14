import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FollowCourseService {
  private baseUrl = 'http://localhost/tutdocs/server-side/api/follow-courses'; // Replace with your actual backend URL
  constructor(private http: HttpClient) {}
  followCourses(user_id: string, course_name: string,course_code:string): Observable<any> {
    const requestBody = {
      user_id: user_id,
      course_name: course_name,
      course_code:course_code
    };
    return this.http.post(`${this.baseUrl}/follow-courses.php`, requestBody);
  }

  checkFollowed(user_id: string, course_name: string): Observable<any> {
    const requestBody = {
      user_id: user_id,
      course_name: course_name
    };
    return this.http.post(`${this.baseUrl}/check-followed.php`, requestBody);
  }
  unFollowed(user_id: string, course_name: string): Observable<any> {
    const requestBody = {
      user_id: user_id,
      course_name: course_name
    };
    return this.http.post(`${this.baseUrl}/unfollow-course.php`, requestBody);
  }
  // getFollowedCourses(userId: string) {
  //   const requestBody = { userId: userId };

  //   return this.http.post<any>(`${this.baseUrl}/fetch.php`, requestBody);
  // }
}
