<script lang="ts">
	import { profileStore } from '$lib/stores/profile.svelte';
	import { deckStore } from '$lib/stores/decks.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { friendlyError } from '$lib/api/client';
	import Button from './ui/Button.svelte';
	import Modal from './ui/Modal.svelte';
	import { User, ChevronDown, Plus, Pencil, Trash2, Check } from '@lucide/svelte';

	let open         = $state(false);
	let showCreate   = $state(false);
	let showRename   = $state(false);
	let showDelete   = $state(false);
	let newName      = $state('');
	let deleteConfirm = $state('');
	let busy         = $state(false);

	async function switchTo(id: number): Promise<void> {
		if (id === profileStore.active?.id) { open = false; return; }
		busy = true;
		try {
			await profileStore.bootstrap(id);
			deckStore.hydrate(profileStore.bootstrapDecks);
			open = false;
		} catch (e) {
			toastStore.error(friendlyError(e));
		} finally {
			busy = false;
		}
	}

	async function createProfile(): Promise<void> {
		const name = newName.trim();
		if (!name) return;
		busy = true;
		try {
			await profileStore.createAndActivate(name);
			deckStore.hydrate(profileStore.bootstrapDecks);
			newName = '';
			showCreate = false;
			toastStore.success(`Profilo "${name}" creato.`);
		} catch (e) {
			toastStore.error(friendlyError(e));
		} finally {
			busy = false;
		}
	}

	async function renameProfile(): Promise<void> {
		if (!newName.trim() || !profileStore.active) return;
		busy = true;
		try {
			await profileStore.renameProfile(profileStore.active.id, newName.trim());
			toastStore.success('Profilo rinominato.');
			newName = '';
			showRename = false;
		} catch (e) {
			toastStore.error(friendlyError(e));
		} finally {
			busy = false;
		}
	}

	async function deleteProfile(): Promise<void> {
		const profile = profileStore.active;
		if (!profile) return;
		if (deleteConfirm !== profile.name) return;
		busy = true;
		try {
			await profileStore.deleteProfile(profile.id);
			deckStore.clear();
			toastStore.success('Profilo eliminato.');
			showDelete = false;
			deleteConfirm = '';
		} catch (e) {
			toastStore.error(friendlyError(e));
		} finally {
			busy = false;
		}
	}

	function openRename(): void {
		newName = profileStore.active?.name ?? '';
		showRename = true;
		open = false;
	}

	function openDelete(): void {
		deleteConfirm = '';
		showDelete = true;
		open = false;
	}
</script>

<!-- Trigger button -->
<div class="relative">
	<button
		onclick={() => open = !open}
		class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-fc-border
			   bg-white/4 hover:bg-white/8 hover:border-fc-border-hover transition-all text-sm"
		aria-haspopup="listbox"
		aria-expanded={open}
	>
		<div class="w-6 h-6 rounded-full bg-fc-accent/25 flex items-center justify-center">
			<User size={12} class="text-fc-accent-light" />
		</div>
		<span class="font-medium text-fc-text max-w-[140px] truncate">
			{profileStore.active?.name ?? '—'}
		</span>
		<ChevronDown size={14} class="text-fc-muted transition-transform {open ? 'rotate-180' : ''}" />
	</button>

	<!-- Dropdown -->
	{#if open}
		<div
			class="absolute right-0 top-full mt-1 w-56 popover z-40 py-1"
			role="listbox"
		>
			<!-- Other profiles -->
			{#each profileStore.profiles as profile}
				{@const isActive = profile.id === profileStore.active?.id}
				<button
					class="menu-item py-2.5"
					onclick={() => switchTo(profile.id)}
					role="option"
					aria-selected={isActive}
					disabled={busy}
				>
					<div class="w-6 h-6 rounded-full bg-fc-accent/15 flex items-center justify-center shrink-0">
						<User size={11} class="text-fc-accent-light" />
					</div>
					<span class="flex-1 text-left text-fc-text truncate">{profile.name}</span>
					{#if isActive}
						<Check size={13} class="text-fc-success shrink-0" />
					{/if}
				</button>
			{/each}

			<div class="border-t border-fc-border my-1 mx-2"></div>

			<!-- Actions -->
			<button
				class="menu-item text-xs"
				onclick={() => { showCreate = true; newName = ''; open = false; }}
			>
				<Plus size={13} />
				Nuovo profilo
			</button>
			<button
				class="menu-item text-xs"
				onclick={openRename}
			>
				<Pencil size={13} />
				Rinomina profilo
			</button>
			<button
				class="menu-item-danger text-xs"
				onclick={openDelete}
			>
				<Trash2 size={13} />
				Elimina profilo
			</button>
		</div>

		<!-- Click outside to close -->
		<div class="fixed inset-0 z-30" onclick={() => open = false} role="presentation"></div>
	{/if}
</div>

<!-- Create modal -->
<Modal bind:open={showCreate} title="Nuovo profilo" width="sm">
	{#snippet children()}
		<!-- svelte-ignore a11y_autofocus -->
		<input
			type="text"
			class="input-base mb-4"
			placeholder="Nome del profilo"
			bind:value={newName}
			onkeydown={(e) => e.key === 'Enter' && createProfile()}
			autofocus
		/>
	{/snippet}
	{#snippet footer()}
		<Button variant="ghost" size="sm" onclick={() => showCreate = false}>Annulla</Button>
		<Button variant="primary" size="sm" loading={busy} onclick={createProfile}>Crea</Button>
	{/snippet}
</Modal>

<!-- Rename modal -->
<Modal bind:open={showRename} title="Rinomina profilo" width="sm">
	{#snippet children()}
		<!-- svelte-ignore a11y_autofocus -->
		<input
			type="text"
			class="input-base mb-4"
			placeholder="Nuovo nome"
			bind:value={newName}
			onkeydown={(e) => e.key === 'Enter' && renameProfile()}
			autofocus
		/>
	{/snippet}
	{#snippet footer()}
		<Button variant="ghost" size="sm" onclick={() => showRename = false}>Annulla</Button>
		<Button variant="primary" size="sm" loading={busy} onclick={renameProfile}>Salva</Button>
	{/snippet}
</Modal>

<!-- Delete modal -->
<Modal bind:open={showDelete} title="Elimina profilo" width="sm">
	{#snippet children()}
		<p class="text-sm text-fc-muted mb-3">
			Questa azione eliminerà permanentemente il profilo
			<strong class="text-fc-text">{profileStore.active?.name}</strong>
			con tutti i suoi mazzi e flashcard. Scrivi il nome del profilo per confermare.
		</p>
		<!-- svelte-ignore a11y_autofocus -->
		<input
			type="text"
			class="input-base"
			placeholder={profileStore.active?.name ?? ''}
			bind:value={deleteConfirm}
			autofocus
		/>
	{/snippet}
	{#snippet footer()}
		<Button variant="ghost" size="sm" onclick={() => showDelete = false}>Annulla</Button>
		<Button
			variant="danger"
			size="sm"
			loading={busy}
			disabled={deleteConfirm !== profileStore.active?.name}
			onclick={deleteProfile}
		>
			{#snippet iconLeft()}<Trash2 size={14} />{/snippet}
			Elimina
		</Button>
	{/snippet}
</Modal>
