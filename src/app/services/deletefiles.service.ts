import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileDeleteService {

  constructor(private http: HttpClient) { }

  deleteFileAndData(fileUrl: string, fileKey: string,fileThumnails_url:string, userId: string) {
    const deleteData = {
      file_url: fileUrl,
      fileKey: fileKey,
      fileThumnails_url:fileThumnails_url,
      userId: userId
    };

    return this.http.post<any>('http://localhost/tutdocs/users-files/delete_files.php', deleteData );
  }
}
