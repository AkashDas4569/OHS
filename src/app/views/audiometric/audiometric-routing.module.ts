import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { 
  AudiometricTestComponent,
  OccupationalNoiseExposureComponent, 
  MedicalHistoryComponent, 
  AudiometryResultComponent 
} from './';

const routes: Routes = [
  {
    path: 'audiometric-test-queue',
    component: AudiometricTestComponent,
    data: {
      title: 'Audiometric Test'
    }
  },
  {
    path: 'occupational-noise-exposure',
    component: OccupationalNoiseExposureComponent,
    data: {
      title: 'Occupational Noise Exposure'
    }
  },
  {
    path: 'medical-history',
    component: MedicalHistoryComponent,
    data: {
      title: 'Medical History'
    }
  },
  {
    path: 'audiometry-result',
    component: AudiometryResultComponent,
    data: {
      title: 'Audiometry Result'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AudiometricRoutingModule { }
