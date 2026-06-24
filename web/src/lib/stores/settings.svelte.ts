/**
 * Settings store — Svelte 5 runes.
 * Wraps profile_settings. Synced with the server after every update.
 */

import { settingsApi } from '$lib/api/settings';
import { profileStore } from './profile.svelte';
import { runWithState } from './helpers';
import type { ProfileSettings } from '$lib/types';

class SettingsStore {
	saving = $state(false);
	error  = $state<string | null>(null);

	/** Current settings (proxied from profileStore). */
	get current(): ProfileSettings | null {
		return profileStore.settings;
	}

	/** Update settings on server and sync to store. */
	async update(data: Partial<ProfileSettings>): Promise<void> {
		const id = profileStore.active?.id;
		if (!id) throw new Error('Nessun profilo attivo.');

		await runWithState(
			(v) => { this.saving = v; },
			(v) => { this.error = v; },
			'Impossibile salvare le impostazioni.',
			async () => {
				const { settings } = await settingsApi.update(id, data);
				profileStore.updateSettings(settings);
			}
		);
	}

	/** Save a Gemini API key for the current profile. */
	async saveGeminiKey(apiKey: string): Promise<void> {
		const id = profileStore.active?.id;
		if (!id) throw new Error('Nessun profilo attivo.');

		await runWithState(
			(v) => { this.saving = v; },
			(v) => { this.error = v; },
			'Impossibile salvare la chiave API.',
			async () => {
				// Use the server's authoritative response rather than hardcoding true
				const { has_api_key } = await settingsApi.setGeminiKey(id, apiKey);
				profileStore.updateSettings({ has_api_key });
			}
		);
	}

	/** Delete the Gemini API key for the current profile. */
	async deleteGeminiKey(): Promise<void> {
		const id = profileStore.active?.id;
		if (!id) throw new Error('Nessun profilo attivo.');

		await runWithState(
			(v) => { this.saving = v; },
			(v) => { this.error = v; },
			'Impossibile eliminare la chiave API.',
			async () => {
				const { has_api_key } = await settingsApi.deleteGeminiKey(id);
				profileStore.updateSettings({ has_api_key });
			}
		);
	}

	/** Fetch available Gemini models. */
	async listModels(): Promise<string[]> {
		const id = profileStore.active?.id;
		if (!id) return [];
		const { models } = await settingsApi.listGeminiModels(id);
		return models;
	}
}

export const settingsStore = new SettingsStore();
