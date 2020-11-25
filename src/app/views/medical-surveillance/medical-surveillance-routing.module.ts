import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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

const routes: Routes = [
  {
    path: 'status/medical-condition/:eId/:dId/:eTestVisitId/:sex',
    component: MedicalConditionComponent,
    data: {
      title: 'Medical Condition'
    }
  },
  {
    path: 'status/investigation',
    component: InvestigationComponent,
    data: {
      title: 'Investigation'
    }
  },
  {
    path: 'status/physical-exam',
    component: PhysicalExamComponent,
    data: {
      title: 'Physical Exam'
    }
  },
  {
    path: 'status/past-medical-history/:eId/:dId/:eTestVisitId',
    component: PastMedicalHistoryComponent,
    data: {
      title: 'Past Medical History'
    }
  },
  {
    path: 'status/family-history/:eId/:dId/:eTestVisitId',
    component: FamilyHistoryComponent,
    data: {
      title: 'Family History'
    }
  },
  {
    path: 'status/occupational-history/:eId/:dId/:eTestVisitId',
    component: OccupationalHistoryComponent,
    data: {
      title: 'Occupational History'
    }
  },
  {
    path: 'status/chemical-history/:eId/:dId/:eTestVisitId',
    component: ChemicalHistoryComponent,
    data: {
      title: 'Chemical History'
    }
  },
  {
    path: 'status/exam-outcome-record',
    component: ExamOutcomeRecordComponent,
    data: {
      title: 'Exam Outcome & Reco.'
    }
  },
  {
    path: 'list',
    component: MedicalSurveillanceListComponent,
    data: {
      title: 'Medical Surveillance List'
    }
  },
  {
    path: 'status/fitness-certificate',
    component: FitnessCertificateComponent,
    data: {
      title: 'Fitness Certificate'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalSurveillanceRoutingModule { }
