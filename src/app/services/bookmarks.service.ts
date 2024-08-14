import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  private baseUrl = 'http://localhost/tutdocs/bookmark'; // Replace with your actual backend URL
  private recentViewedUrl = 'http://localhost/tutdocs/users-files/reviews';
  private coursesApi='http://localhost/tutdocs/server-side/api/follow-courses';

  constructor(private http: HttpClient) {}
  addBookMark(user_id: string, filKey: string): Observable<any> {
    const requestBody = {
      user_id: user_id,
      fileKey: filKey
    };
    return this.http.post(`${this.baseUrl}/add.php`, requestBody);
  }

  checkBookMark(user_id: string, fileKey: string): Observable<any> {
    const requestBody = {
      user_id: user_id,
      fileKey: fileKey
    };
    return this.http.post(`${this.baseUrl}/check.php`, requestBody);
  }
  removeBookMark(user_id: string, file_key: string): Observable<any> {
    const requestBody = {
      user_id: user_id,
      fileKey: file_key
    };
    return this.http.post(`${this.baseUrl}/remove.php`, requestBody);
  }
  getBookMarked(userId: string) {
    const requestBody = { userId: userId };

    return this.http.post<any>(`${this.baseUrl}/fetch.php`, requestBody);
  }

  getRecentlyViewed(userId: string) {
    const requestBody = { userId: userId };

    return this.http.post<any>(`${this.recentViewedUrl}/fetch_recently_viewed.php`, requestBody);
  }
  getFollowedCourses(userId: string) {
    const requestBody = { userId: userId };

    return this.http.post<any>(`${this.coursesApi}/fetch-courses.php`, requestBody);
  }
}
