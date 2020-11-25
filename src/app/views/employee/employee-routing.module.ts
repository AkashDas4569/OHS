import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { 
  RegistrationComponent,
  GeneralInfoComponent, 
  MedicalRecordBookComponent
} from './';

const routes: Routes = [
  {
    path: 'registration',
    component: RegistrationComponent,
    data: {
      title: 'Employee Registration'
    }
  },
  {
    path: 'general-info/:id',
    component: GeneralInfoComponent,
    data: {
      title: 'Employee General Info'
    }
  },
  {
    path: 'status/medical-record-book',
    component:  MedicalRecordBookComponent,
    data: {
      title: 'Employee Medical Record Book'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
