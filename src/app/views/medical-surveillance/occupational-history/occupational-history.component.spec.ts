import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupationalHistoryComponent } from './occupational-history.component';

describe('OccupationalHistoryComponent', () => {
  let component: OccupationalHistoryComponent;
  let fixture: ComponentFixture<OccupationalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OccupationalHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OccupationalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
