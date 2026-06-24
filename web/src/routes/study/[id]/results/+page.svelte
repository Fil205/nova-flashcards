<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { studyStore, verdictLabel, verdictColor } from '$lib/stores/study.svelte';
	import { deckStore } from '$lib/stores/decks.svelte';
	import { fadeUp, staggerFadeUp } from '$lib/anim';
	import { parseId } from '$lib/utils';
	import Button from '$lib/components/ui/Button.svelte';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import MathText from '$lib/components/MathText.svelte';
	import { RotateCcw, Home, Trophy } from '@lucide/svelte';

	const deckId = $derived(parseId(page.params.id));

	let headerEl = $state<HTMLElement | null>(null);
	let statsEl  = $state<HTMLElement | null>(null);

	// $derived so these update reactively and don't flash stale values on direct page load
	const summary    = $derived(studyStore.computeSummary());
	const results    = $derived(studyStore.session?.results ?? []);
	const deck       = $derived(deckStore.currentDeck);
	const wrongCards = $derived(studyStore.getWrongCards());

	onMount(() => {
		if (isNaN(deckId)) { goto('/'); return; }
		if (!studyStore.session) { goto(`/deck/${deckId}`); return; }
		if (headerEl) fadeUp(headerEl, 0, 0.4);
		if (statsEl) {
			const cards = statsEl.querySelectorAll('.glass');
			staggerFadeUp(cards, 0.08, 0.1);
		}
	});

	function masteryColor(score: number): string {
		if (score >= 0.8) return 'text-fc-success';
		if (score >= 0.5) return 'text-fc-warning';
		return 'text-fc-danger';
	}

	function restart(): void {
		goto(`/study/${deckId}`);
	}

	function retryWrong(): void {
		goto(`/study/${deckId}?mode=wrong`);
	}

	function home(): void {
		studyStore.endSession();
		goto('/');
	}

	function cardQuestion(cardId: number): string {
		return deck?.cards.find((c) => c.id === cardId)?.question ?? `Carta #${cardId}`;
	}
</script>

<svelte:head><title>Risultati — Falschcard</title></svelte:head>

<!-- Guard: renders nothing (blank) while onMount redirects if session is missing -->
{#if studyStore.session}
<div class="max-w-2xl mx-auto flex flex-col gap-6">
	<!-- Header -->
	<div bind:this={headerEl} class="text-center pt-4">
		<div class="w-16 h-16 rounded-2xl bg-fc-gradient flex items-center justify-center mx-auto mb-4 shadow-glow">
			<Trophy size={28} class="text-white" />
		</div>
		<h1 class="text-2xl font-bold font-display gradient-text">Sessione completata!</h1>
		{#if deck}
			<p class="text-fc-muted text-sm mt-1">{deck.name}</p>
		{/if}
	</div>

	<!-- Score + stats -->
	<div bind:this={statsEl} class="grid grid-cols-2 sm:grid-cols-4 gap-3">
		<GlassCard pad="sm" class="text-center col-span-2 sm:col-span-1">
			<p class="text-3xl font-bold {masteryColor(summary.score)}">
				{Math.round(summary.score * 100)}%
			</p>
			<p class="text-xs text-fc-faint mt-1">Punteggio</p>
		</GlassCard>
		{#each [
			{ label: 'Corretti', value: summary.correct, color: 'text-fc-success' },
			{ label: 'Parziali', value: summary.partial, color: 'text-fc-warning' },
			{ label: 'Errati',   value: summary.wrong,   color: 'text-fc-danger'  },
		] as s}
			<GlassCard pad="sm" class="text-center">
				<p class="text-2xl font-bold {s.color}">{s.value}</p>
				<p class="text-xs text-fc-faint mt-1">{s.label}</p>
			</GlassCard>
		{/each}
	</div>

	<!-- Card-by-card breakdown -->
	{#if results.length > 0}
		<div class="flex flex-col gap-2">
			<h2 class="text-sm font-semibold text-fc-muted uppercase tracking-wide">Dettaglio carte</h2>
			<div class="flex flex-col gap-2">
				{#each results as r}
					<div class="glass px-4 py-3 flex items-start gap-3">
						<span class="text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5
									 {r.verdict === 'correct' ? 'bg-fc-success/20 text-fc-success' :
									  r.verdict === 'partial' ? 'bg-fc-warning/20 text-fc-warning' :
									  'bg-fc-danger/20 text-fc-danger'}">
							{r.verdict === 'correct' ? '✓' : r.verdict === 'partial' ? '~' : '✗'}
						</span>
						<div class="flex-1 min-w-0">
							<MathText text={cardQuestion(r.cardId)} class="text-sm text-fc-text truncate block" />
							{#if r.userAnswer && !r.skipped}
								<span class="text-xs text-fc-muted mt-0.5 truncate block">Risposta: <MathText text={r.userAnswer} /></span>
							{/if}
							{#if r.aiFeedback}
								<MathText text={r.aiFeedback} class="text-xs text-fc-faint mt-1 block" />
							{/if}
						</div>
						<span class="text-xs text-fc-muted shrink-0 {verdictColor(r.verdict)}">
							{verdictLabel(r.verdict)}
						</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Actions -->
	<div class="flex flex-wrap gap-3 justify-center">
		<Button variant="ghost" size="sm" onclick={home}>
			{#snippet iconLeft()}<Home size={13} />{/snippet}
			Mazzi
		</Button>
		<Button variant="secondary" size="sm" onclick={restart}>
			{#snippet iconLeft()}<RotateCcw size={13} />{/snippet}
			Ripeti sessione
		</Button>
		{#if wrongCards.length > 0}
			<button
				type="button"
				onclick={retryWrong}
				class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
					   border border-fc-danger/40 bg-fc-danger/10 text-fc-danger
					   hover:bg-fc-danger/20 hover:border-fc-danger/60 transition-all"
			>
				<RotateCcw size={13} />
				Ripeti sbagliate ({wrongCards.length})
			</button>
		{/if}
	</div>
</div>
{/if}
