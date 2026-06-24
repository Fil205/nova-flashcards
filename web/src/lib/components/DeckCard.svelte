<script lang="ts">
	import type { DeckSummary } from '$lib/types';
	import { BookOpen, MoreVertical, Pencil, Trash2, BarChart2 } from '@lucide/svelte';

	interface Props {
		deck: DeckSummary;
		onStudy?: (deck: DeckSummary) => void;
		onEdit?: (deck: DeckSummary) => void;
		onDelete?: (deck: DeckSummary) => void;
		onclick?: (deck: DeckSummary) => void;
	}

	let { deck, onStudy, onEdit, onDelete, onclick }: Props = $props();

	let menuOpen = $state(false);

	function masteryPercent(): string {
		if (deck.mastery === null) return '—';
		return Math.round(deck.mastery * 100) + '%';
	}

	function masteryColor(): string {
		if (deck.mastery === null) return 'text-fc-faint';
		if (deck.mastery >= 0.8) return 'text-fc-success';
		if (deck.mastery >= 0.5) return 'text-fc-warning';
		return 'text-fc-danger';
	}

	function lastStudied(): string {
		if (!deck.last_studied_at) return 'Mai studiato';
		const d = new Date(deck.last_studied_at);
		return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
	}
</script>

<div
	class="glass glass-hover p-5 flex flex-col gap-4 cursor-pointer group relative"
	onclick={() => onclick?.(deck)}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && onclick?.(deck)}
>
	<!-- Menu button -->
	<button
		class="absolute top-3 right-3 p-1.5 rounded-lg text-fc-faint
			   opacity-0 group-hover:opacity-100 hover:text-fc-text hover:bg-white/8
			   transition-all z-10"
		onclick={(e) => { e.stopPropagation(); menuOpen = !menuOpen; }}
		aria-label="Opzioni mazzo"
	>
		<MoreVertical size={15} />
	</button>

	<!-- Header -->
	<div class="flex items-start gap-3 pr-6">
		<div class="w-10 h-10 rounded-xl bg-fc-gradient flex items-center justify-center shrink-0 shadow-glow-sm">
			<BookOpen size={16} class="text-white" />
		</div>
		<div class="flex-1 min-w-0">
			<h3 class="font-semibold text-fc-text leading-tight truncate font-display">{deck.name}</h3>
			{#if deck.description}
				<p class="text-xs text-fc-muted mt-0.5 line-clamp-1">{deck.description}</p>
			{/if}
		</div>
	</div>

	<!-- Stats row -->
	<div class="grid grid-cols-3 gap-2 text-center">
		<div class="bg-white/4 rounded-lg px-2 py-1.5">
			<p class="text-lg font-bold text-fc-text leading-none">{deck.card_count}</p>
			<p class="text-[10px] text-fc-faint mt-0.5">carte</p>
		</div>
		<div class="bg-white/4 rounded-lg px-2 py-1.5">
			<p class="text-lg font-bold text-fc-text leading-none">{deck.times_studied}</p>
			<p class="text-[10px] text-fc-faint mt-0.5">sessioni</p>
		</div>
		<div class="bg-white/4 rounded-lg px-2 py-1.5">
			<p class="text-lg font-bold {masteryColor()} leading-none">{masteryPercent()}</p>
			<p class="text-[10px] text-fc-faint mt-0.5">mastery</p>
		</div>
	</div>

	<!-- Footer -->
	<div class="flex items-center justify-between pt-1 border-t border-fc-border">
		<span class="text-[11px] text-fc-faint">{lastStudied()}</span>
		{#if onStudy}
			<button
				class="text-xs font-medium text-fc-accent-light hover:text-white
					   bg-fc-accent/15 hover:bg-fc-accent/30 px-3 py-1 rounded-lg transition-all"
				onclick={(e) => { e.stopPropagation(); onStudy?.(deck); }}
			>
				Studia
			</button>
		{/if}
	</div>

	<!-- Dropdown menu -->
	{#if menuOpen}
		<div
			class="absolute right-2 top-10 w-44 popover z-20 py-1"
			role="menu"
		>
			{#if onEdit}
				<button
					class="menu-item"
					onclick={(e) => { e.stopPropagation(); onEdit?.(deck); menuOpen = false; }}
					role="menuitem"
				>
					<Pencil size={13} /> Modifica
				</button>
			{/if}
			{#if onDelete}
				<button
					class="menu-item-danger"
					onclick={(e) => { e.stopPropagation(); onDelete?.(deck); menuOpen = false; }}
					role="menuitem"
				>
					<Trash2 size={13} /> Elimina
				</button>
			{/if}
		</div>
		<div class="fixed inset-0 z-10" onclick={(e) => { e.stopPropagation(); menuOpen = false; }} role="presentation"></div>
	{/if}
</div>
