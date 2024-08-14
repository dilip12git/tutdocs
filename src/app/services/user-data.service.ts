// user-data.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  constructor() {}

  getUserData(): any {
    const userData = localStorage.getItem('uData');
    if (userData) {
     // console.log(userData);
      return JSON.parse(userData);
    } else {
      // Handle scenario where userData is not found in localStorage
      return null;
    }
  }
}
