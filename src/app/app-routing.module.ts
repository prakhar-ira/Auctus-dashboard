import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Chart1Component } from './charts/chart1/chart1.component';


const routes: Routes = [
  {
    path: '',
    loadChildren: './auth/auth.module#AuthModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
