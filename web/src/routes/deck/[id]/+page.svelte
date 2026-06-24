<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { deckStore } from '$lib/stores/decks.svelte';
	import { reviewStore } from '$lib/stores/review.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { friendlyError } from '$lib/api/client';
	import { fadeUp, staggerFadeUp } from '$lib/anim';
	import Button from '$lib/components/ui/Button.svelte';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import MathText from '$lib/components/MathText.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import CardEditor from '$lib/components/CardEditor.svelte';
	import ImportDialog from '$lib/components/ImportDialog.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import type { Card } from '$lib/types';
	import { ChevronLeft, Plus, Upload, Play, Shuffle, RotateCcw, Pencil, Trash2 } from '@lucide/svelte';
	import { parseId } from '$lib/utils';

	const deckId = $derived(parseId(page.params.id));

	let loading        = $state(true);
	let headerEl       = $state<HTMLElement | null>(null);
	let listEl         = $state<HTMLElement | null>(null);
	let showAddCard    = $state(false);
	let showImport     = $state(false);
	let editingCard    = $state<Card | null>(null);
	let showDeleteCard = $state(false);
	let cardToDelete   = $state<Card | null>(null);
	let deleting       = $state(false);

	onMount(async () => {
		if (isNaN(deckId)) { goto('/'); return; }
		const deck = await deckStore.loadDeck(deckId);
		loading = false;
		if (!deck) { goto('/'); return; }

		if (headerEl) fadeUp(headerEl, 0, 0.35);
		if (listEl) {
			const rows = listEl.querySelectorAll('.card-row');
			staggerFadeUp(rows, 0.05, 0.1);
		}
	});

	async function deleteCard(): Promise<void> {
		if (!cardToDelete) return;
		deleting = true;
		try {
			await deckStore.deleteCard(cardToDelete.id, deckId);
			toastStore.success('Carta eliminata.');
			showDeleteCard = false;
			cardToDelete = null;
		} catch (e) {
			toastStore.error(friendlyError(e));
		} finally {
			deleting = false;
		}
	}

	const deck = $derived(deckStore.currentDeck);

	/** Number of "didn't know" cards in this deck */
	const wrongCount = $derived.by(() => {
		if (!deck) return 0;
		return reviewStore.idsForDeck(deck).length;
	});
</script>

<svelte:head>
	<title>{deck?.name ?? 'Mazzo'} — Falschcard</title>
</svelte:head>

<div class="flex flex-col gap-6">
	{#if loading}
		<div class="flex justify-center py-24">
			<Spinner size={28} class="text-fc-muted" />
		</div>
	{:else if !deck}
		<EmptyState icon="🔍" title="Mazzo non trovato" description="Il mazzo non esiste o è stato eliminato.">
			{#snippet action()}
				<Button variant="secondary" size="sm" onclick={() => goto('/')}>
					{#snippet iconLeft()}<ChevronLeft size={14} />{/snippet}
					Torna ai mazzi
				</Button>
			{/snippet}
		</EmptyState>
	{:else}
		<!-- Header -->
		<div bind:this={headerEl} class="flex items-start justify-between gap-4 flex-wrap">
			<div class="flex items-center gap-3">
				<a
					href="/"
					class="p-2 rounded-lg text-fc-muted hover:text-fc-text hover:bg-white/8 transition-colors"
					aria-label="Torna ai mazzi"
				>
					<ChevronLeft size={18} />
				</a>
				<div>
					<h1 class="text-xl font-bold font-display text-fc-text">{deck.name}</h1>
					{#if deck.description}
						<p class="text-sm text-fc-muted">{deck.description}</p>
					{/if}
				</div>
			</div>

			<div class="flex items-center gap-2 flex-wrap">
				<!-- Cluster gestione: ghost quieti, non competono con le azioni di studio -->
				<Button variant="ghost" size="sm" onclick={() => goto(`/deck/${deckId}/edit`)}>
					{#snippet iconLeft()}<Pencil size={13} />{/snippet}
					Modifica
				</Button>
				<Button variant="ghost" size="sm" onclick={() => showImport = true}>
					{#snippet iconLeft()}<Upload size={13} />{/snippet}
					Importa
				</Button>
				<Button variant="ghost" size="sm" onclick={() => showAddCard = true}>
					{#snippet iconLeft()}<Plus size={13} />{/snippet}
					Carta
				</Button>

				{#if deck.cards.length > 0}
					<!-- Divisore visivo gestione / studio -->
					<div class="w-px h-5 bg-fc-border mx-0.5"></div>

					<!-- Cluster studio: gradiente=primario, grigio=alternativa, rosso=ripasso -->
					<div class="flex items-center gap-1.5">
						<Button variant="primary" size="sm" onclick={() => goto(`/study/${deckId}`)}>
							{#snippet iconLeft()}<Play size={13} />{/snippet}
							Studia
						</Button>
						<Button variant="secondary" size="sm" onclick={() => goto(`/study/${deckId}?mode=shuffle`)}>
							{#snippet iconLeft()}<Shuffle size={13} />{/snippet}
							Casuale
						</Button>
						<button
							type="button"
							onclick={() => goto(`/study/${deckId}?mode=wrong`)}
							disabled={wrongCount === 0}
							title={wrongCount === 0 ? 'Nessuna carta da ripassare' : `Ripassa ${wrongCount} carte non sapute`}
							class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
								   {wrongCount > 0
								       ? 'border-fc-danger/50 bg-fc-danger/10 text-fc-danger hover:bg-fc-danger/20'
								       : 'border-fc-border text-fc-faint cursor-not-allowed opacity-50'}"
						>
							<RotateCcw size={13} />
							{wrongCount > 0 ? `Ripeti (${wrongCount})` : 'Ripeti'}
						</button>
					</div>
				{/if}
			</div>
		</div>

		<!-- Stats -->
		<div class="grid grid-cols-3 gap-3">
			{#each [
				{ label: 'Carte', value: deck.card_count },
				{ label: 'Sessioni', value: deck.times_studied },
				{ label: 'Mastery', value: deck.mastery !== null ? Math.round(deck.mastery * 100) + '%' : '—' },
			] as s}
				<GlassCard pad="sm" class="text-center">
					<p class="text-xl font-bold text-fc-text">{s.value}</p>
					<p class="text-xs text-fc-faint mt-0.5">{s.label}</p>
				</GlassCard>
			{/each}
		</div>

		<!-- Card list -->
		{#if deck.cards.length === 0}
			<EmptyState
				icon="🃏"
				title="Nessuna carta"
				description="Aggiungi carte manualmente o importale da un file."
			>
				{#snippet action()}
					<div class="flex gap-2">
						<Button variant="secondary" size="sm" onclick={() => showImport = true}>
							{#snippet iconLeft()}<Upload size={13} />{/snippet}
							Importa
						</Button>
						<Button variant="primary" size="sm" onclick={() => showAddCard = true}>
							{#snippet iconLeft()}<Plus size={13} />{/snippet}
							Aggiungi carta
						</Button>
					</div>
				{/snippet}
			</EmptyState>
		{:else}
			<div bind:this={listEl} class="flex flex-col gap-2">
				{#each deck.cards as card, i (card.id)}
					<div class="card-row glass p-4 flex items-start gap-4 group
						{reviewStore.unknownIds.has(card.id) ? 'border-l-2 border-l-fc-danger/50' : ''}">
						<span class="text-xs text-fc-faint w-6 shrink-0 mt-0.5 tabular-nums">{i + 1}</span>
						<div class="flex-1 min-w-0">
							<MathText text={card.question} class="text-sm font-medium text-fc-text" />
							<MathText text={card.answer} class="text-xs text-fc-muted mt-1 block" />
							{#if card.explanation}
								<MathText text={card.explanation} class="text-xs text-fc-faint mt-1 italic block" />
							{/if}
							{#if card.images && card.images.length > 0}
								<div class="flex items-center gap-1.5 mt-2">
									{#each card.images.slice(0, 4) as img (img.id)}
										<img
											src={img.url}
											alt={img.alt ?? ''}
											loading="lazy"
											class="w-9 h-9 rounded-md object-cover border border-fc-border"
										/>
									{/each}
									{#if card.images.length > 4}
										<span class="text-xs text-fc-faint">+{card.images.length - 4}</span>
									{/if}
								</div>
							{/if}
						</div>
						<div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity shrink-0">
							<button
								type="button"
								class="p-1.5 rounded-lg text-fc-muted hover:text-fc-text hover:bg-white/8 transition-colors"
								onclick={() => { editingCard = card; }}
								aria-label="Modifica carta"
							>
								<Pencil size={13} />
							</button>
							<button
								type="button"
								class="p-1.5 rounded-lg text-fc-muted hover:text-fc-danger hover:bg-fc-danger/8 transition-colors"
								onclick={() => { cardToDelete = card; showDeleteCard = true; }}
								aria-label="Elimina carta"
							>
								<Trash2 size={13} />
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<!-- Add card modal -->
<CardEditor bind:open={showAddCard} {deckId} />

<!-- Edit card modal -->
{#if editingCard}
	<CardEditor
		open={!!editingCard}
		{deckId}
		card={editingCard}
		onclose={() => editingCard = null}
		onsaved={() => editingCard = null}
	/>
{/if}

<!-- Import dialog -->
<ImportDialog bind:open={showImport} {deckId} />

<!-- Delete card confirmation -->
<Modal bind:open={showDeleteCard} title="Elimina carta" width="sm">
	{#snippet children()}
		<p class="text-sm text-fc-muted">
			Vuoi eliminare la carta: <em class="text-fc-text not-italic font-medium">"{cardToDelete?.question}"</em>?
		</p>
	{/snippet}
	{#snippet footer()}
		<Button variant="ghost" size="sm" onclick={() => showDeleteCard = false}>Annulla</Button>
		<Button variant="danger" size="sm" loading={deleting} onclick={deleteCard}>
			{#snippet iconLeft()}<Trash2 size={14} />{/snippet}
			Elimina
		</Button>
	{/snippet}
</Modal>
