import { api } from './client';
import type { Card, CardDraft } from '$lib/types';

export const cardsApi = {
	create(deckId: number, card: CardDraft): Promise<{ card: Card }> {
		return api.post(`/decks/${deckId}/cards`, card);
	},

	bulkCreate(deckId: number, cards: CardDraft[]): Promise<{ inserted: number }> {
		return api.post(`/decks/${deckId}/cards/bulk`, { cards });
	},

	update(cardId: number, data: Partial<CardDraft>): Promise<{ card: Card }> {
		return api.patch(`/cards/${cardId}`, data);
	},

	delete(cardId: number): Promise<void> {
		return api.delete(`/cards/${cardId}`);
	},
};
