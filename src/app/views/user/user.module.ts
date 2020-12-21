import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../../core/modules/shared.module';

import { 
  DashboardComponent, 
  TestComponent
} from './';

@NgModule({
  declarations: [
    DashboardComponent, 
    TestComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
