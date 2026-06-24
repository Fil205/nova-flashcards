<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { deckStore } from '$lib/stores/decks.svelte';
	import { studyStore, verdictLabel, verdictColor } from '$lib/stores/study.svelte';
	import { reviewStore } from '$lib/stores/review.svelte';
	import { profileStore } from '$lib/stores/profile.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { aiApi } from '$lib/api/ai';
	import { friendlyError, isNetworkError } from '$lib/api/client';
	import { speak, stopTts, isTtsSupported } from '$lib/voice/tts';
	import { fadeUp, scaleIn, slideInRight } from '$lib/anim';
	import { parseId } from '$lib/utils';
	import { renderRich } from '$lib/markdown';
	import Button from '$lib/components/ui/Button.svelte';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import MathText from '$lib/components/MathText.svelte';
	import CardImages from '$lib/components/CardImages.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import SessionProgress from '$lib/components/SessionProgress.svelte';
	import AnswerInput from '$lib/components/AnswerInput.svelte';
	import TutorPanel from '$lib/components/TutorPanel.svelte';
	import type { Card, Verdict } from '$lib/types';
	import {
		ChevronLeft, ChevronRight, RotateCcw,
		CheckCircle, MinusCircle, XCircle, Bot, Volume2, VolumeX
	} from '@lucide/svelte';

	const deckId = $derived(parseId(page.params.id));

	let loading       = $state(true);
	let mode          = $state<'sequential' | 'shuffle'>('sequential');
	let phase         = $state<'question' | 'answered' | 'manual'>('question');
	let answer        = $state('');
	let evaluating    = $state(false);
	let evalResult    = $state<{ verdict: Verdict; feedback: string } | null>(null);
	let cardEl        = $state<HTMLElement | null>(null);
	let localAutoRead = $state(false);
	/** Passed to TutorPanel only for manual follow-up chats; never auto-triggered. */
	let reviewAnswer  = $state<string | null>(null);
	/** Streamed AI explanation shown under "Correzione AI" in Card 3. */
	let aiReview        = $state('');
	let reviewStreaming = $state(false);
	/** Non-reactive cancel handle for the in-flight review stream. */
	let cancelReview: (() => void) | null = null;
	/** Timestamp when the current card was first shown (for per-card timing). */
	let cardShownAt   = Date.now();

	onMount(async () => {
		if (isNaN(deckId)) { goto('/'); return; }
		const deck = await deckStore.loadDeck(deckId);
		loading = false;
		if (!deck || deck.cards.length === 0) {
			goto(`/deck/${deckId}`);
			return;
		}

		const modeParam = page.url.searchParams.get('mode');
		let cards = deck.cards;
		let sessionMode: 'sequential' | 'shuffle' = 'sequential';

		if (modeParam === 'shuffle') {
			sessionMode = 'shuffle';
		} else if (modeParam === 'wrong') {
			const wrongIds = reviewStore.unknownIds;
			const wrongCards = deck.cards.filter((c) => wrongIds.has(c.id));
			if (wrongCards.length === 0) {
				goto(`/deck/${deckId}`);
				return;
			}
			cards = wrongCards;
		}

		mode = sessionMode;
		studyStore.startSession(deckId, cards, sessionMode);

		localAutoRead = profileStore.settings?.auto_read_question ?? false;
		if (localAutoRead) readQuestion();
		if (cardEl) scaleIn(cardEl);
	});

	onDestroy(() => {
		stopTts();
		cancelReview?.();
	});

	const currentCard = $derived.by<Card | undefined>(() => {
		const cardId = studyStore.currentCardId;
		return deckStore.currentDeck?.cards.find((c) => c.id === cardId);
	});

	// ── Navigation ─────────────────────────────────────────────────────────────

	/**
	 * Reconstruct view state for the current card from session.results.
	 * showAnswer=true → answered/manual phase; false → question phase.
	 */
	function applyView(showAnswer: boolean): void {
		stopTts();
		cancelReview?.();
		reviewStreaming = false;
		reviewAnswer = null;
		const card = currentCard;
		if (!card || !studyStore.session) return;

		const result = studyStore.session.results.find((r) => r.cardId === card.id);

		if (showAnswer && result) {
			answer     = result.userAnswer ?? '';
			evalResult = result.skipped
				? null
				: { verdict: result.verdict, feedback: result.aiFeedback ?? '' };
			aiReview   = result.skipped ? '' : (result.aiFeedback ?? '');
			phase = result.skipped ? 'manual' : 'answered';
		} else {
			phase      = 'question';
			answer     = result?.userAnswer ?? '';
			evalResult = null;
			aiReview   = '';
		}

		if (cardEl) slideInRight(cardEl);
		if (localAutoRead) {
			if (showAnswer) setTimeout(readAnswer, 200);
			else setTimeout(readQuestion, 200);
		}
	}

	/** ◀ — go back one "half-step" (A→Q of same card, or Q→A of previous card). */
	function goBack(): void {
		if (phase !== 'question') {
			applyView(false);
		} else {
			const idx = studyStore.session?.currentIndex ?? 0;
			if (idx > 0) {
				studyStore.prevCard();
				applyView(true);
			}
		}
	}

	/** ▶ — go forward one "half-step" (Q→A, or A→Q of next card / results). */
	async function goForward(): Promise<void> {
		if (phase === 'question') {
			const card = currentCard;
			if (!card || !studyStore.session) return;
			const result = studyStore.session.results.find((r) => r.cardId === card.id);
			if (result) {
				applyView(true);
			} else {
				revealAnswer();
			}
		} else {
			await next();
		}
	}

	/** True when back would have no effect (first card in question phase). */
	const isAtStart = $derived(
		phase === 'question' && (studyStore.session?.currentIndex ?? 0) === 0
	);

	// ── Study logic ────────────────────────────────────────────────────────────

	async function evaluate(): Promise<void> {
		if (!answer.trim() || evaluating) return;
		const card = currentCard;
		const profileId = profileStore.active?.id;
		if (!card || !profileId) return;

		if (!profileStore.settings?.has_api_key) {
			phase = 'manual';
			return;
		}

		evaluating = true;
		try {
			const result = await aiApi.evaluate(profileId, card, answer);
			evalResult  = result;
			phase       = 'answered';
			if (localAutoRead) { stopTts(); setTimeout(readAnswer, 200); }

			studyStore.recordResult({
				verdict:    result.verdict,
				userAnswer: answer,
				aiFeedback: '',
				skipped:    false,
				timeMs:     Date.now() - cardShownAt,
			});

			// Stream the detailed AI explanation directly into Card 3.
			streamReviewIntoCard(card, answer);
		} catch (e) {
			if (!isNetworkError(e)) {
				// Server returned an error (not offline) — show it
				toastStore.error(friendlyError(e));
			}
			// Whether offline or server error, fall back to manual self-evaluation
			phase = 'manual';
		} finally {
			evaluating = false;
		}
	}

	/** Stream the answer review into Card 3 ("Correzione AI"); persist on complete. */
	function streamReviewIntoCard(card: Card, userAnswer: string): void {
		const profileId = profileStore.active?.id;
		if (!profileId) return;
		cancelReview?.();
		aiReview        = '';
		reviewStreaming = true;
		const cardId    = card.id;
		cancelReview = aiApi.streamReview(
			profileId, card, userAnswer,
			(delta) => { aiReview += delta; },
			(full)  => {
				reviewStreaming = false;
				aiReview = full;
				studyStore.setAiFeedback(cardId, full);
				cancelReview = null;
			},
			()      => { reviewStreaming = false; cancelReview = null; },
		);
	}

	function manualVerdict(verdict: Verdict): void {
		studyStore.recordResult({
			verdict,
			userAnswer: answer,
			skipped:    false,
			timeMs:     Date.now() - cardShownAt,
		});
		phase      = 'answered';
		evalResult = { verdict, feedback: '' };
		if (localAutoRead) { stopTts(); setTimeout(readAnswer, 200); }
	}

	function revealAnswer(): void {
		phase = 'manual';
		studyStore.recordResult({
			verdict:    'correct',
			userAnswer: '',
			skipped:    true,
			timeMs:     0,
		});
		if (localAutoRead) { stopTts(); setTimeout(readAnswer, 200); }
	}

	async function next(): Promise<void> {
		reviewAnswer = null;
		cancelReview?.();
		reviewStreaming = false;
		stopTts();

		if (studyStore.isComplete) {
			await saveSession();
			goto(`/study/${deckId}/results`);
			return;
		}

		studyStore.nextCard();
		cardShownAt = Date.now();
		answer      = '';
		phase       = 'question';
		evalResult  = null;
		aiReview    = '';

		if (cardEl) slideInRight(cardEl);
		if (localAutoRead) setTimeout(readQuestion, 200);
	}

	async function saveSession(): Promise<void> {
		const summary      = studyStore.computeSummary();
		const total        = studyStore.session?.cardOrder.length ?? 0;
		const wrongCardIds = studyStore.getWrongCards();
		const knownCardIds = studyStore.getKnownCards();
		try {
			await deckStore.recordStudy(deckId, {
				mode,
				total,
				correct:        summary.correct,
				partial:        summary.partial,
				wrong:          summary.wrong,
				score:          summary.score,
				duration_ms:    Date.now() - (studyStore.session?.startedAt ?? Date.now()),
				wrong_card_ids: wrongCardIds,
				known_card_ids: knownCardIds,
			});
			reviewStore.markMissed(wrongCardIds);
			reviewStore.markKnown(knownCardIds);
		} catch (e) {
			toastStore.warning('Sessione completata, ma il salvataggio non è riuscito. Riprova.');
		}
	}

	function readQuestion(): void {
		const card = currentCard;
		if (!card || !isTtsSupported()) return;
		const settings = profileStore.settings;
		speak(
			card.question,
			deckStore.currentDeck?.lang ?? 'it-IT',
			settings?.tts_voice_uri,
			settings?.tts_rate ?? 1,
			settings?.tts_pitch ?? 1,
		);
	}

	function readAnswer(): void {
		const card = currentCard;
		if (!card || !isTtsSupported()) return;
		const settings = profileStore.settings;
		speak(
			card.answer,
			deckStore.currentDeck?.lang ?? 'it-IT',
			settings?.tts_voice_uri,
			settings?.tts_rate ?? 1,
			settings?.tts_pitch ?? 1,
		);
	}

	function readExplanation(): void {
		const card = currentCard;
		if (!card || !card.explanation || !isTtsSupported()) return;
		const settings = profileStore.settings;
		speak(
			card.explanation,
			deckStore.currentDeck?.lang ?? 'it-IT',
			settings?.tts_voice_uri,
			settings?.tts_rate ?? 1,
			settings?.tts_pitch ?? 1,
		);
	}

	const verdictIcons = { correct: CheckCircle, partial: MinusCircle, wrong: XCircle };

	function resultBorderClass(verdict: Verdict | null): string {
		if (!verdict) return '';
		return 'border ' + (
			verdict === 'correct' ? 'border-fc-success/40' :
			verdict === 'partial' ? 'border-fc-warning/40' :
			                        'border-fc-danger/40'
		);
	}
</script>

<svelte:head><title>Studio — Falschcard</title></svelte:head>

<div class="w-full max-w-5xl mx-auto flex flex-col gap-5 px-2 sm:px-4">
	<!-- Top bar -->
	<div class="flex items-center gap-2 sm:gap-3">
		<a
			href="/deck/{deckId}"
			class="p-2 rounded-lg text-fc-muted hover:text-fc-text hover:bg-white/8 transition-colors shrink-0"
			aria-label="Esci dalla sessione"
		>
			<ChevronLeft size={18} />
		</a>
		<SessionProgress class="flex-1" />

		{#if isTtsSupported()}
			<button
				type="button"
				onclick={() => localAutoRead = !localAutoRead}
				class="p-2 rounded-lg transition-colors shrink-0
					   {localAutoRead ? 'bg-fc-accent/20 text-fc-accent-light' : 'text-fc-muted hover:text-fc-text hover:bg-white/8'}"
				aria-label={localAutoRead ? 'Disabilita lettura automatica' : 'Abilita lettura automatica'}
				aria-pressed={localAutoRead}
				title={localAutoRead ? 'Lettura automatica attiva' : 'Lettura automatica disabilitata'}
			>
				{#if localAutoRead}<Volume2 size={16} />{:else}<VolumeX size={16} />{/if}
			</button>
		{/if}

		<!-- Tutor toggle — available for manual follow-up questions, off by default -->
		{#if profileStore.settings?.has_api_key}
			<button
				type="button"
				onclick={() => studyStore.toggleTutor()}
				class="p-2 rounded-lg transition-colors shrink-0
					   {studyStore.tutorOpen ? 'bg-fc-accent/20 text-fc-accent-light' : 'text-fc-muted hover:text-fc-text hover:bg-white/8'}"
				aria-label={studyStore.tutorOpen ? 'Chiudi tutor AI' : 'Apri tutor AI'}
				aria-pressed={studyStore.tutorOpen}
				title="Tutor AI"
			>
				<Bot size={16} />
			</button>
		{/if}
	</div>

	{#if loading}
		<div class="flex justify-center py-16"><Spinner size={28} class="text-fc-muted" /></div>

	{:else if studyStore.isComplete}
		<div class="text-center py-16">
			<p class="text-xl font-bold gradient-text">Sessione completata! 🎉</p>
			<Button variant="primary" class="mt-4" onclick={() => goto(`/study/${deckId}/results`)}>
				Vedi risultati
			</Button>
		</div>

	{:else if currentCard}
		<!--
			study-grid: mobile = flex-col (card → tutor → controls).
			study-grid--with-tutor (desktop ≥1024px): 2-col grid so tutor spans both rows.
		-->
		<div
			class="study-grid"
			class:study-grid--with-tutor={studyStore.tutorOpen && !!currentCard}
		>

			<!-- ══ AREA: card ════════════════════════════════════════════════════ -->
			<div class="study-grid-card flex flex-col gap-3 min-w-0" bind:this={cardEl}>

				<!-- ══ CARD 1 — Domanda (always full size) ════════════════════ -->
				<GlassCard pad="lg">
					<div class="flex items-start justify-between gap-2 mb-4">
						<p class="text-xs text-fc-faint uppercase tracking-wide">Domanda</p>
						<button
							type="button"
							onclick={readQuestion}
							class="p-1.5 rounded-lg text-fc-muted hover:text-fc-text hover:bg-white/8 transition-colors"
							aria-label="Leggi domanda"
							title="Leggi domanda"
						>
							<Volume2 size={14} />
						</button>
					</div>
					<CardImages
						images={currentCard.images?.filter((i) => i.section === 'question')}
						class="mb-4"
					/>
					<MathText
						text={currentCard.question}
						class="text-base sm:text-lg font-medium text-fc-text leading-relaxed"
					/>
				</GlassCard>

				{#if phase === 'question'}
					<!-- ── Input risposta ─────────────────────────────────────── -->
					<GlassCard pad="md">
						<p class="text-xs text-fc-faint uppercase tracking-wide mb-3">La tua risposta</p>
						<AnswerInput
							bind:value={answer}
							lang={deckStore.currentDeck?.lang ?? 'it-IT'}
							disabled={evaluating}
							onsubmit={evaluate}
						/>
					</GlassCard>

					{#if evaluating}
						<div class="flex items-center gap-2 text-fc-muted text-sm">
							<Spinner size={16} class="text-fc-accent-light" />
							Valutazione AI in corso…
						</div>
					{/if}

				{:else}
					<!-- ══ CARD 2 — Risposta corretta + spiegazione ═══════════ -->
					<GlassCard pad="md">
						<div class="flex items-start justify-between gap-2 mb-2">
							<p class="text-xs text-fc-faint uppercase tracking-wide">Risposta corretta</p>
							{#if isTtsSupported()}
								<button
									type="button"
									onclick={readAnswer}
									class="p-1.5 rounded-lg text-fc-muted hover:text-fc-text hover:bg-white/8 transition-colors"
									aria-label="Leggi risposta"
									title="Leggi risposta"
								>
									<Volume2 size={14} />
								</button>
							{/if}
						</div>
						<CardImages
							images={currentCard.images?.filter((i) => i.section === 'answer')}
							class="mb-3"
						/>
						<MathText text={currentCard.answer} class="text-base text-fc-text leading-relaxed" />
						{#if currentCard.explanation || currentCard.images?.some((i) => i.section === 'explanation')}
							<div class="mt-3 border-t border-fc-border pt-3">
								<div class="flex items-start justify-between gap-2 mb-1">
									<p class="text-xs text-fc-faint uppercase tracking-wide">Spiegazione</p>
									{#if isTtsSupported()}
										<button
											type="button"
											onclick={readExplanation}
											class="p-1.5 rounded-lg text-fc-muted hover:text-fc-text hover:bg-white/8 transition-colors"
											aria-label="Leggi spiegazione"
											title="Leggi spiegazione"
										>
											<Volume2 size={14} />
										</button>
									{/if}
								</div>
								<CardImages
									images={currentCard.images?.filter((i) => i.section === 'explanation')}
									class="mb-2"
								/>
								{#if currentCard.explanation}
									<MathText
										text={currentCard.explanation}
										class="text-xs text-fc-muted leading-relaxed block"
									/>
								{/if}
							</div>
						{/if}
					</GlassCard>

					<!-- ══ CARD 3 — La mia risposta + correzione AI ══════════
					     Visible whenever the user has written something OR we have a verdict.
					-->
					{@const hasVerdict = evalResult !== null}
					{@const verdict = hasVerdict ? evalResult!.verdict : null}
					{@const VIcon = verdict ? verdictIcons[verdict] : null}
					{@const showReview = reviewStreaming || !!aiReview}

					{#if answer || hasVerdict}
						<GlassCard pad="md" class={resultBorderClass(verdict)}>

							<!-- Header: verdict badge or neutral label -->
							<div class="flex items-center gap-2 pb-3 mb-3 border-b border-fc-border">
								{#if hasVerdict && VIcon && verdict}
									<VIcon size={15} class={verdictColor(verdict)} />
									<span class="font-semibold text-sm {verdictColor(verdict)}">
										{verdictLabel(verdict)}
									</span>
								{:else}
									<span class="text-xs font-medium text-fc-muted uppercase tracking-wide">
										La tua risposta
									</span>
								{/if}
							</div>

							<!-- La tua risposta (only if written) -->
							{#if answer}
								<p class="text-xs text-fc-faint uppercase tracking-wide mb-1">La tua risposta</p>
								<MathText text={answer} class="text-sm text-fc-muted leading-relaxed" />
							{/if}

							<!-- Correzione AI — streamed explanation, separated by a divider -->
							{#if showReview}
								<div class="border-t border-fc-border mt-3 pt-3">
									<p class="text-xs text-fc-faint uppercase tracking-wide mb-1.5">Correzione AI</p>
									{#if aiReview}
										<div class="md text-sm text-fc-text leading-relaxed">
											{@html renderRich(aiReview)}{#if reviewStreaming}<span
												class="inline-block w-0.5 h-[1em] bg-fc-muted align-middle ml-0.5"
												style="animation: blink 0.8s step-end infinite"
											></span>{/if}
										</div>
									{:else}
										<!-- Thinking dots while waiting for first token -->
										<div class="flex gap-1 items-center py-0.5">
											<span class="w-1.5 h-1.5 rounded-full bg-fc-muted" style="animation: dotPulse 1.2s ease-in-out infinite"></span>
											<span class="w-1.5 h-1.5 rounded-full bg-fc-muted" style="animation: dotPulse 1.2s ease-in-out 0.2s infinite"></span>
											<span class="w-1.5 h-1.5 rounded-full bg-fc-muted" style="animation: dotPulse 1.2s ease-in-out 0.4s infinite"></span>
										</div>
									{/if}
								</div>
							{/if}
						</GlassCard>
					{/if}

				{/if}

			</div>
			<!-- ══ END AREA: card ════════════════════════════════════════════════ -->

			<!-- ══ AREA: tutor ══════════════════════════════════════════════════ -->
			{#if studyStore.tutorOpen && currentCard}
				<div class="study-grid-tutor popover overflow-hidden flex flex-col h-96 lg:h-[520px]">
					<TutorPanel
						card={currentCard}
						{reviewAnswer}
						onReviewConsumed={() => { reviewAnswer = null; }}
					/>
				</div>
			{/if}
			<!-- ══ END AREA: tutor ══════════════════════════════════════════════ -->

			<!-- ══ AREA: controls — verdict buttons + nav bar ═══════════════════
			     Kept separate so on mobile it sits AFTER the tutor chat,
			     and on desktop it occupies the bottom-left grid cell.
			-->
			<div class="study-grid-controls flex flex-col gap-3">

				<!-- Verdict buttons (manual self-evaluation only) -->
				{#if phase === 'manual'}
					<div class="flex gap-3">
						<button
							type="button"
							onclick={() => manualVerdict('wrong')}
							class="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm
								   border border-fc-danger/40 bg-fc-danger/10 text-fc-danger
								   hover:bg-fc-danger/20 hover:border-fc-danger/60 transition-all"
						>
							<XCircle size={16} />
							Non sapevo
						</button>
						<button
							type="button"
							onclick={() => manualVerdict('correct')}
							class="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm
								   border border-fc-success/40 bg-fc-success/10 text-fc-success
								   hover:bg-fc-success/20 hover:border-fc-success/60 transition-all"
						>
							<CheckCircle size={16} />
							Sapevo
						</button>
					</div>
				{/if}

				<!-- ── Nav bar ◀ ▶ ───────────────────────────────────────────── -->
				<div class="flex items-center gap-2">
					<!-- Back -->
					<button
						type="button"
						disabled={isAtStart}
						onclick={goBack}
						class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-medium
							   transition-all shrink-0
							   {isAtStart
							       ? 'border-fc-border/30 text-fc-faint cursor-not-allowed opacity-40'
							       : 'border-fc-border text-fc-muted hover:text-fc-text hover:border-fc-border-hover hover:bg-white/4'}"
						aria-label="Torna indietro"
					>
						<ChevronLeft size={14} />
						Indietro
					</button>

					<!-- Forward (context-dependent) -->
					{#if phase === 'question'}
						<button
							type="button"
							onclick={goForward}
							class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border
								   border-white/10 text-fc-muted hover:text-fc-text hover:border-white/20
								   hover:bg-white/4 transition-all text-sm"
						>
							<RotateCcw size={14} />
							Mostra risposta
						</button>

					{:else if phase === 'manual'}
						<!-- Advance without choosing a verdict -->
						<Button variant="secondary" size="md" class="flex-1" onclick={goForward}>
							{#snippet iconLeft()}<ChevronRight size={14} />{/snippet}
							{studyStore.isComplete ? 'Vedi risultati' : 'Avanti'}
						</Button>

					{:else if phase === 'answered'}
						<Button variant="primary" size="md" class="flex-1" onclick={goForward}>
							{#snippet iconLeft()}<ChevronRight size={14} />{/snippet}
							{studyStore.isComplete ? 'Vedi risultati' : 'Avanti'}
						</Button>
					{/if}
				</div>
			</div>
			<!-- ══ END AREA: controls ════════════════════════════════════════════ -->

		</div>
	{/if}
</div>
