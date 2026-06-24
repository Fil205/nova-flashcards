/**
 * Offline application cache — localStorage, typed, best-effort.
 *
 * Keys:
 *   fc.cache.profiles          → ProfileSummary[]
 *   fc.cache.bootstrap.<id>    → BootstrapData
 *   fc.cache.deck.<id>         → Deck
 *
 * All operations are wrapped in try/catch so a quota error or corrupted
 * entry never crashes the app. The cache is write-through (updated on
 * every successful API response) and used as read fallback only when the
 * network is truly unreachable (TypeError, not ApiError).
 */

import type { BootstrapData, Deck, ProfileSummary } from '$lib/types';

const KEYS = {
	profiles: 'fc.cache.profiles',
	bootstrap: (id: number) => `fc.cache.bootstrap.${id}`,
	deck: (id: number) => `fc.cache.deck.${id}`,
} as const;

// ── helpers ───────────────────────────────────────────────────────────────────

function get<T>(key: string): T | null {
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : null;
	} catch {
		return null;
	}
}

function set(key: string, value: unknown): void {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// quota exceeded or private mode — ignore silently
	}
}

function remove(key: string): void {
	try {
		localStorage.removeItem(key);
	} catch {
		// ignore
	}
}

// ── profiles ──────────────────────────────────────────────────────────────────

export function getProfiles(): ProfileSummary[] | null {
	return get<ProfileSummary[]>(KEYS.profiles);
}

export function setProfiles(profiles: ProfileSummary[]): void {
	set(KEYS.profiles, profiles);
}

// ── bootstrap (profile + settings + decks summary + review cards) ─────────────

export function getBootstrap(profileId: number): BootstrapData | null {
	return get<BootstrapData>(KEYS.bootstrap(profileId));
}

export function setBootstrap(profileId: number, data: BootstrapData): void {
	set(KEYS.bootstrap(profileId), data);
}

// ── full deck (with cards) ────────────────────────────────────────────────────

export function getDeck(deckId: number): Deck | null {
	return get<Deck>(KEYS.deck(deckId));
}

export function setDeck(deckId: number, deck: Deck): void {
	set(KEYS.deck(deckId), deck);
}

/** Remove all cache entries for a profile (call on profile delete). */
export function clearProfile(profileId: number): void {
	const bootstrap = getBootstrap(profileId);
	if (bootstrap) {
		// Remove all cached decks belonging to this profile
		for (const d of bootstrap.decks) {
			remove(KEYS.deck(d.id));
		}
	}
	remove(KEYS.bootstrap(profileId));
}

/** Returns true if the full deck is already in cache (used by prefetchAll). */
export function hasDeck(deckId: number): boolean {
	return get<unknown>(KEYS.deck(deckId)) !== null;
}
