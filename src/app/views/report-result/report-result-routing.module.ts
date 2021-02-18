import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { 
  MedicalSurveillanceReportResultComponent,
  AudiometricReportResultComponent,
  FitnessCertificateResultComponent,
  SummaryReportMedicalSurveillanceComponent,
  MedicalRemovalProtectionComponent,
  MedicalRecordBookResultComponent 
} from './';

const routes: Routes = [
  {
    path: 'medical-surveillance-report-result/:eId/:eTestVisitId',
    component: MedicalSurveillanceReportResultComponent,
    data: {
      title: 'Medical Surveillance'
    }
  },
  {
    path: 'medical-record-book-result/:eId/:eTestVisitId',
    component: MedicalRecordBookResultComponent,
    data: {
      title: 'Medical Record Book'
    }
  },
  {
    path: 'audiometric-report-result/:eId/:eTestVisitId',
    component: AudiometricReportResultComponent,
    data: {
      title: 'Audiometric Report Result'
    }
  },
  {
    path: 'certificate-fitness/:eId/:eTestVisitId',
    component: FitnessCertificateResultComponent,
    data: {
      title: 'Certificate of Fitness'
    }
  },
  {
    path: 'summary-report-medicalsur',
    component: SummaryReportMedicalSurveillanceComponent,
    data: {
      title: 'Summary Report For Medical Surveillance'
    }
  },
  {
    path: 'medical-removal-protection/:eId/:eTestVisitId',
    component: MedicalRemovalProtectionComponent,
    data: {
      title: 'Medical Removal Protection'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportResultRoutingModule { }
