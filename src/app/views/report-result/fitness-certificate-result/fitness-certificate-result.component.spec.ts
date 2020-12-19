import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitnessCertificateResultComponent } from './fitness-certificate-result.component';

describe('FitnessCertificateResultComponent', () => {
  let component: FitnessCertificateResultComponent;
  let fixture: ComponentFixture<FitnessCertificateResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FitnessCertificateResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FitnessCertificateResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
