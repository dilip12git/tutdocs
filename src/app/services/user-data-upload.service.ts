import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserDataUploadService {
  private apiUrl = 'http://localhost/tutdocs/auth/register.php'; // Replace with your PHP endpoint

  constructor(private http: HttpClient) { }

  uploadUserData(userData: any) {
    return this.http.post<any>(this.apiUrl, userData);
  }
}
