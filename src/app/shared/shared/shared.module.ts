import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { TreeModule } from 'angular-tree-component';
import { ToastrModule } from 'ngx-toastr';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TreeModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    })
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    NgxDaterangepickerMd,
    TreeModule,
    ToastrModule
  ],
})
export class SharedModule { }
