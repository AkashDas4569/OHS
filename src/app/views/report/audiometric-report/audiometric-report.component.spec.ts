import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiometricReportComponent } from './audiometric-report.component';

describe('AudiometricReportComponent', () => {
  let component: AudiometricReportComponent;
  let fixture: ComponentFixture<AudiometricReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudiometricReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudiometricReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
