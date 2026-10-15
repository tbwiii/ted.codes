<script lang="ts">
	import { tick } from 'svelte';
	import { categories, tools, type Category } from '$content/tools';
	import SectionTitle from './SectionTitle.svelte';

	let active = $state<Category | 'All'>('All');
	const filters = [
		'All',
		...categories.filter((c) => tools.some((t) => t.category === c))
	] as const;

	// Filtering dims the rest instead of removing them, so nothing reflows.
	const rank = $derived(
		new Map(
			tools
				.filter((t) => active === 'All' || t.category === active)
				.map((t, i) => [t.id, i] as const)
		)
	);

	let grid: HTMLElement;

	// Tiles keep their place and the rest dim, so the sticky filter bar can leave the
	// matches off-screen. Bring the first match into view if it isn't.
	async function select(f: (typeof filters)[number]) {
		active = f;
		await tick();
		const first = grid.querySelector<HTMLElement>('.tile.on');
		if (!first) return;
		const { top, bottom } = first.getBoundingClientRect();
		const clearOfBar = 150; // floating header + sticky filters
		if (top < clearOfBar || bottom > window.innerHeight) {
			first.scrollIntoView({ block: 'center' });
		}
	}

	// One pointer handler drives the spotlight on every tile, so the glow bleeds across neighbors.
	function spotlight(e: PointerEvent) {
		for (const tile of grid.querySelectorAll<HTMLElement>('.tile')) {
			const r = tile.getBoundingClientRect();
			tile.style.setProperty('--mx', `${e.clientX - r.left}px`);
			tile.style.setProperty('--my', `${e.clientY - r.top}px`);
		}
	}
</script>

<section id="tools" class="tools">
	<SectionTitle text="Tools" kicker="Select your loadout" />

	<div class="filters" role="group" aria-label="Highlight tools by category">
		{#each filters as f (f)}
			<button aria-pressed={active === f} class:active={active === f} onclick={() => select(f)}>
				{f}
				<span class="count"
					>{f === 'All' ? tools.length : tools.filter((t) => t.category === f).length}</span
				>
			</button>
		{/each}
	</div>

	<ul class="grid" bind:this={grid} onpointermove={spotlight}>
		{#each tools as tool, i (tool.id)}
			{@const r = rank.get(tool.id)}
			<li
				class="tile"
				class:off={r === undefined}
				class:on={r !== undefined && active !== 'All'}
				style:--d={(i * 7) % 10}
				style:--r={r ?? 0}
			>
				<div class="inner">
					<img src={tool.logo} alt="" class:wide={tool.wide} loading="lazy" />
					<span class="name">{tool.name}</span>
				</div>
			</li>
		{/each}
	</ul>
</section>

<style>
	.tools {
		max-width: 76rem;
		margin: 0 auto;
		padding: 0 1rem 8rem;
	}

	.filters {
		position: sticky;
		top: 5rem;
		z-index: 20;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
		margin: 0 -1rem 1.25rem;
		padding: 0.6rem 1rem;
		background: #0b0616b3;
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		border-block: 1px solid #ffffff10;
	}

	/* One scrolling row rather than a wrapped second row that eats the viewport while stuck. */
	@media (max-width: 900px) {
		.filters {
			flex-wrap: nowrap;
			justify-content: flex-start;
			overflow-x: auto;
			margin-inline: -1rem;
			padding: 0.5rem 1rem;
			scrollbar-width: none;
			mask: linear-gradient(90deg, transparent, #000 1rem calc(100% - 1rem), transparent);
		}
		.filters button {
			flex: none;
		}
	}

	.filters button {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		padding: 0.55rem 1rem;
		border-radius: 999px;
		color: var(--color-lilac);
		background: #ffffff08;
		border: 1px solid #ffffff1a;
		cursor: pointer;
		isolation: isolate;
		transform: skewX(-12deg);
		transition:
			background 0.25s,
			color 0.25s,
			box-shadow 0.25s,
			transform 0.3s var(--ease-spring);
	}

	.filters button:hover {
		transform: skewX(-12deg) translateY(-2px);
		border-color: #ff2fd680;
	}

	.filters button::before {
		content: '';
		position: absolute;
		inset: -1px;
		z-index: -1;
		border-radius: inherit;
		background: linear-gradient(90deg, var(--color-neon), var(--color-sun));
		opacity: 0;
		transform: scale(0.85);
		transition:
			opacity 0.3s,
			transform 0.4s var(--ease-spring);
	}

	.filters button.active {
		color: var(--color-void);
		border-color: transparent;
		box-shadow: 0 0 24px #ff2fd680;
	}

	.filters button.active::before {
		opacity: 1;
		transform: none;
	}

	.count {
		font-size: 0.65rem;
		opacity: 0.6;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
		gap: 0.6rem;
	}

	.tile {
		--mx: -999px;
		--my: -999px;
		position: relative;
		aspect-ratio: 5 / 4;
		border-radius: 0.9rem;
		padding: 1px;
		background:
			radial-gradient(
				260px circle at var(--mx) var(--my),
				#ff2fd6cc,
				#3ef2ff66 35%,
				transparent 60%
			),
			#ffffff14;
		animation: float 6s ease-in-out calc(var(--d) * -0.6s) infinite alternate;
		transition:
			opacity 0.5s var(--ease-out-expo) calc(var(--r) * 35ms),
			filter 0.5s var(--ease-out-expo) calc(var(--r) * 35ms),
			scale 0.6s var(--ease-spring) calc(var(--r) * 35ms);
	}

	.tile.off {
		opacity: 0.5;
		filter: grayscale(1) brightness(0.4) blur(0.5px);
		scale: 0.9;
		transition-delay: 0s;
	}

	.tile.on {
		scale: 1.04;
		background:
			radial-gradient(
				260px circle at var(--mx) var(--my),
				#ff2fd6cc,
				#3ef2ff66 35%,
				transparent 60%
			),
			linear-gradient(140deg, #ff2fd6aa, #ffb13b88);
		box-shadow: 0 0 28px -6px #ff2fd6;
	}

	.inner {
		position: relative;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.55rem;
		padding: 0.5rem;
		border-radius: inherit;
		overflow: hidden;
		background:
			radial-gradient(180px circle at var(--mx) var(--my), #ff2fd622, transparent 70%),
			linear-gradient(160deg, #1d0f33f0, #0b0616f5);
		perspective: 500px;
	}

	/* Perspective floor inside each tile. */
	.inner::before {
		content: '';
		position: absolute;
		inset: 55% -30% -10%;
		background-image:
			linear-gradient(#3ef2ff30 1px, transparent 1px),
			linear-gradient(90deg, #3ef2ff30 1px, transparent 1px);
		background-size: 18px 18px;
		transform: rotateX(70deg);
		transform-origin: top;
		mask: linear-gradient(transparent, #000 60%);
		opacity: 0;
		transition: opacity 0.4s;
	}

	img {
		position: relative;
		width: auto;
		height: 2.1rem;
		max-width: 60%;
		object-fit: contain;
		filter: drop-shadow(0 6px 14px #0009);
		transition:
			transform 0.5s var(--ease-spring),
			filter 0.4s;
	}

	img.wide {
		max-width: 75%;
	}

	.name {
		position: relative;
		max-width: 100%;
		text-align: center;
		font-family: var(--font-display);
		font-size: 0.8rem;
		line-height: 1.2;
		color: #e9e1ff;
		overflow-wrap: anywhere;
	}

	.tile:hover .inner::before {
		opacity: 1;
	}

	.tile:hover img {
		transform: translateY(-2px) scale(1.08);
		filter: drop-shadow(0 0 12px #ff2fd6aa) drop-shadow(0 8px 8px #000a);
	}

	.tile:hover .name {
		color: #fff;
	}

	@media (max-width: 640px) {
		.grid {
			grid-template-columns: repeat(auto-fill, minmax(6.25rem, 1fr));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tile {
			animation: none;
		}
		.tile,
		img,
		.filters button {
			transition: none;
		}
		.tile:hover img,
		.filters button:hover {
			transform: none;
		}
	}

	@keyframes float {
		from {
			translate: 0 -4px;
		}
		to {
			translate: 0 4px;
		}
	}
</style>
