import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturePopoverComponent } from './feature-popover.component';

describe('FeaturePopoverComponent', () => {
  let component: FeaturePopoverComponent;
  let fixture: ComponentFixture<FeaturePopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeaturePopoverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturePopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
