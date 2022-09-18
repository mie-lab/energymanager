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
  visualization: string;

  constructor(private router: Router) {
    this.address =
      window.houseData !== undefined ? window.houseData['address'] : undefined;
    this.area =
      window.houseData !== undefined ? window.houseData['area'] : undefined;
    this.e_class =
      window.houseData !== undefined ? window.houseData['e_class'] : undefined;
    this.umfang =
      window.houseData !== undefined ? window.houseData['umfang'] : undefined;
    this.visualization =
      window.houseData !== undefined
        ? window.houseData['visualization']
        : undefined;
  }

  ngAfterContentInit(): void {}

  goToSensors($event: MouseEvent) {
    this.router.navigate(['sensors']).then();
  }
}
