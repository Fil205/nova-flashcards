<script lang="ts">
	import { onMount } from 'svelte';
	import { profileStore } from '$lib/stores/profile.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { deckStore } from '$lib/stores/decks.svelte';
	import { friendlyError } from '$lib/api/client';
	import { fadeUp, scaleIn } from '$lib/anim';
	import Button from './ui/Button.svelte';
	import GlassCard from './ui/GlassCard.svelte';
	import Spinner from './ui/Spinner.svelte';
	import { Layers, Plus, User } from '@lucide/svelte';

	interface Props {
		onactivated?: () => void;
	}

	let { onactivated }: Props = $props();

	let cardEl    = $state<HTMLElement | null>(null);
	let mode      = $state<'select' | 'create'>('select');
	let newName   = $state('');
	let creating  = $state(false);
	let selecting = $state<number | null>(null);
	let error     = $state('');

	onMount(async () => {
		await profileStore.loadProfiles();
		if (cardEl) scaleIn(cardEl);
	});

	async function select(id: number): Promise<void> {
		selecting = id;
		error = '';
		const ok = await profileStore.bootstrap(id);
		if (ok) {
			deckStore.hydrate(profileStore.bootstrapDecks);
			onactivated?.();
		} else {
			error = profileStore.error ?? 'Errore nel caricamento del profilo.';
			await profileStore.loadProfiles();
		}
		selecting = null;
	}

	async function create(): Promise<void> {
		const name = newName.trim();
		if (!name) { error = 'Inserisci un nome.'; return; }
		creating = true;
		error = '';
		try {
			const profile = await profileStore.createAndActivate(name);
			deckStore.hydrate(profileStore.bootstrapDecks);
			onactivated?.();
		} catch (e) {
			error = friendlyError(e);
		} finally {
			creating = false;
		}
	}
</script>

<div class="min-h-dvh flex flex-col items-center justify-center p-6">
	<div bind:this={cardEl} class="w-full max-w-sm">
		<!-- Logo / Branding -->
		<div class="text-center mb-8">
			<div class="w-16 h-16 rounded-2xl bg-fc-gradient flex items-center justify-center mx-auto mb-4 shadow-glow">
				<Layers size={28} class="text-white" />
			</div>
			<h1 class="text-2xl font-bold font-display gradient-text">Falschcard</h1>
			<p class="text-fc-muted text-sm mt-1">Crea e studia le tue flashcard</p>
		</div>

		<GlassCard>
			{#if mode === 'select'}
				<h2 class="text-base font-semibold mb-4 text-fc-text">Seleziona profilo</h2>

				{#if profileStore.profiles.length === 0}
					<p class="text-fc-muted text-sm mb-4">Nessun profilo trovato. Creane uno per iniziare.</p>
				{:else}
					<div class="flex flex-col gap-2 mb-4">
						{#each profileStore.profiles as profile}
							<button
								class="flex items-center gap-3 px-4 py-3 rounded-xl border border-fc-border
									   bg-white/4 hover:bg-white/8 hover:border-fc-border-hover
									   transition-all text-left group"
								onclick={() => select(profile.id)}
								disabled={selecting !== null}
							>
								<div class="w-8 h-8 rounded-full bg-fc-accent/20 flex items-center justify-center shrink-0">
									<User size={14} class="text-fc-accent-light" />
								</div>
								<span class="text-sm font-medium text-fc-text flex-1">{profile.name}</span>
								{#if selecting === profile.id}
									<Spinner size={16} class="text-fc-muted" />
								{/if}
							</button>
						{/each}
					</div>
				{/if}

				{#if error}
					<p class="text-fc-danger text-xs mb-3">{error}</p>
				{/if}

				<Button variant="ghost" size="sm" class="w-full" onclick={() => { mode = 'create'; error = ''; }}>
					{#snippet iconLeft()}<Plus size={14} />{/snippet}
					Crea nuovo profilo
				</Button>

			{:else}
				<!-- Create profile -->
				<h2 class="text-base font-semibold mb-4 text-fc-text">Nuovo profilo</h2>

				<div class="mb-4">
					<!-- svelte-ignore a11y_autofocus -->
					<input
						type="text"
						class="input-base"
						placeholder="Nome del profilo (es. Filippo)"
						bind:value={newName}
						onkeydown={(e) => e.key === 'Enter' && create()}
						autofocus
					/>
				</div>

				{#if error}
					<p class="text-fc-danger text-xs mb-3">{error}</p>
				{/if}

				<div class="flex gap-2">
					{#if profileStore.profiles.length > 0}
						<Button variant="ghost" size="sm" onclick={() => { mode = 'select'; error = ''; }}>
							Indietro
						</Button>
					{/if}
					<Button variant="primary" size="sm" class="flex-1" loading={creating} onclick={create}>
						Crea e inizia
					</Button>
				</div>
			{/if}
		</GlassCard>
	</div>
</div>
