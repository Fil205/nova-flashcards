<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { profileStore } from '$lib/stores/profile.svelte';
	import { deckStore } from '$lib/stores/decks.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import * as outbox from '$lib/offline/outbox';
	import CosmicBackground from '$lib/components/CosmicBackground.svelte';
	import ProfileGate from '$lib/components/ProfileGate.svelte';
	import ProfileSwitcher from '$lib/components/ProfileSwitcher.svelte';
	import ToastContainer from '$lib/components/ui/ToastContainer.svelte';
	import InstallPrompt from '$lib/components/InstallPrompt.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { Layers, LayoutDashboard, Settings, WifiOff } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	// App state
	let appState = $state<'loading' | 'gate' | 'ready'>('loading');

	// Offline indicator
	let isOnline = $state(true);

	onMount(() => {
		// Initialise online status synchronously
		isOnline = navigator.onLine;

		// Handlers registered synchronously so the cleanup return is sync too
		const handleOnline = () => {
			isOnline = true;
			outbox.flush().then((synced) => {
				if (synced > 0) {
					toastStore.success(
						synced === 1
							? 'Sessione offline sincronizzata.'
							: `${synced} sessioni offline sincronizzate.`
					);
				}
			});
		};

		const handleOffline = () => { isOnline = false; };

		window.addEventListener('online',  handleOnline);
		window.addEventListener('offline', handleOffline);

		// Async boot logic — runs in background, does NOT block the mount return
		(async () => {
			await profileStore.loadProfiles();
			const storedId = profileStore.storedId;

			if (storedId) {
				const ok = await profileStore.bootstrap(storedId);
				if (ok) {
					deckStore.hydrate(profileStore.bootstrapDecks);
					appState = 'ready';

					if (navigator.onLine) {
						// Background tasks — don't block the render
						outbox.flush().then((synced) => {
							if (synced > 0) {
								toastStore.success(
									synced === 1
										? 'Sessione offline sincronizzata.'
										: `${synced} sessioni offline sincronizzate.`
								);
							}
						});
						deckStore.prefetchAll();
					}
				} else {
					appState = 'gate';
				}
			} else {
				appState = 'gate';
			}
		})();

		// Synchronous cleanup returned to onMount
		return () => {
			window.removeEventListener('online',  handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	});

	function onActivated(): void {
		deckStore.hydrate(profileStore.bootstrapDecks);
		appState = 'ready';
		// After fresh login, prefetch and flush outbox
		if (navigator.onLine) {
			deckStore.prefetchAll();
			outbox.flush().then((synced) => {
				if (synced > 0) {
					toastStore.success(
						synced === 1
							? 'Sessione offline sincronizzata.'
							: `${synced} sessioni offline sincronizzate.`
					);
				}
			});
		}
	}

	// Nav links
	const navLinks = [
		{ href: '/',         label: 'Mazzi',       Icon: LayoutDashboard },
		{ href: '/settings', label: 'Impostazioni', Icon: Settings },
	];

	function isActive(href: string): boolean {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}
</script>

<CosmicBackground />

{#if appState === 'loading'}
	<div class="min-h-dvh flex items-center justify-center">
		<div class="flex flex-col items-center gap-4">
			<Spinner size={32} class="text-fc-accent-light" />
			<p class="text-fc-muted text-sm">Caricamento...</p>
		</div>
	</div>

{:else if appState === 'gate'}
	<ProfileGate onactivated={onActivated} />

{:else}
	<!-- App shell -->
	<div class="min-h-dvh flex flex-col">
		<!-- Top navigation bar -->
		<header class="sticky top-0 z-30 border-b border-fc-border bg-fc-bg/80 backdrop-blur-lg">
			<div class="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
				<!-- Logo -->
				<a href="/" class="flex items-center gap-2.5 shrink-0 group">
					<div class="w-7 h-7 rounded-lg bg-fc-gradient flex items-center justify-center shadow-glow-sm">
						<Layers size={14} class="text-white" />
					</div>
					<span class="font-bold font-display text-sm gradient-text hidden sm:block">Falschcard</span>
				</a>

				<!-- Nav links -->
				<nav class="flex items-center gap-1 flex-1" aria-label="Navigazione principale">
					{#each navLinks as { href, label, Icon }}
						<a
							{href}
							class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all
								   {isActive(href)
								       ? 'bg-fc-accent/15 text-fc-accent-light border border-fc-accent/20'
								       : 'text-fc-muted hover:text-fc-text hover:bg-white/6'}"
							aria-current={isActive(href) ? 'page' : undefined}
						>
							<Icon size={14} />
							<span class="hidden sm:block">{label}</span>
						</a>
					{/each}
				</nav>

				<!-- Offline indicator -->
				{#if !isOnline}
					<div
						class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-fc-warning/40
						       bg-fc-warning/10 text-fc-warning text-xs font-medium shrink-0"
						title="Sei offline — stai usando i dati salvati in cache"
					>
						<WifiOff size={12} />
						<span class="hidden sm:block">Offline</span>
					</div>
				{/if}

				<!-- Profile switcher -->
				<ProfileSwitcher />
			</div>
		</header>

		<!-- Main content -->
		<main class="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
			{@render children()}
		</main>
	</div>
{/if}

<ToastContainer />
<InstallPrompt />
