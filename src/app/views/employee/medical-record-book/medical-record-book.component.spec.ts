import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRecordBookComponent } from './medical-record-book.component';

describe('MedicalRecordBookComponent', () => {
  let component: MedicalRecordBookComponent;
  let fixture: ComponentFixture<MedicalRecordBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalRecordBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalRecordBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
