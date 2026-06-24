/**
 * Toast notification store — Svelte 5 runes.
 */

import type { Toast, ToastVariant } from '$lib/types';

// Monotonic counter — zero collision risk, deterministic ordering
let _nextId = 0;
function uid(): string {
	return String(++_nextId);
}

class ToastStore {
	toasts = $state<Toast[]>([]);

	// Track pending auto-dismiss timers so manual remove() can cancel them
	private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

	add(variant: ToastVariant, message: string, duration = 3500): void {
		const toast: Toast = { id: uid(), variant, message, duration };
		this.toasts = [...this.toasts, toast];

		if (duration > 0) {
			const timer = setTimeout(() => this.remove(toast.id), duration);
			this.timers.set(toast.id, timer);
		}
	}

	remove(id: string): void {
		clearTimeout(this.timers.get(id));
		this.timers.delete(id);
		this.toasts = this.toasts.filter((t) => t.id !== id);
	}

	success(message: string, duration?: number): void {
		this.add('success', message, duration);
	}

	error(message: string, duration?: number): void {
		this.add('error', message, duration ?? 5000);
	}

	warning(message: string, duration?: number): void {
		this.add('warning', message, duration);
	}

	info(message: string, duration?: number): void {
		this.add('info', message, duration);
	}
}

export const toastStore = new ToastStore();
