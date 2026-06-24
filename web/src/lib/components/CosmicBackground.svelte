<script lang="ts">
	import { onMount } from 'svelte';

	// Generate deterministic star positions + drift parameters
	const STAR_COUNT = 80;
	const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
		x:         ((i * 1234567 + 987654)  % 10000) / 100,   // 0–100%
		y:         ((i * 7654321 + 123456)  % 10000) / 100,
		r:         ((i * 314159  + 265358)  % 100)   / 100 * 1.5 + 0.5,
		opacity:   ((i * 271828  + 182845)  % 100)   / 100 * 0.5 + 0.2,
		delay:     (i % 7) * 0.5,
		dur:       3 + (i % 4),
		// Drift: very subtle ±3px movement over 25-44s
		dx:        (((i * 2718281 + 828459) % 100) / 100 - 0.5) * 6,
		dy:        (((i * 1618033 + 988749) % 100) / 100 - 0.5) * 6,
		driftDur:  25 + (i % 20),
		driftDelay: (i % 13) * 1.8,
	}));

	// Nebula orbs
	const orbs = [
		{ cx: 15, cy: 20, r: 280, color: '#4F1DD1', opacity: 0.08 },
		{ cx: 80, cy: 70, r: 320, color: '#1D4ED8', opacity: 0.06 },
		{ cx: 50, cy: 50, r: 220, color: '#7C3AED', opacity: 0.05 },
	];

	// Respect prefers-reduced-motion
	let motionOk = $state(true);
	onMount(() => {
		motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});
</script>

<div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none" aria-hidden="true">
	<svg class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
		<defs>
			{#each orbs as orb, i}
				<radialGradient id="nebula-{i}" cx="50%" cy="50%" r="50%">
					<stop offset="0%"   stop-color={orb.color} stop-opacity={orb.opacity * 1.5} />
					<stop offset="100%" stop-color={orb.color} stop-opacity="0" />
				</radialGradient>
			{/each}
		</defs>

		<!-- Nebula orbs -->
		{#each orbs as orb, i}
			<ellipse
				cx="{orb.cx}%"
				cy="{orb.cy}%"
				rx={orb.r}
				ry={orb.r * 0.8}
				fill="url(#nebula-{i})"
			/>
		{/each}

		<!-- Stars with twinkle + very subtle drift -->
		{#each stars as s}
			<circle cx="{s.x}%" cy="{s.y}%" r={s.r} fill="white" opacity={s.opacity}>
				<!-- Opacity twinkle (always on) -->
				<animate
					attributeName="opacity"
					values="{s.opacity};{s.opacity * 2};{s.opacity}"
					dur="{s.dur}s"
					begin="{s.delay}s"
					repeatCount="indefinite"
				/>
				<!-- Position drift (disabled when prefers-reduced-motion) -->
				{#if motionOk}
					<animateTransform
						attributeName="transform"
						type="translate"
						values="0 0; {s.dx} {s.dy}; 0 0"
						dur="{s.driftDur}s"
						begin="{s.driftDelay}s"
						repeatCount="indefinite"
						additive="sum"
					/>
				{/if}
			</circle>
		{/each}
	</svg>

	<!-- Gradient overlay (bottom fade) -->
	<div class="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-fc-bg to-transparent"></div>
</div>
