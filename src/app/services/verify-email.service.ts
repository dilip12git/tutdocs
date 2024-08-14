import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailVerificationService {
  private backendUrl = 'http://localhost/tutdocs/auth'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  sendVerificationLink(userData: any): Observable<any> {
    console.log("from service userData:",userData)
    return this.http.post<any>(`${this.backendUrl}/send_email_verification_link.php`, userData);
  }

  verifyEmail(token: string): Observable<any> {
    console.log("from service token:", token);
    const data = { token }; // Creating an object with key 'token' and its value
    return this.http.post<any>(`${this.backendUrl}/verify_email.php`, data);
  }
  
  deleteTokenAndUserData(username: string): Observable<any> {
    const data={username};
    return this.http.post<any>(`${this.backendUrl}/delete_verified_email.php`, data);
  }

}
