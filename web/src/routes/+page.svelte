<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { deckStore } from '$lib/stores/decks.svelte';
	import { profileStore } from '$lib/stores/profile.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { friendlyError } from '$lib/api/client';
	import { aiApi } from '$lib/api/ai';
	import { parseJson } from '$lib/import/parsers';
	import { IMPORT_AI_PROMPT } from '$lib/import/aiPrompt';
	import { staggerFadeUp, fadeUp, scaleIn } from '$lib/anim';
	import DeckCard from '$lib/components/DeckCard.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { DeckSummary } from '$lib/types';
	import { Plus, Search, Trash2, Upload, Sparkles, Copy, Check, Wand2, AlertTriangle } from '@lucide/svelte';

	let headerEl  = $state<HTMLElement | null>(null);
	let gridEl    = $state<HTMLElement | null>(null);
	let searchQ   = $state('');
	let showCreate = $state(false);
	let createTab  = $state<'empty' | 'json'>('empty');
	let deckName   = $state('');
	let deckDesc   = $state('');
	let creating   = $state(false);

	// Create-from-JSON tab
	let jsonText     = $state('');
	let jsonErrors   = $state<string[]>([]);
	let jsonImporting = $state(false);
	let jsonFixing   = $state(false);
	let promptCopied = $state(false);

	const hasApiKey = $derived(profileStore.settings?.has_api_key ?? false);

	function resetCreate(): void {
		createTab  = 'empty';
		deckName   = '';
		deckDesc   = '';
		jsonText   = '';
		jsonErrors = [];
	}

	// Delete confirmation
	let showDelete  = $state(false);
	let deckToDelete = $state<DeckSummary | null>(null);
	let deleting     = $state(false);

	onMount(() => {
		if (headerEl) fadeUp(headerEl, 0, 0.4);
		if (gridEl) {
			const cards = gridEl.querySelectorAll('.glass');
			staggerFadeUp(cards, 0.07, 0.1);
		}
	});

	const filteredDecks = $derived(
		deckStore.decks.filter((d) =>
			!searchQ || d.name.toLowerCase().includes(searchQ.toLowerCase())
		)
	);

	async function createDeck(): Promise<void> {
		const name = deckName.trim();
		if (!name) return;
		const profileId = profileStore.active?.id;
		if (!profileId) return;

		creating = true;
		try {
			const deck = await deckStore.create(profileId, {
				name,
				description: deckDesc.trim() || undefined,
			});
			toastStore.success(`Mazzo "${name}" creato.`);
			showCreate = false;
			resetCreate();
			goto(`/deck/${deck.id}`);
		} catch (e) {
			toastStore.error(friendlyError(e));
		} finally {
			creating = false;
		}
	}

	/** Create a new deck directly from pasted/uploaded JSON. */
	async function createFromJson(): Promise<void> {
		const profileId = profileStore.active?.id;
		if (!profileId || !jsonText.trim()) return;

		const result = parseJson(jsonText);
		jsonErrors = result.errors;
		if (result.cards.length === 0) return; // nothing to import — keep errors visible

		const name = (result.name && result.name.trim()) || 'Nuovo mazzo';

		jsonImporting = true;
		try {
			const deck = await deckStore.create(profileId, {
				name,
				description: result.description || undefined,
				source: 'import-json',
			});
			await deckStore.bulkAddCards(deck.id, result.cards);
			toastStore.success(`Mazzo "${name}" creato con ${result.cards.length} carte.`);
			showCreate = false;
			resetCreate();
			goto(`/deck/${deck.id}`);
		} catch (e) {
			toastStore.error(friendlyError(e));
		} finally {
			jsonImporting = false;
		}
	}

	async function fixJsonWithAi(): Promise<void> {
		const profileId = profileStore.active?.id;
		if (!profileId || !jsonText.trim()) return;
		jsonFixing = true;
		try {
			const { fixed } = await aiApi.fixImport(profileId, jsonText);
			jsonText = fixed;
			jsonErrors = parseJson(jsonText).errors;
		} catch (e) {
			toastStore.error(friendlyError(e));
		} finally {
			jsonFixing = false;
		}
	}

	async function handleJsonFile(e: Event): Promise<void> {
		const input = e.target as HTMLInputElement;
		const file  = input.files?.[0];
		if (!file) return;
		jsonText = await file.text();
		jsonErrors = [];
	}

	async function copyPrompt(): Promise<void> {
		try {
			await navigator.clipboard.writeText(IMPORT_AI_PROMPT);
			promptCopied = true;
			toastStore.success('Prompt copiato! Incollalo in Claude / ChatGPT / Gemini con i tuoi documenti.');
			setTimeout(() => { promptCopied = false; }, 2500);
		} catch {
			toastStore.error('Impossibile copiare. Seleziona il testo manualmente.');
		}
	}

	function confirmDelete(deck: DeckSummary): void {
		deckToDelete = deck;
		showDelete = true;
	}

	async function deleteDeck(): Promise<void> {
		if (!deckToDelete) return;
		deleting = true;
		try {
			await deckStore.delete(deckToDelete.id);
			toastStore.success(`Mazzo "${deckToDelete.name}" eliminato.`);
			showDelete   = false;
			deckToDelete = null;
		} catch (e) {
			toastStore.error(friendlyError(e));
		} finally {
			deleting = false;
		}
	}
</script>

<svelte:head><title>Falschcard — I miei mazzi</title></svelte:head>

<div class="flex flex-col gap-6">
	<!-- Header -->
	<div bind:this={headerEl} class="flex items-center justify-between gap-4 flex-wrap">
		<div>
			<h1 class="text-xl font-bold font-display text-fc-text">
				Ciao, <span class="gradient-text">{profileStore.active?.name}</span> 👋
			</h1>
			<p class="text-sm text-fc-muted mt-0.5">
				{deckStore.decks.length} {deckStore.decks.length === 1 ? 'mazzo' : 'mazzi'}
			</p>
		</div>
		<Button variant="primary" size="sm" onclick={() => showCreate = true}>
			{#snippet iconLeft()}<Plus size={14} />{/snippet}
			Nuovo mazzo
		</Button>
	</div>

	<!-- Search (only if there are decks) -->
	{#if deckStore.decks.length > 3}
		<div class="relative">
			<Search size={15} class="absolute left-3 top-1/2 -translate-y-1/2 text-fc-faint" />
			<input
				type="search"
				class="input-base pl-9"
				placeholder="Cerca mazzo..."
				bind:value={searchQ}
			/>
		</div>
	{/if}

	<!-- Deck grid -->
	{#if deckStore.loading}
		<div class="flex justify-center py-16">
			<Spinner size={28} class="text-fc-muted" />
		</div>
	{:else if filteredDecks.length === 0}
		<EmptyState
			icon="📦"
			title={searchQ ? 'Nessun mazzo trovato' : 'Nessun mazzo ancora'}
			description={searchQ ? 'Prova con un altro termine.' : 'Crea il tuo primo mazzo per iniziare a studiare.'}
		>
			{#snippet action()}
				{#if !searchQ}
					<Button variant="primary" size="sm" onclick={() => showCreate = true}>
						{#snippet iconLeft()}<Plus size={14} />{/snippet}
						Crea mazzo
					</Button>
				{/if}
			{/snippet}
		</EmptyState>
	{:else}
		<div
			bind:this={gridEl}
			class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
		>
			{#each filteredDecks as deck (deck.id)}
				<DeckCard
					{deck}
					onclick={(d) => goto(`/deck/${d.id}`)}
					onStudy={(d) => goto(`/study/${d.id}`)}
					onEdit={(d) => goto(`/deck/${d.id}/edit`)}
					onDelete={confirmDelete}
				/>
			{/each}
		</div>
	{/if}
</div>

<!-- Create deck modal -->
<Modal bind:open={showCreate} title="Nuovo mazzo" width={createTab === 'json' ? 'lg' : 'sm'} onclose={resetCreate}>
	{#snippet children()}
		<!-- Tab switch -->
		<div class="flex gap-1 p-1 mb-4 rounded-xl bg-white/5 border border-fc-border">
			<button
				type="button"
				onclick={() => createTab = 'empty'}
				class="flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors
					   {createTab === 'empty' ? 'bg-fc-accent/20 text-fc-accent-light' : 'text-fc-muted hover:text-fc-text'}"
			>
				Vuoto
			</button>
			<button
				type="button"
				onclick={() => createTab = 'json'}
				class="flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors
					   {createTab === 'json' ? 'bg-fc-accent/20 text-fc-accent-light' : 'text-fc-muted hover:text-fc-text'}"
			>
				Da JSON
			</button>
		</div>

		{#if createTab === 'empty'}
			<div class="flex flex-col gap-4">
				<input
					type="text"
					class="input-base"
					placeholder="Nome del mazzo"
					bind:value={deckName}
					onkeydown={(e) => e.key === 'Enter' && createDeck()}
				/>
				<textarea
					class="input-base min-h-[60px]"
					placeholder="Descrizione (opzionale)"
					bind:value={deckDesc}
				></textarea>
			</div>
		{:else}
			<div class="flex flex-col gap-4">
				<!-- AI prompt helper -->
				<div class="rounded-xl border border-fc-border bg-white/3 px-4 py-3 flex flex-col gap-2">
					<div class="flex items-center justify-between gap-3">
						<div class="flex items-center gap-2 text-sm font-medium text-fc-text">
							<Sparkles size={14} class="text-fc-accent-light" />
							Genera un mazzo con AI
						</div>
						<button
							type="button"
							onclick={copyPrompt}
							class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
								   {promptCopied
								       ? 'border-fc-success/50 bg-fc-success/10 text-fc-success'
								       : 'border-fc-border text-fc-muted hover:text-fc-text hover:border-fc-border-hover'}"
						>
							{#if promptCopied}
								<Check size={12} /> Prompt copiato!
							{:else}
								<Copy size={12} /> Copia prompt
							{/if}
						</button>
					</div>
					<p class="text-xs text-fc-muted leading-relaxed">
						Copia il prompt, aprilo in Claude / ChatGPT / Gemini, allega i tuoi documenti e incolla
						qui il JSON. Includerà nome, descrizione e carte del mazzo.
					</p>
				</div>

				<!-- Paste zone -->
				<textarea
					class="input-base font-mono text-xs min-h-[140px]"
					placeholder={'Incolla qui il JSON: { "name": "...", "description": "...", "cards": [...] }'}
					bind:value={jsonText}
					oninput={() => { jsonErrors = []; }}
				></textarea>

				<!-- File drop -->
				<label
					class="border-2 border-dashed border-fc-border hover:border-fc-border-hover rounded-xl p-4
						   flex items-center gap-3 cursor-pointer transition-colors group"
				>
					<Upload size={18} class="text-fc-muted group-hover:text-fc-text transition-colors shrink-0" />
					<span class="text-sm text-fc-muted">
						oppure carica un file <span class="font-mono text-fc-accent-light">.json</span>
					</span>
					<input type="file" class="hidden" accept=".json" onchange={handleJsonFile} />
				</label>

				<!-- Errors + AI fix -->
				{#if jsonErrors.length > 0}
					<div class="flex flex-col gap-2">
						<div class="flex flex-col gap-1">
							{#each jsonErrors.slice(0, 3) as err}
								<p class="text-xs text-fc-warning flex items-center gap-1.5">
									<AlertTriangle size={12} /> {err}
								</p>
							{/each}
						</div>
						{#if hasApiKey}
							<Button variant="secondary" size="sm" loading={jsonFixing} onclick={fixJsonWithAi} class="self-start">
								{#snippet iconLeft()}<Wand2 size={14} />{/snippet}
								Correggi con AI
							</Button>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	{/snippet}
	{#snippet footer()}
		<Button variant="ghost" size="sm" onclick={() => { showCreate = false; resetCreate(); }}>Annulla</Button>
		{#if createTab === 'empty'}
			<Button variant="primary" size="sm" loading={creating} onclick={createDeck}>
				{#snippet iconLeft()}<Plus size={14} />{/snippet}
				Crea
			</Button>
		{:else}
			<Button variant="primary" size="sm" loading={jsonImporting} disabled={!jsonText.trim()} onclick={createFromJson}>
				{#snippet iconLeft()}<Upload size={14} />{/snippet}
				Crea da JSON
			</Button>
		{/if}
	{/snippet}
</Modal>

<!-- Delete confirmation -->
<Modal bind:open={showDelete} title="Elimina mazzo" width="sm">
	{#snippet children()}
		<p class="text-sm text-fc-muted">
			Vuoi eliminare il mazzo <strong class="text-fc-text">{deckToDelete?.name}</strong>
			con tutte le sue {deckToDelete?.card_count ?? 0} carte? L'operazione è irreversibile.
		</p>
	{/snippet}
	{#snippet footer()}
		<Button variant="ghost" size="sm" onclick={() => showDelete = false}>Annulla</Button>
		<Button variant="danger" size="sm" loading={deleting} onclick={deleteDeck}>
			{#snippet iconLeft()}<Trash2 size={14} />{/snippet}
			Elimina
		</Button>
	{/snippet}
</Modal>
