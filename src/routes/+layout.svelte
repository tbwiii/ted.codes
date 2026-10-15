<script lang="ts">
	import './layout.css';
	import { fx } from '$lib/fx.svelte';
	import { site } from '$content/site';
	import Sunset from '$lib/components/Sunset.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Konami from '$lib/components/Konami.svelte';

	let { children } = $props();

	let scrollY = $state(0);
	let innerHeight = $state(1);

	$effect(() => {
		fx.heroProgress = Math.min(1, Math.max(0, scrollY / (innerHeight * 1.2)));
	});
</script>

<svelte:window bind:scrollY bind:innerHeight />

<svelte:head>
	<title>{site.name} · {site.title}</title>
	<meta name="description" content={site.description} />
	<meta property="og:title" content="{site.name} · {site.title}" />
	<meta property="og:description" content={site.description} />
	<meta property="og:url" content={site.url} />
	<meta property="og:image" content="{site.url}/og.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="theme-color" content="#0a0514" />
</svelte:head>

<a class="skip" href="#about">Skip to content</a>

<Sunset />
<Header />
<main>
	{@render children()}
</main>
<Footer />
<Konami />
<div class="crt" aria-hidden="true"></div>

<style>
	/* The tilted section titles overhang the edges; without this, phones widen the layout to fit. */
	main {
		overflow-x: clip;
	}

	.skip {
		position: fixed;
		top: 0.5rem;
		left: 0.5rem;
		z-index: 100;
		padding: 0.5rem 1rem;
		background: var(--color-cyan);
		color: var(--color-void);
		translate: 0 -200%;
	}

	.skip:focus {
		translate: 0 0;
	}

	/* Scanlines and a soft vignette over everything. */
	.crt {
		position: fixed;
		inset: 0;
		z-index: 40;
		pointer-events: none;
		background:
			repeating-linear-gradient(transparent 0 2px, #00000012 2px 4px),
			radial-gradient(ellipse at center, transparent 60%, #00000070 100%);
		mix-blend-mode: multiply;
	}
</style>
