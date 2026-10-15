<script lang="ts">
	import { fx } from '$lib/fx.svelte';
	import { links } from '$content/site';

	const visible = $derived(fx.heroProgress > 0.55);

	// Section ids the nav links to, in page order.
	const sectionIds = ['tools', 'projects'];
	let activeId = $state<string | null>(null);

	// Effects only run in the browser, so this is SSR-safe. A section is "active"
	// while it intersects the middle band of the viewport (10% tall, centred).
	$effect(() => {
		if (!('IntersectionObserver' in window)) return;

		const inBand = new Set<string>();
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) inBand.add(entry.target.id);
					else inBand.delete(entry.target.id);
				}
				activeId = sectionIds.find((id) => inBand.has(id)) ?? null;
			},
			{ rootMargin: '-45% 0px -45% 0px' }
		);

		for (const id of sectionIds) {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	});
</script>

<header class:visible>
	<nav aria-label="Main">
		<a class="logo" href="#top" aria-label="Back to top">
			<span class="tw">TW</span>
		</a>
		<div class="sections">
			<a
				href="#tools"
				class:active={activeId === 'tools'}
				aria-current={activeId === 'tools' ? 'location' : undefined}>Tools</a
			>
			<a
				href="#projects"
				class:active={activeId === 'projects'}
				aria-current={activeId === 'projects' ? 'location' : undefined}>Projects</a
			>
		</div>
		<div class="socials">
			{#each links as link (link.label)}
				<a href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
					<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
						><path d={link.icon} fill="currentColor" /></svg
					>
					<span class="label">{link.label}</span>
				</a>
			{/each}
		</div>
	</nav>
</header>

<style>
	header {
		position: fixed;
		top: 1rem;
		left: 50%;
		z-index: 50;
		width: min(100% - 2rem, 44rem);
		translate: -50% -150%;
		opacity: 0;
		transition:
			translate 0.6s var(--ease-out-expo),
			opacity 0.4s ease;
	}

	header.visible {
		translate: -50% 0;
		opacity: 1;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.5rem 0.4rem 0.9rem;
		border-radius: 999px;
		background: color-mix(in oklab, var(--color-void) 72%, transparent);
		backdrop-filter: blur(16px) saturate(1.6);
		-webkit-backdrop-filter: blur(16px) saturate(1.6);
		border: 1px solid #ffffff1f;
		box-shadow:
			0 0 0 1px #ff2fd61a,
			0 10px 40px -10px #ff2fd650,
			inset 0 1px 0 #ffffff14;
	}

	.logo {
		font-family: var(--font-display);
		font-weight: 900;
		font-style: italic;
		font-size: 1.5rem;
		line-height: 1;
		transform: skew(-12deg);
		transition: transform 0.3s var(--ease-spring);
	}

	.logo:hover {
		transform: skew(-12deg) scale(1.1);
	}

	.tw {
		color: transparent;
		background: var(--chrome);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-stroke: 0.02em #c9d6f0;
	}

	.sections {
		display: flex;
		gap: 0.25rem;
		margin-right: auto;
		margin-left: 0.75rem;
	}

	.sections a,
	.socials a {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		padding: 0.5rem 0.8rem;
		border-radius: 999px;
		transition:
			background 0.2s,
			color 0.2s,
			box-shadow 0.2s;
	}

	.sections a:hover,
	.sections a.active {
		color: #fff;
		background: #ff2fd61f;
		box-shadow: inset 0 0 0 1px #ff2fd660;
	}

	.socials {
		display: flex;
		gap: 0.25rem;
	}

	.socials a {
		display: flex;
		align-items: center;
		gap: 0;
		padding: 0.55rem;
		color: var(--color-lilac);
	}

	.socials .label {
		display: inline-block;
		max-width: 0;
		overflow: hidden;
		white-space: nowrap;
		transition:
			max-width 0.4s var(--ease-out-expo),
			margin 0.4s var(--ease-out-expo);
	}

	.socials a:hover {
		color: var(--color-void);
		background: var(--color-cyan);
		box-shadow: 0 0 20px #3ef2ff90;
	}

	.socials a:hover .label,
	.socials a:focus-visible .label {
		max-width: 6rem;
		margin-left: 0.4rem;
	}

	@media (max-width: 480px) {
		.sections a {
			padding: 0.5rem 0.5rem;
			letter-spacing: 0.08em;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sections a {
			transition: none;
		}
	}
</style>
