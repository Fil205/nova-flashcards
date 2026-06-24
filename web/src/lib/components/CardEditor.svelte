<script lang="ts">
	import type { Card, CardDraft, CardImage, CardSection } from '$lib/types';
	import { deckStore } from '$lib/stores/decks.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { friendlyError } from '$lib/api/client';
	import { flashSuccess, shake } from '$lib/anim';
	import Button from './ui/Button.svelte';
	import Modal from './ui/Modal.svelte';
	import ImageUploader from './ImageUploader.svelte';
	import { Save } from '@lucide/svelte';

	interface Props {
		open: boolean;
		deckId: number;
		card?: Card | null;     // null = create mode
		onclose?: () => void;
		onsaved?: () => void;
	}

	let { open = $bindable(), deckId, card = null, onclose, onsaved }: Props = $props();

	let question    = $state('');
	let answer      = $state('');
	let explanation = $state('');
	let saving      = $state(false);
	let errorMsg    = $state('');
	let formEl      = $state<HTMLElement | null>(null);

	// Image uploaders (one per section). The {#key uploaderKey} blocks remount them
	// when the edited card changes (card.id) or after creating a new card
	// (createCount). Derived — never assigned inside an effect, to avoid a reactive loop.
	let createCount   = $state(0);
	const uploaderKey = $derived(card?.id ?? `new-${createCount}`);
	let qUploader     = $state<ImageUploader | null>(null);
	let aUploader     = $state<ImageUploader | null>(null);
	let eUploader     = $state<ImageUploader | null>(null);

	const initialImages = (s: CardSection): CardImage[] =>
		(card?.images ?? []).filter((i) => i.section === s);

	// Reset form when card prop changes (or modal opens)
	$effect(() => {
		question    = card?.question ?? '';
		answer      = card?.answer ?? '';
		explanation = card?.explanation ?? '';
		errorMsg    = '';
	});

	async function save(): Promise<void> {
		errorMsg = '';
		if (!question.trim() || !answer.trim()) {
			errorMsg = 'Domanda e risposta sono obbligatorie.';
			if (formEl) shake(formEl);
			return;
		}

		saving = true;
		try {
			const draft: CardDraft = {
				question:    question.trim(),
				answer:      answer.trim(),
				explanation: explanation.trim() || undefined,
			};

			if (card) {
				await deckStore.updateCard(card.id, draft);
				toastStore.success('Carta aggiornata.');
			} else {
				// Are there images waiting to be attached to the new card?
				const pendingImages =
					(qUploader?.count() ?? 0) + (aUploader?.count() ?? 0) + (eUploader?.count() ?? 0) > 0;

				const newCard = await deckStore.addCard(deckId, draft);

				// Flush deferred image uploads now that the card exists.
				await Promise.all([
					qUploader?.flush(newCard.id),
					aUploader?.flush(newCard.id),
					eUploader?.flush(newCard.id),
				]);
				// Refresh the deck so the new card carries its images in the store.
				if (pendingImages) await deckStore.loadDeck(deckId);

				toastStore.success('Carta aggiunta.');
				// Reset for next card (createCount bump remounts empty uploaders)
				question    = '';
				answer      = '';
				explanation = '';
				createCount++;
			}

			if (formEl) flashSuccess(formEl);
			onsaved?.();
		} catch (e) {
			errorMsg = friendlyError(e);
			if (formEl) shake(formEl);
		} finally {
			saving = false;
		}
	}
</script>

<Modal bind:open title={card ? 'Modifica carta' : 'Nuova carta'} onclose={onclose}>
	{#snippet children()}
		<div bind:this={formEl} class="flex flex-col gap-4">
			<div>
				<label for="ce-question" class="text-xs font-medium text-fc-muted uppercase tracking-wide block mb-1.5">
				Domanda <span class="text-fc-danger normal-case">*</span>
			</label>
				<!-- svelte-ignore a11y_autofocus -->
				<textarea
					id="ce-question"
					class="input-base min-h-[80px]"
					placeholder="Scrivi la domanda..."
					bind:value={question}
					autofocus
				></textarea>
				<div class="mt-2">
					{#key uploaderKey}
						<ImageUploader
							bind:this={qUploader}
							section="question"
							cardId={card?.id ?? null}
							initial={initialImages('question')}
						/>
					{/key}
				</div>
			</div>
			<div>
				<label for="ce-answer" class="text-xs font-medium text-fc-muted uppercase tracking-wide block mb-1.5">
				Risposta <span class="text-fc-danger normal-case">*</span>
			</label>
				<textarea
					id="ce-answer"
					class="input-base min-h-[80px]"
					placeholder="Scrivi la risposta..."
					bind:value={answer}
				></textarea>
				<div class="mt-2">
					{#key uploaderKey}
						<ImageUploader
							bind:this={aUploader}
							section="answer"
							cardId={card?.id ?? null}
							initial={initialImages('answer')}
						/>
					{/key}
				</div>
			</div>
			<div>
				<label for="ce-explanation" class="text-xs font-medium text-fc-muted uppercase tracking-wide block mb-1.5">
					Spiegazione <span class="text-fc-faint normal-case">(opzionale)</span>
				</label>
				<textarea
					id="ce-explanation"
					class="input-base min-h-[60px]"
					placeholder="Aggiungi una spiegazione per il tutor AI..."
					bind:value={explanation}
				></textarea>
				<div class="mt-2">
					{#key uploaderKey}
						<ImageUploader
							bind:this={eUploader}
							section="explanation"
							cardId={card?.id ?? null}
							initial={initialImages('explanation')}
						/>
					{/key}
				</div>
			</div>

			{#if errorMsg}
				<p class="text-xs text-fc-danger">{errorMsg}</p>
			{/if}
		</div>
	{/snippet}
	{#snippet footer()}
		<Button variant="ghost" size="sm" onclick={() => { open = false; onclose?.(); }}>Annulla</Button>
		<Button variant="primary" size="sm" loading={saving} onclick={save}>
			{#snippet iconLeft()}<Save size={14} />{/snippet}
			{card ? 'Salva' : 'Aggiungi'}
		</Button>
	{/snippet}
</Modal>
