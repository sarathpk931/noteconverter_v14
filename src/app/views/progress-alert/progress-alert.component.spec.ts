import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressAlertComponent } from './progress-alert.component';

describe('ProgressAlertComponent', () => {
  let component: ProgressAlertComponent;
  let fixture: ComponentFixture<ProgressAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
