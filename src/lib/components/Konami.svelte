<script lang="ts">
	import { fx } from '$lib/fx.svelte';

	const code = [
		'ArrowUp',
		'ArrowUp',
		'ArrowDown',
		'ArrowDown',
		'ArrowLeft',
		'ArrowRight',
		'ArrowLeft',
		'ArrowRight',
		'b',
		'a'
	];
	let pos = 0;
	let toast = $state<string | null>(null);
	let timer: ReturnType<typeof setTimeout>;

	$effect(() => {
		document.body.classList.toggle('turbo', fx.turbo);
	});

	function onKey(e: KeyboardEvent) {
		const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
		pos = key === code[pos] ? pos + 1 : key === code[0] ? 1 : 0;
		if (pos < code.length) return;

		pos = 0;
		fx.turbo = !fx.turbo;
		toast = fx.turbo ? 'Turbo mode engaged' : 'Turbo mode off';
		clearTimeout(timer);
		timer = setTimeout(() => (toast = null), 2400);
	}
</script>

<svelte:window onkeydown={onKey} />

<div class="toast-slot" aria-live="polite">
	{#if toast}
		{#key toast}<p class="toast">{toast}</p>{/key}
	{/if}
</div>

<style>
	.toast-slot {
		position: fixed;
		inset: auto 0 2rem;
		z-index: 60;
		display: grid;
		place-items: center;
		pointer-events: none;
	}

	.toast {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		letter-spacing: 0.35em;
		text-transform: uppercase;
		color: var(--color-void);
		background: linear-gradient(90deg, var(--color-gold), var(--color-neon));
		padding: 0.75rem 1.5rem;
		box-shadow: 0 0 40px #ff2fd6;
		transform: skewX(-15deg);
		animation: pop 2.4s var(--ease-out-expo) both;
	}

	@keyframes pop {
		0% {
			opacity: 0;
			transform: skewX(-15deg) scale(2);
			filter: blur(8px);
		}
		12%,
		80% {
			opacity: 1;
			transform: skewX(-15deg) scale(1);
			filter: none;
		}
		100% {
			opacity: 0;
			transform: skewX(-15deg) translateY(20px);
		}
	}

	:global(body.turbo) {
		--color-neon: #3ef2ff;
		--color-cyan: #ffd23f;
	}
</style>
