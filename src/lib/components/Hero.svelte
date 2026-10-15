<script lang="ts">
	const first = 'TED'.split('');
	const last = 'WALLER'.split('');
</script>

<section class="hero" id="top">
	<div class="stage">
		<p class="hud">
			<span class="blink">●</span> PLAYER 1 · EST. 2005
		</p>

		<h1 class="name" aria-label="Ted Waller">
			{#each [first, last] as word, w}
				<span class="word" aria-hidden="true">
					{#each word as letter, i}
						{@const n = w * first.length + i}
						<span class="letter" style:--i={n} data-letter={letter}>{letter}</span>
					{/each}
				</span>
			{/each}
			<span class="sparkle" aria-hidden="true"></span>
		</h1>

		<p class="tagline">Full Stack Developer</p>
	</div>

	<a class="cue" href="#about" aria-label="Scroll to intro">
		<span>scroll</span>
		<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
			<path
				d="M6 9l6 6 6-6"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			/>
		</svg>
	</a>
</section>

<style>
	.hero {
		position: relative;
		display: grid;
		place-items: center;
		min-height: 100svh;
		padding: 0 1rem;
		perspective: 900px;
	}

	.stage {
		display: grid;
		justify-items: center;
		text-align: center;
		transform: translateY(-6vh);
	}

	/* Fly through the title as you scroll away from it. */
	@supports (animation-timeline: scroll()) {
		.stage {
			animation: fly-away linear both;
			animation-timeline: scroll(root);
			animation-range: 0 90svh;
		}
		@keyframes fly-away {
			to {
				transform: translateY(-6vh) translateZ(420px);
				opacity: 0;
				filter: blur(6px);
			}
		}
	}

	.hud {
		font-family: var(--font-mono);
		font-size: clamp(0.65rem, 1.6vw, 0.85rem);
		letter-spacing: 0.35em;
		color: var(--color-cyan);
		text-shadow: var(--neon-cyan);
		margin-bottom: 1.5rem;
		padding: 0.45rem calc(1rem - 0.35em) 0.45rem 1rem;
		border-radius: 999px;
		background: #0a0514b0;
		border: 1px solid #3ef2ff40;
		backdrop-filter: blur(6px);
		animation: fade-up 1s var(--ease-out-expo) 1.4s both;
	}

	.blink {
		color: var(--color-hot);
		text-shadow: 0 0 8px var(--color-hot);
		animation: pulse 1.2s ease-in-out infinite;
	}

	.name {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0 0.28em;
		font-family: var(--font-display);
		font-weight: 900;
		font-style: italic;
		font-size: clamp(3.2rem, 13vw, 11rem);
		line-height: 0.95;
		letter-spacing: 0.02em;
	}

	@media (max-width: 640px) {
		.name {
			font-size: 19vw;
		}
	}

	.word {
		display: inline-flex;
		transform: skew(-12deg);
	}

	.letter {
		position: relative;
		display: inline-block;
		color: transparent;
		background: var(--chrome);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-stroke: 0.012em #c9d6f0;
		filter: drop-shadow(0 0 0.04em #8ba2d0) drop-shadow(0 0.04em 0.12em #165ff3);
		animation: letter-in 1.1s var(--ease-out-expo) calc(0.35s + var(--i) * 70ms) both;
	}

	/* A sheen sweeping across the chrome. */
	.letter::after {
		content: attr(data-letter);
		position: absolute;
		inset: 0;
		color: transparent;
		-webkit-text-stroke: 0;
		background: linear-gradient(105deg, transparent 40%, #ffffffd0 50%, transparent 60%) no-repeat;
		background-size: 300% 100%;
		background-clip: text;
		-webkit-background-clip: text;
		animation: sheen 5s ease-in-out calc(2s + var(--i) * 60ms) infinite;
	}

	.sparkle {
		position: absolute;
		top: 0.05em;
		right: -0.1em;
		width: 0.4em;
		height: 0.4em;
		background:
			radial-gradient(white 3%, #ffffff40 15%, #ffffff50 30%, transparent 50%),
			radial-gradient(#ffffff70 50%, transparent 60%) 50% 50% / 5% 100% no-repeat,
			radial-gradient(#ffffff70 50%, transparent 60%) 50% 50% / 80% 5% no-repeat;
		animation: twinkle 3.5s ease-in-out 1.8s infinite both;
	}

	.tagline {
		font-family: var(--font-script);
		font-size: clamp(2.2rem, 7vw, 5.8rem);
		line-height: 1;
		color: #fff;
		text-shadow: var(--neon-pink);
		transform: rotate(-7deg);
		margin-top: -0.35em;
		padding: 0 0.3em 0.2em;
		animation: write 1.4s cubic-bezier(0.65, 0, 0.35, 1) 1.1s both;
	}

	.cue {
		position: absolute;
		bottom: 2rem;
		display: grid;
		justify-items: center;
		gap: 0.2rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.4em;
		text-transform: uppercase;
		color: var(--color-lilac);
		opacity: 0.8;
		animation: fade-up 1s ease 2.4s both;
	}

	.cue svg {
		animation: bob 1.6s ease-in-out infinite;
	}

	@keyframes letter-in {
		from {
			opacity: 0;
			transform: perspective(600px) translateZ(400px) translateY(-0.4em) rotateX(70deg);
			filter: blur(12px);
		}
	}

	@keyframes sheen {
		0%,
		60% {
			background-position: 100% 0;
		}
		100% {
			background-position: 0 0;
		}
	}

	@keyframes write {
		from {
			clip-path: inset(-60% 100% -60% -20%);
			opacity: 0.3;
		}
		to {
			clip-path: inset(-60% -20% -60% -20%);
			opacity: 1;
		}
	}

	@keyframes twinkle {
		0%,
		100% {
			transform: scale(0) rotate(0);
		}
		15% {
			transform: scale(1.2) rotate(45deg);
		}
		30% {
			transform: scale(0) rotate(90deg);
		}
	}

	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
	}

	@keyframes bob {
		50% {
			transform: translateY(5px);
		}
	}

	@keyframes pulse {
		50% {
			opacity: 0.25;
		}
	}
</style>
