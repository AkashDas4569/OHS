import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitnessCertificateComponent } from './fitness-certificate.component';

describe('FitnessCertificateComponent', () => {
  let component: FitnessCertificateComponent;
  let fixture: ComponentFixture<FitnessCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FitnessCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FitnessCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
