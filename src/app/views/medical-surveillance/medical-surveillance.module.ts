import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalSurveillanceRoutingModule } from './medical-surveillance-routing.module';
import { SharedModule } from '../../core/modules/shared.module';

import { 
  MedicalConditionComponent,
  InvestigationComponent, 
  PhysicalExamComponent, 
  PastMedicalHistoryComponent, 
  FamilyHistoryComponent, 
  OccupationalHistoryComponent, 
  ChemicalHistoryComponent, 
  MedicalSurveillanceListComponent, 
  FitnessCertificateComponent, 
  ExamOutcomeRecordComponent 
} from './';

@NgModule({
  declarations: [
    MedicalConditionComponent, 
    InvestigationComponent, 
    PhysicalExamComponent, 
    PastMedicalHistoryComponent, 
    FamilyHistoryComponent, 
    OccupationalHistoryComponent, 
    ChemicalHistoryComponent, 
    MedicalSurveillanceListComponent, 
    FitnessCertificateComponent, 
    ExamOutcomeRecordComponent
  ],
  imports: [
    CommonModule,
    MedicalSurveillanceRoutingModule,
    SharedModule
  ]
})
export class MedicalSurveillanceModule { }
