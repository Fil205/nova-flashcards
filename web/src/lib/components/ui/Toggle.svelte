<script lang="ts">
	interface Props {
		checked: boolean;
		disabled?: boolean;
		label?: string;
		onchange?: (value: boolean) => void;
	}

	let {
		checked = $bindable(),
		disabled = false,
		label,
		onchange,
	}: Props = $props();

	const trackCls = $derived(
		`block w-10 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-fc-accent' : 'bg-white/15'}`
	);
</script>

<label class="inline-flex items-center gap-3 cursor-pointer select-none group" class:opacity-50={disabled} class:cursor-not-allowed={disabled}>
	<span class="relative inline-block w-10 h-6">
		<input
			type="checkbox"
			bind:checked
			{disabled}
			class="sr-only"
			onchange={() => onchange?.(checked)}
		/>
		<span class={trackCls}></span>
		<span
			class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
			class:translate-x-4={checked}
		></span>
	</span>
	{#if label}
		<span class="text-sm text-fc-text">{label}</span>
	{/if}
</label>
