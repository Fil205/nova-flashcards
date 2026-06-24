<script lang="ts">
	import { deckStore } from '$lib/stores/decks.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { profileStore } from '$lib/stores/profile.svelte';
	import { friendlyError } from '$lib/api/client';
	import { parseJson } from '$lib/import/parsers';
	import { IMPORT_AI_PROMPT } from '$lib/import/aiPrompt';
	import { aiApi } from '$lib/api/ai';
	import Button from './ui/Button.svelte';
	import Modal from './ui/Modal.svelte';
	import MathText from './MathText.svelte';
	import { Upload, AlertTriangle, Sparkles, Copy, Check, Wand2 } from '@lucide/svelte';

	interface Props {
		open: boolean;
		deckId: number;
		onclose?: () => void;
		onimported?: (count: number) => void;
	}

	let { open = $bindable(), deckId, onclose, onimported }: Props = $props();

	let rawText      = $state('');
	let errors       = $state<string[]>([]);
	let preview      = $state<{ question: string; answer: string }[]>([]);
	let importing    = $state(false);
	let fixing       = $state(false);
	let step         = $state<'input' | 'preview'>('input');
	let promptCopied = $state(false);
	let parseResult  = $state<import('$lib/types').ImportParseResult>({ cards: [], errors: [] });

	const hasApiKey = $derived(profileStore.settings?.has_api_key ?? false);

	function parse(): void {
		if (!rawText.trim()) return;
		const result = parseJson(rawText);
		parseResult = result;
		errors  = result.errors;
		preview = result.cards.slice(0, 5);

		if (result.cards.length > 0) {
			step = 'preview';
		}
	}

	async function fixWithAi(): Promise<void> {
		const profileId = profileStore.active?.id;
		if (!profileId || !rawText.trim()) return;
		fixing = true;
		try {
			const { fixed } = await aiApi.fixImport(profileId, rawText);
			rawText = fixed;
			parse();
		} catch (e) {
			toastStore.error(friendlyError(e));
		} finally {
			fixing = false;
		}
	}

	async function doImport(): Promise<void> {
		const result = parseResult;
		if (result.cards.length === 0) return;

		importing = true;
		try {
			const count = await deckStore.bulkAddCards(deckId, result.cards);
			toastStore.success(`${count} carte importate.`);
			onimported?.(count);
			rawText = '';
			step = 'input';
			open = false;
		} catch (e) {
			toastStore.error(friendlyError(e));
		} finally {
			importing = false;
		}
	}

	async function handleFile(e: Event): Promise<void> {
		const input = e.target as HTMLInputElement;
		const file  = input.files?.[0];
		if (!file) return;
		rawText = await file.text();
		parse();
	}

	async function handleCopyPrompt(): Promise<void> {
		try {
			await navigator.clipboard.writeText(IMPORT_AI_PROMPT);
			promptCopied = true;
			toastStore.success('Prompt copiato! Incollalo in Claude / ChatGPT / Gemini con i tuoi documenti.');
			setTimeout(() => { promptCopied = false; }, 2500);
		} catch {
			toastStore.error('Impossibile copiare. Seleziona il testo manualmente.');
		}
	}

	function reset(): void {
		rawText = '';
		errors = [];
		preview = [];
		step = 'input';
	}
</script>

<Modal bind:open title="Importa carte" width="lg" onclose={() => { reset(); onclose?.(); }}>
	{#snippet children()}
		{#if step === 'input'}
			<div class="flex flex-col gap-4">
				<!-- 1. AI prompt section — TOP -->
				<div class="rounded-xl border border-fc-border bg-white/3 px-4 py-3 flex flex-col gap-2">
					<div class="flex items-center justify-between gap-3">
						<div class="flex items-center gap-2 text-sm font-medium text-fc-text">
							<Sparkles size={14} class="text-fc-accent-light" />
							Genera flashcard con AI
						</div>
						<button
							type="button"
							onclick={handleCopyPrompt}
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
						Copia il prompt, aprilo in Claude / ChatGPT / Gemini, allega i tuoi documenti
						(PDF, appunti, slide) e incolla la risposta JSON qui sotto.
					</p>
				</div>

				<!-- 2. Textarea — paste zone -->
				<textarea
					class="input-base font-mono text-xs min-h-[140px]"
					placeholder="Incolla qui il JSON generato dall'AI o il tuo export Falschcard…"
					bind:value={rawText}
				></textarea>

				<!-- 3. File drop -->
				<label
					class="border-2 border-dashed border-fc-border hover:border-fc-border-hover rounded-xl p-4
						   flex items-center gap-3 cursor-pointer transition-colors group"
				>
					<Upload size={18} class="text-fc-muted group-hover:text-fc-text transition-colors shrink-0" />
					<span class="text-sm text-fc-muted">
						oppure carica un file <span class="font-mono text-fc-accent-light">.json</span>
					</span>
					<input type="file" class="hidden" accept=".json" onchange={handleFile} />
				</label>

				<!-- 4. Format hint -->
				<div class="rounded-lg border border-fc-border bg-white/3 px-4 py-3 text-xs text-fc-text">
					<p class="font-medium mb-1">Formato JSON atteso</p>
					<p class="font-mono text-fc-accent-light leading-relaxed">
						[{"{"}"question":"...","answer":"...","explanation":"..."{"}"}]
					</p>
					<p class="text-fc-muted mt-1 text-xs">
						Oppure export Falschcard: <span class="font-mono">{"{ \"decks\": [...] }"}</span>
					</p>
				</div>

				<!-- 5. Errors + AI fix -->
				{#if errors.length > 0}
					<div class="flex flex-col gap-2">
						<div class="flex flex-col gap-1">
							{#each errors.slice(0, 3) as err}
								<p class="text-xs text-fc-warning flex items-center gap-1.5">
									<AlertTriangle size={12} /> {err}
								</p>
							{/each}
						</div>
						{#if hasApiKey}
							<Button variant="secondary" size="sm" loading={fixing} onclick={fixWithAi} class="self-start">
								{#snippet iconLeft()}<Wand2 size={14} />{/snippet}
								Correggi con AI
							</Button>
						{/if}
					</div>
				{/if}
			</div>
		{:else}
			<!-- Preview -->
			<div class="flex flex-col gap-3">
				<p class="text-sm text-fc-muted">
					<strong class="text-fc-text">{parseResult.cards.length}</strong> carte pronte per l'importazione.
					Anteprima delle prime 5:
				</p>
				<div class="flex flex-col gap-2 max-h-64 overflow-y-auto">
					{#each preview as card, i}
						<div class="bg-white/4 rounded-lg px-3 py-2.5 text-sm">
							<span class="font-medium text-fc-text">{i + 1}. <MathText text={card.question} /></span>
							<MathText text={card.answer} class="text-fc-muted text-xs mt-0.5 block" />
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/snippet}
	{#snippet footer()}
		{#if step === 'input'}
			<Button variant="ghost" size="sm" onclick={() => { reset(); open = false; onclose?.(); }}>Annulla</Button>
			<Button variant="primary" size="sm" disabled={!rawText.trim()} onclick={parse}>
				Anteprima
			</Button>
		{:else}
			<Button variant="ghost" size="sm" onclick={() => step = 'input'}>Indietro</Button>
			<Button variant="primary" size="sm" loading={importing} onclick={doImport}>
				{#snippet iconLeft()}<Upload size={14} />{/snippet}
				Importa
			</Button>
		{/if}
	{/snippet}
</Modal>
