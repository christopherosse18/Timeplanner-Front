import { TestBed } from '@angular/core/testing';

import { SaisieService } from './saisie.service';

describe('SaisieService', () => {
  let service: SaisieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaisieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
