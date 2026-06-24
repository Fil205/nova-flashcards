<script lang="ts">
	import { toastStore } from '$lib/stores/toast.svelte';
	import { CheckCircle, AlertTriangle, XCircle, Info, X } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { fadeUp } from '$lib/anim';

	const icons = {
		success: CheckCircle,
		error:   XCircle,
		warning: AlertTriangle,
		info:    Info,
	};

	// No bg-* color here: .popover supplies an opaque background.
	// Border-left accent gives per-variant color identity without bleed-through.
	const colors = {
		success: 'border-fc-success/30 border-l-fc-success text-fc-success',
		error:   'border-fc-danger/30  border-l-fc-danger  text-fc-danger',
		warning: 'border-fc-warning/30 border-l-fc-warning text-fc-warning',
		info:    'border-fc-accent/30  border-l-fc-accent  text-fc-accent-light',
	};
</script>

<div
	class="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end pointer-events-none"
	aria-live="polite"
	aria-label="Notifiche"
>
	{#each toastStore.toasts as toast (toast.id)}
		{@const Icon = icons[toast.variant]}
		<div
			class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border-l-4 popover max-w-sm w-full
				   shadow-glass-lg text-sm {colors[toast.variant]}"
			role="alert"
		>
			<Icon size={16} class="mt-0.5 shrink-0" />
			<span class="flex-1 text-fc-text leading-snug">{toast.message}</span>
			<button
				onclick={() => toastStore.remove(toast.id)}
				class="shrink-0 text-fc-muted hover:text-fc-text transition-colors p-0.5 rounded"
				aria-label="Chiudi notifica"
			>
				<X size={14} />
			</button>
		</div>
	{/each}
</div>
