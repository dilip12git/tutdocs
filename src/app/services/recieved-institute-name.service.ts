import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecievedInstituteNameService {

  private institutionNameSubject = new BehaviorSubject<string>('');
  addedInstitutionName$ = this.institutionNameSubject.asObservable();

  constructor() {}

  setInstitutionName(institution_name: string) {
    this.institutionNameSubject.next(institution_name);
}
}