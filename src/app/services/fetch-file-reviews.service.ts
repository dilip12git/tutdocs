import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchFileReviewsService {

  private apiUrl = 'http://localhost/tutdocs/users-files/reviews/fetch_files_count.php'; // Replace with your PHP file URL

  constructor(private http: HttpClient) {}

  getNumberOfFilesForUser(userId: string): Observable<{ total_files: number }> {
    return this.http.post<{ total_files: number }>(this.apiUrl, { user_id: userId });
  }
}
