import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OhsClientListComponent } from './ohs-client-list.component';

describe('OhsClientListComponent', () => {
  let component: OhsClientListComponent;
  let fixture: ComponentFixture<OhsClientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OhsClientListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OhsClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
