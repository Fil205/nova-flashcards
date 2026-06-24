<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		icon?: string;
		title: string;
		description?: string;
		action?: Snippet;
	}

	let { icon = '📭', title, description, action }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center text-center py-16 gap-4">
	<div class="text-5xl opacity-40 select-none">{icon}</div>
	<div>
		<h3 class="text-base font-semibold text-fc-text mb-1">{title}</h3>
		{#if description}
			<p class="text-sm text-fc-muted max-w-xs">{description}</p>
		{/if}
	</div>
	{#if action}
		<div class="mt-2">
			{@render action()}
		</div>
	{/if}
</div>
