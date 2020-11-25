import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalSurveillanceSummaryComponent } from './medical-surveillance-summary.component';

describe('MedicalSurveillanceSummaryComponent', () => {
  let component: MedicalSurveillanceSummaryComponent;
  let fixture: ComponentFixture<MedicalSurveillanceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalSurveillanceSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalSurveillanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
