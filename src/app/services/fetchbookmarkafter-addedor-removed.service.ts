import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FetchbookmarkafterAddedorRemovedService {

  constructor() { }
  private uploadCompleteSource = new Subject<void>();
  uploadComplete$ = this.uploadCompleteSource.asObservable();

  triggerUploadComplete() {
    this.uploadCompleteSource.next();
  }
}
