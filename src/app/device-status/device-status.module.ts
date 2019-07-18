import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceStatusRoutingModule } from './device-status-routing.module';
import { DeviceStatusComponent } from './device-status.component';

@NgModule({
  declarations: [DeviceStatusComponent],
  imports: [
    CommonModule,
    DeviceStatusRoutingModule
  ]
})
export class DeviceStatusModule { }
