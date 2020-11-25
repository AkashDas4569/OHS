import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOhdSettingsComponent } from './delete-ohd-settings.component';

describe('DeleteOhdSettingsComponent', () => {
  let component: DeleteOhdSettingsComponent;
  let fixture: ComponentFixture<DeleteOhdSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteOhdSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteOhdSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
