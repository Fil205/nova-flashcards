/**
 * Study session store — Svelte 5 runes (ephemeral, not persisted).
 */

import type { StudySession, CardResult, Verdict, TutorMessage, Card } from '$lib/types';

function shuffle<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

class StudyStore {
	session      = $state<StudySession | null>(null);
	tutorHistory = $state<TutorMessage[]>([]);
	tutorOpen    = $state(false);

	startSession(deckId: number, cards: Card[], mode: 'sequential' | 'shuffle'): void {
		const ids = cards.map((c) => c.id);
		const order = mode === 'shuffle' ? shuffle(ids) : ids;
		this.session = {
			deckId,
			mode,
			cardOrder: order,
			currentIndex: 0,
			results: [],
			startedAt: Date.now(),
		};
		this.tutorHistory = [];
		this.tutorOpen    = false;
	}

	endSession(): void {
		this.session      = null;
		this.tutorHistory = [];
		this.tutorOpen    = false;
	}

	nextCard(): void {
		if (!this.session) return;
		this.session = { ...this.session, currentIndex: this.session.currentIndex + 1 };
		this.tutorHistory = [];
	}

	prevCard(): void {
		if (!this.session) return;
		const prev = Math.max(0, this.session.currentIndex - 1);
		this.session = { ...this.session, currentIndex: prev };
		this.tutorHistory = [];
	}

	recordResult(result: Omit<CardResult, 'cardId'>): void {
		if (!this.session) return;
		const cardId = this.session.cardOrder[this.session.currentIndex];
		const cardResult: CardResult = { ...result, cardId };
		const existing = this.session.results.findIndex((r) => r.cardId === cardId);
		const results =
			existing >= 0
				? this.session.results.map((r, i) => (i === existing ? cardResult : r))
				: [...this.session.results, cardResult];
		this.session = { ...this.session, results };
	}

	/**
	 * Update only the AI feedback of an already-recorded result (by cardId).
	 * Used when the streamed answer review completes, so revisits can reconstruct
	 * the explanation without re-calling the AI.
	 */
	setAiFeedback(cardId: number, feedback: string): void {
		if (!this.session) return;
		const results = this.session.results.map((r) =>
			r.cardId === cardId ? { ...r, aiFeedback: feedback } : r
		);
		this.session = { ...this.session, results };
	}

	addTutorMessage(msg: TutorMessage): void {
		this.tutorHistory = [...this.tutorHistory, msg];
	}

	setTutorOpen(open: boolean): void {
		this.tutorOpen = open;
	}

	toggleTutor(): void {
		this.tutorOpen = !this.tutorOpen;
	}

	// ── Derived ─────────────────────────────────────────────────────────────

	get currentCardId(): number | null {
		if (!this.session) return null;
		return this.session.cardOrder[this.session.currentIndex] ?? null;
	}

	get isComplete(): boolean {
		if (!this.session) return false;
		return this.session.currentIndex >= this.session.cardOrder.length;
	}

	get totalCards(): number {
		return this.session?.cardOrder.length ?? 0;
	}

	get progress(): number {
		if (!this.totalCards) return 0;
		return this.session!.currentIndex / this.totalCards;
	}

	computeSummary(): { correct: number; partial: number; wrong: number; skipped: number; score: number; mastery: number } {
		const results = this.session?.results ?? [];
		const answered = results.filter((r) => !r.skipped);
		const correct  = results.filter((r) => r.verdict === 'correct').length;
		const partial  = results.filter((r) => r.verdict === 'partial').length;
		const wrong    = results.filter((r) => r.verdict === 'wrong').length;
		const skipped  = results.filter((r) => r.skipped).length;

		const score = answered.length === 0 ? 0
			: answered.reduce((acc, r) => {
					if (r.verdict === 'correct') return acc + 1;
					if (r.verdict === 'partial') return acc + 0.5;
					return acc;
				}, 0) / answered.length;

		return { correct, partial, wrong, skipped, score, mastery: score };
	}

	getWrongCards(): number[] {
		// Only outright wrong answers (incl. manual "Non sapevo") go to review.
		// Partial answers are left neutral — not added, not removed.
		return (this.session?.results ?? [])
			.filter((r) => !r.skipped && r.verdict === 'wrong')
			.map((r) => r.cardId);
	}

	getKnownCards(): number[] {
		return (this.session?.results ?? [])
			.filter((r) => !r.skipped && r.verdict === 'correct')
			.map((r) => r.cardId);
	}
}

export const studyStore = new StudyStore();

export function verdictLabel(verdict: Verdict): string {
	return { correct: 'Corretto', partial: 'Parziale', wrong: 'Errato' }[verdict];
}

export function verdictColor(verdict: Verdict): string {
	return {
		correct: 'text-fc-success',
		partial: 'text-fc-warning',
		wrong:   'text-fc-danger',
	}[verdict];
}
