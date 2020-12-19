import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryReportMedicalSurveillanceComponent } from './summary-report-medical-surveillance.component';

describe('SummaryReportMedicalSurveillanceComponent', () => {
  let component: SummaryReportMedicalSurveillanceComponent;
  let fixture: ComponentFixture<SummaryReportMedicalSurveillanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryReportMedicalSurveillanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryReportMedicalSurveillanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
