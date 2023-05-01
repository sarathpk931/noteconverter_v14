import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanScreenComponent } from './scan-screen.component';

describe('ScanScreenComponent', () => {
  let component: ScanScreenComponent;
  let fixture: ComponentFixture<ScanScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
