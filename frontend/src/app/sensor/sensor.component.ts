import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { connect } from './SensorComm';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css'],
})
export class SensorComponent implements OnInit {
  @ViewChild('canvas')
  // @ts-ignore
  private canvasRef: ElementRef;

  showSensor = true;
  hasData = false;
  _temperature = 0.0;
  humidity = 0.0;
  labels: string[];
  data: number[];
  dataH: number[];
  chart?: Chart;

  set temperature(t: number) {
    this._temperature = t;
  }
  get temperature() {
    return this._temperature;
  }
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private route: Router
  ) {
    this.labels = [];
    this.data = [];
    this.dataH = [];
  }

  ngOnInit(): void {}

  buildGraph() {
    this.chart = new Chart(this.canvasRef.nativeElement.getContext('2d'), {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Temperature',
            data: this.data,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
          {
            label: 'Humidity',
            data: this.dataH,
            fill: false,
            borderColor: 'rgb(75, 192, 75)',
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  handleSensorConnect = async (e: Event) => {
    const success = await connect(
      (temp) => {
        this.hasData = true;
        !this.chart && this.buildGraph();
        this.temperature = temp;
        console.log('updating temp', temp);
        this.chart?.data.labels?.push('');
        this.chart?.data.datasets[0].data.push(temp);
        this.chart?.update();
        console.log(this.chart?.data.datasets[0].data);

        if ((this.chart?.data.datasets[0].data.length ?? 0) > 20) {
          this.showSensor = false;
        }

        this.changeDetectorRef.detectChanges();
      },
      (humidity: number) => {
        this.hasData = true;
        this.humidity = humidity;
        console.log('updating humidity', humidity);
        this.chart?.data.datasets[1].data.push(humidity);
        this.chart?.update();

        this.changeDetectorRef.detectChanges();
      }
    );
    if (!success) {
      setTimeout(() => {
        this.handleSensorConnect(e);
      }, 1500);
    }
  };

  handleGoNext = () => {
    this.route.navigate(['results']);
  };
}
