import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FollowUnfollowService {
  private apiUrl = 'http://localhost/tutdocs/follow'; // Replace this with your actual API URL

  constructor(private http: HttpClient) { }

  checkIfUserIsFollowed(loggedInUserId: string, userIdToCheck: string): Observable<any> {
    const requestBody = {
      loggedInUserId: loggedInUserId,
      userIdToCheck: userIdToCheck
    };
    return this.http.post(`${this.apiUrl}/check_followed.php`, requestBody);
  }

  followUser(loggedInUserId: string, userIdToFollow: string, current_time:any): Observable<any> {
    const requestBody = {
      loggedInUserId: loggedInUserId,
      userIdToFollow: userIdToFollow,
      current_time:current_time
    };
    return this.http.post(`${this.apiUrl}/follow.php`, requestBody);
  }

  unfollowUser(loggedInUserId: string, userIdToUnfollow: string): Observable<any> {
    const requestBody = {
      loggedInUserId: loggedInUserId,
      userIdToUnfollow: userIdToUnfollow
    };
    return this.http.post(`${this.apiUrl}/unfollow.php`, requestBody);
  }

  getFollowerFollowingCounts(userId: string) {
    const url = 'http://localhost/tutdocs/follow/follower_and_following_count.php';
    const postData = { userId: userId };

    return this.http.post<any>(url, postData);
  }

  getCurrentFollowerFollowing(userId: string) {
    const url = 'http://localhost/tutdocs/follow/follower_and_following_count.php';
    const postData = { userId: userId };

    return this.http.post<any>(url, postData);
  }
}
