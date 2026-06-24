/**
 * Review store — tracks per-card "didn't know" history.
 * Persisted server-side in card_reviews table; hydrated on bootstrap.
 * Svelte 5 runes.
 */

import type { Deck } from '$lib/types';

class ReviewStore {
	/** Set of card IDs the user has marked as "didn't know" (any profile). */
	unknownIds = $state<Set<number>>(new Set());

	/** Hydrate from bootstrap payload. */
	hydrate(list: { deck_id: number; card_id: number }[]): void {
		this.unknownIds = new Set(list.map((x) => x.card_id));
	}

	/** Clear on profile switch / delete. */
	clear(): void {
		this.unknownIds = new Set();
	}

	/** Returns card IDs that are unknown AND belong to this deck. */
	idsForDeck(deck: Deck): number[] {
		return deck.cards.map((c) => c.id).filter((id) => this.unknownIds.has(id));
	}

	/** Optimistically mark cards as missed (adds to local set). */
	markMissed(cardIds: number[]): void {
		if (cardIds.length === 0) return;
		const s = new Set(this.unknownIds);
		cardIds.forEach((id) => s.add(id));
		this.unknownIds = s;
	}

	/** Optimistically mark cards as known (removes from local set). */
	markKnown(cardIds: number[]): void {
		if (cardIds.length === 0) return;
		const s = new Set(this.unknownIds);
		cardIds.forEach((id) => s.delete(id));
		this.unknownIds = s;
	}
}

export const reviewStore = new ReviewStore();
