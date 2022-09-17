import {AfterContentInit, Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements AfterContentInit {
  constructor(private router: Router) {
  }

  ngAfterContentInit(): void {
  }

  goToSensors($event: MouseEvent) {
    this.router.navigate(['sensors']).then()
  }
}
