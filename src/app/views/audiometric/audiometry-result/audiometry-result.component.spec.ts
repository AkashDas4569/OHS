import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiometryResultComponent } from './audiometry-result.component';

describe('AudiometryResultComponent', () => {
  let component: AudiometryResultComponent;
  let fixture: ComponentFixture<AudiometryResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudiometryResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudiometryResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
