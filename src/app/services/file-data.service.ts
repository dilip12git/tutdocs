import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileDataService {
  private fileData: any = {}; // Initialize with an empty object

  constructor() { }

  setFiles(data: any): void {
    this.fileData = data;
  }

  getFiles(): any {
    return this.fileData;
  }
}
