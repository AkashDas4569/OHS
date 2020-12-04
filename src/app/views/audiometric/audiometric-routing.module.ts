import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { 
  AudiometricTestComponent,
  OccupationalNoiseExposureComponent, 
  MedicalHistoryComponent, 
  AudiometryResultComponent,
  CheckoutComponent 
} from './';

const routes: Routes = [
  {
    path: 'list',
    component: AudiometricTestComponent,
    data: {
      title: 'Audiometric List'
    }
  },
  {
    path: 'status/occupational-noise-exposure/:eId/:eTestVisitId',
    component: OccupationalNoiseExposureComponent,
    data: {
      title: 'Occupational Noise Exposure'
    }
  },
  {
    path: 'status/medical-history/:eId/:eTestVisitId',
    component: MedicalHistoryComponent,
    data: {
      title: 'Medical History'
    }
  },
  {
    path: 'status/audiometry-result/:eId/:eTestVisitId',
    component: AudiometryResultComponent,
    data: {
      title: 'Audiometry Result'
    }
  },
  {
    path: 'status/checkout/:eId/:eTestVisitId',
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
export class AudiometricRoutingModule { }
