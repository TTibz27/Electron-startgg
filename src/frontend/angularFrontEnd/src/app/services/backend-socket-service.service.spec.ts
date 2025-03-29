import { TestBed } from '@angular/core/testing';

import { BackendSocketServiceService } from './backend-socket-service.service';

describe('BackendSocketServiceService', () => {
  let service: BackendSocketServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendSocketServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
