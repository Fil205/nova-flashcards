import { api } from './client';
import type { ProfileSummary, BootstrapData } from '$lib/types';

export const profilesApi = {
	list(): Promise<{ profiles: ProfileSummary[] }> {
		return api.get('/profiles');
	},

	create(name: string): Promise<{ profile: ProfileSummary }> {
		return api.post('/profiles', { name });
	},

	rename(id: number, name: string): Promise<{ profile: ProfileSummary }> {
		return api.patch(`/profiles/${id}`, { name });
	},

	delete(id: number): Promise<void> {
		return api.delete(`/profiles/${id}`);
	},

	bootstrap(id: number): Promise<BootstrapData> {
		return api.get(`/profiles/${id}/bootstrap`);
	},
};
