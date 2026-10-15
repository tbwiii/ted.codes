import { parse as parseYaml } from 'yaml';
import { marked } from 'marked';
import { tools, type Tool } from '$content/tools';

/**
 * Projects live in src/content/projects/<slug>/index.md, next to a cover image.
 * Add a folder to add a project, delete it to remove one. See README.md.
 */

export type Project = {
	slug: string;
	title: string;
	order: number;
	url?: string;
	repo?: string;
	tool?: Tool;
	tech: string[];
	role?: string;
	/** Rendered HTML from the markdown body. */
	body: string;
	cover?: string;
	hidden: boolean;
};

type Frontmatter = {
	title: string;
	order?: number;
	url?: string;
	repo?: string;
	tool?: string;
	tech?: string[];
	role?: string;
	cover?: string;
	hidden?: boolean;
};

const files = import.meta.glob<string>('../content/projects/*/index.md', {
	query: '?raw',
	import: 'default',
	eager: true
});

const images = import.meta.glob<string>(
	'../content/projects/*/*.{png,jpg,jpeg,webp,avif,gif,svg}',
	{
		query: '?url',
		import: 'default',
		eager: true
	}
);

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function parseProject(path: string, raw: string): Project {
	const slug = path.split('/').at(-2)!;
	const match = raw.match(FRONTMATTER);
	if (!match) throw new Error(`${path} is missing its --- frontmatter --- block`);

	const data = parseYaml(match[1]) as Frontmatter;
	if (!data?.title) throw new Error(`${path} needs a title`);

	const dir = path.slice(0, path.lastIndexOf('/') + 1);
	const coverFile =
		data.cover ??
		Object.keys(images)
			.find((p) => p.startsWith(dir + 'cover.'))
			?.slice(dir.length);
	const cover = coverFile ? images[dir + coverFile.replace(/^\.\//, '')] : undefined;

	const tool = data.tool ? tools.find((t) => t.id === data.tool) : undefined;
	if (data.tool && !tool)
		throw new Error(`${path}: unknown tool "${data.tool}" (see src/content/tools.ts)`);

	return {
		slug,
		title: data.title,
		order: data.order ?? Number.MAX_SAFE_INTEGER,
		url: data.url,
		repo: data.repo,
		tool,
		tech: data.tech ?? [],
		role: data.role,
		body: marked.parse(match[2].trim(), { async: false }),
		cover,
		hidden: data.hidden ?? false
	};
}

export const projects: Project[] = Object.entries(files)
	.map(([path, raw]) => parseProject(path, raw))
	.filter((p) => !p.hidden)
	.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
