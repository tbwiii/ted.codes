<script lang="ts">
	import { links, site } from '$content/site';

	const year = new Date().getFullYear();
</script>

<footer>
	<p class="thanks">Thanks for playing</p>
	<a class="continue" href="#top">
		<span class="blink">▶</span> Continue?
	</a>

	<div class="row">
		<p>&copy; {year} {site.name}</p>
		<ul>
			{#each links as link (link.label)}
				<li>
					<a href={link.href} target="_blank" rel="noreferrer">
						<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"
							><path d={link.icon} fill="currentColor" /></svg
						>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
		<p class="hint">↑↑↓↓←→←→BA</p>
	</div>
</footer>

<style>
	footer {
		display: grid;
		justify-items: center;
		gap: 1.25rem;
		padding: 6rem 1.25rem 2rem;
		text-align: center;
		background: linear-gradient(transparent, #05020bdd 40%);
	}

	.thanks {
		font-family: var(--font-script);
		font-size: clamp(2.5rem, 7vw, 4.5rem);
		color: #fff;
		text-shadow: var(--neon-pink);
		transform: rotate(-4deg);
	}

	.continue {
		font-family: var(--font-mono);
		font-size: 1rem;
		letter-spacing: 0.35em;
		text-transform: uppercase;
		color: var(--color-gold);
		text-shadow: 0 0 12px var(--color-sun);
		padding: 0.6rem 1.2rem;
		border: 1px dashed #ffd23f60;
		border-radius: 0.5rem;
		transition:
			background 0.2s,
			color 0.2s;
	}

	.continue:hover {
		background: var(--color-gold);
		color: var(--color-void);
		text-shadow: none;
	}

	.blink {
		animation: blink 1s steps(1) infinite;
	}

	.row {
		width: min(100%, 72rem);
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		margin-top: 4rem;
		padding-top: 1.5rem;
		border-top: 1px solid #ffffff14;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		color: #cbb8e6;
	}

	ul {
		display: flex;
		gap: 1.5rem;
	}

	ul a {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		transition: color 0.2s;
	}

	ul a:hover {
		color: var(--color-cyan);
	}

	.hint {
		opacity: 0.35;
		letter-spacing: 0.3em;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
