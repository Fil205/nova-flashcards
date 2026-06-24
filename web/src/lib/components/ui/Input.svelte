<script lang="ts">
	interface Props {
		value: string;
		type?: string;
		placeholder?: string;
		disabled?: boolean;
		label?: string;
		hint?: string;
		error?: string;
		class?: string;
		onchange?: (value: string) => void;
		oninput?: (value: string) => void;
	}

	let {
		value = $bindable(),
		type = 'text',
		placeholder = '',
		disabled = false,
		label,
		hint,
		error,
		class: extraClass = '',
		onchange,
		oninput,
	}: Props = $props();
</script>

<div class="flex flex-col gap-1 {extraClass}">
	{#if label}
		<label class="text-xs font-medium text-fc-muted uppercase tracking-wide">{label}</label>
	{/if}
	<input
		{type}
		bind:value
		{placeholder}
		{disabled}
		class="input-base {error ? 'border-fc-danger/50 focus:ring-fc-danger/30' : ''}"
		onchange={(e) => onchange?.((e.target as HTMLInputElement).value)}
		oninput={(e) => oninput?.((e.target as HTMLInputElement).value)}
	/>
	{#if error}
		<p class="text-xs text-fc-danger">{error}</p>
	{:else if hint}
		<p class="text-xs text-fc-faint">{hint}</p>
	{/if}
</div>
