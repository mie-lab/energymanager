import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from "../settings/settings.component";
import {AppComponent} from "./app.component";
import {NgModule} from "@angular/core";

const routes: Routes = [
  //{path: '', component: AppComponent, pathMatch: 'full'},
  {path: '', component: AppComponent, pathMatch: 'full'},
  {path: 'settings', component: SettingsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

