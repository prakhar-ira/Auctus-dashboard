import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';


import { FootfallRoutingModule } from './footfall-routing.module';
import { FootfallComponent } from './footfall.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared/shared.module';

@NgModule({
  declarations: [FootfallComponent],
  imports: [
    CommonModule,
    FootfallRoutingModule,
   SharedModule,
  ]
})
export class FootfallModule { }
