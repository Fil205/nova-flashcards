/**
 * Decks store — Svelte 5 runes.
 * Source of truth: server. This store is a client-side cache that stays
 * in sync after each API call (optimistic updates where appropriate).
 */

import { decksApi, type CreateDeckPayload, type StudyResultPayload } from '$lib/api/decks';
import { cardsApi } from '$lib/api/cards';
import { isNetworkError } from '$lib/api/client';
import * as cache from '$lib/offline/cache';
import * as outbox from '$lib/offline/outbox';
import type { Deck, DeckSummary, Card, CardDraft } from '$lib/types';

class DecksStore {
	decks   = $state<DeckSummary[]>([]);
	loading = $state(false);
	error   = $state<string | null>(null);

	// The currently open deck (full with cards)
	currentDeck = $state<Deck | null>(null);

	/** Hydrate from bootstrap data (no extra network call). */
	hydrate(decks: DeckSummary[]): void {
		this.decks = decks;
	}

	/** Clear all decks (on profile switch). */
	clear(): void {
		this.decks       = [];
		this.currentDeck = null;
	}

	/** Load deck list for a profile from server. */
	async load(profileId: number): Promise<void> {
		this.loading = true;
		this.error   = null;
		try {
			const { decks } = await decksApi.list(profileId);
			this.decks = decks;
		} catch {
			this.error = 'Impossibile caricare i mazzi.';
		} finally {
			this.loading = false;
		}
	}

	/** Load a single deck with all cards. */
	async loadDeck(deckId: number): Promise<Deck | null> {
		try {
			const { deck } = await decksApi.get(deckId);
			this.currentDeck = deck;
			cache.setDeck(deckId, deck);
			return deck;
		} catch (err) {
			// Offline fallback: serve from cache if available
			if (isNetworkError(err)) {
				const cached = cache.getDeck(deckId);
				if (cached) {
					this.currentDeck = cached;
					return cached;
				}
			}
			return null;
		}
	}

	/**
	 * Prefetch all decks in the current list that are not yet cached.
	 * Called in the background after a successful online bootstrap so every
	 * deck is available offline without the user having to open each one.
	 * Max 3 concurrent requests to avoid hammering the server.
	 */
	async prefetchAll(): Promise<void> {
		const uncached = this.decks.filter((d) => !cache.hasDeck(d.id));
		if (uncached.length === 0) return;

		// Process in batches of 3
		for (let i = 0; i < uncached.length; i += 3) {
			const batch = uncached.slice(i, i + 3);
			await Promise.all(
				batch.map(async (summary) => {
					try {
						const { deck } = await decksApi.get(summary.id);
						cache.setDeck(summary.id, deck);
					} catch {
						// Silently ignore — prefetch is best-effort
					}
				})
			);
		}
	}

	/** Create a new deck. */
	async create(profileId: number, data: CreateDeckPayload): Promise<Deck> {
		const { deck } = await decksApi.create(profileId, data);
		// Add summary to list
		const summary: DeckSummary = { ...deck, card_count: 0 };
		this.decks = [...this.decks, summary];
		this.currentDeck = deck;
		return deck;
	}

	/** Update deck metadata. */
	async update(deckId: number, data: Partial<CreateDeckPayload>): Promise<void> {
		const { deck } = await decksApi.update(deckId, data);
		this.decks = this.decks.map((d) =>
			d.id === deckId ? { ...d, name: deck.name, description: deck.description, lang: deck.lang } : d
		);
		if (this.currentDeck?.id === deckId) {
			this.currentDeck = deck;
		}
	}

	/** Delete a deck. */
	async delete(deckId: number): Promise<void> {
		await decksApi.delete(deckId);
		this.decks = this.decks.filter((d) => d.id !== deckId);
		if (this.currentDeck?.id === deckId) {
			this.currentDeck = null;
		}
	}

	/** Record a completed study session. */
	async recordStudy(deckId: number, result: StudyResultPayload): Promise<void> {
		try {
			await decksApi.recordStudy(deckId, result);
		} catch (err) {
			if (isNetworkError(err)) {
				// Offline: queue the session; optimistic local update still happens below
				outbox.enqueue(deckId, result);
			} else {
				// HTTP error — re-throw so the caller can show a warning toast
				throw err;
			}
		}
		// Optimistic local stats update (runs whether saved online or queued offline)
		this.decks = this.decks.map((d) =>
			d.id === deckId
				? {
						...d,
						times_studied:   d.times_studied + 1,
						last_score:      result.score,
						last_studied_at: new Date().toISOString(),
						mastery:         result.score,
					}
				: d
		);
	}

	// ── Card operations ───────────────────────────────────────────────────────

	/** Add a card to current deck. */
	async addCard(deckId: number, card: CardDraft): Promise<Card> {
		const { card: newCard } = await cardsApi.create(deckId, card);
		if (this.currentDeck?.id === deckId) {
			this.currentDeck = {
				...this.currentDeck,
				cards:      [...this.currentDeck.cards, newCard],
				card_count: this.currentDeck.card_count + 1,
			};
		}
		// Update card_count in summary
		this.decks = this.decks.map((d) =>
			d.id === deckId ? { ...d, card_count: d.card_count + 1 } : d
		);
		return newCard;
	}

	/** Bulk import cards into a deck. */
	async bulkAddCards(deckId: number, cards: CardDraft[]): Promise<number> {
		const { inserted } = await cardsApi.bulkCreate(deckId, cards);
		// Reload the deck to get updated cards
		await this.loadDeck(deckId);
		this.decks = this.decks.map((d) =>
			d.id === deckId ? { ...d, card_count: d.card_count + inserted } : d
		);
		return inserted;
	}

	/** Update a card. */
	async updateCard(cardId: number, data: Partial<CardDraft>): Promise<void> {
		const { card } = await cardsApi.update(cardId, data);
		if (this.currentDeck) {
			this.currentDeck = {
				...this.currentDeck,
				cards: this.currentDeck.cards.map((c) => (c.id === cardId ? card : c)),
			};
		}
	}

	/** Delete a card. */
	async deleteCard(cardId: number, deckId: number): Promise<void> {
		await cardsApi.delete(cardId);
		if (this.currentDeck?.id === deckId) {
			this.currentDeck = {
				...this.currentDeck,
				cards:      this.currentDeck.cards.filter((c) => c.id !== cardId),
				card_count: Math.max(0, this.currentDeck.card_count - 1),
			};
		}
		this.decks = this.decks.map((d) =>
			d.id === deckId ? { ...d, card_count: Math.max(0, d.card_count - 1) } : d
		);
	}

	/** Derived: find a deck summary by id. */
	findById(id: number): DeckSummary | undefined {
		return this.decks.find((d) => d.id === id);
	}
}

export const deckStore = new DecksStore();
