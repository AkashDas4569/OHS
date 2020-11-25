import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbnormalExamResultsComponent } from './abnormal-exam-results.component';

describe('AbnormalExamResultsComponent', () => {
  let component: AbnormalExamResultsComponent;
  let fixture: ComponentFixture<AbnormalExamResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbnormalExamResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbnormalExamResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
