import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { PriestComponent } from './priest/priest.component';
import { PriestModule } from './priest/priest.module';

export const routes: Routes = [
  {
    path: 'priest',
    component: PriestComponent
  },

];


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    PriestModule,
    RouterModule.forChild(routes)
  ],
})

export class ConfigurationModule { }
