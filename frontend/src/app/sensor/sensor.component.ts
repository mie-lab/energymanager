import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { connect } from './SensorComm';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css'],
})
export class SensorComponent implements OnInit {
  _temperature = 0.0;
  humidity = 0.0;

  set temperature(t: number) {
    this._temperature = t;
  }
  get temperature() {
    return this._temperature;
  }
  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  handleSensorConnect = (e: Event) => {
    connect(
      (temp) => {
        this.temperature = temp;
        this.changeDetectorRef.detectChanges();
        console.log('updating temp', temp);
      },
      (humidity: number) => {
        this.humidity = humidity;
        this.changeDetectorRef.detectChanges();
        console.log('updating humidity', humidity);
      }
    ).then();
  };
}
