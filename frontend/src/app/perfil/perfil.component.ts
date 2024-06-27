import { Component } from '@angular/core';
import { CartasComponent } from '../components/cartas/cartas.component';
import { CabeceraComponent } from '../components/cabecera/cabecera.component';
import { Deck } from '../entity/deck';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { User } from '../entity/user';
import { AuthService } from '../services/auth.service';
import { DigimonDeckService } from '../services/digimon-deck.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CartasComponent, CabeceraComponent, CommonModule, FormsModule, NgFor, NgIf],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  digimonDeckService: DigimonDeckService;

  user: User | null = null;
  deckActual?: Deck;

  constructor(authService: AuthService, digimonDeckService: DigimonDeckService) {
    this.digimonDeckService = digimonDeckService;
    this.user = authService.getUser();
  }

  ngOnInit(): void {
    if(this.user != null) {
      this.digimonDeckService.getUserDecks(this.user.username).subscribe(
        (decks: Deck[]) => {
          this.user!.decks = decks;
          if (this.user!.decks.length > 0) {
            console.log(this.user!.decks);
            this.deckActual = this.user!.decks[0];
            this.digimonDeckService.setDeckActual(this.deckActual!);
            this.updateValue();
          }
          else {
            this.user!.decks = [];
          }

        }
      );
    }
  }

  updateValue() {
    // Lógica para actualizar el valor
    this.digimonDeckService.triggerRefresh();
  }

  changeDeck(deck: Deck) {
    this.deckActual = deck;
    this.digimonDeckService.setDeckActual(deck);
    this.updateValue();
  }

  nuevoDeck() {
    if(this.user != null) {
      this.deckActual = {
        id: 0,
        name: 'DeckNuevo',
        deckCards: [],
        user: this.user
      };
    }
    
  }

  saveDeck() {
    if(this.deckActual != null) {
      this.digimonDeckService.addDeck(this.deckActual, this.user!.username).subscribe({
        next: () => {
          this.digimonDeckService.getUserDecks(this.user!.username).subscribe(
            (decks: Deck[]) => {
              this.user!.decks = decks;
              this.deckActual = this.user!.decks[this.user!.decks.length - 1];
              this.digimonDeckService.setDeckActual(this.deckActual!);
              this.updateValue();
            }
          );
        }
      });
      
    
    }
  }

}
