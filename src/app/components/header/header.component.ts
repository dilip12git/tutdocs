import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faHome, faUniversity, faSchool, faFile,faListCheck,faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { AuthGoogleService } from 'src/app/services/auth-google.service';
import { MatDialog } from '@angular/material/dialog';
// import { PopupSignComponent } from 'src/app/popup_sign/popup_sign.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  home = faHome;
  univ = faUniversity;
  faListCheck=faListCheck;
  faCloudUpload=faCloudUpload;
  school = faSchool;
  docs = faFile;

  scrollDown: boolean = false;
  lastScrollTop = 0;
  constructor(
 
    ) { }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > this.lastScrollTop && currentScroll > 50) {
      // Scrolling down and past a certain threshold (50px in this case)
      this.scrollDown = true;
    } else {
      // Scrolling up or close to the top
      if (currentScroll === 0) {
        // Reached the top of the page, remove background color
        this.scrollDown = false;
      }
    }
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }


}