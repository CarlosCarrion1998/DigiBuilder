import { DeckCard } from "./deck-card";

export interface Card {
    id: number;
    name: string;
    code: string;
    defaultSrc: string;
    actualSrc: string;
}