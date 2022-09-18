import { AfterContentInit, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements AfterContentInit {
  address: string;
  area: number;
  e_class: string;
  umfang: number;

  constructor(private router: Router) {
    this.address = window.houseData['address'];
    this.area = window.houseData['area'];
    this.e_class = window.houseData['e_class'];
    this.umfang = window.houseData['umfang'];
  }

  ngAfterContentInit(): void {}

  goToSensors($event: MouseEvent) {
    this.router.navigate(['sensors']).then();
  }
}
