/**
 * Offline outbox — queues study sessions that couldn't be saved to the server.
 *
 * Only `recordStudy` needs to be queued: it's the sole write operation that
 * occurs during a study session (carries wrong/known card IDs too).
 * CRUD on decks/cards is online-only and already fails with user-visible toasts.
 *
 * Persistence: `fc.outbox` in localStorage (array of pending entries).
 *
 * flush() is called:
 *   - at app boot (in case the user was offline last session)
 *   - whenever the `online` event fires
 */

import { decksApi, type StudyResultPayload } from '$lib/api/decks';
import { isNetworkError } from '$lib/api/client';

const KEY = 'fc.outbox';

export interface OutboxEntry {
	id: string;              // random uuid — used to dedup on retry
	deckId: number;
	payload: StudyResultPayload;
	queuedAt: number;        // Unix ms
}

// ── persistence helpers ───────────────────────────────────────────────────────

function load(): OutboxEntry[] {
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? (JSON.parse(raw) as OutboxEntry[]) : [];
	} catch {
		return [];
	}
}

function save(entries: OutboxEntry[]): void {
	try {
		localStorage.setItem(KEY, JSON.stringify(entries));
	} catch {
		// quota — not much we can do
	}
}

// ── public API ────────────────────────────────────────────────────────────────

/** Number of sessions waiting to be synced. */
export function pending(): number {
	return load().length;
}

/** Add a study session to the outbox. */
export function enqueue(deckId: number, payload: StudyResultPayload): void {
	const entries = load();
	entries.push({
		id:       crypto.randomUUID(),
		deckId,
		payload,
		queuedAt: Date.now(),
	});
	save(entries);
}

/**
 * Attempt to flush all queued sessions to the server.
 * - Successful entries are removed from the queue.
 * - Network-error entries stay in the queue for the next retry.
 * - HTTP-error entries (e.g. 404 deck deleted) are discarded (unrecoverable).
 *
 * Returns the number of successfully synced sessions.
 */
export async function flush(): Promise<number> {
	const entries = load();
	if (entries.length === 0) return 0;

	const remaining: OutboxEntry[] = [];
	let synced = 0;

	for (const entry of entries) {
		try {
			await decksApi.recordStudy(entry.deckId, entry.payload);
			synced++;
			// successfully sent — drop from queue (don't add to remaining)
		} catch (err) {
			if (isNetworkError(err)) {
				// Still offline — keep in queue and stop retrying for this flush
				remaining.push(entry);
			}
			// HTTP error (404, 422, …) → deck deleted or invalid — discard silently
		}
	}

	save(remaining);
	return synced;
}
