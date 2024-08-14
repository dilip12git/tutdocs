import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {


currentYear: number;

constructor() {
  // Create a new Date instance and get the current year
  this.currentYear = new Date().getFullYear();
}

}
