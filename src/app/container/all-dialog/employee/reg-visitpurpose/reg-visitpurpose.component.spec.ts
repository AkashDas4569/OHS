import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegVisitpurposeComponent } from './reg-visitpurpose.component';

describe('RegVisitpurposeComponent', () => {
  let component: RegVisitpurposeComponent;
  let fixture: ComponentFixture<RegVisitpurposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegVisitpurposeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegVisitpurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
