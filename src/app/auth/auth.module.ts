import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FootfallComponent } from '../footfall/footfall.component';
import { Chart1Component } from '../charts/chart1/chart1.component';
import { SharedModule } from '../shared/shared/shared.module';

@NgModule({
  declarations: [AuthComponent, FootfallComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }
