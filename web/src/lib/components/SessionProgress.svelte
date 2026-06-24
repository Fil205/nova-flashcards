<script lang="ts">
	import { studyStore } from '$lib/stores/study.svelte';

	interface Props {
		class?: string;
	}

	let { class: cls = '' }: Props = $props();

	const pct = $derived(Math.round(studyStore.progress * 100));
</script>

<div class="flex items-center gap-3 {cls}" aria-label="Progresso sessione">
	<div class="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
		<div
			class="h-full bg-fc-gradient rounded-full transition-all duration-300"
			style="width: {pct}%"
		></div>
	</div>
	<span class="text-xs text-fc-muted tabular-nums shrink-0">
		{studyStore.session?.currentIndex ?? 0} / {studyStore.totalCards}
	</span>
</div>
