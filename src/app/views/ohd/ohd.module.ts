import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OhdRoutingModule } from './ohd-routing.module';
import { SharedModule } from '../../core/modules/shared.module';

import { 
  OhdSettingsComponent, 
  ManageUsersComponent,
  ChangePasswordComponent 
} from './';

@NgModule({
  declarations: [
    OhdSettingsComponent, 
    ManageUsersComponent, 
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    OhdRoutingModule,
    SharedModule
  ]
})
export class OhdModule { }
