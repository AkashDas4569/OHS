import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OhsClientSettingsComponent } from './ohs-client-settings.component';

describe('OhsClientSettingsComponent', () => {
  let component: OhsClientSettingsComponent;
  let fixture: ComponentFixture<OhsClientSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OhsClientSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OhsClientSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
