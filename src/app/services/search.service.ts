import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = 'http://localhost/tutdocs/server-side/api/search/search.php'; // Replace with your PHP API URL
  
  constructor(private http: HttpClient) { }

  search(query: string): Observable<any[]> {
    const url = `${this.apiUrl}?query=${query}`;
    return this.http.get<any[]>(url);
  }


  searchInstitution(query: string): Observable<any[]> {
    const url = `http://localhost/tutdocs/server-side/api/search/institution-search.php?query=${query}`;
    return this.http.get<any[]>(url);
  }


  searchUser(query: string): Observable<any[]> {
    const url = `http://localhost/tutdocs/server-side/api/search/user-search.php?query=${query}`;
    return this.http.get<any[]>(url);
  }
  searchPost(query: string): Observable<any[]> {
    const url = `http://localhost/tutdocs/server-side/api/search/post-search.php?query=${query}`;
    return this.http.get<any[]>(url);
  }
}
