import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeatmapSummaryRoutingModule } from './heatmap-summary-routing.module';
import { HeatmapSummaryComponent } from './heatmap-summary.component';
import { SharedModule } from '../shared/shared/shared.module';

@NgModule({
  declarations: [HeatmapSummaryComponent],
  imports: [
    CommonModule,
    HeatmapSummaryRoutingModule,
    SharedModule
  ]
})
export class HeatmapSummaryModule { }
