<script lang="ts">
	let {
		text,
		align = 'left',
		kicker
	}: { text: string; align?: 'left' | 'right'; kicker?: string } = $props();
</script>

<div class="wrap" class:right={align === 'right'}>
	{#if kicker}<p class="kicker">{kicker}</p>{/if}
	<h2 class="title">
		<span class="ghost" aria-hidden="true">{text}</span>
		<span class="stripe-mask solid">{text}</span>
	</h2>
</div>

<style>
	.wrap {
		--tilt: -6deg;
		position: relative;
		margin: 7rem 0 5rem;
		padding-left: clamp(1rem, 8vw, 6rem);
		transform: rotate(var(--tilt));
	}

	.wrap.right {
		--tilt: 6deg;
		text-align: right;
		padding-left: 0;
		padding-right: clamp(1rem, 8vw, 6rem);
	}

	.kicker {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		letter-spacing: 0.4em;
		text-transform: uppercase;
		color: var(--color-cyan);
		text-shadow: var(--neon-cyan);
		margin-bottom: 0.5rem;
	}

	.title {
		position: relative;
		display: inline-block;
		font-family: var(--font-display);
		font-weight: 900;
		font-size: clamp(3.5rem, 14vw, 9.5rem);
		line-height: 0.9;
		text-transform: uppercase;
		color: #fff;
	}

	.solid {
		display: block;
		text-shadow: 0 0 30px #ff2fd680;
	}

	/* Outline copy offset behind the stripes, like a CRT ghost. */
	.ghost {
		position: absolute;
		inset: 0;
		color: transparent;
		-webkit-text-stroke: 1.5px var(--color-neon);
		transform: translate(0.06em, 0.05em);
		filter: drop-shadow(0 0 6px var(--color-neon));
	}

	@supports (animation-timeline: view()) {
		.wrap {
			animation: title-in linear both;
			animation-timeline: view();
			animation-range: entry 0% cover 40%;
		}
		.ghost {
			animation: ghost-in linear both;
			animation-timeline: view();
			animation-range: entry 10% cover 50%;
		}
		@keyframes title-in {
			from {
				opacity: 0;
				transform: rotate(var(--tilt)) translateX(calc(var(--dir, -1) * 20vw)) skewX(30deg);
				filter: blur(8px);
			}
		}
		.right {
			--dir: 1;
		}
		@keyframes ghost-in {
			from {
				transform: translate(0.4em, 0.2em);
				opacity: 0;
			}
		}
	}
</style>
