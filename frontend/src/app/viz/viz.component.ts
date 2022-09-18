import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

@Component({
  selector: 'app-viz',
  templateUrl: './viz.component.html',
  styleUrls: ['./viz.component.css'],
})
export class VizComponent implements OnInit {
  @ViewChild('canvas')
  // @ts-ignore
  private canvasRef: ElementRef;
  @ViewChild('canvas2')
  // @ts-ignore
  private canvas2Ref: ElementRef;

  //* Cube Properties
  @Input() public rotationSpeedX: number = 0.0;
  @Input() public rotationSpeedY: number = 0.0;
  @Input() public size: number = 50;
  @Input() public texture: string = '/assets/Floorplan.png';

  //* Stage Properties
  @Input() public cameraX: number = 70;
  @Input() public cameraY: number = 60;
  @Input() public cameraZ: number = 70;
  @Input() public fieldOfView: number = 1;
  @Input('nearClipping') public nearClippingPlane: number = 1;
  @Input('farClipping') public farClippingPlane: number = 1000;

  //* Helper Properties (Private Properties);
  private camera!: THREE.OrthographicCamera;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  private loader = new THREE.TextureLoader();
  private geometry = new THREE.BoxGeometry(4, 0.03, 1.4);
  private material = new THREE.MeshBasicMaterial({
    map:
      window.houseData && 'visualization' in window.houseData
        ? window.houseData['visualization']
        : this.loader.load(this.texture),
  });
  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;

  /**
   *Animate the cube
   *
   * @private
   * @memberof CubeComponent
   */
  private animateCube() {
    this.cube.rotation.x += this.rotationSpeedX;
    this.cube.rotation.y += this.rotationSpeedY;
  }

  /**
   * Create the scene
   *
   * @private
   * @memberof CubeComponent
   */
  private createScene() {
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfafafa);
    this.scene.add(this.cube);
    //*Camera
    let aspectRatio = this.getAspectRatio();
    // this.camera = new THREE.OrthographicCamera(
    //   this.fieldOfView,
    //   aspectRatio,
    //   this.nearClippingPlane,
    //   this.farClippingPlane
    // );
    const width = 2;
    const height = 2;
    this.camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      this.nearClippingPlane,
      this.farClippingPlane
    );
    this.camera.position.x = this.cameraX;
    this.camera.position.y = this.cameraY;
    this.camera.position.z = this.cameraZ;
    this.camera.lookAt(0, 0, 0);
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
   * Start the rendering loop
   *
   * @private
   * @memberof CubeComponent
   */
  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    const controls = new TrackballControls(
      this.camera,
      this.renderer.domElement
    );

    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 1;

    let component: VizComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateCube();
      controls.update();
      component.renderer.render(component.scene, component.camera);
    })();
  }

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();

    const labels = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24,
    ].map((l) => l.toString());
    new Chart(this.canvas2Ref.nativeElement.getContext('2d'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Indoors temperature',
            data: [
              23, 23, 22.9, 22.8, 22.5, 22.3, 22.1, 21.4, 21.1, 20.8, 20.3,
              19.4, 19.5, 19.0, 18.7, 18.1, 17.5, 17.4, 17.1, 16.5, 15.5, 15.1,
              14.2, 13.1, 12.5, 11.7, 11.1,
            ],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
          {
            label: 'Outdoors temperature',
            data: [
              23, 23, 22.9, 22.8, 22.5, 22.3, 22.1, 21.4, 21.1, 20.8, 20.3,
              19.4, 19.5, 19.0, 18.7, 18.1, 17.5, 17.4, 17.1, 16.5, 15.5, 15.1,
              14.2, 13.1, 12.5, 11.7, 11.1,
            ].map((n, i) => n + Math.random() * 4 - i / 5 - 5),
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

  handle() {
    window.open('/assets/Energy_saving_recommendations.pdf', '_blank');
  }
}
