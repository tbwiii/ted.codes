<script lang="ts">
	import { site } from '$content/site';

	// *word* marks a neon highlight.
	const lines = [
		"I'm a *Full* *Stack* *Developer* specializing in *web* *apps* and *component* *architecture.*",
		`Making stuff for the web since *'${String(site.since).slice(2)}.*`
	];

	const parsed = lines.map((line) =>
		line.split(' ').map((w) => ({ text: w.replace(/\*/g, ''), hot: w.startsWith('*') }))
	);

	const years = new Date().getFullYear() - site.since;
</script>

<section id="about" class="mission">
	{#each parsed as words, l}
		<p class="line" class:small={l > 0}>
			{#each words as word}
				<span class="word" class:hot={word.hot}>{word.text}</span>{' '}
			{/each}
		</p>
	{/each}
	<p class="counter">
		<span class="n">{years}</span> years and counting
	</p>
</section>

<style>
	.mission {
		max-width: 68rem;
		margin: 0 auto;
		padding: 12vh 1.5rem 6vh;
		display: grid;
		gap: 2.5rem;
		text-align: center;
	}

	.line {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(2rem, 5.5vw, 4.25rem);
		line-height: 1.12;
		color: #fff;
		text-wrap: balance;
	}

	.line.small {
		font-size: clamp(1.5rem, 3.8vw, 3rem);
	}

	.word {
		display: inline-block;
	}

	.hot {
		color: #fff;
		text-shadow: var(--neon-pink);
	}

	.counter {
		font-family: var(--font-mono);
		font-size: clamp(0.7rem, 1.6vw, 0.9rem);
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--color-cyan);
		opacity: 0.85;
	}

	.n {
		color: var(--color-gold);
		text-shadow: 0 0 10px var(--color-sun);
	}

	/* Words light up as they scroll through the viewport. */
	@supports (animation-timeline: view()) {
		.word {
			animation: dim linear both;
			animation-timeline: view();
			animation-range: entry 10% cover 40%;
		}
		.hot {
			animation-name: dim-hot;
		}
		@keyframes dim {
			from {
				opacity: 0.12;
				filter: blur(3px);
				transform: translateY(0.25em);
			}
		}
		@keyframes dim-hot {
			from {
				opacity: 0.12;
				text-shadow: none;
				filter: blur(3px);
				transform: translateY(0.25em);
			}
			60% {
				text-shadow: none;
			}
		}
	}
</style>
