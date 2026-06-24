<script lang="ts">
	import { onMount } from 'svelte';
	import { pwaStore } from '$lib/stores/pwa.svelte';
	import { Download, X, Upload } from '@lucide/svelte';

	const LS_KEY = 'pwa-install-dismissed';

	let show      = $state(false);
	let dismissed = $state(false);

	onMount(() => {
		// init() registers the beforeinstallprompt listener exactly once.
		// Returns a cleanup function that removes those listeners on unmount.
		const cleanup = pwaStore.init();

		if (localStorage.getItem(LS_KEY)) {
			dismissed = true;
			return cleanup;
		}

		// iOS: no install event — show manual hint after a short delay
		if (pwaStore.isIOS) {
			setTimeout(() => {
				if (!dismissed && !pwaStore.installed) show = true;
			}, 3500);
		}

		return cleanup;
	});

	// React when Chrome/Edge signals install-readiness (deferred event arrives)
	$effect(() => {
		if (pwaStore.deferred && !dismissed && !pwaStore.installed) show = true;
		if (pwaStore.installed) show = false;
	});

	function dismiss(): void {
		show = false;
		dismissed = true;
		localStorage.setItem(LS_KEY, '1');
	}
</script>

{#if show}
	<div
		class="install-banner fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50
		       popover border-fc-accent/25 rounded-2xl p-4 shadow-glow-sm
		       flex items-start gap-3"
		role="complementary"
		aria-label="Installa Falschcard come app"
	>
		<!-- Brand icon -->
		<div class="w-9 h-9 rounded-xl bg-fc-gradient flex items-center justify-center shrink-0 shadow-glow-sm">
			{#if pwaStore.isIOS}
				<Upload size={16} class="text-white" />
			{:else}
				<Download size={16} class="text-white" />
			{/if}
		</div>

		<!-- Content -->
		<div class="flex-1 min-w-0">
			<p class="text-sm font-semibold text-fc-text leading-tight">Installa Falschcard</p>

			{#if pwaStore.isIOS}
				<p class="text-xs text-fc-muted mt-1 leading-relaxed">
					Tocca <span class="inline-flex items-center gap-0.5 font-medium text-fc-accent-light">
						<Upload size={10} /> Condividi
					</span> in Safari, poi
					<span class="font-medium text-fc-text">Aggiungi alla schermata Home</span>.
				</p>
			{:else}
				<p class="text-xs text-fc-muted mt-0.5 leading-relaxed">
					Aprila come un'app vera, anche dalla schermata iniziale.
				</p>
				<button
					type="button"
					onclick={() => pwaStore.install()}
					class="mt-2 text-xs font-semibold text-fc-accent-light hover:text-white
					       transition-colors underline-offset-2 hover:underline"
				>
					Installa ora →
				</button>
			{/if}
		</div>

		<!-- Dismiss -->
		<button
			type="button"
			onclick={dismiss}
			class="p-1.5 rounded-lg text-fc-muted hover:text-fc-text hover:bg-white/8
			       transition-colors shrink-0 -mt-0.5"
			aria-label="Non mostrare più"
		>
			<X size={13} />
		</button>
	</div>
{/if}

<style>
	.install-banner {
		animation: slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}
	@keyframes slideUp {
		from { transform: translateY(110%); opacity: 0; }
		to   { transform: translateY(0);    opacity: 1; }
	}
</style>
