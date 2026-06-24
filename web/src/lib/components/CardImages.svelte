<script lang="ts">
	import type { CardImage } from '$lib/types';

	interface Props {
		images?: CardImage[] | null;
		/** Tailwind margin applied below the block when there are images. */
		class?: string;
	}

	let { images = null, class: klass = '' }: Props = $props();

	const list = $derived((images ?? []).slice().sort((a, b) => a.position - b.position));

	// Carousel state (only used when there are 3 images)
	let track = $state<HTMLElement | null>(null);
	let active = $state(0);

	function onScroll(): void {
		if (!track) return;
		active = Math.round(track.scrollLeft / track.clientWidth);
	}

	function goTo(i: number): void {
		if (!track) return;
		track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
	}
</script>

{#if list.length > 0}
	<div class="ci {klass}">
		{#if list.length === 1}
			<!-- 1 image: single, full width, no crop -->
			<img
				class="ci-img ci-single"
				src={list[0].url}
				alt={list[0].alt ?? ''}
				width={list[0].width ?? undefined}
				height={list[0].height ?? undefined}
				loading="lazy"
				decoding="async"
			/>
		{:else if list.length === 2}
			<!-- 2 images: side-by-side grid (stacks on very narrow screens) -->
			<div class="ci-grid">
				{#each list as img (img.id)}
					<img
						class="ci-img ci-cell"
						src={img.url}
						alt={img.alt ?? ''}
						width={img.width ?? undefined}
						height={img.height ?? undefined}
						loading="lazy"
						decoding="async"
					/>
				{/each}
			</div>
		{:else}
			<!-- 3+ images: swipe carousel with dot indicators -->
			<div class="ci-carousel">
				<div class="ci-track" bind:this={track} onscroll={onScroll}>
					{#each list as img (img.id)}
						<div class="ci-slide">
							<img
								class="ci-img ci-cell"
								src={img.url}
								alt={img.alt ?? ''}
								width={img.width ?? undefined}
								height={img.height ?? undefined}
								loading="lazy"
								decoding="async"
							/>
						</div>
					{/each}
				</div>
				<div class="ci-dots">
					{#each list as _, i (i)}
						<button
							type="button"
							class="ci-dot {active === i ? 'is-active' : ''}"
							aria-label={`Vai all'immagine ${i + 1}`}
							onclick={() => goTo(i)}
						></button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.ci {
		width: 100%;
	}

	/* Shared image look: rounded, framed, never distorted (contain). */
	.ci-img {
		display: block;
		width: 100%;
		object-fit: contain;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 0.75rem;
	}

	.ci-single {
		max-height: 50vh;
		object-position: center;
	}

	.ci-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}
	.ci-cell {
		height: 11rem;
	}
	@media (max-width: 380px) {
		.ci-grid {
			grid-template-columns: 1fr;
		}
	}

	/* Carousel: horizontal scroll-snap, fixed height so the card stays compact. */
	.ci-carousel {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.ci-track {
		display: flex;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		gap: 0.5rem;
		scrollbar-width: none;
	}
	.ci-track::-webkit-scrollbar {
		display: none;
	}
	.ci-slide {
		flex: 0 0 100%;
		scroll-snap-align: center;
	}
	.ci-carousel .ci-cell {
		height: 13rem;
	}
	.ci-dots {
		display: flex;
		justify-content: center;
		gap: 0.4rem;
	}
	.ci-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 9999px;
		background: rgba(255, 255, 255, 0.25);
		transition: background 0.2s, transform 0.2s;
	}
	.ci-dot.is-active {
		background: #a78bfa;
		transform: scale(1.2);
	}
</style>
