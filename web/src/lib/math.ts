import katex from 'katex';

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

/**
 * Render LaTeX math delimiters inside `text` using KaTeX, while HTML-escaping
 * all non-math segments to prevent XSS.
 *
 * Supported delimiters:
 *   $$...$$ — display (block) math
 *   $...$   — inline math
 *
 * Safe to call on streaming/partial text: incomplete delimiters are left as
 * escaped plain text and render correctly once the closing delimiter arrives.
 */
export function renderMath(text: string): string {
	if (!text) return '';

	// Match $$...$$ first (greedy-safe with [\s\S]), then $...$ (inline, no nesting)
	const re = /(\$\$[\s\S]+?\$\$|\$(?!\$)(?:[^$\\]|\\[\s\S])*?\$(?!\$))/g;
	const parts: string[] = [];
	let last = 0;
	let m: RegExpExecArray | null;

	while ((m = re.exec(text)) !== null) {
		// Escape plain text before this match
		if (m.index > last) {
			parts.push(escapeHtml(text.slice(last, m.index)));
		}

		const isDisplay = m[0].startsWith('$$');
		const math = isDisplay ? m[0].slice(2, -2) : m[0].slice(1, -1);

		try {
			parts.push(
				katex.renderToString(math.trim(), {
					displayMode: isDisplay,
					throwOnError: false,
					output: 'html',
				})
			);
		} catch {
			// Fallback: show raw delimiter as escaped text
			parts.push(escapeHtml(m[0]));
		}

		last = m.index + m[0].length;
	}

	// Escape any remaining plain text
	if (last < text.length) {
		parts.push(escapeHtml(text.slice(last)));
	}

	return parts.join('');
}
