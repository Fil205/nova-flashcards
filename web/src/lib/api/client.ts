/**
 * Base API client.
 * All requests go to /api (same origin — proxied by Vite in dev, Nginx in prod).
 */

const BASE = '/api';

export class ApiError extends Error {
	constructor(
		public readonly code: string,
		message: string,
		public readonly status: number
	) {
		super(message);
		this.name = 'ApiError';
	}
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
	const opts: RequestInit = {
		method,
		headers: { 'Content-Type': 'application/json' },
	};
	if (body !== undefined) {
		opts.body = JSON.stringify(body);
	}

	const res = await fetch(BASE + path, opts);

	// No-content responses (204)
	if (res.status === 204) {
		return undefined as T;
	}

	const data = await res.json().catch(() => ({ error: { code: 'PARSE_ERROR', message: 'Invalid JSON response' } }));

	if (!res.ok) {
		const err = data?.error ?? {};
		throw new ApiError(err.code ?? 'UNKNOWN', err.message ?? `HTTP ${res.status}`, res.status);
	}

	return data as T;
}

export const api = {
	get:    <T>(path: string) => request<T>('GET', path),
	post:   <T>(path: string, body?: unknown) => request<T>('POST', path, body),
	put:    <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
	patch:  <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
	delete: <T>(path: string) => request<T>('DELETE', path),
};

/**
 * Returns true when the error is a network / connectivity failure rather
 * than an HTTP-level error from the server.
 * Use this to distinguish "offline" from "server returned 4xx/5xx".
 */
export function isNetworkError(err: unknown): boolean {
	return !(err instanceof ApiError);
}

/** User-friendly error message from any thrown value. */
export function friendlyError(err: unknown): string {
	if (err instanceof ApiError) {
		if (err.status === 404) return err.message;
		if (err.status === 409) return err.message;
		if (err.status === 422) return 'Dati non validi. Controlla i campi.';
		if (err.status === 400) return err.message;
		if (err.status >= 500) return err.message || 'Errore del server. Riprova tra qualche secondo.';
		return err.message || 'Errore del server.';
	}
	if (err instanceof Error) return err.message;
	return 'Si è verificato un errore imprevisto.';
}

/**
 * Stream SSE from a POST endpoint (for AI review/tutor).
 * Calls onDelta for each text chunk, onComplete when done, onError on failure.
 * Returns a cancel function.
 */
export function streamPost(
	path: string,
	body: unknown,
	onDelta: (delta: string) => void,
	onComplete: (full: string) => void,
	onError: (msg: string) => void
): () => void {
	const controller = new AbortController();
	let cancelled = false;

	(async () => {
		try {
			const res = await fetch(BASE + path, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
				signal: controller.signal,
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new ApiError(
					data?.error?.code ?? 'ERROR',
					data?.error?.message ?? `HTTP ${res.status}`,
					res.status
				);
			}

			if (!res.body) throw new Error('No response body');

			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let fullText = '';
			let buffer = '';

			while (true) {
				if (cancelled) break;
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split('\n');
				buffer = lines.pop() ?? '';

				for (const line of lines) {
					if (cancelled) break;
					if (!line.startsWith('data: ')) continue;
					const jsonStr = line.slice(6).trim();
					if (!jsonStr) continue;

					try {
						const parsed = JSON.parse(jsonStr);
						if (parsed?.error) {
							// Server-sent error event (e.g. from GeminiService on upstream 4xx/5xx)
							onError(typeof parsed.error === 'string' ? parsed.error : 'Errore del server.');
							cancelled = true;
							break;
						}
						const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
						if (text) {
							fullText += text;
							onDelta(text);
						}
					} catch {
						// malformed SSE chunk — skip
					}
				}
			}

			// Flush any remaining buffered content (last SSE line without trailing \n)
			if (!cancelled && buffer.startsWith('data: ')) {
				const jsonStr = buffer.slice(6).trim();
				if (jsonStr) {
					try {
						const parsed = JSON.parse(jsonStr);
						if (parsed?.error) {
							onError(typeof parsed.error === 'string' ? parsed.error : 'Errore del server.');
							cancelled = true;
						} else {
							const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
							if (text) { fullText += text; onDelta(text); }
						}
					} catch { /* skip */ }
				}
			}

			if (!cancelled) onComplete(fullText);
		} catch (err) {
			if (!cancelled) {
				onError(friendlyError(err));
			}
		}
	})();

	return () => {
		cancelled = true;
		controller.abort();
	};
}
