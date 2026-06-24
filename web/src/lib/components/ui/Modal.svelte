<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { scaleIn, scaleOut, backdropIn, backdropOut } from '$lib/anim';
	import { X } from '@lucide/svelte';

	interface Props {
		open: boolean;
		title?: string;
		onclose?: () => void;
		width?: 'sm' | 'md' | 'lg' | 'xl';
		children?: Snippet;
		footer?: Snippet;
	}

	let {
		open = $bindable(),
		title,
		onclose,
		width = 'md',
		children,
		footer,
	}: Props = $props();

	let backdropEl = $state<HTMLDivElement | null>(null);
	let panelEl    = $state<HTMLDivElement | null>(null);

	const widths = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-2xl',
	};

	function close(): void {
		if (!backdropEl || !panelEl) {
			open = false;
			onclose?.();
			return;
		}
		scaleOut(panelEl, () => {
			backdropOut(backdropEl, () => {
				open = false;
				onclose?.();
			});
		});
	}

	function onKeydown(e: KeyboardEvent): void {
		if (e.key === 'Escape') close();
	}

	$effect(() => {
		if (open) {
			// Animate in
			requestAnimationFrame(() => {
				backdropIn(backdropEl);
				scaleIn(panelEl);
			});
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		bind:this={backdropEl}
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
		onclick={() => close()}
		role="dialog"
		aria-modal="true"
		aria-label={title}
	>
		<!-- Panel -->
		<div
			bind:this={panelEl}
			class="popover relative w-full {widths[width]} max-h-[90dvh] overflow-y-auto"
			onclick={(e) => e.stopPropagation()}
			role="presentation"
		>
			<!-- Header -->
			{#if title || onclose}
				<div class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-fc-border">
					{#if title}
						<h2 class="text-base font-semibold text-fc-text font-display">{title}</h2>
					{/if}
					<button
						onclick={close}
						class="ml-auto p-1 rounded-lg text-fc-muted hover:text-fc-text hover:bg-white/8 transition-colors"
						aria-label="Chiudi"
					>
						<X size={18} />
					</button>
				</div>
			{/if}

			<!-- Body -->
			<div class="p-5">
				{#if children}{@render children()}{/if}
			</div>

			<!-- Footer -->
			{#if footer}
				<div class="px-5 pb-5 pt-1 flex items-center justify-end gap-2 border-t border-fc-border">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
