import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceStatusComponent } from './device-status.component';

const routes: Routes = [
  {
    path: '',
    component: DeviceStatusComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceStatusRoutingModule { }
