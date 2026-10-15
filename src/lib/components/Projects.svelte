<script lang="ts">
	import { projects } from '$lib/content';
	import ProjectCard from './ProjectCard.svelte';
	import SectionTitle from './SectionTitle.svelte';
</script>

<section id="projects">
	<SectionTitle text="Projects" align="right" kicker="Stage select" />

	{#each projects as project, i (project.slug)}
		<ProjectCard {project} index={i} total={projects.length} />
	{/each}
</section>
