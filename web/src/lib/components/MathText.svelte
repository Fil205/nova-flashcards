<script lang="ts">
	import { renderRich } from '$lib/markdown';
	import 'katex/dist/katex.min.css';

	interface Props {
		text: string;
		class?: string;
		block?: boolean;
	}

	let { text, class: cls = '', block = false }: Props = $props();

	// block → full Markdown (paragraphs, lists, tables, code) + LaTeX
	// inline → single-line Markdown (bold/italic/code/links) + LaTeX, no block wrappers
	const html = $derived(renderRich(text, { inline: !block }));
</script>

{#if block}
	<div class="md {cls}">{@html html}</div>
{:else}
	<span class={cls}>{@html html}</span>
{/if}
