import { Deck } from "./deck";

export interface User {
    id: number;
    username: string;
    password: string;
    image: string;
    decks: Deck[];
}

