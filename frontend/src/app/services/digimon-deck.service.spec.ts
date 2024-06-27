import { TestBed } from '@angular/core/testing';

import { DigimonDeckService } from './digimon-deck.service';

describe('DigimonDeckService', () => {
  let service: DigimonDeckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigimonDeckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
