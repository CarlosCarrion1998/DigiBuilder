import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Deck } from '../entity/deck';
import { Card } from '../entity/card';
import { DeckCard } from '../entity/deck-card';

@Injectable({
  providedIn: 'root'
})
export class DigimonDeckService {
  

  private url = 'http://localhost:8080/api/data/user/deck';

  private deckActual: Deck | null = null;
  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();

  triggerRefresh() {
    this.refreshSubject.next();
  }

  constructor(private http: HttpClient) { }

  removeCardFromDeck(deck: Deck, deckcard_id: number): Observable<any> {
    return this.http.post(this.url + "/card/remove?deckcard_id=" + deckcard_id, deck);
  }

  getDeckCard(deckId: number, cardId: number): Observable<any> {
    return this.http.get<any>(this.url + "?deck_id=" + deckId + "&card_id=" + cardId);
  }

  getUserDecks(username: string): Observable<any> {
    return this.http.get<any>(this.url + "?username=" + username);
  }

  addCardToDeck(deckId: number, card: Card): Observable<any> {
    return this.http.post(this.url + "/card?deck_id=" + deckId, card);
  }

  addDeck(deck: Deck, username: string): Observable<any> {
    return this.http.post(this.url + "?username=" + username, deck);
  }

  setDeckActual(deck: Deck) {
    this.deckActual = deck;
  }

  getDeckActual(): Deck {
    return this.deckActual!;
  }
}
