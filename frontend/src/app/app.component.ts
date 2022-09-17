import {Component} from '@angular/core';
import {HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = "EnergyManager"

  constructor(private router: Router) {
    this.router.navigate(['results']).then()
  }

}
