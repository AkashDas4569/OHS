import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { SharedModule } from '../../core/modules/shared.module';

import { 
  RegistrationComponent,
  GeneralInfoComponent, 
  MedicalRecordBookComponent
} from './';

@NgModule({
  declarations: [
    RegistrationComponent, 
    GeneralInfoComponent, 
    MedicalRecordBookComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    SharedModule
  ]
})
export class EmployeeModule { }
