<script lang="ts">
	import { onMount } from 'svelte';
	import { fx } from '$lib/fx.svelte';

	let canvas: HTMLCanvasElement;
	let failed = $state(false);

	const vertex = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

	// Outrun sunset: star field, striped sun, neon-rimmed mountains, and an endless grid.
	const fragment = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uTravel;
uniform float uScroll;
uniform vec2 uMouse;
uniform float uTurbo;
uniform float uIntro;
out vec4 outColor;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(float x) {
	float i = floor(x), f = fract(x);
	float u = f * f * (3.0 - 2.0 * f);
	return mix(hash(vec2(i, 0.0)), hash(vec2(i + 1.0, 0.0)), u);
}

float ridge(float x) {
	return noise(x) * 0.6 + noise(x * 2.3 + 7.0) * 0.28 + noise(x * 5.1 + 3.0) * 0.12;
}

float gridLine(float v) {
	float w = fwidth(v);
	float f = abs(fract(v - 0.5) - 0.5);
	return 1.0 - smoothstep(0.0, w * 1.4, f);
}

vec3 hueShift(vec3 c, float a) {
	const vec3 k = vec3(0.57735);
	float ca = cos(a);
	return c * ca + cross(k, c) * sin(a) + k * dot(k, c) * (1.0 - ca);
}

void main() {
	vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
	float t = uTime;
	vec2 par = uMouse * vec2(0.035, 0.02);

	// On tall screens the scrolled horizon drops fully off-screen; otherwise the glow reads as a bar.
	float tall = smoothstep(1.0, 0.6, uRes.x / uRes.y);
	float horizon = mix(-0.06, mix(-0.42, -0.62, tall), uScroll) + par.y;
	float sunR = 0.3 * clamp(uRes.x / uRes.y * 0.9, 0.6, 1.0);
	// Intro: horizon ignites, grid sweeps toward the viewer, then the sun and mountains rise.
	float introSky = smoothstep(0.0, 0.4, uIntro);
	float introGrid = smoothstep(0.08, 0.55, uIntro);
	float introSun = smoothstep(0.2, 1.0, uIntro);
	float introHills = smoothstep(0.35, 0.95, uIntro);

	vec2 sunC = vec2(par.x * 0.4, horizon + mix(0.26, 0.02, uScroll) - (1.0 - introSun) * (0.3 + sunR * 1.1));

	vec3 pink = vec3(1.0, 0.18, 0.84);
	vec3 hot = vec3(1.0, 0.16, 0.43);
	vec3 cyan = vec3(0.24, 0.95, 1.0);
	vec3 col;

	if (uv.y > horizon) {
		// Sky
		float h = uv.y - horizon;
		col = mix(vec3(0.55, 0.08, 0.42), vec3(0.16, 0.04, 0.28), smoothstep(0.0, 0.35, h)) * introSky;
		col = mix(col, vec3(0.04, 0.02, 0.08), smoothstep(0.25, 1.0, h));

		// Stars
		vec2 g = (uv + par * 0.3) * 70.0;
		vec2 id = floor(g);
		float r = hash(id);
		if (r > 0.965) {
			vec2 o = vec2(hash(id + 1.3), hash(id + 7.1)) - 0.5;
			float d = length(fract(g) - 0.5 - o * 0.6);
			float tw = 0.55 + 0.45 * sin(t * (1.5 + r * 3.0) + r * 90.0);
			col += vec3(0.9, 0.85, 1.0) * smoothstep(0.12, 0.0, d) * tw * smoothstep(0.05, 0.4, h) * introSky;
		}

		// Sun
		vec2 sd = uv - sunC;
		float d = length(sd);
		float sy = sd.y / sunR;
		vec3 sunCol = mix(vec3(1.0, 0.12, 0.55), vec3(1.0, 0.86, 0.3), smoothstep(-0.9, 0.8, sy));
		float disc = smoothstep(sunR, sunR - 0.004, d) * smoothstep(0.0, 0.35, introSun);
		float s = 0.3 - sy;
		if (s > 0.0) {
			float gap = step(fract(s * 6.5 + t * 0.2), s * 0.38);
			disc *= 1.0 - gap;
		}
		col += pink * exp(-max(d - sunR, 0.0) * 7.0) * 0.45 * introSun;
		col = mix(col, sunCol, disc);

		// Mountains, pushed to the sides so the sun stays clear
		float side = smoothstep(0.12, 0.85, abs(uv.x - sunC.x));
		float far = horizon + ridge((uv.x + par.x * 1.2) * 3.2 + 11.0) * 0.24 * side * introHills;
		float near = horizon + ridge((uv.x + par.x * 2.5) * 2.1 + 3.0) * 0.15 * side * introHills;
		if (uv.y < far) {
			col = mix(vec3(0.12, 0.03, 0.2), vec3(0.3, 0.06, 0.35), smoothstep(horizon, far, uv.y) * 0.6);
			col += pink * smoothstep(0.006, 0.0, far - uv.y) * side * 0.8;
		}
		if (uv.y < near) {
			col = vec3(0.05, 0.01, 0.09);
			col += cyan * smoothstep(0.005, 0.0, near - uv.y) * side;
		}
	} else {
		// Floor
		float dy = horizon - uv.y;
		float z = 0.35 / dy;
		float x = (uv.x - par.x * 2.0) * z;
		float lines = max(gridLine(x * 1.4), gridLine(z * 1.4 + uTravel));
		float fade = exp(-z * 0.09) * smoothstep(introGrid * 1.2, introGrid * 1.2 - 0.08, dy);
		vec3 lineCol = mix(pink, cyan, smoothstep(0.0, 0.25, dy));
		col = vec3(0.03, 0.01, 0.06) * introSky;
		col += lineCol * lines * fade * 1.4;
		col += lineCol * 0.07 * fade;

		// Sun reflection smear
		col += hot * exp(-abs(uv.x - sunC.x) * 7.0) * exp(-dy * 9.0) * 0.35 * (1.0 - uScroll) * introSun;
	}

	// Horizon haze
	float ignite = exp(-abs(uv.x) * mix(14.0, 0.0, introSky)) * smoothstep(0.0, 0.12, uIntro);
	col += pink * exp(-abs(uv.y - horizon) * 30.0) * 0.55 * ignite;

	col = mix(col, hueShift(col, 2.4 + sin(t * 1.5) * 0.4), uTurbo);

	// Dim as the page scrolls so content stays readable, plus vignette and dither
	vec2 q = gl_FragCoord.xy / uRes;
	col *= mix(1.0, 0.5, uScroll);
	col *= 0.55 + 0.45 * pow(16.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), 0.2);
	col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) / 255.0;

	outColor = vec4(col, 1.0);
}`;

	onMount(() => {
		const gl = canvas.getContext('webgl2', {
			antialias: false,
			alpha: false,
			powerPreference: 'low-power'
		});
		if (!gl) {
			failed = true;
			return;
		}

		const compile = (type: number, src: string) => {
			const s = gl.createShader(type)!;
			gl.shaderSource(s, src);
			gl.compileShader(s);
			if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
				throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
			return s;
		};

		let program: WebGLProgram;
		try {
			program = gl.createProgram()!;
			gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
			gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
			gl.linkProgram(program);
			if (!gl.getProgramParameter(program, gl.LINK_STATUS))
				throw new Error(gl.getProgramInfoLog(program) ?? 'link');
		} catch (e) {
			console.warn('Sunset shader failed, using CSS fallback', e);
			failed = true;
			return;
		}

		gl.useProgram(program);
		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		const loc = gl.getAttribLocation(program, 'p');
		gl.enableVertexAttribArray(loc);
		gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

		const u = (n: string) => gl.getUniformLocation(program, n);
		const uRes = u('uRes'),
			uTime = u('uTime'),
			uTravel = u('uTravel');
		const uScroll = u('uScroll'),
			uMouse = u('uMouse'),
			uTurbo = u('uTurbo'),
			uIntro = u('uIntro');

		const motion = matchMedia('(prefers-reduced-motion: reduce)');
		const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
		let turbo = 0;
		let travel = 0;
		let time = 0;
		const born = performance.now();
		let last = performance.now();
		let raf = 0;

		const resize = () => {
			const dpr = Math.min(devicePixelRatio, 1.5);
			canvas.width = Math.round(innerWidth * dpr);
			canvas.height = Math.round(innerHeight * dpr);
			gl.viewport(0, 0, canvas.width, canvas.height);
			if (motion.matches) draw(0);
		};

		const onPointer = (e: PointerEvent) => {
			mouse.tx = (e.clientX / innerWidth) * 2 - 1;
			mouse.ty = -((e.clientY / innerHeight) * 2 - 1);
		};

		function draw(dt: number) {
			const k = 1 - Math.exp(-dt * 4);
			mouse.x += (mouse.tx - mouse.x) * k;
			mouse.y += (mouse.ty - mouse.y) * k;
			turbo += ((fx.turbo ? 1 : 0) - turbo) * (1 - Math.exp(-dt * 3));
			time += dt;
			travel += dt * (0.45 + turbo * 2.6);

			gl!.uniform2f(uRes, canvas.width, canvas.height);
			gl!.uniform1f(uTime, time);
			gl!.uniform1f(uTravel, travel);
			gl!.uniform1f(uScroll, fx.heroProgress);
			gl!.uniform2f(uMouse, mouse.x, mouse.y);
			gl!.uniform1f(uTurbo, turbo);
			gl!.uniform1f(uIntro, motion.matches ? 1 : Math.min(1, (performance.now() - born) / 3200));
			gl!.drawArrays(gl!.TRIANGLES, 0, 3);
		}

		const loop = (now: number) => {
			const dt = Math.min((now - last) / 1000, 0.1);
			last = now;
			draw(dt);
			raf = requestAnimationFrame(loop);
		};

		const start = () => {
			cancelAnimationFrame(raf);
			if (motion.matches) {
				draw(0);
			} else {
				last = performance.now();
				raf = requestAnimationFrame(loop);
			}
		};

		// With reduced motion there is no loop, so redraw on scroll to keep the dim/sink in sync.
		const onScroll = () => motion.matches && draw(0);

		resize();
		start();
		addEventListener('resize', resize);
		addEventListener('pointermove', onPointer, { passive: true });
		addEventListener('scroll', onScroll, { passive: true });
		motion.addEventListener('change', start);

		return () => {
			cancelAnimationFrame(raf);
			removeEventListener('resize', resize);
			removeEventListener('pointermove', onPointer);
			removeEventListener('scroll', onScroll);
			motion.removeEventListener('change', start);
		};
	});
</script>

<div class="sunset" class:failed aria-hidden="true">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.sunset {
		position: fixed;
		inset: 0;
		z-index: -10;
		background: var(--color-void);
	}

	.failed {
		background: linear-gradient(#0a0514 0%, #2a1245 45%, #b0156f 60%, #0a0514 61%);
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}

	.failed canvas {
		display: none;
	}
</style>
