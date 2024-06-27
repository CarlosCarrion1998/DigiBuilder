import { TestBed } from '@angular/core/testing';

import { DigimonCardService } from './digimon-card.service';

describe('DigimonCardService', () => {
  let service: DigimonCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigimonCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
