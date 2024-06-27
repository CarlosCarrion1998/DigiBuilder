import { Component, Input } from '@angular/core';
import { DigimonService } from '../../services/digimon.service';
import { NgFor, NgIf } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DigimonImageService } from '../../services/digimon-image.service';
import { Card } from '../../entity/card';
import { EMPTY, Subscription, catchError, concatMap, finalize, forkJoin, from, map, mergeMap, of, switchMap, take, toArray, zip } from 'rxjs';
import { DigimonCardService } from '../../services/digimon-card.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../entity/user';
import { Deck } from '../../entity/deck';
import { DigimonDeckService } from '../../services/digimon-deck.service';
import { Router } from '@angular/router';
import { DeckCard } from '../../entity/deck-card';

@Component({
  selector: 'cartas',
  standalone: true,
  imports: [ScrollingModule, NgFor, NgIf],
  templateUrl: './cartas.component.html',
  styleUrl: './cartas.component.css',
})
export class CartasComponent {
  digimonService: DigimonService;
  digimonImageService: DigimonImageService;
  digimonCardService: DigimonCardService;
  digimonDeckService: DigimonDeckService;
  authService: AuthService;
  router: Router;

  user: User | null = null;

  cardsApi: any[] = [];
  cards: Card[] = [];
  expansion: string = 'BT7';

  @Input() isProfileView: boolean = false;

  refreshSubscription?: Subscription;


  private subscriptions: Subscription[] = [];
  update: boolean = false;

  constructor(
    digimonService: DigimonService,
    digimonImageService: DigimonImageService,
    digimonCardService: DigimonCardService,
    digimonDeckService: DigimonDeckService,
    router: Router,
    authService: AuthService,
  ) {
    this.digimonService = digimonService;
    this.digimonImageService = digimonImageService;
    this.digimonCardService = digimonCardService;
    this.digimonDeckService = digimonDeckService;
    this.authService = authService;
    this.router = router;
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    if(this.user == null)
      this.router.navigate(['']);
    if(!this.isProfileView) {
      if(this.digimonDeckService.getDeckActual() == null) {
        if(this.user!.decks.length > 0) {
          this.digimonDeckService.setDeckActual(this.user!.decks[0]);
        } else {
          const deck: Deck = {
            id: 0,
            deckCards: [],
            name: "Deck 1",
            user: this.user!
          };
          this.digimonDeckService.addDeck(deck, this.user!.username);
          this.digimonDeckService.setDeckActual(deck);
        }
      }
      this.digimonService.getAllCards().subscribe(
        (data: any) => {
          this.cardsApi = data;
          this.initializeCards(this.cardsApi);
          this.updateCardsWithDatabase();
          this.loadImageScrapping();
          
        },
        (error: any) => {
          console.error('Error fetching data', error);
        }
      );
    } else {
      this.refreshSubscription = this.digimonDeckService.refresh$.subscribe(() => {
        this.refresh();
      });
    }
    
  }

  refresh(): void {
    this.digimonDeckService.getDeckActual().deckCards.forEach(deckCard => {
      let temp: Card;
      this.digimonCardService.getCardByCode(deckCard.card.code).subscribe({
        next: (data: any) => {
          temp = data;
          this.cards.push(temp);
          this.onImageLoad(temp);
        },
        error: (error: any) => {
          console.error('Error fetching data', error);
        }
      });
    });
  }
  
  ngOnDestroy(): void {
    // Cancelar todas las suscripciones cuando se destruya el componente
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadImageScrapping(): void {
    // this.digimonImageService.getImage(card.cardnumber).subscribe(
    //   (data2: any) => {
    //     this.cards.push({
    //       name: card.name,
    //       cardnumber: card.cardnumber,
    //       src: data2.url,
    //     });
    //     console.log(this.cards);
    //   },
    //   (error: any) => {
    //     console.error('Error fetching data', error);
    //   }
    // );

    const sub = from(this.cardsApi)
      .pipe(
        concatMap((card) => {
          if (card.cardnumber.startsWith(this.expansion)) {
            return this.digimonCardService.getCardByCode(card.cardnumber).pipe(
              switchMap((existingCard) => {
                if (existingCard) {
                  if(existingCard.actualSrc != "https://images.digimoncard.io/images/assets/CardBack.jpg" && existingCard.actualSrc != "") {
                    return EMPTY;
                  }
                   // Omitir el scraping para esta carta
                } 
                  return this.digimonImageService.getImage(card.cardnumber).pipe(
                    take(1), // Nos aseguramos de que se tome solo una vez
                    map((imageData: any) => ({
                      name: card.name,
                      cardnumber: card.cardnumber,
                      src: imageData.url
                    })),
                    finalize(() => {
                      console.log('Finalizado: ', card.cardnumber);
                    })
                  );
                
              })
            );
          } else {
            return EMPTY; // Si la carta no pertenece a la expansión, retorna un observable vacío
          }
        })
      )
      .subscribe(
        (cardWithImage) => {
          if (cardWithImage) {
            const card = this.cards.find(c => c.code === cardWithImage.cardnumber);
            if (card) {
              card.actualSrc = cardWithImage.src;
              this.onImageLoad(card);
              this.digimonCardService.postCard(card).subscribe({
                next: (data: any) => {
                  console.log('Card posted:', data);
                },
                error: (error: any) => {
                  console.error('Error posting card', error);
              }});
            }
          }
        },
        (error: any) => {
          console.error('Error fetching image data', error);
        }
      );

    // const observables = this.cardsApi
    //   .filter(card => card.cardnumber.startsWith(this.expansion))
    //   .map((card, index) => this.digimonImageService.getImage(card.cardnumber).pipe(
    //     map((imageData: any) => ({
    //       index, // Mantener el índice original de la carta
    //       cardnumber: card.cardnumber,
    //       src: imageData.url
    //     }))
    //   ));
    
    // const sub = concat(...observables).pipe(toArray())
    //   .subscribe(
    //     (results: { index: number, cardnumber: string, src: any }[]) => {
    //       results.forEach(result => {
    //         const card = this.cards.find(c => c.cardnumber === result.cardnumber);
    //         if (card) {
    //           card.actualSrc = result.src;
    //           console.log('Card image updated:', card);
    //           // Llamar a onImageLoad para actualizar la imagen en la UI
    //           this.onImageLoad(card);
    //         }
    //       });
    //     },
    //     (error: any) => {
    //       console.error('Error fetching image data', error);
    //     }
    //   );


    

    this.subscriptions.push(sub);
  }
  onImageLoad(card: Card) {
    let imagenActualizada = false;
    let url = "https://images.digimoncard.io/images/assets/CardBack.jpg";
    if (card.actualSrc) {
      // Cambia la fuente de la imagen a la imagen real si ya está disponible
      console.log(this.update);
      if(this.update) {
        const imgElement = document.querySelector(`img[src="${url}"][data-update-needed="true"]`) as HTMLImageElement;
        if (imgElement) {
          imgElement.src = card.actualSrc;
          imgElement.setAttribute('data-update-needed', 'false');
          imagenActualizada = true;
          console.log('Imagen actualizada:', card.actualSrc);
        }
      } 
      if(!imagenActualizada) {
      const imgElement = document.querySelector(`img[src="${card.defaultSrc}"]`) as HTMLImageElement;
        if (imgElement) {
          if(card.actualSrc != '') {
            imgElement.src = card.actualSrc;
            if(!this.update) {
              if(card.actualSrc != "https://images.digimoncard.io/images/assets/CardBack.jpg") {
                imgElement.setAttribute('data-update-needed', 'false');
              }
            } else {
              imgElement.setAttribute('data-update-needed', 'false');
            }
            console.log('Imagen nueva:', card.code);
          }
        }
      }
      
      
    }
  }
  initializeCards(cards: any[]) {
    // Inicializar las cartas con la imagen por defecto
    this.cards = cards.map(card => ({
      id: 0,
      name: card.name,
      code: card.cardnumber,
      defaultSrc: '../../../assets/default-card.webp', // Imagen por defecto
      actualSrc: '', // Se actualizará con la imagen real
      deckCards: []
    }));
  }

  updateCardsWithDatabase() {
    const observables = this.cards
    .filter(card => card.code.startsWith(this.expansion))
    .map(card => {
      return this.digimonCardService.getCardByCode(card.code).pipe(
        map(data => {
          if (data) {
            card.id = data.id;
            card.actualSrc = data.actualSrc;
            // card.deckCards = data.deckCards;
            this.onImageLoad(card);
          }
        }),
        catchError(error => {
          console.error('Error fetching card data', error);
          return of(null); // Continue even if there is an error
        })
      );
    });

  forkJoin(observables).pipe(
    finalize(() => {
      this.update = true;
      console.log('All cards have been processed');
    })
  ).subscribe();
    
    

  }

  addCardToDeck(card: Card) {
    

    if(card.actualSrc === '') {
      this.digimonCardService.postCard(card).subscribe({
        next: (data: any) => {
          this.addCardToDeckRelation(data);
        },
        error: (error: any) => {
          console.error('Error posting card', error);
      }});
    } else {
      this.addCardToDeckRelation(card);
    }
    
    
    
  }

  addCardToDeckRelation(card: Card) {
    let deckcard;
    if((deckcard = this.digimonDeckService.getDeckActual().deckCards.find(deckCard => deckCard.card.code === card.code))) {
      if(deckcard.cantidad >= 4){
        alert("No puedes tener más de 4 cartas iguales en tu deck: " + card.name);
        return;
      }
      else {
        this.digimonDeckService.getDeckActual().deckCards.find(deckCard => deckCard.card.code === card.code)!.cantidad++;
        
      }
    } else {
      
      this.digimonDeckService.getDeckActual().deckCards.push({id: 0, card: card, cantidad: 1});
    }
    this.digimonDeckService.addCardToDeck(this.digimonDeckService.getDeckActual().id, card).subscribe();
  }

  removeCardFromDeck(deckCard: DeckCard) {
    this.digimonDeckService.removeCardFromDeck(this.digimonDeckService.getDeckActual(), deckCard.id).subscribe();
    if(deckCard.cantidad > 1) {
      deckCard.cantidad--;
    } else {
      this.digimonDeckService.getDeckActual().deckCards.splice(this.digimonDeckService.getDeckActual().deckCards.indexOf(deckCard), 1);
      
    }
    this.refreshSubscription = this.digimonDeckService.refresh$.subscribe(() => {
      this.refresh();
    });
    
  }

}
