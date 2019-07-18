import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';
import { SharedModule } from '../shared/shared/shared.module';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    OverviewRoutingModule,
    SharedModule
  ]
})
export class OverviewModule { }
