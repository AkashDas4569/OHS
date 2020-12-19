import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalSurveillanceReportResultComponent } from './medical-surveillance-report-result.component';

describe('MedicalSurveillanceReportResultComponent', () => {
  let component: MedicalSurveillanceReportResultComponent;
  let fixture: ComponentFixture<MedicalSurveillanceReportResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalSurveillanceReportResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalSurveillanceReportResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
