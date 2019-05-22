import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FootfallComponent } from './footfall.component';

const routes: Routes = [
  {
    path: '',
    component: FootfallComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootfallRoutingModule { }
