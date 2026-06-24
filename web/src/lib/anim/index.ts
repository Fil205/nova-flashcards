/**
 * GSAP animation helpers.
 * All animations respect prefers-reduced-motion automatically.
 */

import { gsap } from 'gsap';

// Check for reduced motion preference
const prefersReducedMotion = (): boolean =>
	typeof window !== 'undefined' &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const dur = (d: number) => (prefersReducedMotion() ? 0 : d);

// ── Entrance animations ────────────────────────────────────────────────────────

/** Fade in + slide up from 16px. Default entry animation. */
export function fadeUp(el: Element | null, delay = 0, duration = 0.35): gsap.core.Tween | null {
	if (!el) return null;
	return gsap.from(el, {
		opacity: 0,
		y: 16,
		duration: dur(duration),
		delay,
		ease: 'power2.out',
		clearProps: 'all',
	});
}

/** Fade in (no movement). */
export function fadeIn(el: Element | null, delay = 0, duration = 0.25): gsap.core.Tween | null {
	if (!el) return null;
	return gsap.from(el, { opacity: 0, duration: dur(duration), delay, ease: 'power2.out', clearProps: 'all' });
}

/** Scale + fade in (for modals, panels). */
export function scaleIn(el: Element | null, delay = 0): gsap.core.Tween | null {
	if (!el) return null;
	return gsap.from(el, {
		opacity: 0,
		scale: 0.94,
		duration: dur(0.28),
		delay,
		ease: 'back.out(1.5)',
		clearProps: 'all',
	});
}

/** Fade out + scale down (for closing modals). */
export function scaleOut(el: Element | null, onComplete?: () => void): gsap.core.Tween | null {
	if (!el) return null;
	return gsap.to(el, {
		opacity: 0,
		scale: 0.94,
		duration: dur(0.2),
		ease: 'power2.in',
		onComplete,
	});
}

/** Slide in from the right. */
export function slideInRight(el: Element | null, delay = 0): gsap.core.Tween | null {
	if (!el) return null;
	return gsap.from(el, {
		opacity: 0,
		x: 32,
		duration: dur(0.32),
		delay,
		ease: 'power2.out',
		clearProps: 'all',
	});
}

/** Slide in from the left. */
export function slideInLeft(el: Element | null, delay = 0): gsap.core.Tween | null {
	if (!el) return null;
	return gsap.from(el, {
		opacity: 0,
		x: -32,
		duration: dur(0.32),
		delay,
		ease: 'power2.out',
		clearProps: 'all',
	});
}

/** Staggered fade-up for a list of elements. */
export function staggerFadeUp(
	els: Element[] | NodeListOf<Element>,
	stagger = 0.06,
	delay = 0
): gsap.core.Tween | null {
	const arr = Array.from(els);
	if (!arr.length) return null;
	return gsap.from(arr, {
		opacity: 0,
		y: 16,
		duration: dur(0.35),
		delay,
		stagger: prefersReducedMotion() ? 0 : stagger,
		ease: 'power2.out',
		clearProps: 'all',
	});
}

// ── Feedback animations ────────────────────────────────────────────────────────

/** Brief pulse — used for save feedback. */
export function pulse(el: Element | null): void {
	if (!el || prefersReducedMotion()) return;
	gsap.fromTo(el, { scale: 1 }, { scale: 1.04, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.inOut' });
}

/** Flash border green — success indicator on an element. */
export function flashSuccess(el: Element | null): void {
	if (!el || prefersReducedMotion()) return;
	gsap.fromTo(
		el,
		{ boxShadow: '0 0 0 2px rgba(16,185,129,0)' },
		{ boxShadow: '0 0 0 2px rgba(16,185,129,0.6)', duration: 0.15, yoyo: true, repeat: 1 }
	);
}

/** Shake — error indicator. */
export function shake(el: Element | null): void {
	if (!el || prefersReducedMotion()) return;
	gsap.fromTo(
		el,
		{ x: 0 },
		{ x: 6, duration: 0.07, yoyo: true, repeat: 5, ease: 'power2.inOut', clearProps: 'x' }
	);
}

// ── Backdrop ──────────────────────────────────────────────────────────────────

export function backdropIn(el: Element | null): gsap.core.Tween | null {
	if (!el) return null;
	return gsap.from(el, { opacity: 0, duration: dur(0.2) });
}

export function backdropOut(el: Element | null, onComplete?: () => void): gsap.core.Tween | null {
	if (!el) return null;
	return gsap.to(el, { opacity: 0, duration: dur(0.15), onComplete });
}

// ── Card flip (study) ─────────────────────────────────────────────────────────

export function cardFlipToAnswer(front: Element | null, back: Element | null): void {
	if (!front || !back || prefersReducedMotion()) {
		if (front) (front as HTMLElement).style.display = 'none';
		if (back) (back as HTMLElement).style.display = 'block';
		return;
	}
	gsap.to(front, {
		rotateY: 90,
		duration: 0.18,
		ease: 'power2.in',
		onComplete: () => {
			(front as HTMLElement).style.display = 'none';
			(back as HTMLElement).style.display = 'block';
			gsap.from(back, { rotateY: -90, duration: 0.18, ease: 'power2.out' });
		},
	});
}
