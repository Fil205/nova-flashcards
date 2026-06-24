import { api } from './client';
import type { ProfileSettings } from '$lib/types';

export const settingsApi = {
	get(profileId: number): Promise<{ settings: ProfileSettings }> {
		return api.get(`/profiles/${profileId}/settings`);
	},

	update(profileId: number, data: Partial<ProfileSettings>): Promise<{ settings: ProfileSettings }> {
		return api.put(`/profiles/${profileId}/settings`, data);
	},

	setGeminiKey(profileId: number, apiKey: string): Promise<{ has_api_key: boolean }> {
		return api.put(`/profiles/${profileId}/gemini-key`, { api_key: apiKey });
	},

	deleteGeminiKey(profileId: number): Promise<{ has_api_key: boolean }> {
		return api.delete(`/profiles/${profileId}/gemini-key`);
	},

	listGeminiModels(profileId: number): Promise<{ models: string[] }> {
		return api.get(`/profiles/${profileId}/gemini-models`);
	},
};
