import { api } from './client';
import type { Deck, DeckSummary, DeckSource } from '$lib/types';

export interface CreateDeckPayload {
	name: string;
	description?: string;
	lang?: string;
	source?: DeckSource;
}

export interface StudyResultPayload {
	mode: 'sequential' | 'shuffle';
	total: number;
	correct: number;
	partial: number;
	wrong: number;
	score: number;
	duration_ms?: number;
	wrong_card_ids?: number[];
	known_card_ids?: number[];
}

export const decksApi = {
	list(profileId: number): Promise<{ decks: DeckSummary[] }> {
		return api.get(`/profiles/${profileId}/decks`);
	},

	create(profileId: number, data: CreateDeckPayload): Promise<{ deck: Deck }> {
		return api.post(`/profiles/${profileId}/decks`, data);
	},

	get(deckId: number): Promise<{ deck: Deck }> {
		return api.get(`/decks/${deckId}`);
	},

	update(deckId: number, data: Partial<CreateDeckPayload>): Promise<{ deck: Deck }> {
		return api.patch(`/decks/${deckId}`, data);
	},

	delete(deckId: number): Promise<void> {
		return api.delete(`/decks/${deckId}`);
	},

	recordStudy(deckId: number, result: StudyResultPayload): Promise<{ ok: boolean; score: number }> {
		return api.post(`/decks/${deckId}/study`, result);
	},
};
