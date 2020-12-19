import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRemovalProtectionComponent } from './medical-removal-protection.component';

describe('MedicalRemovalProtectionComponent', () => {
  let component: MedicalRemovalProtectionComponent;
  let fixture: ComponentFixture<MedicalRemovalProtectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalRemovalProtectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalRemovalProtectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
