<script lang="ts">
	import { onDestroy } from 'svelte';
	import { studyStore } from '$lib/stores/study.svelte';
	import { profileStore } from '$lib/stores/profile.svelte';
	import { aiApi } from '$lib/api/ai';
	import { renderRich } from '$lib/markdown';
	import { Bot, Send, X } from '@lucide/svelte';
	import type { Card } from '$lib/types';

	interface Props {
		card: Card;
		/** When set, triggers an automatic streaming review of this answer inside the chat. */
		reviewAnswer?: string | null;
		/** Called when the auto-review stream completes or errors, so parent can reset. */
		onReviewConsumed?: () => void;
	}

	let { card, reviewAnswer = null, onReviewConsumed }: Props = $props();

	let message    = $state('');
	let streaming  = $state(false);
	let streamText = $state('');
	let error      = $state('');
	let chatEl     = $state<HTMLDivElement | null>(null);

	// Non-reactive refs — avoids dependency-tracking loops in $effect
	let currentCancelFn: (() => void) | null = null;
	let lastReviewAnswer: string | null = null;

	function scrollBottom(): void {
		requestAnimationFrame(() => {
			if (chatEl) chatEl.scrollTop = chatEl.scrollHeight;
		});
	}

	/**
	 * Shared SSE-stream launcher.
	 * Cancels any in-flight stream, resets UI state, then calls `startFn` with the
	 * three standard SSE callbacks (onDelta / onComplete / onError).
	 *
	 * @param startFn  A function that starts the stream and returns a cancel function.
	 *                 Receives (onDelta, onComplete, onError) as arguments.
	 * @param onDone   Optional callback invoked when the stream completes OR errors
	 *                 (e.g. to notify the parent via `onReviewConsumed`).
	 */
	function beginStream(
		startFn: (
			onDelta:    (delta: string) => void,
			onComplete: (full: string)  => void,
			onError:    (msg: string)   => void
		) => () => void,
		onDone?: () => void
	): void {
		currentCancelFn?.();
		currentCancelFn = null;

		streaming  = true;
		streamText = '';
		error      = '';

		currentCancelFn = startFn(
			(delta) => { streamText += delta; scrollBottom(); },
			(full)  => {
				streaming  = false;
				streamText = '';
				studyStore.addTutorMessage({ role: 'assistant', content: full });
				scrollBottom();
				onDone?.();
			},
			(err)   => {
				streaming  = false;
				streamText = '';
				error      = err;
				onDone?.();
			}
		);
	}

	// Watch reviewAnswer: when it changes to a new non-null value, start auto-review
	$effect(() => {
		const ra = reviewAnswer; // track reactive prop

		if (ra && ra !== lastReviewAnswer) {
			lastReviewAnswer = ra;
			triggerAutoReview(ra);
		} else if (!ra && lastReviewAnswer !== null) {
			// Parent reset reviewAnswer (next card) — cancel any ongoing stream
			lastReviewAnswer = null;
			currentCancelFn?.();
			currentCancelFn = null;
			streaming  = false;
			streamText = '';
		}
	});

	function triggerAutoReview(userAnswer: string): void {
		const profileId = profileStore.active?.id;
		if (!profileId) return;

		// Show user's answer as a chat message before streaming the AI review
		studyStore.addTutorMessage({ role: 'user', content: `La mia risposta: ${userAnswer}` });
		scrollBottom();

		beginStream(
			(onDelta, onComplete, onError) =>
				aiApi.streamReview(profileId, card, userAnswer, onDelta, onComplete, onError),
			onReviewConsumed
		);
	}

	async function sendMessage(): Promise<void> {
		const text = message.trim();
		if (!text || streaming) return;

		const profileId = profileStore.active?.id;
		if (!profileId) return;

		message = '';
		studyStore.addTutorMessage({ role: 'user', content: text });
		scrollBottom();

		// Snapshot the history BEFORE the push above (push already happened via addTutorMessage).
		// The current user message is passed separately as `message`, not duplicated in history.
		const historyForApi = studyStore.tutorHistory.slice(0, -1); // exclude the just-added user msg

		beginStream(
			(onDelta, onComplete, onError) =>
				aiApi.streamTutor(profileId, card, historyForApi, text, onDelta, onComplete, onError)
		);
	}

	function onKeydown(e: KeyboardEvent): void {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}

	onDestroy(() => {
		currentCancelFn?.();
	});
</script>

<!-- Full-height flex column -->
<div class="flex flex-col h-full min-h-0">
	<!-- Header -->
	<div class="flex items-center justify-between px-4 py-3 border-b border-fc-border shrink-0">
		<div class="flex items-center gap-2">
			<span class="w-2 h-2 rounded-full bg-fc-accent-light" style="box-shadow:0 0 6px rgba(167,139,250,0.6)"></span>
			<span class="text-sm font-semibold text-fc-text">Tutor AI</span>
		</div>
		<button
			type="button"
			onclick={() => studyStore.setTutorOpen(false)}
			class="p-1.5 rounded-lg text-fc-muted hover:text-fc-text hover:bg-white/8 transition-colors"
			aria-label="Chiudi tutor"
		>
			<X size={15} />
		</button>
	</div>

	<!-- Messages area -->
	<div
		bind:this={chatEl}
		class="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0"
		role="log"
		aria-label="Conversazione con il Tutor AI"
		aria-live="polite"
		aria-relevant="additions"
	>
		{#if studyStore.tutorHistory.length === 0 && !streaming}
			<!-- Empty state -->
			<div class="flex flex-col items-center justify-center h-full text-center gap-3 px-4 py-8">
				<Bot size={32} class="text-fc-faint" />
				<p class="text-sm text-fc-faint leading-relaxed max-w-[22ch]">
					Hai dubbi su questa carta? Chiedimi qualsiasi cosa!
				</p>
			</div>
		{:else}
			<!-- Message bubbles -->
			{#each studyStore.tutorHistory as msg, i (i)}
				<div class="flex flex-col gap-1 max-w-[88%]
					{msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}">
					<span class="text-xs text-fc-faint px-1">{msg.role === 'user' ? 'Tu' : 'Tutor'}</span>
					<div class="px-4 py-3 text-sm leading-relaxed break-words
						{msg.role === 'user'
							? 'bg-fc-accent/20 border border-fc-accent-light/30 text-fc-text rounded-2xl rounded-br-sm'
							: 'bg-white/6 border border-fc-border text-fc-muted rounded-2xl rounded-bl-sm'}">
						{#if msg.role === 'assistant'}
							<div class="md">{@html renderRich(msg.content)}</div>
						{:else}
							{msg.content}
						{/if}
					</div>
				</div>
			{/each}

			<!-- Streaming assistant bubble -->
			{#if streaming}
				<div class="flex flex-col gap-1 max-w-[88%] self-start items-start">
					<span class="text-xs text-fc-faint px-1">Tutor</span>
					<div class="px-4 py-3 text-sm leading-relaxed bg-white/6 border border-fc-border
						text-fc-muted rounded-2xl rounded-bl-sm break-words">
						{#if streamText}
							<div class="md inline">{@html renderRich(streamText)}</div><span
								class="inline-block w-0.5 h-[1em] bg-fc-muted align-middle ml-0.5"
								style="animation: blink 0.8s step-end infinite"
							></span>
						{:else}
							<!-- Thinking dots -->
							<div class="flex gap-1 items-center py-0.5">
								<span class="w-1.5 h-1.5 rounded-full bg-fc-muted" style="animation: dotPulse 1.2s ease-in-out infinite"></span>
								<span class="w-1.5 h-1.5 rounded-full bg-fc-muted" style="animation: dotPulse 1.2s ease-in-out 0.2s infinite"></span>
								<span class="w-1.5 h-1.5 rounded-full bg-fc-muted" style="animation: dotPulse 1.2s ease-in-out 0.4s infinite"></span>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			{#if error}
				<p class="text-xs text-fc-danger px-1">{error}</p>
			{/if}
		{/if}
	</div>

	<!-- Input area -->
	<div class="shrink-0 px-4 py-3 border-t border-fc-border flex gap-2 items-end">
		<textarea
			bind:value={message}
			class="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-fc-text
				   placeholder-fc-faint focus:outline-none focus:ring-2 focus:ring-fc-accent-light/50
				   focus:border-fc-accent-light/50 transition-all resize-none min-h-[40px] max-h-[120px]"
			placeholder="Fai una domanda"
			rows={1}
			disabled={streaming}
			onkeydown={onKeydown}
			aria-label="Messaggio per il Tutor"
		></textarea>
		<button
			type="button"
			onclick={sendMessage}
			disabled={!message.trim() || streaming}
			class="p-2.5 rounded-xl text-white shrink-0 self-end
				   disabled:opacity-40 disabled:cursor-not-allowed transition-all"
			style="background: linear-gradient(135deg, #7C3AED, #3B82F6)"
			aria-label="Invia messaggio"
		>
			<Send size={15} />
		</button>
	</div>
</div>
