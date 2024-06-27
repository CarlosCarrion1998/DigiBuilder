package com.backend.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.backend.entity.Card;
import com.backend.backend.entity.Deck;
import com.backend.backend.entity.DeckCard;
import com.backend.backend.entity.User;
import com.backend.backend.repository.CardRepository;
import com.backend.backend.repository.DeckCardRepository;
import com.backend.backend.repository.DeckRepository;
import com.backend.backend.repository.UserRepository;


@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/data")
public class DigimonController {

    private final UserRepository userRepository;
    private final DeckRepository deckRepository;
    private final DeckCardRepository deckCardRepository;
    private final CardRepository cardRepository;

    public DigimonController(UserRepository userRepository, DeckRepository deckRepository, CardRepository cardRepository, DeckCardRepository deckCardRepository) {
        this.userRepository = userRepository;
        this.deckRepository = deckRepository;
        this.cardRepository = cardRepository;
        this.deckCardRepository = deckCardRepository;
    }

    @GetMapping("/user")
    public User getUser(@RequestParam String username) {
        return userRepository.findByUsername(username);
    }

    @PostMapping("/user")
    public User createUser(@RequestParam String username, @RequestParam String password, @RequestParam String image) {
        User temp = userRepository.findByUsername(username);
        if(temp == null) {
            User user = new User();
            user.setUsername(username);
            user.setPassword(password);
            user.setImage(image);
            return userRepository.save(user);
        }
        else {
            return null;
        }
    }

    @DeleteMapping("/user")
    public void deleteUser(@RequestParam String username) {
        User user = userRepository.findByUsername(username);
        if(user != null) {
            userRepository.delete(user);
        }
    }

    @GetMapping("/deck/getAll")
    public List<Deck> getAllDeck() {
        List<Deck> decks = (List<Deck>) deckRepository.findAll();
        return decks;
    }

    @GetMapping("/user/deck")
    public List<Deck> getUserDeck(@RequestParam String username) {
        User user = userRepository.findByUsername(username);
        if(user != null) {
            return user.getDecks();
        }
        return null;
    }


    @PostMapping("/user/deck")
    public ResponseEntity<User> addDeck(@RequestParam String username, @RequestBody Deck deck) {
        
        User user = userRepository.findByUsername(username);
        if(user != null) {
            if(deck.getId() == 0) {
                deck.setId(null);
                user.addDeck(deck);
                userRepository.save(user);
            } else {
                Deck temp = deckRepository.findById(deck.getId()).orElse(null);
                if(temp != null) {
                    temp.setName(deck.getName());
                    temp.getDeckCards().clear();
                    temp.getDeckCards().addAll(deck.getDeckCards());
                    deckRepository.save(temp);
                }
            }
            return ResponseEntity.ok(user);
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/user/deck")
    public ResponseEntity<User> deleteDeck(@RequestParam String username, @RequestParam String deckName) {
        User user = userRepository.findByUsername(username);
        if(user != null) {
            List<Deck> decks = user.getDecks();
            for(Deck deck : decks) {
                if(deck.getName().equals(deckName)) {
                    decks.remove(deck);
                    userRepository.save(user);
                    return ResponseEntity.ok(user);
                }
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @GetMapping("/card/allCards")
    public List<Card> getAllCards() {
        return (List<Card>) cardRepository.findAll();
    }

    @GetMapping("/card")
    public Card getCard(@RequestParam String cardCode) {
        return cardRepository.findByCode(cardCode);
    }



    @PostMapping("/card")
    public ResponseEntity<Card> addCard(@RequestBody Card card) {
        Card temp = cardRepository.findByCode(card.getCode());
        if(temp == null) {
            temp = new Card();
            temp.setCode(card.getCode());
            temp.setName(card.getName());
            temp.setDefaultSrc(card.getDefaultSrc());
            temp.setActualSrc(card.getActualSrc());
            cardRepository.save(temp);
        
        }
        else {
            temp.setActualSrc(card.getActualSrc());
            cardRepository.save(temp);
        }
        return ResponseEntity.ok(temp);
    }

    
    // @GetMapping("user/deck")
    // public Card[] getCardsFromDeck(@RequestParam String username) {
    //     Deck deck = this.getUserDeck(username);
    //     return cards;
    // }

    public DeckCard comprobarDeckCard(Deck deck, Card card) {
        if(deck != null && card != null) {
            for(DeckCard deckCard : deck.getDeckCards()) {
                if(deckCard.getCard().getCode().equals(card.getCode())) {
                    deckCard.setCard(card);
                    deckCard.setDeck(deck);
                    return deckCard;
                }
            }
        }
        return null;
    }

    @GetMapping("/user/deck/card")
    public DeckCard getDeckCard(@RequestParam long deck_id, @RequestParam long card_id) {
        Deck deck = deckRepository.findById(deck_id).orElse(null);
        Card card = cardRepository.findById(card_id).orElse(null);
        return comprobarDeckCard(deck, card);
    }
    

    @PostMapping("/user/deck/card")
    public ResponseEntity<Deck> addCardToDeck(@RequestParam Long deck_id, @RequestBody Card card) {
        Deck deck = deckRepository.findById(deck_id).orElse(null);
        if(deck != null && card != null) {
            if(cardRepository.findByCode(card.getCode()) == null) {
                card.setActualSrc("https://images.digimoncard.io/images/assets/CardBack.jpg");
                cardRepository.save(card);

            }
            DeckCard deckCard = comprobarDeckCard(deck, card);
            if(deckCard == null) {
                deckCard = new DeckCard();
                deckCard.setDeck(deck);
                deckCard.setCard(card);
                deckCard.setCantidad(1);
                deck.getDeckCards().add(deckCard);
            }
            else {
                deckCard.setCantidad(deckCard.getCantidad() + 1);
            }
            deckRepository.save(deck);
            return ResponseEntity.ok(deck);
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/user/deck/card/remove")
    public ResponseEntity<Deck> removeCardToDeck(@RequestBody Deck deck, @RequestParam Long deckcard_id) {
        deck = deckRepository.findById(deck.getId()).orElse(null);
        if(deck != null) {
            int index = -1;

        for(int i = 0; i < deck.getDeckCards().size(); i++) {
            if(deck.getDeckCards().get(i).getId() == deckcard_id) {
                index = i;
                break;
            }
        }
        if(deck.getDeckCards().get(index).getCantidad() > 1) {
            deck.getDeckCards().get(index).setCantidad(deck.getDeckCards().get(index).getCantidad() - 1);
        }
        else {
           deck.getDeckCards().remove(index);
        }
        this.deckRepository.save(deck);
        return ResponseEntity.ok(deck);
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        

        
    }
    
}
