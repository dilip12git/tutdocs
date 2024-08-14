import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { faEllipsisV,faTrash,faCheck} from '@fortawesome/free-solid-svg-icons';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { FetchbookmarkafterAddedorRemovedService } from 'src/app/services/fetchbookmarkafter-addedor-removed.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  faCheck=faCheck;
  isAuthenticated: boolean = false;
  userId: string = ''
  notifications:any[]=[];
  url:any;
  userTimezone:string=''
  time:any;
  faTrash=faTrash;
  faEllipsisV=faEllipsisV;
  totalNotifications:string='0';
  shownotification:boolean=true;
  isLoading:boolean=true;
  repeatCount = 5;
  repeatArray = Array(this.repeatCount).fill(0);
  showRemoveOption = false;
  showRemoveOptionId: string | null = null;

  constructor(
    private noficationsService: NotificationsService,
    private authenticated: AuthenticatedService,
    private userDataService: UserDataService,
    private router:Router,
    private errorHandlerService: ErrorHandlerService,
    private fetchDataAfterAddedOremoved: FetchbookmarkafterAddedorRemovedService,

  ) {

   
   }
  ngOnInit(): void {
    this.isAuthenticated = this.authenticated.isAuthenticatedUser();
    if (this.isAuthenticated) {
      this.userId = this.userDataService.getUserData().user_id;
      this.fetchNotifications(this.userId);
    }
    else{
      this.isLoading = false;
      this.shownotification = false;
      
    
    }
  }
  fetchNotifications(userId: string) {
    if (userId) {
    
  
    this.noficationsService.getNotifications(userId).subscribe(
      (response: any) => {
        if (response && response.success) {
          this.notifications = response.notifications;
          this.totalNotifications = response.totalNotifications;
            setTimeout(() => {
              this.isLoading = false;
            }, 1000);
        }
        else{
          this.isLoading = false;
          this.shownotification = false;
        }
      },
      (error) => {
        console.error('Error fetching notifications:', error);
        // Handle error if needed
      }
    );
    }
   
  }
  
  open(url: string, title: string,notification_id:any) {
    this.updateStatus(notification_id);
    // console.log(notification_id)
    if (title === "New Follower") {
        this.router.navigate([url]);
    } else {
        const parts = url.split('=');
        if (parts.length >= 2) {
            const fileKey = parts[1];
            const document = fileKey;
            // console.log(fileKey);
            this.router.navigate(['view'], { queryParams: { document } });
        }
      }
}
markAsRead(notification_id: any) {
  this.updateStatus(notification_id);
  }
updateStatus(notification_id:any):void{
  if(notification_id){
    this.noficationsService.updateNotificationStatus(notification_id).subscribe(
      (reponse: any) => {
        // console.log(reponse);

        if(reponse && reponse.success){
          // console.log(reponse);
          this.fetchNotifications(this.userId);
          this.fetchDataAfterAddedOremoved.triggerUploadComplete();

        }
      });
    

  }
}


showOption(id: string) {
  this.showRemoveOptionId = this.showRemoveOptionId === id ? null : id;
  setTimeout(() => {
    this.showRemoveOptionId=null;
  }, 3000);
}
deleteNotification(id:any,userId:string):void{
  if(id  && userId){
    this.noficationsService.deleteNotifications(id,userId).subscribe(
      (reponse: any) => {
        if(reponse && reponse.success){
          this.fetchNotifications(this.userId);
          const msg="Removed successfully !";
          this.showMessage(msg);
          this.fetchDataAfterAddedOremoved.triggerUploadComplete();
        }
      });
    

  }
}
getTimeElapsed(timestamp: string): string {
  const now = new Date();
  const createdAt = new Date(timestamp);
  const difference = Math.abs(now.getTime() - createdAt.getTime());
  const minutes = Math.floor(difference / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years >= 1) {
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } else if (months >= 1) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (weeks >= 1) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (days >= 1) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours >= 1) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
}
showMessage(msg:any){
  this.errorHandlerService.setError(msg);
}

}
