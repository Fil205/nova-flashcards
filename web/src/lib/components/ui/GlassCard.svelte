<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		pad?: 'none' | 'sm' | 'md' | 'lg';
		hoverable?: boolean;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		children?: Snippet;
	}

	let {
		pad = 'md',
		hoverable = false,
		class: extraClass = '',
		onclick,
		children,
	}: Props = $props();

	const pads = {
		none: '',
		sm:   'p-4',
		md:   'p-5',
		lg:   'p-6',
	};

	const cls = $derived(
		['glass', pads[pad], hoverable ? 'glass-hover cursor-pointer' : '', extraClass]
			.filter(Boolean).join(' ')
	);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class={cls} {onclick} role={onclick ? 'button' : undefined} tabindex={onclick ? 0 : undefined}>
	{#if children}{@render children()}{/if}
</div>
