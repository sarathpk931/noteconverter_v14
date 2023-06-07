import { TestBed } from '@angular/core/testing';

import { ResourcestringService } from './resourcestring.service';

describe('ResourcestringService', () => {
  let service: ResourcestringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourcestringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
