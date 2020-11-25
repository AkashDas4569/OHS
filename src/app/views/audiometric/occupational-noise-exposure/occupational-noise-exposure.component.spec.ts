import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupationalNoiseExposureComponent } from './occupational-noise-exposure.component';

describe('OccupationalNoiseExposureComponent', () => {
  let component: OccupationalNoiseExposureComponent;
  let fixture: ComponentFixture<OccupationalNoiseExposureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OccupationalNoiseExposureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OccupationalNoiseExposureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
