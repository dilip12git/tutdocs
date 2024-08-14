import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedService {
  private readonly STORAGE_KEY = 'userData';
  private readonly EXPIRATION_KEY = 'tokenExpiration';

  constructor() {}

  setAuthenticated(status: boolean) {
    // Set authenticated status in localStorage
    localStorage.setItem(this.STORAGE_KEY, status ? 'true' : 'false');
  }

  isAuthenticatedUser(): boolean {
    // Check authenticated status from localStorage
    const storedStatus = localStorage.getItem(this.STORAGE_KEY);
    return storedStatus ? storedStatus === 'true' : false;
  }

  checkTokenValidity(): boolean {
    const userId = localStorage.getItem(this.STORAGE_KEY);
    const tokenExpiration = localStorage.getItem(this.EXPIRATION_KEY);

    if (userId && tokenExpiration) {
      const expirationTime = parseInt(tokenExpiration, 10);
      const currentTime = new Date().getTime();

      if (currentTime < expirationTime) {
        return true; // Token is valid
      } else {
        this.clearAuthData(); // Token expired, clear authentication data
        return false;
      }
    } else {
      this.clearAuthData(); // Token or expiration not found, clear authentication data
      return false;
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.EXPIRATION_KEY);
  }
  logout(){
    this.clearAuthData();
    
    
  }


  // setToken(token: string, expirationTime: number): void {
  //   // Store token and its expiration time in localStorage
  //   localStorage.setItem(this.STORAGE_KEY, token);
  //   localStorage.setItem(this.EXPIRATION_KEY, expirationTime.toString());
  // }
}
