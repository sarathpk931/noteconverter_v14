import { TestBed } from '@angular/core/testing';

import { ScanTemplateService } from './scan-template.service';

describe('ScanTemplateService', () => {
  let service: ScanTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScanTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
