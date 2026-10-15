<script lang="ts">
	import { site } from '$content/site';

	// *a phrase* marks a neon highlight; punctuation after the closing * stays unlit.
	const lines = [
		"I'm a *Full Stack Developer* specializing in *web apps*, *component architecture*, and *agentic workflows*.",
		`Making stuff for the web since *'${String(site.since).slice(2)}*.`
	];

	// Highlighted phrases alternate between neon pink and cyan.
	const glows = ['#ff2fd6', '#3ef2ff'];
	let hotCount = 0;

	const parsed = lines.map((line) =>
		line
			// Keep a phrase's inner spaces from splitting it into separate tokens.
			.replace(/\*[^*]+\*/g, (m) => m.replace(/ /g, '\u00a0'))
			.split(' ')
			.map((token) => {
				const m = token.match(/^\*(.+)\*(.*)$/);
				if (!m) return { text: token, hot: false, tail: '', glow: undefined };
				return {
					text: m[1].replace(/\u00a0/g, ' '),
					hot: true,
					tail: m[2],
					glow: glows[hotCount++ % glows.length]
				};
			})
	);

	const years = new Date().getFullYear() - site.since;
</script>

<section id="about" class="mission">
	{#each parsed as words, l}
		<p class="line" class:small={l > 0}>
			{#each words as word}
				<span class="chunk"
					><span class="word" class:hot={word.hot} style:--glow={word.glow}>{word.text}</span
					>{word.tail}</span
				>{' '}
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

	/* Keeps trailing punctuation glued to its word so a comma never starts a line. */
	.chunk {
		white-space: nowrap;
	}

	.word {
		display: inline-block;
	}

	.hot {
		color: #fff;
		text-shadow:
			0 0 0.05em #fff,
			0 0 0.2em var(--glow),
			0 0 0.5em var(--glow),
			0 0 1.2em color-mix(in srgb, var(--glow) 50%, transparent);
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
				transform: translateY(0.25em);
			}
		}
		@keyframes dim-hot {
			from {
				opacity: 0.12;
				text-shadow: none;
				transform: translateY(0.25em);
			}
			60% {
				text-shadow: none;
			}
		}
	}
</style>
