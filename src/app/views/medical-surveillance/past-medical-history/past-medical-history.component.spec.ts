import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastMedicalHistoryComponent } from './past-medical-history.component';

describe('PastMedicalHistoryComponent', () => {
  let component: PastMedicalHistoryComponent;
  let fixture: ComponentFixture<PastMedicalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PastMedicalHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PastMedicalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
