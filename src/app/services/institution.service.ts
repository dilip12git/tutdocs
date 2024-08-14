import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {
  private apiUrl = 'http://localhost/tutdocs/server-side/api/add-institutions/fetch_institution.php'; // Replace this URL with your PHP endpoint
  private apiUrlSchool='http://localhost/tutdocs/server-side/api/add-institutions/fetch_institution_type_high_school.php';

  constructor(private http: HttpClient) {}

  fetchInstitutions(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  fetchSchool(): Observable<any> {
    return this.http.get<any>(this.apiUrlSchool);
  }
}
