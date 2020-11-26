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
  // FitnessCertificateComponent, 
  ExamOutcomeRecordComponent,
  CheckoutComponent 
} from './';

const routes: Routes = [
  {
    path: 'list',
    component: MedicalSurveillanceListComponent,
    data: {
      title: 'Medical Surveillance List'
    }
  },
  {
    path: 'status/medical-condition/:eId/:dId/:eTestVisitId/:sex',
    component: MedicalConditionComponent,
    data: {
      title: 'Medical Condition'
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
    path: 'status/physical-exam/:eId/:eTestVisitId',
    component: PhysicalExamComponent,
    data: {
      title: 'Physical Exam'
    }
  },
  {
    path: 'status/investigation/:eId/:eTestVisitId',
    component: InvestigationComponent,
    data: {
      title: 'Investigation'
    }
  },
  {
    path: 'status/exam-outcome-record/:eId/:eTestVisitId',
    component: ExamOutcomeRecordComponent,
    data: {
      title: 'Exam Outcome & Reco.'
    }
  },
  // {
  //   path: 'status/fitness-certificate',
  //   component: FitnessCertificateComponent,
  //   data: {
  //     title: 'Fitness Certificate'
  //   }
  // }
  {
    path: 'status/checkout/:eId/:dId/:eTestVisitId',
    component: CheckoutComponent,
    data: {
      title: 'Checkout'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalSurveillanceRoutingModule { }
