import { User } from "./user";
import { DeckCard } from "./deck-card";


export interface Deck {
    id: number;
    name: string;
    user: User;
    deckCards: DeckCard[];
}