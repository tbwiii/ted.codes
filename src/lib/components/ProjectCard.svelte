<script lang="ts">
	import type { Project } from '$lib/content';

	let { project, index, total }: { project: Project; index: number; total: number } = $props();

	const flipped = $derived(index % 2 === 1);
	const pad = (n: number) => String(n).padStart(2, '0');
	const external = $derived(!!project.url && !project.url.startsWith('#'));

	let screen: HTMLElement;
	let raf = 0;

	// Tilt toward the pointer, with a holographic glare that follows it.
	function tilt(e: PointerEvent) {
		if (e.pointerType !== 'mouse') return;
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(() => {
			const r = screen.getBoundingClientRect();
			const x = (e.clientX - r.left) / r.width;
			const y = (e.clientY - r.top) / r.height;
			screen.style.setProperty('--rx', `${(0.5 - y) * 14}deg`);
			screen.style.setProperty('--ry', `${(x - 0.5) * 18}deg`);
			screen.style.setProperty('--gx', `${x * 100}%`);
			screen.style.setProperty('--gy', `${y * 100}%`);
			screen.style.setProperty('--glare', '1');
		});
	}

	function reset() {
		cancelAnimationFrame(raf);
		screen.style.setProperty('--rx', '0deg');
		screen.style.setProperty('--ry', '0deg');
		screen.style.setProperty('--glare', '0');
	}
</script>

<article class="project" class:flipped>
	<div class="info">
		<p class="index">
			<span>{pad(index + 1)}</span> / {pad(total)}
		</p>
		<h3 class="title">{project.title}</h3>

		<div class="panel">
			<div class="body">{@html project.body}</div>

			{#if project.role}
				<div>
					<h4 class="label">Role</h4>
					<p>{project.role}</p>
				</div>
			{/if}

			{#if project.tech.length}
				<ul class="tech" aria-label="Tech">
					{#each project.tech as t}<li>{t}</li>{/each}
				</ul>
			{/if}

			<div class="actions">
				{#if project.url}
					<a
						class="cta"
						href={project.url}
						target={external ? '_blank' : undefined}
						rel={external ? 'noreferrer' : undefined}
					>
						<span>Check out {project.title}</span>
					</a>
				{:else}
					<span class="offline"><span class="dot"></span>{project.title} is no longer online</span>
				{/if}
				{#if project.repo}
					<a class="repo" href={project.repo} target="_blank" rel="noreferrer">Source ↗</a>
				{/if}
			</div>
		</div>
	</div>

	<div class="screen-wrap">
		<div
			class="screen"
			bind:this={screen}
			onpointermove={tilt}
			onpointerleave={reset}
			role="presentation"
		>
			{#if project.cover}
				<img src={project.cover} alt="Screenshot of {project.title}" loading="lazy" />
			{/if}
			<span class="scanlines" aria-hidden="true"></span>
			<span class="glare" aria-hidden="true"></span>
		</div>
		{#if project.tool}
			<img
				class="badge"
				src={project.tool.logo}
				alt={project.tool.name}
				title="Built with {project.tool.name}"
			/>
		{/if}
	</div>
</article>

<style>
	.project {
		position: relative;
		display: grid;
		grid-template-columns: 1fr;
		gap: 3.5rem 4rem;
		align-items: center;
		max-width: 76rem;
		margin: 0 auto 11rem;
		padding: 0 1.25rem;
	}

	@media (min-width: 960px) {
		.project {
			grid-template-columns: 1fr 1.1fr;
		}
		.flipped .info {
			order: 2;
		}
	}

	.index {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		letter-spacing: 0.3em;
		color: var(--color-lilac);
		opacity: 0.7;
		margin-bottom: 0.25rem;
	}

	.index span {
		color: var(--color-cyan);
		text-shadow: var(--neon-cyan);
	}

	.title {
		position: relative;
		z-index: 2;
		font-family: var(--font-script);
		font-size: clamp(3.2rem, 8vw, 5.5rem);
		line-height: 1;
		color: #fff;
		text-shadow: var(--neon-pink);
		transform: rotate(-5deg);
		margin: 0 0 -0.45em -0.1em;
		white-space: nowrap;
	}

	.panel {
		position: relative;
		display: grid;
		gap: 1.6rem;
		padding: clamp(2.2rem, 5vw, 3rem) clamp(1.4rem, 4vw, 2.75rem) clamp(1.8rem, 4vw, 2.5rem);
		border-radius: 1rem;
		font-size: 1.05rem;
		line-height: 1.65;
		color: #f5ebff;
		background:
			linear-gradient(155deg, #ff2fd62e, transparent 45%),
			color-mix(in oklab, #2a0f3f 70%, transparent);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		border: 1px solid #ffd6f470;
		box-shadow:
			0 0 0.3em #ffffff60,
			0 0 2.2em -0.3em var(--color-neon),
			inset 0 0 3em #ff2fd630;
	}

	.body :global(em) {
		color: var(--color-gold);
	}

	.label {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: var(--color-cyan);
		margin-bottom: 0.3rem;
	}

	.tech {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tech li {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		padding: 0.1rem 0.7rem;
		background: var(--color-chip);
		color: #7c2d12;
		transform: skewX(-20deg);
		transition:
			transform 0.3s var(--ease-spring),
			background 0.2s;
	}

	.tech li:hover {
		transform: skewX(-20deg) translateY(-3px);
		background: var(--color-gold);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem 1.5rem;
	}

	.cta {
		position: relative;
		overflow: hidden;
		display: inline-block;
		padding: 0.8rem 1.6rem;
		margin-left: -0.5rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: #4a0a45;
		background: #f5b3ff;
		transform: skewX(-20deg);
		box-shadow: 0 0 0 0 #ff2fd6;
		transition:
			transform 0.35s var(--ease-spring),
			box-shadow 0.35s,
			background 0.25s;
	}

	.cta span {
		display: inline-block;
		transform: skewX(20deg);
	}

	.cta::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(100deg, transparent 30%, #fff9 50%, transparent 70%);
		translate: -120% 0;
		transition: translate 0.6s var(--ease-out-expo);
	}

	.cta:hover {
		background: #fff;
		transform: skewX(-20deg) scale(1.05);
		box-shadow: 0 0 30px 2px #ff2fd6aa;
	}

	.cta:hover::after {
		translate: 120% 0;
	}

	.repo {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--color-cyan);
	}

	.repo:hover {
		text-shadow: var(--neon-cyan);
	}

	.offline {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		opacity: 0.75;
	}

	.dot {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		background: var(--color-hot);
		box-shadow: 0 0 10px var(--color-hot);
	}

	.screen-wrap {
		position: relative;
		perspective: 1100px;
	}

	.screen {
		--rx: 0deg;
		--ry: 0deg;
		--gx: 50%;
		--gy: 50%;
		--glare: 0;
		position: relative;
		overflow: hidden;
		border-radius: 0.9rem;
		padding: 5px;
		background: linear-gradient(140deg, #ffffff, #bfe9ff 40%, #6eccee);
		box-shadow:
			0 0 0.05em #024775,
			0 0 1.4em #00a1efaa,
			0 30px 60px -20px #000;
		transform: rotateX(var(--rx)) rotateY(var(--ry));
		transform-style: preserve-3d;
		transition: transform 0.6s var(--ease-out-expo);
	}

	.screen img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		border-radius: 0.6rem;
	}

	.scanlines {
		position: absolute;
		inset: 5px;
		border-radius: 0.6rem;
		pointer-events: none;
		background: repeating-linear-gradient(transparent 0 2px, #0000001a 2px 3px);
		mix-blend-mode: multiply;
	}

	.glare {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: var(--glare);
		transition: opacity 0.4s;
		background:
			radial-gradient(circle at var(--gx) var(--gy), #ffffff55, transparent 45%),
			linear-gradient(
				calc(var(--ry) * 4 + 115deg),
				transparent 25%,
				#ff2fd633 40%,
				#3ef2ff33 50%,
				#ffd23f33 60%,
				transparent 75%
			);
		mix-blend-mode: screen;
	}

	.badge {
		position: absolute;
		top: -2.2rem;
		right: -1rem;
		width: 5.5rem;
		height: 5.5rem;
		object-fit: contain;
		filter: drop-shadow(0 0 16px #ffffff50) drop-shadow(0 10px 10px #000a);
		animation: hover-badge 5s ease-in-out infinite alternate;
	}

	.flipped .badge {
		right: auto;
		left: -1rem;
	}

	@keyframes hover-badge {
		from {
			transform: translateY(0) rotate(-6deg);
		}
		to {
			transform: translateY(-10px) rotate(6deg);
		}
	}

	@supports (animation-timeline: view()) {
		.info,
		.screen-wrap {
			animation: slide-in linear both;
			animation-timeline: view();
			animation-range: entry 0% cover 35%;
		}
		.info {
			--from: -12vw;
		}
		.screen-wrap {
			--from: 12vw;
		}
		.flipped .info {
			--from: 12vw;
		}
		.flipped .screen-wrap {
			--from: -12vw;
		}
		@keyframes slide-in {
			from {
				opacity: 0;
				translate: var(--from) 0;
				filter: blur(10px);
			}
		}
	}
</style>
