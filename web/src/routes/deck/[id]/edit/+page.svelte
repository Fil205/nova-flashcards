<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { deckStore } from '$lib/stores/decks.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { friendlyError } from '$lib/api/client';
	import { fadeUp } from '$lib/anim';
	import Button from '$lib/components/ui/Button.svelte';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { ChevronLeft, Save, Trash2 } from '@lucide/svelte';
	import { parseId } from '$lib/utils';

	const deckId = $derived(parseId(page.params.id));

	let loading     = $state(true);
	let name        = $state('');
	let desc        = $state('');
	let lang        = $state('');
	let saving      = $state(false);
	let formEl      = $state<HTMLElement | null>(null);
	let showDelete  = $state(false);
	let deleting    = $state(false);

	const LANGS = [
		{ value: '', label: 'Predefinita del sistema' },
		{ value: 'it-IT', label: 'Italiano' },
		{ value: 'en-US', label: 'English (US)' },
		{ value: 'en-GB', label: 'English (UK)' },
		{ value: 'fr-FR', label: 'Français' },
		{ value: 'de-DE', label: 'Deutsch' },
		{ value: 'es-ES', label: 'Español' },
	];

	onMount(async () => {
		if (isNaN(deckId)) { goto('/'); return; }
		const deck = await deckStore.loadDeck(deckId);
		if (!deck) { goto('/'); return; }
		name    = deck.name;
		desc    = deck.description ?? '';
		lang    = deck.lang ?? '';
		loading = false;
		if (formEl) fadeUp(formEl, 0, 0.35);
	});

	async function deleteDeck(): Promise<void> {
		deleting = true;
		try {
			await deckStore.delete(deckId);
			toastStore.success('Mazzo eliminato.');
			goto('/');
		} catch (e) {
			toastStore.error(friendlyError(e));
		} finally {
			deleting = false;
			showDelete = false;
		}
	}

	async function save(): Promise<void> {
		if (!name.trim()) return;
		saving = true;
		try {
			await deckStore.update(deckId, {
				name:        name.trim(),
				description: desc.trim() || undefined,
				lang:        lang || undefined,
			});
			toastStore.success('Mazzo aggiornato.');
			goto(`/deck/${deckId}`);
		} catch (e) {
			toastStore.error(friendlyError(e));
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head><title>Modifica mazzo — Falschcard</title></svelte:head>

<div class="max-w-lg mx-auto flex flex-col gap-6">
	<div class="flex items-center gap-3">
		<a
			href="/deck/{deckId}"
			class="p-2 rounded-lg text-fc-muted hover:text-fc-text hover:bg-white/8 transition-colors"
			aria-label="Torna al mazzo"
		>
			<ChevronLeft size={18} />
		</a>
		<h1 class="text-xl font-bold font-display text-fc-text">Modifica mazzo</h1>
	</div>

	{#if loading}
		<div class="flex justify-center py-12">
			<Spinner size={28} class="text-fc-muted" />
		</div>
	{:else}
		<div bind:this={formEl}>
		<GlassCard pad="md">
			<div class="flex flex-col gap-4">
				<div>
					<label for="edit-name" class="text-xs font-medium text-fc-muted uppercase tracking-wide block mb-1.5">Nome</label>
					<input id="edit-name" type="text" class="input-base" placeholder="Nome del mazzo" bind:value={name} />
				</div>
				<div>
					<label for="edit-desc" class="text-xs font-medium text-fc-muted uppercase tracking-wide block mb-1.5">Descrizione</label>
					<textarea id="edit-desc" class="input-base min-h-[60px]" placeholder="Descrizione opzionale..." bind:value={desc}></textarea>
				</div>
				<div>
					<label for="edit-lang" class="text-xs font-medium text-fc-muted uppercase tracking-wide block mb-1.5">
						Lingua (per TTS)
					</label>
					<select id="edit-lang" class="input-base" bind:value={lang}>
						{#each LANGS as l}
							<option value={l.value}>{l.label}</option>
						{/each}
					</select>
				</div>
			</div>
		</GlassCard>
		</div>

		<!-- Footer: Elimina a sinistra (distruttivo), Annulla+Salva a destra (costruttivo) -->
		<div class="flex items-center justify-between gap-4">
			<Button variant="danger" size="sm" onclick={() => showDelete = true}>
				{#snippet iconLeft()}<Trash2 size={13} />{/snippet}
				Elimina mazzo
			</Button>
			<div class="flex gap-2">
				<Button variant="ghost" size="sm" onclick={() => goto(`/deck/${deckId}`)}>Annulla</Button>
				<Button variant="primary" size="sm" loading={saving} onclick={save}>
					{#snippet iconLeft()}<Save size={14} />{/snippet}
					Salva modifiche
				</Button>
			</div>
		</div>
	{/if}
</div>

<!-- Conferma eliminazione mazzo -->
<Modal bind:open={showDelete} title="Elimina mazzo" width="sm">
	{#snippet children()}
		<p class="text-sm text-fc-muted">
			Vuoi eliminare il mazzo <strong class="text-fc-text">"{name}"</strong>
			con tutte le sue carte? L'operazione non è reversibile.
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
