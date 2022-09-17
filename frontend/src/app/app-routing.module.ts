import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from "./settings/settings.component";
import {AppComponent} from "./app.component";
import {NgModule} from "@angular/core";
import {SensorComponent} from "./sensor/sensor.component";
import {CameraComponent} from "./camera/camera.component";

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'camera',
        component: CameraComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'sensors',
        component: SensorComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

