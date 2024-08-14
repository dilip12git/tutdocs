import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class GenerateUserIdService {


  private currentUserId: string = '';
  generateUserID(username: string, email: string): string {
    if (username && email) {
      const cleanedUsername = username.replace(/\s/g, ''); // Remove spaces from username if needed
      const concatenatedString = `${cleanedUsername}_${email}`;
      const hashedId = CryptoJS.SHA256(concatenatedString).toString(CryptoJS.enc.Hex);
      const uniqueUserId = hashedId.substr(0, 5);
      const atSymbol="@";
      this.currentUserId = `${cleanedUsername}${atSymbol}${uniqueUserId}`;
      this.currentUserId = this.currentUserId.toLowerCase();
    } else {
      console.error('Username or email is missing.');
    }
    return this.currentUserId;
  }
  
  getUserID(): string {
    return this.currentUserId;
  }
}
