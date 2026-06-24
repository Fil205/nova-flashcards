interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Extend Window so TypeScript knows about the global we set in app.html
declare global {
	interface Window {
		__deferredInstallPrompt: BeforeInstallPromptEvent | null;
	}
}

let installed = $state(false);
let isIOS     = $state(false);
let deferred  = $state<BeforeInstallPromptEvent | null>(null);
let ready     = false; // prevent double-init

function init(): () => void {
	if (ready || typeof window === 'undefined') return () => {};
	ready = true;

	installed =
		window.matchMedia('(display-mode: standalone)').matches ||
		(navigator as unknown as { standalone?: boolean }).standalone === true;

	isIOS =
		/iphone|ipad|ipod/i.test(navigator.userAgent) &&
		!(window as unknown as { MSStream?: unknown }).MSStream;

	// The app.html inline script may have already caught the event before we mounted.
	// Read it immediately so pwaStore.deferred is set without waiting for the next event.
	deferred = window.__deferredInstallPrompt;

	// Also listen for future firings (first load, or browser re-enables install)
	// and for the custom events dispatched by the app.html capture script.
	const onInstallable = () => { deferred = window.__deferredInstallPrompt; };
	const onInstalled   = () => { installed = true; deferred = null; };

	window.addEventListener('pwa-installable', onInstallable);
	window.addEventListener('pwa-installed',   onInstalled);
	// Fallback: direct listener in case the page runs without the inline script
	window.addEventListener('beforeinstallprompt', (e: Event) => {
		e.preventDefault();
		window.__deferredInstallPrompt = e as BeforeInstallPromptEvent;
		deferred = e as BeforeInstallPromptEvent;
	});

	return () => {
		window.removeEventListener('pwa-installable', onInstallable);
		window.removeEventListener('pwa-installed',   onInstalled);
	};
}

type InstallOutcome = 'accepted' | 'dismissed' | 'unavailable';

async function install(): Promise<InstallOutcome> {
	const evt = deferred ?? window.__deferredInstallPrompt;
	if (!evt) return 'unavailable';

	await evt.prompt();
	const { outcome } = await evt.userChoice;
	if (outcome === 'accepted') installed = true;
	deferred = null;
	window.__deferredInstallPrompt = null;
	return outcome;
}

export const pwaStore = {
	get installed() { return installed; },
	get isIOS()     { return isIOS; },
	get deferred()  { return deferred; },
	init,
	install,
};
