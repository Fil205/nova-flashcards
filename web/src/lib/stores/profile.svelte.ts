/**
 * Active profile store — Svelte 5 runes.
 *
 * The active profile ID is persisted in localStorage so the app
 * reopens on the same profile. All actual data comes from the server.
 */

import { profilesApi } from '$lib/api/profiles';
import { isNetworkError } from '$lib/api/client';
import { reviewStore } from '$lib/stores/review.svelte';
import * as cache from '$lib/offline/cache';
import type { ProfileSummary, ProfileSettings, DeckSummary, BootstrapData } from '$lib/types';

const LS_KEY = 'falschcard.activeProfileId';

class ProfileStore {
	// List of all profiles (for the switcher)
	profiles = $state<ProfileSummary[]>([]);

	// Currently active profile data (null = not selected / loading)
	active     = $state<ProfileSummary | null>(null);
	settings   = $state<ProfileSettings | null>(null);

	// Deck list lives here too (loaded on bootstrap, then managed by deckStore)
	bootstrapDecks = $state<DeckSummary[]>([]);

	loading = $state(false);
	error   = $state<string | null>(null);

	/** ID stored in localStorage — may be stale (profile deleted on server). */
	get storedId(): number | null {
		if (typeof localStorage === 'undefined') return null;
		const v = localStorage.getItem(LS_KEY);
		return v ? parseInt(v, 10) : null;
	}

	/** Save active profile ID to localStorage. */
	private persist(id: number): void {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(LS_KEY, String(id));
		}
	}

	/** Clear stored profile from localStorage. */
	clearStored(): void {
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem(LS_KEY);
		}
	}

	/** Load the list of profiles from the server. */
	async loadProfiles(): Promise<void> {
		try {
			const { profiles } = await profilesApi.list();
			this.profiles = profiles;
			cache.setProfiles(profiles);
		} catch {
			// Offline fallback: use cached profile list so the gate can show profiles
			this.profiles = cache.getProfiles() ?? [];
		}
	}

	/**
	 * Bootstrap the app with a profile.
	 * Returns true if successful, false if the profile was not found.
	 */
	async bootstrap(id: number): Promise<boolean> {
		this.loading = true;
		this.error   = null;
		try {
			const data: BootstrapData = await profilesApi.bootstrap(id);
			this.active         = data.profile;
			this.settings       = data.settings;
			this.bootstrapDecks = data.decks;
			reviewStore.hydrate(data.unknown_cards ?? []);
			this.persist(id);
			// Write-through: save to offline cache so we can boot without network
			cache.setBootstrap(id, data);
			return true;
		} catch (err: unknown) {
			const e = err as { status?: number };
			if (e?.status === 404) {
				// Profile deleted on server — clear local id, no point keeping cache
				this.clearStored();
				return false;
			}

			if (isNetworkError(err)) {
				// Offline: try to boot from cached bootstrap data
				const cached = cache.getBootstrap(id);
				if (cached) {
					this.active         = cached.profile;
					this.settings       = cached.settings;
					this.bootstrapDecks = cached.decks;
					reviewStore.hydrate(cached.unknown_cards ?? []);
					// Keep stored id so next online session resumes the same profile
					return true;
				}
			}

			this.error = 'Impossibile caricare il profilo. Controlla la connessione.';
			return false;
		} finally {
			this.loading = false;
		}
	}

	/** Create a new profile and immediately make it active. */
	async createAndActivate(name: string): Promise<ProfileSummary> {
		const { profile } = await profilesApi.create(name);
		this.profiles = [...this.profiles, profile];
		await this.bootstrap(profile.id);
		return profile;
	}

	/** Switch to a different profile. */
	async switchTo(id: number): Promise<void> {
		await this.bootstrap(id);
	}

	/** Update settings in-store (after API call). */
	updateSettings(patch: Partial<ProfileSettings>): void {
		if (this.settings) {
			this.settings = { ...this.settings, ...patch };
		}
	}

	/** Delete a profile and reset if it was active. */
	async deleteProfile(id: number): Promise<void> {
		await profilesApi.delete(id);
		this.profiles = this.profiles.filter((p) => p.id !== id);
		// Remove all offline cache entries for this profile
		cache.clearProfile(id);
		if (this.active?.id === id) {
			this.active   = null;
			this.settings = null;
			this.bootstrapDecks = [];
			reviewStore.clear();
			this.clearStored();
		}
	}

	/** Rename active profile. */
	async renameProfile(id: number, name: string): Promise<void> {
		const { profile } = await profilesApi.rename(id, name);
		this.profiles = this.profiles.map((p) => (p.id === id ? profile : p));
		if (this.active?.id === id) {
			this.active = profile;
		}
	}
}

export const profileStore = new ProfileStore();
