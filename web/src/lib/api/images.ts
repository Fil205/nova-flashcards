/**
 * Card image API — multipart upload + delete.
 *
 * Upload uses FormData directly (NOT the JSON `api` client in client.ts, which
 * forces Content-Type: application/json). Errors are mapped to ApiError so they
 * read consistently with the rest of the app.
 */

import { ApiError } from './client';
import type { CardImage, CardSection } from '$lib/types';

const BASE = '/api';

export const imagesApi = {
	/** Upload one (already compressed) image blob to a card section. */
	async upload(
		cardId: number,
		blob: Blob,
		section: CardSection,
		filename: string,
		alt?: string
	): Promise<{ image: CardImage }> {
		const form = new FormData();
		form.append('file', blob, filename);
		form.append('section', section);
		if (alt) form.append('alt', alt);

		const res = await fetch(`${BASE}/cards/${cardId}/images`, { method: 'POST', body: form });
		const data = await res
			.json()
			.catch(() => ({ error: { code: 'PARSE_ERROR', message: 'Risposta non valida dal server.' } }));

		if (!res.ok) {
			const err = data?.error ?? {};
			throw new ApiError(err.code ?? 'UNKNOWN', err.message ?? `HTTP ${res.status}`, res.status);
		}
		return data as { image: CardImage };
	},

	/** Delete an image (row + file). */
	async remove(imageId: number): Promise<void> {
		const res = await fetch(`${BASE}/images/${imageId}`, { method: 'DELETE' });
		if (!res.ok && res.status !== 204) {
			const data = await res.json().catch(() => ({}));
			const err = data?.error ?? {};
			throw new ApiError(err.code ?? 'UNKNOWN', err.message ?? `HTTP ${res.status}`, res.status);
		}
	},
};
