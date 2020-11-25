import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiometricTestComponent } from './audiometric-test.component';

describe('AudiometricTestComponent', () => {
  let component: AudiometricTestComponent;
  let fixture: ComponentFixture<AudiometricTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudiometricTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudiometricTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
