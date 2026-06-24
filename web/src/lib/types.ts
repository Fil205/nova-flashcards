// ─── Profile ──────────────────────────────────────────────────────────────────

export interface ProfileSummary {
	id: number;
	name: string;
	created_at: string;
	updated_at: string;
}

export interface ProfileSettings {
	profile_id: number;
	has_api_key: boolean;
	gemini_model: string;
	auto_read_question: boolean;
	tts_voice_uri: string | null;
	tts_rate: number;
	tts_pitch: number;
	theme: 'dark' | 'light' | 'system';
	extra: Record<string, unknown> | null;
	updated_at: string;
}

export interface BootstrapData {
	profile: ProfileSummary;
	settings: ProfileSettings;
	decks: DeckSummary[];
	unknown_cards: { deck_id: number; card_id: number }[];
}

// ─── Deck ─────────────────────────────────────────────────────────────────────

export type DeckSource = 'manual' | 'import-txt' | 'import-json' | 'ai' | 'example';

export interface DeckSummary {
	id: number;
	profile_id: number;
	name: string;
	description: string | null;
	lang: string | null;
	source: DeckSource;
	position: number;
	times_studied: number;
	last_score: number | null;
	last_studied_at: string | null;
	mastery: number | null;
	card_count: number;
	created_at: string;
	updated_at: string;
}

export interface Deck extends DeckSummary {
	cards: Card[];
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export type CardSection = 'question' | 'answer' | 'explanation';

export interface CardImage {
	id: number;
	card_id: number;
	section: CardSection;
	position: number;
	url: string;
	width: number | null;
	height: number | null;
	alt: string | null;
}

export interface Card {
	id: number;
	deck_id: number;
	question: string;
	answer: string;
	explanation: string | null;
	position: number;
	images?: CardImage[];
	created_at: string;
	updated_at: string;
}

export type CardDraft = {
	question: string;
	answer: string;
	explanation?: string;
};

// ─── Study session ────────────────────────────────────────────────────────────

export type Verdict = 'correct' | 'partial' | 'wrong';

export interface CardResult {
	cardId: number;
	verdict: Verdict;
	userAnswer: string;
	/** AI-generated feedback text from the evaluate endpoint. */
	aiFeedback?: string;
	skipped: boolean;
	timeMs: number;
}

export interface StudySession {
	deckId: number;
	mode: 'sequential' | 'shuffle';
	cardOrder: number[];     // ordered card IDs
	currentIndex: number;
	results: CardResult[];
	startedAt: number;       // Unix ms
}

// ─── AI ───────────────────────────────────────────────────────────────────────

export interface EvaluationResult {
	verdict: Verdict;
	feedback: string;
}

export interface TutorMessage {
	role: 'user' | 'assistant';
	content: string;
}

// ─── Import ───────────────────────────────────────────────────────────────────

export interface ImportParseResult {
	cards: CardDraft[];
	errors: string[];
	/** Deck name from the JSON, when the source includes deck metadata. */
	name?: string;
	/** Deck description from the JSON, when present. */
	description?: string;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
	id: string;
	variant: ToastVariant;
	message: string;
	duration?: number;
}
