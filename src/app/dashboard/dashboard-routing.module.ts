import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'home'
      },
      {
        path: 'home',
        loadChildren: '../home/home.module#HomeModule'
      },
      {
        path: 'profile',
        loadChildren: '../profile/profile.module#ProfileModule'
      },
      {
        path: 'overview',
        loadChildren: '../overview/overview.module#OverviewModule'
      },
      {
        path: 'footfall',
        loadChildren: '../footfall/footfall.module#FootfallModule'
      },
      {
        path: 'heatmap-summary',
        loadChildren: '../heatmap-summary/heatmap-summary.module#HeatmapSummaryModule'
      },
      {
        path: 'device-status',
        loadChildren: '../device-status/device-status.module#DeviceStatusModule'
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
