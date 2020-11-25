import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OhdSettingsComponent } from './ohd-settings.component';

describe('OhdSettingsComponent', () => {
  let component: OhdSettingsComponent;
  let fixture: ComponentFixture<OhdSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OhdSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OhdSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
