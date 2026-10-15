/** Shared visual state: the shader, hero, and header all read from this. */
export const fx = $state({
	/** Konami code easter egg. Speeds up the grid and shifts the palette. */
	turbo: false,
	/** Scroll progress through the first ~1.5 viewports, 0 to 1. */
	heroProgress: 0
});
