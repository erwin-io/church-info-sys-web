import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestComponent } from './request.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatTimepickerModule } from 'src/app/core/directive/mat-timepicker/src/lib/mat-timepicker.module';
import { CallService } from 'src/app/core/services/call.service';
import { ViewRequestComponent } from './view-request/view-request.component';

export const routes: Routes = [
  {
    path: '',
    component: RequestComponent,
    pathMatch: 'full'
  },
  {
    path: 'details/:requestId',
    component: ViewRequestComponent
  },
];


@NgModule({
  declarations: [RequestComponent, ViewRequestComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatTimepickerModule,
  ],providers:[
    CallService]
})
export class RequestModule { }
