<script lang="ts">
	import { onMount } from 'svelte';
	import { profileStore } from '$lib/stores/profile.svelte';
	import { settingsStore } from '$lib/stores/settings.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { deckStore } from '$lib/stores/decks.svelte';
	import { friendlyError } from '$lib/api/client';
	import { fadeUp, flashSuccess } from '$lib/anim';
	import { getVoices, isTtsSupported, speak, stopTts } from '$lib/voice/tts';
	import Button from '$lib/components/ui/Button.svelte';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import Toggle from '$lib/components/ui/Toggle.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { Key, Volume2, Download, Trash2, Settings, Eye, EyeOff, CheckCircle, AlertTriangle, Smartphone, Upload } from '@lucide/svelte';
	import { pwaStore } from '$lib/stores/pwa.svelte';

	// Selectable Gemini models. IDs MUST match GeminiService::DEFAULT_MODELS on the
	// server (same allowlist), with the first entry as the default.
	const MODELS = [
		{ id: 'gemini-3.5-flash',      label: 'Gemini 3.5 Flash' },
		{ id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash-Lite' },
	];

	// ── TTS ──────────────────────────────────────────────────────────────────

	let voices      = $state<{ uri: string; name: string; lang: string }[]>([]);
	let ttsSupported = isTtsSupported();
	let previewPlaying = $state(false);

	onMount(async () => {
		if (ttsSupported) voices = await getVoices();
		const secs = document.querySelectorAll('.settings-section');
		secs.forEach((el, i) => fadeUp(el, i * 0.06, 0.35));
	});

	const settings = $derived(profileStore.settings);

	async function saveSettings(partial: Record<string, unknown>): Promise<void> {
		try {
			await settingsStore.update(partial as Parameters<typeof settingsStore.update>[0]);
			toastStore.success('Impostazioni salvate.');
		} catch (e) {
			toastStore.error(friendlyError(e));
		}
	}

	function previewTts(): void {
		if (previewPlaying) { stopTts(); previewPlaying = false; return; }
		previewPlaying = true;
		const lang = settings?.tts_voice_uri ? voices.find(v => v.uri === settings.tts_voice_uri)?.lang ?? 'it-IT' : 'it-IT';
		const text = lang.startsWith('it') ? 'Questa è un\'anteprima della voce selezionata.' : 'This is a voice preview.';
		speak(text, lang, settings?.tts_voice_uri, settings?.tts_rate, settings?.tts_pitch);
		setTimeout(() => previewPlaying = false, 4000);
	}

	// ── Gemini API ────────────────────────────────────────────────────────────

	let geminiKey    = $state('');
	let showKey      = $state(false);
	let savingKey    = $state(false);
	let deletingKey  = $state(false);

	async function saveGeminiKey(): Promise<void> {
		if (!geminiKey.trim()) return;
		savingKey = true;
		try {
			await settingsStore.saveGeminiKey(geminiKey.trim());
			toastStore.success('Chiave API salvata.');
			geminiKey = '';
		} catch (e) {
			toastStore.error(friendlyError(e));
		} finally {
			savingKey = false;
		}
	}

	async function deleteGeminiKey(): Promise<void> {
		deletingKey = true;
		try {
			await settingsStore.deleteGeminiKey();
			toastStore.success('Chiave API rimossa.');
		} catch (e) {
			toastStore.error(friendlyError(e));
		} finally {
			deletingKey = false;
		}
	}

	// ── Export / Reset ────────────────────────────────────────────────────────

	let exporting   = $state(false);
	let showReset   = $state(false);
	let confirmName = $state('');
	let resetting   = $state(false);

	async function exportData(): Promise<void> {
		const profileId = profileStore.active?.id;
		if (!profileId) return;
		exporting = true;
		try {
			const res = await fetch(`/api/profiles/${profileId}/export`);
			const blob = await res.blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `falschcard-backup-${new Date().toISOString().slice(0, 10)}.json`;
			a.click();
			URL.revokeObjectURL(url);
			toastStore.success('Backup esportato.');
		} catch (e) {
			toastStore.error(friendlyError(e));
		} finally {
			exporting = false;
		}
	}
</script>

<svelte:head><title>Impostazioni — Falschcard</title></svelte:head>

<div class="max-w-xl mx-auto flex flex-col gap-6">
	<h1 class="text-xl font-bold font-display text-fc-text">
		<Settings size={20} class="inline mr-2 text-fc-muted" />Impostazioni
	</h1>

	<!-- ── Gemini API ──────────────────────────────────────────────────────── -->
	<div class="settings-section flex flex-col gap-3">
		<h2 class="text-xs font-semibold text-fc-muted uppercase tracking-widest flex items-center gap-2">
			<Key size={13} /> Gemini API
		</h2>

		<GlassCard pad="md">
			<!-- Key status -->
			<div class="flex items-center justify-between mb-4">
				<div>
					<p class="text-sm font-medium text-fc-text">Chiave API Gemini</p>
					<p class="text-xs text-fc-muted mt-0.5">Usata per valutazione e tutor AI. Salvata cifrata sul server.</p>
				</div>
				<div class="flex items-center gap-1.5 text-xs {settings?.has_api_key ? 'text-fc-success' : 'text-fc-warning'}">
					{#if settings?.has_api_key}
						<CheckCircle size={14} /> Attiva
					{:else}
						<AlertTriangle size={14} /> Mancante
					{/if}
				</div>
			</div>

			<!-- Key input -->
			<div class="relative mb-3">
				<input
					type={showKey ? 'text' : 'password'}
					class="input-base pr-10 font-mono text-sm"
					placeholder="Incolla la tua chiave API Gemini..."
					bind:value={geminiKey}
					onkeydown={(e) => e.key === 'Enter' && saveGeminiKey()}
				/>
				<button
					class="absolute right-3 top-1/2 -translate-y-1/2 text-fc-faint hover:text-fc-muted transition-colors"
					onclick={() => showKey = !showKey}
					aria-label={showKey ? 'Nascondi' : 'Mostra'}
				>
					{#if showKey}<EyeOff size={15} />{:else}<Eye size={15} />{/if}
				</button>
			</div>
			<div class="flex gap-2">
				<Button variant="primary" size="sm" loading={savingKey} onclick={saveGeminiKey} disabled={!geminiKey.trim()}>
					Salva chiave
				</Button>
				{#if settings?.has_api_key}
					<Button variant="danger" size="sm" loading={deletingKey} onclick={deleteGeminiKey}>
						Rimuovi
					</Button>
				{/if}
			</div>
		</GlassCard>

		<!-- Model selector -->
		{#if settings?.has_api_key}
			<GlassCard pad="md">
				<p class="text-sm font-medium text-fc-text mb-3">Modello Gemini</p>
				<select
					class="input-base text-sm"
					value={MODELS.some((m) => m.id === settings.gemini_model) ? settings.gemini_model : MODELS[0].id}
					onchange={(e) => saveSettings({ gemini_model: (e.target as HTMLSelectElement).value })}
				>
					{#each MODELS as m}
						<option value={m.id}>{m.label}</option>
					{/each}
				</select>
				<p class="text-xs text-fc-muted mt-2">Usato per valutazione, correzione e tutor AI.</p>
			</GlassCard>
		{/if}
	</div>

	<!-- ── TTS ─────────────────────────────────────────────────────────────── -->
	{#if ttsSupported}
		<div class="settings-section flex flex-col gap-3">
			<h2 class="text-xs font-semibold text-fc-muted uppercase tracking-widest flex items-center gap-2">
				<Volume2 size={13} /> Lettura vocale
			</h2>

			<GlassCard pad="md">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-fc-text">Leggi domanda automaticamente</p>
						<p class="text-xs text-fc-muted mt-0.5">La domanda viene letta ad alta voce all'apertura di ogni carta</p>
					</div>
					<Toggle
						checked={settings?.auto_read_question ?? false}
						onchange={(v) => saveSettings({ auto_read_question: v })}
					/>
				</div>
			</GlassCard>

			{#if voices.length > 0}
				<GlassCard pad="md">
					<p class="text-sm font-medium text-fc-text mb-3">Voce</p>
					<select
						class="input-base text-sm mb-3"
						value={settings?.tts_voice_uri ?? ''}
						onchange={(e) => saveSettings({ tts_voice_uri: (e.target as HTMLSelectElement).value || null })}
					>
						<option value="">Predefinita del sistema</option>
						{#each voices as v}
							<option value={v.uri}>{v.name} ({v.lang})</option>
						{/each}
					</select>
					<Button variant="secondary" size="sm" onclick={previewTts}>
						{#snippet iconLeft()}<Volume2 size={13} />{/snippet}
						{previewPlaying ? 'Ferma' : 'Anteprima voce'}
					</Button>
				</GlassCard>
			{/if}

			<GlassCard pad="md">
				<div class="flex flex-col gap-4">
					<div>
						<div class="flex items-center justify-between mb-2">
							<p class="text-sm font-medium text-fc-text">Velocità</p>
							<span class="text-xs text-fc-muted tabular-nums">{(settings?.tts_rate ?? 1).toFixed(1)}×</span>
						</div>
						<input
							type="range" min="0.5" max="2" step="0.1"
							class="w-full accent-fc-accent"
							value={settings?.tts_rate ?? 1}
							onchange={(e) => saveSettings({ tts_rate: parseFloat((e.target as HTMLInputElement).value) })}
						/>
					</div>
					<div>
						<div class="flex items-center justify-between mb-2">
							<p class="text-sm font-medium text-fc-text">Tono</p>
							<span class="text-xs text-fc-muted tabular-nums">{(settings?.tts_pitch ?? 1).toFixed(1)}</span>
						</div>
						<input
							type="range" min="0" max="2" step="0.1"
							class="w-full accent-fc-accent"
							value={settings?.tts_pitch ?? 1}
							onchange={(e) => saveSettings({ tts_pitch: parseFloat((e.target as HTMLInputElement).value) })}
						/>
					</div>
				</div>
			</GlassCard>
		</div>
	{/if}

	<!-- ── Dati ─────────────────────────────────────────────────────────────── -->
	<div class="settings-section flex flex-col gap-3">
		<h2 class="text-xs font-semibold text-fc-muted uppercase tracking-widest">Dati</h2>
		<GlassCard pad="md">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-fc-text">Esporta dati</p>
					<p class="text-xs text-fc-muted mt-0.5">Scarica un backup JSON di tutti i tuoi mazzi</p>
				</div>
				<Button variant="secondary" size="sm" loading={exporting} onclick={exportData}>
					{#snippet iconLeft()}<Download size={13} />{/snippet}
					Esporta
				</Button>
			</div>
		</GlassCard>
	</div>

	<!-- ── App ───────────────────────────────────────────────────────────────── -->
	{#if !pwaStore.installed}
		<div class="settings-section flex flex-col gap-3">
			<h2 class="text-xs font-semibold text-fc-muted uppercase tracking-widest flex items-center gap-2">
				<Smartphone size={13} /> App
			</h2>

			<GlassCard pad="sm">
				{#if pwaStore.isIOS}
					<!-- iOS: nessun evento nativo, istruzioni manuali -->
					<div class="flex items-center gap-4">
						<div class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shrink-0"
							style="background: linear-gradient(135deg, #7C3AED, #3B82F6)">
							<Upload size={15} />
							Installa
						</div>
						<div class="min-w-0">
							<p class="text-sm font-medium text-fc-text leading-snug">Installa Falschcard</p>
							<p class="text-xs text-fc-muted mt-0.5 leading-relaxed">
								Tocca <span class="text-fc-accent-light font-medium">Condividi</span> in Safari → <span class="text-fc-text font-medium">Aggiungi alla schermata Home</span>
							</p>
						</div>
					</div>

				{:else}
					<!-- Chrome/Edge/Android: pulsante sempre visibile, best-effort -->
					<div class="flex items-center gap-4">
						<button
							type="button"
							onclick={() => pwaStore.install()}
							class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shrink-0
								   transition-all hover:opacity-90 active:scale-[0.97]"
							style="background: linear-gradient(135deg, #7C3AED, #3B82F6)"
						>
							<Smartphone size={15} />
							Installa
						</button>
						<div class="min-w-0">
							<p class="text-sm font-medium text-fc-text leading-snug">Installa Falschcard come app</p>
							<p class="text-xs text-fc-muted mt-0.5">Aprila direttamente dalla schermata iniziale, anche offline</p>
						</div>
					</div>
				{/if}
			</GlassCard>
		</div>
	{/if}
</div>
