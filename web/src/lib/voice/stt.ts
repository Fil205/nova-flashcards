/**
 * Speech-to-text utilities (Web Speech Recognition API).
 *
 * Continuous mode: recognition stays active until the caller explicitly calls
 * handle.stop(). The browser may fire `onend` on silence — we auto-restart
 * unless the user has stopped intentionally.
 */

export function isSttSupported(): boolean {
	return typeof window !== 'undefined' &&
		('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

export interface SttHandle {
	stop: () => void;
}

export function startListening(
	lang: string,
	onResult: (text: string, isFinal: boolean) => void,
	onError: (msg: string) => void,
	onEnd: () => void
): SttHandle | null {
	if (!isSttSupported()) {
		onError('Il riconoscimento vocale non è supportato in questo browser.');
		return null;
	}

	// @ts-expect-error webkit prefix
	const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
	const rec = new Rec();

	rec.continuous     = true;   // keep listening across pauses
	rec.interimResults = true;
	rec.lang           = lang || 'it-IT';

	// Flag set by handle.stop() so onend knows not to restart
	let stopped = false;

	rec.onresult = (e: { results: SpeechRecognitionResultList; resultIndex: number }) => {
		// Walk only the new results (from resultIndex onward)
		let finalChunk   = '';
		let interimChunk = '';
		for (let i = e.resultIndex; i < e.results.length; i++) {
			const result = e.results[i];
			if (result.isFinal) {
				finalChunk += result[0].transcript;
			} else {
				interimChunk += result[0].transcript;
			}
		}
		// Emit final segments first, then any interim preview
		if (finalChunk)   onResult(finalChunk.trim(), true);
		if (interimChunk) onResult(interimChunk, false);
	};

	rec.onerror = (e: { error: string }) => {
		const map: Record<string, string> = {
			'not-allowed':         'Microfono non autorizzato.',
			'no-speech':           'Nessuna voce rilevata.',
			'network':             'Errore di rete nel riconoscimento vocale.',
			'audio-capture':       'Impossibile accedere al microfono.',
			'service-not-allowed': 'Servizio di riconoscimento non disponibile.',
		};
		// 'no-speech' in continuous mode is a normal timeout, not a fatal error.
		// The browser will fire onend and we will auto-restart.
		if (e.error === 'no-speech') return;
		stopped = true;
		onError(map[e.error] ?? 'Errore riconoscimento vocale.');
	};

	rec.onend = () => {
		if (stopped) {
			// Intentional stop — notify caller
			onEnd();
		} else {
			// The browser ended the session on its own (silence timeout, etc.).
			// Restart automatically to keep continuous listening going.
			try {
				rec.start();
			} catch {
				// Already started or unavailable — ignore
			}
		}
	};

	rec.start();

	return {
		stop: () => {
			stopped = true;
			try { rec.stop(); } catch { /* ignore if already stopped */ }
		},
	};
}
