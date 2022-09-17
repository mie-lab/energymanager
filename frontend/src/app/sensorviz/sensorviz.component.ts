import { Component, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-sensorviz',
  templateUrl: './sensorviz.component.html',
  styleUrls: ['./sensorviz.component.css'],
})
export class SensorvizComponent implements OnInit {
  @ViewChild('canvas')
  // @ts-ignore
  private canvasRef: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const labels = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24,
    ].map((l) => l.toString());
    new Chart(this.canvasRef.nativeElement.getContext('2d'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Indoors temperature',
            data: [
              23, 23, 22.9, 22.8, 22.5, 22.3, 22.1, 21.4, 21.1, 20.8, 20.3,
              19.4, 19.5, 19.0, 18.7, 18.1,
            ],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
          {
            label: 'Outdoors temperature',
            data: [
              23, 23, 22.9, 22.8, 22.5, 22.3, 22.1, 21.4, 21.1, 20.8, 20.3,
              19.4, 19.5, 19.0, 18.7, 18.1,
            ].map((n) => n + Math.random() * 4 - 2),
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
}
