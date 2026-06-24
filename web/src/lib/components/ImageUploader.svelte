<script lang="ts">
	import type { CardImage, CardSection } from '$lib/types';
	import { imagesApi } from '$lib/api/images';
	import { compressImage, ImageCompressError } from '$lib/images/compress';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { friendlyError } from '$lib/api/client';
	import Spinner from './ui/Spinner.svelte';
	import { ImagePlus, X } from '@lucide/svelte';

	const MAX = 3;

	interface Pending {
		blob: Blob;
		ext: 'webp' | 'jpg';
		previewUrl: string;
	}

	interface Props {
		section: CardSection;
		/** Card id once it exists. null in create mode → uploads are deferred. */
		cardId: number | null;
		/** Already-stored images for this section (edit mode). */
		initial?: CardImage[];
	}

	let { section, cardId, initial = [] }: Props = $props();

	// Committed = on the server. Pending = compressed locally, awaiting a card id.
	let committed = $state<CardImage[]>([...initial]);
	let pending   = $state<Pending[]>([]);
	let busy      = $state(false);
	let inputEl   = $state<HTMLInputElement | null>(null);

	const total = $derived(committed.length + pending.length);

	/** Total images currently held (used by the editor to gate saving if needed). */
	export function count(): number {
		return total;
	}

	/**
	 * Upload all pending blobs to a (now-existing) card. Called by CardEditor
	 * after it creates the card in "new card" mode. Resolves when all are sent.
	 */
	export async function flush(newCardId: number): Promise<void> {
		for (const p of pending.slice()) {
			try {
				const { image } = await imagesApi.upload(newCardId, p.blob, section, `image.${p.ext}`);
				committed = [...committed, image];
			} catch (e) {
				toastStore.error(friendlyError(e));
			} finally {
				URL.revokeObjectURL(p.previewUrl);
			}
		}
		pending = [];
	}

	async function onPick(e: Event): Promise<void> {
		const input = e.target as HTMLInputElement;
		const files = Array.from(input.files ?? []);
		input.value = ''; // allow re-picking the same file
		if (files.length === 0) return;

		const room = MAX - total;
		if (files.length > room) {
			toastStore.warning(`Puoi aggiungere ancora ${room} immagine${room === 1 ? '' : 'i'} in questa sezione.`);
		}

		busy = true;
		try {
			for (const file of files.slice(0, room)) {
				try {
					const { blob, ext } = await compressImage(file);
					if (cardId != null) {
						// Edit mode: upload immediately.
						const { image } = await imagesApi.upload(cardId, blob, section, `image.${ext}`);
						committed = [...committed, image];
					} else {
						// Create mode: hold until the card exists.
						pending = [...pending, { blob, ext, previewUrl: URL.createObjectURL(blob) }];
					}
				} catch (err) {
					toastStore.error(err instanceof ImageCompressError ? err.message : friendlyError(err));
				}
			}
		} finally {
			busy = false;
		}
	}

	async function removeCommitted(img: CardImage): Promise<void> {
		try {
			await imagesApi.remove(img.id);
			committed = committed.filter((c) => c.id !== img.id);
		} catch (e) {
			toastStore.error(friendlyError(e));
		}
	}

	function removePending(i: number): void {
		const p = pending[i];
		if (p) URL.revokeObjectURL(p.previewUrl);
		pending = pending.filter((_, idx) => idx !== i);
	}
</script>

<div class="flex items-center gap-2 flex-wrap">
	{#each committed as img (img.id)}
		<div class="iu-thumb">
			<img src={img.url} alt={img.alt ?? ''} />
			<button type="button" class="iu-del" aria-label="Rimuovi immagine" onclick={() => removeCommitted(img)}>
				<X size={12} />
			</button>
		</div>
	{/each}

	{#each pending as p, i (p.previewUrl)}
		<div class="iu-thumb">
			<img src={p.previewUrl} alt="" />
			<button type="button" class="iu-del" aria-label="Rimuovi immagine" onclick={() => removePending(i)}>
				<X size={12} />
			</button>
		</div>
	{/each}

	{#if total < MAX}
		<button
			type="button"
			class="iu-add"
			disabled={busy}
			onclick={() => inputEl?.click()}
			title="Aggiungi immagine"
		>
			{#if busy}
				<Spinner size={16} class="text-fc-muted" />
			{:else}
				<ImagePlus size={16} />
				<span class="text-[10px] mt-0.5">{total}/{MAX}</span>
			{/if}
		</button>
	{/if}

	<input
		bind:this={inputEl}
		type="file"
		accept="image/*"
		multiple
		class="hidden"
		onchange={onPick}
	/>
</div>

<style>
	.iu-thumb {
		position: relative;
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 0.6rem;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.03);
		flex: 0 0 auto;
	}
	.iu-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.iu-del {
		position: absolute;
		top: 2px;
		right: 2px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.1rem;
		height: 1.1rem;
		border-radius: 9999px;
		background: rgba(0, 0, 0, 0.6);
		color: #fff;
		transition: background 0.15s;
	}
	.iu-del:hover {
		background: rgba(239, 68, 68, 0.85);
	}
	.iu-add {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 0.6rem;
		border: 1px dashed rgba(255, 255, 255, 0.2);
		color: rgba(240, 242, 255, 0.55);
		transition: border-color 0.15s, color 0.15s, background 0.15s;
		flex: 0 0 auto;
	}
	.iu-add:hover:not(:disabled) {
		border-color: rgba(167, 139, 250, 0.6);
		color: #a78bfa;
		background: rgba(255, 255, 255, 0.03);
	}
	.iu-add:disabled {
		opacity: 0.6;
		cursor: default;
	}
</style>
