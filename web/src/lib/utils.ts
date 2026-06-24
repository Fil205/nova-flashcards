/**
 * Parses a route `[id]` parameter as a positive integer.
 * Returns NaN for non-numeric, zero, or negative values.
 * Callers should redirect to '/' when NaN is returned.
 *
 * @example
 *   const deckId = $derived(parseId(page.params.id));
 *   onMount(() => { if (isNaN(deckId)) { goto('/'); return; } ... });
 */
export function parseId(param: string | undefined): number {
	const n = parseInt(param ?? '', 10);
	return Number.isFinite(n) && n > 0 ? n : NaN;
}
