import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalSurveillanceListComponent } from './medical-surveillance-list.component';

describe('MedicalSurveillanceListComponent', () => {
  let component: MedicalSurveillanceListComponent;
  let fixture: ComponentFixture<MedicalSurveillanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalSurveillanceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalSurveillanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
