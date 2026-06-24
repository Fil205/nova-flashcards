import { streamPost } from './client';
import { api } from './client';
import type { Card, EvaluationResult, TutorMessage } from '$lib/types';

export const aiApi = {
	/** Non-streaming evaluate — returns verdict + feedback JSON. */
	evaluate(
		profileId: number,
		card: Pick<Card, 'question' | 'answer' | 'explanation'>,
		userAnswer: string
	): Promise<EvaluationResult> {
		return api.post(`/profiles/${profileId}/ai/evaluate`, { card, userAnswer });
	},

	/** Stream the answer review (SSE). Returns a cancel function. */
	streamReview(
		profileId: number,
		card: Pick<Card, 'question' | 'answer' | 'explanation'>,
		userAnswer: string,
		onDelta: (delta: string) => void,
		onComplete: (full: string) => void,
		onError: (msg: string) => void
	): () => void {
		return streamPost(
			`/profiles/${profileId}/ai/review`,
			{ card, userAnswer },
			onDelta, onComplete, onError
		);
	},

	/** Stream a tutor response (SSE). Returns a cancel function. */
	streamTutor(
		profileId: number,
		card: Pick<Card, 'question' | 'answer' | 'explanation'>,
		history: TutorMessage[],
		message: string,
		onDelta: (delta: string) => void,
		onComplete: (full: string) => void,
		onError: (msg: string) => void
	): () => void {
		return streamPost(
			`/profiles/${profileId}/ai/tutor`,
			{ card, history, message },
			onDelta, onComplete, onError
		);
	},

	/** Send malformed import text to the AI; returns fixed JSON string. */
	fixImport(profileId: number, text: string): Promise<{ fixed: string }> {
		return api.post(`/profiles/${profileId}/ai/fix-import`, { text });
	},
};
