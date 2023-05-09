import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from 'src/app/material/material.module';
import { PriestComponent } from './priest.component';
import { PriestAddComponent } from './priest-add/priest-add.component';

export const routes: Routes = [
  {
    path: '',
    component: PriestComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [PriestComponent, PriestAddComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class PriestModule { }
