import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {WebcamModule} from "ngx-webcam";
import {CameraComponent} from "../camera/camera.component";
import {HttpClientModule} from "@angular/common/http";
import { SensorComponent } from './sensor/sensor.component';
import { VizComponent } from './viz/viz.component';
import { SensorvizComponent } from './sensorviz/sensorviz.component';

@NgModule({
  declarations: [
    AppComponent,
    CameraComponent,
    SensorComponent,
    VizComponent,
    SensorvizComponent
  ],
  imports: [
    BrowserModule,
    WebcamModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
