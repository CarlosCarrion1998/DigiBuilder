import { TestBed } from '@angular/core/testing';

import { DigimonImageService } from './digimon-image.service';

describe('DigimonImageService', () => {
  let service: DigimonImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigimonImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
