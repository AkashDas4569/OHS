import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiometricReportResultComponent } from './audiometric-report-result.component';

describe('AudiometricReportResultComponent', () => {
  let component: AudiometricReportResultComponent;
  let fixture: ComponentFixture<AudiometricReportResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudiometricReportResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudiometricReportResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
