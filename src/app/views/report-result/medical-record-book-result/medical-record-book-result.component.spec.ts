import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRecordBookResultComponent } from './medical-record-book-result.component';

describe('MedicalRecordBookResultComponent', () => {
  let component: MedicalRecordBookResultComponent;
  let fixture: ComponentFixture<MedicalRecordBookResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalRecordBookResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalRecordBookResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
