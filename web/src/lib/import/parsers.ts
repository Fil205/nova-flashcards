/**
 * Import parser for flashcard JSON files.
 * Format: [{ question, answer, explanation? }] or Falschcard export format.
 *
 * Uses four progressive fallbacks for common LLM mistakes:
 *  1. Direct JSON.parse on the cleaned string (fastest path).
 *  2. Extract the first array/object from surrounding prose, then JSON.parse.
 *  3. Repair unescaped internal quotes and trailing commas, then JSON.parse.
 *  4. Error.
 *
 * Each fallback only activates if the previous one fails, so valid JSON is
 * never unnecessarily modified.
 */

import type { CardDraft, ImportParseResult } from '$lib/types';

// ─── JSON parser helpers ──────────────────────────────────────────────────────

/**
 * Strip markdown code fences (``` or ```json) that LLMs commonly add even when
 * instructed not to. Mirrors the same regex used server-side in GeminiService.php.
 */
function stripFences(text: string): string {
	return text.replace(/```(?:json)?\s*\n?|\n?```/gi, '').trim();
}

/**
 * Try to extract the first JSON array (or object) from a string that may
 * contain surrounding prose or preamble text.
 */
function extractJson(text: string): string | null {
	// Prefer array — the expected AI output format
	const arrStart = text.indexOf('[');
	const arrEnd   = text.lastIndexOf(']');
	if (arrStart !== -1 && arrEnd > arrStart) {
		return text.slice(arrStart, arrEnd + 1);
	}
	// Fallback: object (Falschcard export format)
	const objStart = text.indexOf('{');
	const objEnd   = text.lastIndexOf('}');
	if (objStart !== -1 && objEnd > objStart) {
		return text.slice(objStart, objEnd + 1);
	}
	return null;
}

/**
 * Repair JSON that has unescaped double quotes inside string values — the most
 * common mistake in LLM-generated JSON, e.g.:
 *
 *   "answer": "...il Premio "Business Game" 2025..."   ← invalid
 *   "answer": "...il Premio \"Business Game\" 2025..."  ← what we produce
 *
 * Also removes trailing commas before } or ] (another frequent LLM mistake).
 *
 * Strategy: LLM output is reliably one JSON field per line, so we process
 * line by line. For each key–value line we:
 *  1. Match the key (strictly: no unescaped quotes inside a key).
 *  2. Greedily capture everything between the first and LAST `"` on the line
 *     as the raw value — this includes any inner unescaped quotes.
 *  3. Normalize existing `\"` back to `"`, then re-escape ALL `"` → `\"`.
 *     This is idempotent: an already-correct `\"` round-trips safely.
 *
 * Limitation (accepted): multi-line values and raw backslash paths are not
 * repaired — they are not present in typical flashcard AI output.
 */
function repairLooseJson(text: string): string {
	// Matches:  <whitespace>"key": "value"<optional comma><whitespace>
	// Group 1 = prefix (whitespace + key + colon + space)
	// Group 2 = raw value content between the outermost quotes
	// Group 3 = trailing comma/whitespace
	const kvLine = /^(\s*"(?:[^"\\]|\\.)*"\s*:\s*)"(.*)"(\s*,?\s*)$/;

	const repaired = text
		.split('\n')
		.map((line) => {
			const m = line.match(kvLine);
			if (!m) return line;
			const [, prefix, rawValue, suffix] = m;
			// Normalize (undo existing escapes) then re-escape — idempotent
			const fixed = rawValue.replace(/\\"/g, '"').replace(/"/g, '\\"');
			return `${prefix}"${fixed}"${suffix}`;
		})
		.join('\n');

	// Remove trailing commas immediately before } or ] (structural fix)
	return repaired.replace(/,(\s*[}\]])/g, '$1');
}

// ─── JSON parser ──────────────────────────────────────────────────────────────

export function parseJson(text: string): ImportParseResult {
	const errors: string[] = [];

	// Step 1 — strip markdown fences and surrounding whitespace
	const cleaned = stripFences(text);

	// Steps 2–4: try JSON.parse with progressive fallbacks
	let parsed: unknown;

	try {
		// Step 2 — direct parse (happy path: valid JSON)
		parsed = JSON.parse(cleaned);
	} catch {
		const extracted = extractJson(cleaned);
		const candidate = extracted ?? cleaned;

		try {
			// Step 3 — parse the extracted array/object (strips surrounding prose)
			parsed = JSON.parse(candidate);
		} catch {
			// Step 4 — repair unescaped quotes and trailing commas, then retry
			try {
				parsed = JSON.parse(repairLooseJson(candidate));
			} catch {
				return {
					cards:  [],
					errors: [
						'JSON non valido anche dopo tentativo di riparazione automatica. ' +
						'Prova a rigenerare con l\'AI o correggi manualmente le virgolette interne (usa \\" invece di ").',
					],
				};
			}
		}
	}

	// ── Validate and map parsed value to cards ────────────────────────────────

	const obj = (typeof parsed === 'object' && parsed !== null)
		? (parsed as Record<string, unknown>)
		: null;

	// Falschcard export format: { decks: [{ name, cards: [...] }] }
	if (obj && 'decks' in obj) {
		const data  = parsed as { decks: Array<{ cards?: CardDraft[] }> };
		const cards: CardDraft[] = [];
		for (const deck of data.decks) {
			if (Array.isArray(deck.cards)) {
				cards.push(...deck.cards.filter((c) => c.question && c.answer));
			}
		}
		return { cards, errors };
	}

	// Single deck object: { name?, description?, cards: [...] }
	if (obj && Array.isArray(obj.cards)) {
		const cards = mapCards(obj.cards as unknown[], errors);
		return {
			cards,
			errors,
			name:        typeof obj.name === 'string' ? obj.name.trim() : undefined,
			description: typeof obj.description === 'string' ? obj.description.trim() : undefined,
		};
	}

	// Plain array: [{ question, answer, explanation? }]
	if (Array.isArray(parsed)) {
		return { cards: mapCards(parsed, errors), errors };
	}

	return {
		cards:  [],
		errors: ['Formato JSON non riconosciuto. Usa un array, un oggetto mazzo o l\'export Falschcard.'],
	};
}

/** Validate and map an array of card-like objects to CardDraft[]. */
function mapCards(arr: unknown[], errors: string[]): CardDraft[] {
	const cards: CardDraft[] = [];
	for (let i = 0; i < arr.length; i++) {
		const item = (arr[i] ?? {}) as Record<string, unknown>;
		if (!item.question || !item.answer) {
			errors.push(`Elemento ${i + 1}: "question" o "answer" mancante — carta saltata`);
			continue;
		}
		cards.push({
			question:    String(item.question),
			answer:      String(item.answer),
			explanation: item.explanation ? String(item.explanation) : undefined,
		});
	}
	return cards;
}
