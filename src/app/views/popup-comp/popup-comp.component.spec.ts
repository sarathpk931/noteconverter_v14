import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCompComponent } from './popup-comp.component';

describe('PopupCompComponent', () => {
  let component: PopupCompComponent;
  let fixture: ComponentFixture<PopupCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupCompComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
