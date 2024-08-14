import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  constructor(private http: HttpClient) { }

  fetchFileOpenDetails(fileKey: string): Observable<any> {
    const data = {
      fileKeys: fileKey
     };
    return this.http.post<any>('http://localhost/tutdocs/users-files/fetch_file_details.php', data);
  }

  // fetchRelatedFilesDetails(courseName: string): Observable<any> {
  //   const data={
  //     courseName:courseName
  //   }
  //   return this.http.post<any>('https:tutdocs.com/users-files/fetch_viewer_related_files_details.php', data);
  // }
  updateFileView(fileKey:string){
    const data = {
      fileKey: fileKey,
     };
    return this.http.post<any>('http://localhost/tutdocs/users-files/reviews/views.php', data);
  }
  updateDownload(fileKey:string){
    const data = {
      fileKey: fileKey,
     };
    return this.http.post<any>('http://localhost/tutdocs/users-files/reviews/downloads.php', data);
  }
  likeUnlike(userId: string, fileKey: string): Observable<any> {
   
    const data = {
      userId: userId,
      fileKey: fileKey,
     };
    return this.http.post<any>('http://localhost/tutdocs/users-files/reviews/like_unlike.php', data);
}
checkIfIsLiked(userId: string, fileKey: string): Observable<any> {
  const data = {
    userId: userId,
    fileKey: fileKey
  };

  return this.http.post('http://localhost/tutdocs/users-files/reviews/check_isLiked.php', data);
}
addViewedList(userId: string, fileKey: string): Observable<any> {
  const data = {
    userId: userId,
    fileKey: fileKey
  };

  return this.http.post('http://localhost/tutdocs/users-files/reviews/viewed_files.php', data);
}
}


