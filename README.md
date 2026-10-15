# ted.codes

Ted Waller's portfolio. A synthwave fever dream, 2026 edition: SvelteKit 2, Svelte 5, Tailwind v4, and a hand-rolled WebGL sunset.

The 2023 version lives at [tbwiii/portfolio-2023](https://github.com/tbwiii/portfolio-2023).

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run check    # type check
npm run build    # static site in ./build
```

Deploys as a static site (`@sveltejs/adapter-static`). `netlify.toml` is set up for Netlify.

## Adding a project

Each project is a folder in `src/content/projects/`:

```
src/content/projects/
  my-project/
    index.md     # frontmatter + description
    cover.png    # 4:3 screenshot, any of png/jpg/webp/avif/gif/svg
```

`index.md`:

```md
---
title: My Project
order: 7 # lower shows first
url: https://example.com # omit to show "no longer online"
repo: https://github.com/... # optional "Source" link
tool: react # optional badge, an id from src/content/tools.ts
tech: [React, Vercel]
role: Design, develop, deploy.
hidden: false # true hides it without deleting
---

The description, in **markdown**.
```

To remove a project, delete its folder (or set `hidden: true`). The image is picked up automatically if it's named `cover.*`; point `cover:` at another file in the folder to override.

## Adding a tool

1. Drop a logo at `src/lib/assets/tools/<id>.svg`. The colored logos came from the [Iconify `logos` set](https://icon-sets.iconify.design/logos/): `https://api.iconify.design/logos/<name>.svg`. Logos with dark fills got recolored so they read on the dark background.
2. Add `{ id, name, category }` to `src/content/tools.ts`. Set `wide: true` for wordmark logos.

Categories come from the `categories` list in the same file; empty ones hide themselves.

## Other copy

Name, tagline, description, and social links live in `src/content/site.ts`.

## Where things are

| Thing                               | File                                     |
| ----------------------------------- | ---------------------------------------- |
| WebGL sunset (sun, mountains, grid) | `src/lib/components/Sunset.svelte`       |
| Chrome title                        | `src/lib/components/Hero.svelte`         |
| Glitch-stripe section titles        | `src/lib/components/SectionTitle.svelte` |
| Tool grid with spotlight + filters  | `src/lib/components/Tools.svelte`        |
| Project card (tilt, glare)          | `src/lib/components/ProjectCard.svelte`  |
| Easter egg                          | `src/lib/components/Konami.svelte`       |

Scroll-driven animations (`animation-timeline`) are progressive enhancement: browsers without them get the content fully visible, just without the reveal. `prefers-reduced-motion` freezes the sunset to a single frame and kills the rest.
