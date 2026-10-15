/**
 * The Tools section. Add a logo SVG to src/lib/assets/tools/<id>.svg and an entry here.
 * Order within a category is the display order.
 */

const logos = import.meta.glob<string>('../lib/assets/tools/*.svg', {
	query: '?url',
	import: 'default',
	eager: true
});

export const categories = [
	'Frontend',
	'Backend',
	'Data',
	'Infra',
	'Testing',
	'Design',
	'Workflow'
] as const;
export type Category = (typeof categories)[number];

type ToolDef = { id: string; name: string; category: Category; wide?: boolean };

const defs: ToolDef[] = [
	{ id: 'typescript', name: 'TypeScript', category: 'Frontend' },
	{ id: 'javascript', name: 'JavaScript', category: 'Frontend' },
	{ id: 'react', name: 'React', category: 'Frontend' },
	{ id: 'vue', name: 'VueJS', category: 'Frontend' },
	{ id: 'svelte', name: 'Svelte', category: 'Frontend' },
	{ id: 'nuxt', name: 'Nuxt', category: 'Frontend' },
	{ id: 'mui', name: 'Material UI', category: 'Frontend' },
	{ id: 'tanstack', name: 'TanStack Query', category: 'Frontend' },
	{ id: 'tailwind', name: 'Tailwind', category: 'Frontend' },
	{ id: 'html5', name: 'HTML 5', category: 'Frontend' },
	{ id: 'css3', name: 'CSS 3', category: 'Frontend' },
	{ id: 'vite', name: 'Vite', category: 'Frontend' },

	{ id: 'ruby', name: 'Ruby', category: 'Backend' },
	{ id: 'rails', name: 'Rails', category: 'Backend', wide: true },
	{ id: 'node', name: 'NodeJS', category: 'Backend' },
	{ id: 'sidekiq', name: 'Sidekiq', category: 'Backend', wide: true },
	{ id: 'graphql', name: 'GraphQL', category: 'Backend' },

	{ id: 'postgresql', name: 'PostgreSQL', category: 'Data' },
	{ id: 'redis', name: 'Redis', category: 'Data' },
	{ id: 'elasticsearch', name: 'Elasticsearch', category: 'Data' },
	{ id: 'mongodb', name: 'MongoDB', category: 'Data' },

	{ id: 'aws', name: 'AWS', category: 'Infra' },
	{ id: 'github-actions', name: 'GitHub Actions', category: 'Infra' },

	{ id: 'jest', name: 'Jest', category: 'Testing' },
	{ id: 'cypress', name: 'Cypress', category: 'Testing' },

	{ id: 'figma', name: 'Figma', category: 'Design' },
	{ id: 'sketch', name: 'Sketch', category: 'Design' },
	{ id: 'godot', name: 'Godot', category: 'Design' },

	{ id: 'claude', name: 'Claude Code', category: 'Workflow' },
	{ id: 'git', name: 'Git', category: 'Workflow' },
	{ id: 'vscode', name: 'VS Code', category: 'Workflow' }
];

export type Tool = ToolDef & { logo: string };

export const tools: Tool[] = defs.map((def) => {
	const logo = logos[`../lib/assets/tools/${def.id}.svg`];
	if (!logo)
		throw new Error(`Missing logo for tool "${def.id}": add src/lib/assets/tools/${def.id}.svg`);
	return { ...def, logo };
});
