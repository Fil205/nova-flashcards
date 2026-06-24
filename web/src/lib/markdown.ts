import { marked } from 'marked';
import DOMPurify from 'dompurify';
import katex from 'katex';

/**
 * Rich renderer: Markdown (GFM) + LaTeX, sanitized for safe {@html} output.
 *
 * Pipeline:
 *  1. Extract math segments ($$...$$ block, $...$ inline) BEFORE markdown so that
 *     underscores / asterisks / backslashes inside formulas are not mangled by
 *     the markdown parser. Each is replaced by an inert alphanumeric placeholder.
 *  2. Render the remaining text with marked (block) or marked.parseInline (inline).
 *  3. Render each extracted formula with KaTeX and splice the HTML back in.
 *  4. Sanitize the whole result with DOMPurify (allows KaTeX's spans/SVG/MathML
 *     and GFM tables/code), stripping any script/handler injected via the source.
 *
 * SPA-only app (ssr=false) — this always runs in the browser, so DOMPurify has a DOM.
 * Safe on streaming/partial text: an unclosed delimiter is left as escaped plain text
 * and renders correctly once the closing delimiter arrives.
 */

// Same delimiter regex used by the legacy renderMath() in math.ts:
//   $$...$$ (display) first, then $...$ (inline, no nesting), tolerating \$ escapes.
const MATH_RE = /(\$\$[\s\S]+?\$\$|\$(?!\$)(?:[^$\\]|\\[\s\S])*?\$(?!\$))/g;

marked.setOptions({
	gfm: true,
	breaks: true, // single newlines → <br> (chat / AI output reads naturally)
});

// Force links to open safely in a new tab.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
	if (node.tagName === 'A') {
		node.setAttribute('target', '_blank');
		node.setAttribute('rel', 'noopener noreferrer');
	}
});

const PURIFY_CONFIG = {
	USE_PROFILES: { html: true, svg: true, svgFilters: true, mathMl: true },
};

function renderKatex(src: string, displayMode: boolean): string {
	try {
		return katex.renderToString(src.trim(), {
			displayMode,
			throwOnError: false,
			output: 'html',
		});
	} catch {
		// Fallback: show the raw (escaped) source if KaTeX cannot parse it.
		return escapeHtml(displayMode ? `$$${src}$$` : `$${src}$`);
	}
}

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

export interface RenderRichOptions {
	/** Inline mode: no block wrappers (<p>, lists). Use inside one-line contexts. */
	inline?: boolean;
}

export function renderRich(text: string, opts: RenderRichOptions = {}): string {
	if (!text) return '';

	// 1. Extract math → placeholders. Placeholders are plain alphanumerics that
	//    survive markdown parsing untouched.
	const maths: { html: string }[] = [];
	const withPlaceholders = text.replace(MATH_RE, (match) => {
		const isDisplay = match.startsWith('$$');
		const body = isDisplay ? match.slice(2, -2) : match.slice(1, -1);
		const idx = maths.length;
		maths.push({ html: renderKatex(body, isDisplay) });
		return `fckatexph${idx}phfckatex`;
	});

	// 2. Markdown → HTML.
	let html = opts.inline
		? marked.parseInline(withPlaceholders) as string
		: marked.parse(withPlaceholders) as string;

	// 3. Re-inject KaTeX HTML.
	html = html.replace(/fckatexph(\d+)phfckatex/g, (_m, n: string) => maths[Number(n)]?.html ?? '');

	// 4. Sanitize.
	return DOMPurify.sanitize(html, PURIFY_CONFIG);
}
