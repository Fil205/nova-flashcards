/**
 * Text-to-speech utilities (Web Speech API).
 */

export interface VoiceOption {
	uri: string;
	name: string;
	lang: string;
}

let _voices: VoiceOption[] = [];

function loadVoices(): VoiceOption[] {
	if (typeof window === 'undefined' || !window.speechSynthesis) return [];
	return window.speechSynthesis.getVoices().map((v) => ({
		uri:  v.voiceURI,
		name: v.name,
		lang: v.lang,
	}));
}

export function getVoices(): Promise<VoiceOption[]> {
	return new Promise((resolve) => {
		if (typeof window === 'undefined' || !window.speechSynthesis) {
			resolve([]);
			return;
		}
		const voices = loadVoices();
		if (voices.length > 0) {
			_voices = voices;
			resolve(voices);
			return;
		}
		// Some browsers load voices asynchronously
		window.speechSynthesis.onvoiceschanged = () => {
			_voices = loadVoices();
			resolve(_voices);
		};
		// Fallback timeout
		setTimeout(() => resolve(_voices), 500);
	});
}

/**
 * Strip Markdown and LaTeX markup so the synthesizer reads clean prose instead
 * of pronouncing symbols like "$", "**", "#", "\frac", "{", "}".
 * Conservative: keeps the words, drops the syntax.
 */
export function toSpeechText(raw: string): string {
	if (!raw) return '';
	let s = raw;

	// Fenced / inline code → keep inner text, drop backticks
	s = s.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').replace(/`([^`]*)`/g, '$1');

	// Math: drop $ / $$ delimiters, then strip LaTeX commands and grouping chars
	s = s.replace(/\$\$([\s\S]*?)\$\$/g, ' $1 ').replace(/\$([^$]*)\$/g, ' $1 ');
	s = s.replace(/\\[a-zA-Z]+/g, ' ')      // \frac, \sqrt, \alpha …
		 .replace(/[{}^_\\]/g, ' ');         // grouping / sub-superscript / stray backslash

	// Markdown links/images → keep visible text
	s = s.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1');

	// Emphasis, headings, blockquotes, list bullets, table pipes
	s = s.replace(/[*_~#>|]/g, ' ');

	return s.replace(/\s+/g, ' ').trim();
}

export function speak(
	text: string,
	lang: string,
	voiceURI?: string | null,
	rate = 1.0,
	pitch = 1.0
): void {
	if (typeof window === 'undefined' || !window.speechSynthesis) return;
	window.speechSynthesis.cancel();

	const utt = new SpeechSynthesisUtterance(toSpeechText(text));
	utt.lang  = lang;
	utt.rate  = rate;
	utt.pitch = pitch;

	if (voiceURI) {
		const voice = window.speechSynthesis
			.getVoices()
			.find((v) => v.voiceURI === voiceURI);
		if (voice) utt.voice = voice;
	}

	window.speechSynthesis.speak(utt);
}

export function stopTts(): void {
	if (typeof window === 'undefined' || !window.speechSynthesis) return;
	window.speechSynthesis.cancel();
}

export function isSpeaking(): boolean {
	if (typeof window === 'undefined' || !window.speechSynthesis) return false;
	return window.speechSynthesis.speaking;
}

export function isTtsSupported(): boolean {
	return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
