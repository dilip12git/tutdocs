import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    private router:Router ,
    private authenticated:AuthenticatedService,

    ) { }


  ngOnInit() {
    this.checkAuthentication();
    
  }

  checkAuthentication(): void {
    if (this.authenticated.isAuthenticatedUser()) {
      this.router.navigate(['home']);
    }
  }
 
}
