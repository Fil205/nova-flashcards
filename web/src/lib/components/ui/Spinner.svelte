<script lang="ts">
	interface Props {
		size?: number;
		class?: string;
	}

	let { size = 24, class: cls = '' }: Props = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	class="animate-spin {cls}"
	aria-hidden="true"
>
	<circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
	<path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
</svg>
