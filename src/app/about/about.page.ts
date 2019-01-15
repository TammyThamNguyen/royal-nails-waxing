import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-about',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss']
})
export class AboutPage {
  emailField = new FormControl({});
  pwField = new FormControl({});
  private email:string;
  private password:string;

}
