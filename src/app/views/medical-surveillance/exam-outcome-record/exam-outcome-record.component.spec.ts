import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamOutcomeRecordComponent } from './exam-outcome-record.component';

describe('ExamOutcomeRecordComponent', () => {
  let component: ExamOutcomeRecordComponent;
  let fixture: ComponentFixture<ExamOutcomeRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamOutcomeRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamOutcomeRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
