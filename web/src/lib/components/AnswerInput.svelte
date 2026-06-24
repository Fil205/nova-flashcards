<script lang="ts">
	import { onDestroy } from 'svelte';
	import { isSttSupported, startListening, type SttHandle } from '$lib/voice/stt';
	import { Mic, MicOff, Send } from '@lucide/svelte';

	interface Props {
		value: string;
		lang?: string;
		disabled?: boolean;
		onsubmit?: () => void;
	}

	let { value = $bindable(), lang = 'it-IT', disabled = false, onsubmit }: Props = $props();

	let listening  = $state(false);
	let sttHandle  = $state<SttHandle | null>(null);
	let sttError   = $state('');

	const sttSupported = isSttSupported();

	function toggleStt(): void {
		if (listening) {
			// Second press → stop recording
			sttHandle?.stop();
			listening = false;
			sttHandle = null;
			return;
		}
		sttError = '';

		// Snapshot of text already typed before this session starts.
		// We accumulate finalized speech chunks separately so the user can keep
		// typing and pausing without losing partial results.
		const baseText = value;
		let finalized  = '';   // committed speech so far in this session

		sttHandle = startListening(
			lang,
			(text, isFinal) => {
				if (isFinal) {
					// Append committed chunk; trim so double-spaces don't pile up
					finalized += (finalized ? ' ' : '') + text.trim();
					value = baseText
						? baseText.trimEnd() + ' ' + finalized
						: finalized;
				} else {
					// Show interim preview appended after already-finalized speech
					const preview = finalized ? finalized + ' ' + text : text;
					value = baseText
						? baseText.trimEnd() + ' ' + preview
						: preview;
				}
			},
			(msg) => { sttError = msg; listening = false; sttHandle = null; },
			()    => { listening = false; sttHandle = null; },
		);
		listening = !!sttHandle;
	}

	// Stop the microphone if the component is destroyed mid-recording
	onDestroy(() => {
		sttHandle?.stop();
	});
</script>

<div class="flex flex-col gap-3">
	<!-- Textarea + mic -->
	<div class="relative">
		<textarea
			class="input-base resize-none w-full pr-11"
			style="min-height: 100px"
			placeholder="Scrivi la tua risposta…"
			bind:value
			{disabled}
			onkeydown={(e) => {
				if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
					e.preventDefault();
					onsubmit?.();
				}
			}}
		></textarea>

		<!-- Mic button — inside the textarea, bottom-right -->
		{#if sttSupported}
			<button
				type="button"
				class="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg transition-all
					   {listening
					       ? 'border border-fc-danger/50 bg-fc-danger/15 text-fc-danger animate-pulse'
					       : 'text-fc-faint hover:text-fc-muted hover:bg-white/8'}"
				onclick={toggleStt}
				{disabled}
				aria-label={listening ? 'Ferma registrazione' : 'Dettatura vocale'}
				title={listening ? 'Ferma registrazione' : 'Dettatura vocale'}
			>
				{#if listening}
					<MicOff size={16} />
				{:else}
					<Mic size={16} />
				{/if}
			</button>
		{/if}
	</div>

	{#if sttError}
		<p class="text-xs text-fc-warning" role="alert">{sttError}</p>
	{/if}

	<!-- Verify button — full width, prominent -->
	<button
		type="button"
		class="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm
			   text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed
			   hover:shadow-glow-sm active:scale-[0.98]"
		style="background: linear-gradient(135deg, #7C3AED, #6D28D9)"
		{disabled}
		onclick={onsubmit}
	>
		<Send size={15} />
		Verifica risposta
	</button>
</div>
