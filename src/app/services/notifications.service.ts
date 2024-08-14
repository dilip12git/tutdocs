// notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notificattionApi = 'http://localhost/tutdocs/notification/fetch_notifications.php'
  private UpdateNotificationApi = 'http://localhost/tutdocs/notification/update_notifications_status.php';
  private unViewedApi = 'http://localhost/tutdocs/notification/fetch_no_of_unviewed.php';
  private deleteApi = 'http://localhost/tutdocs/notification/delete_notifications.php';
  private sendNoApi = 'http://localhost/tutdocs/notification/sendLike_notifications.php';
  constructor(private http: HttpClient) { }

  getNotifications(userId: string): Observable<any> {
    const data = {
      userId: userId
    }
    return this.http.post<any>(this.notificattionApi, data);
  }
  updateNotificationStatus(notification_id: any) {
    const data = {
      id: notification_id
    }
    return this.http.post<any>(this.UpdateNotificationApi, data);
  }
  getNoOfUnviewedNotification(userId: string): Observable<any> {
    const data = {
      userId: userId
    }
    return this.http.post<any>(this.unViewedApi, data);

  }

  deleteNotifications(id: any, userId: string): Observable<any> {
    const data = {
      id: id,
      userId: userId
    }
    return this.http.post<any>(this.deleteApi, data);
  }
  sendNotifications(userId: string,
    name: string,
    profile_picture: string,
    url: string,
    file_title:string,
    current_time: string): Observable<any> {
    const data={
      user_id:userId,
      name:name,
      profile_picture:profile_picture,
      url:url,
      file_title:file_title,
      current_time:current_time
    }

    return this.http.post<any>(this.sendNoApi, data);


  }
}
