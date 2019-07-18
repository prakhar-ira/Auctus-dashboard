import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeatmapSummaryComponent } from './heatmap-summary.component';

const routes: Routes = [
  {
    path: '',
    component: HeatmapSummaryComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeatmapSummaryRoutingModule { }
