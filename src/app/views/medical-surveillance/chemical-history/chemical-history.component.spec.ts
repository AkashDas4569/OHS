import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalHistoryComponent } from './chemical-history.component';

describe('ChemicalHistoryComponent', () => {
  let component: ChemicalHistoryComponent;
  let fixture: ComponentFixture<ChemicalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
