<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Animate from '$lib/components/Animate.svelte';

	const categories = [
		{ id: 'all', label: 'All Projects' },
		{ id: 'music', label: 'Music & Sound' },
		{ id: 'media', label: 'Video & Media' },
		{ id: 'training', label: 'Training' },
		{ id: 'installations', label: 'Installations' }
	];

	let activeCategory = $state('all');

	const projects = [
		{
			id: 1,
			title: 'Studio Album Production',
			category: 'music',
			description: 'Complete album production including recording, mixing, and mastering for multiple artists.',
			image: '/logo.png',
			tags: ['Music Production', 'Mixing', 'Mastering']
		},
		{
			id: 2,
			title: 'Live Sound for Major Events',
			category: 'music',
			description: 'Professional live sound engineering for conferences and concerts across Nigeria.',
			image: '/logo.png',
			tags: ['Live Sound', 'Event Production']
		},
		{
			id: 3,
			title: 'Music Video Production',
			category: 'media',
			description: 'Creative direction and production of music videos for gospel and contemporary artists.',
			image: '/logo.png',
			tags: ['Video Production', 'Creative Direction']
		},
		{
			id: 4,
			title: 'Documentary Films',
			category: 'media',
			description: 'Producing impactful documentaries highlighting community empowerment stories.',
			image: '/logo.png',
			tags: ['Documentary', 'Storytelling']
		},
		{
			id: 5,
			title: 'Creative Skills Workshop',
			category: 'training',
			description: 'Comprehensive training programs in audio production and media creation for youth.',
			image: '/logo.png',
			tags: ['Training', 'Youth Empowerment']
		},
		{
			id: 6,
			title: 'Church Media Setup (UK)',
			category: 'installations',
			description: 'Complete sound and media installation for Christ Apostolic Church, Doncaster.',
			image: '/logo.png',
			tags: ['Installation', 'Church Media', 'Live Streaming']
		},
		{
			id: 7,
			title: 'Photography Education',
			category: 'training',
			description: 'Photography and media literacy workshops at Deblaizer Academy.',
			image: '/logo.png',
			tags: ['Photography', 'Education']
		},
		{
			id: 8,
			title: 'Live Streaming Systems',
			category: 'installations',
			description: 'Professional live streaming setup and training for churches and organizations.',
			image: '/logo.png',
			tags: ['Live Streaming', 'Technical Setup']
		}
	];

	const filteredProjects = $derived(
		activeCategory === 'all'
			? projects
			: projects.filter((p) => p.category === activeCategory)
	);
</script>

<svelte:head>
	<title>Portfolio - Aliu Ifeoluwa Philemon</title>
</svelte:head>

<!-- Hero Section -->
<section class="relative pt-32 pb-20 overflow-hidden">
	<!-- Background Image -->
	<div class="absolute inset-0">
		<img
			src="/hero/portfolio-hero.jpg"
			alt="Portfolio"
			class="w-full h-full object-cover"
		/>
		<!-- Gradient Overlays -->
		<div class="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/70 to-dark-900/90"></div>
		<div class="absolute inset-0 bg-gradient-to-r from-dark-900/60 via-transparent to-dark-900/60"></div>
	</div>

	<!-- Content -->
	<div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-5xl mx-auto text-center">
			<div class="text-6xl mb-6 animate-bounce-slow">🎬</div>
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-100 mb-6">
				<span class="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
					Selected Creative Projects
				</span>
			</h1>
			<p class="text-xl text-dark-300 max-w-3xl mx-auto leading-relaxed">
				Explore a portfolio of my professional work across music, media, and community development. Each project reflects a commitment to creativity, excellence, and impact.
			</p>
		</div>
	</div>
</section>

<!-- Filter Section -->
<section class="py-8 bg-dark-900 sticky top-20 z-40 border-b border-dark-800">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex flex-wrap gap-3 justify-center">
			{#each categories as category}
				<button
					onclick={() => (activeCategory = category.id)}
					class="px-6 py-3 rounded-lg font-medium transition-all duration-200
						{activeCategory === category.id
							? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
							: 'bg-dark-800 text-dark-300 hover:text-primary-400 hover:bg-dark-700'}"
				>
					{category.label}
				</button>
			{/each}
		</div>
	</div>
</section>

<!-- Projects Grid -->
<section class="py-20 bg-dark-900">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		{#key activeCategory}
			<div
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
				in:fly={{ y: 20, duration: 400, easing: quintOut }}
				out:fade={{ duration: 200 }}
			>
				{#each filteredProjects as project (project.id)}
					<div
						class="group bg-dark-800 border border-primary-600/30 rounded-2xl overflow-hidden hover:border-primary-600 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-600/20 hover:-translate-y-2"
						in:fly={{ y: 20, duration: 300, delay: filteredProjects.indexOf(project) * 50, easing: quintOut }}
					>
						<!-- Project Image -->
						<div class="aspect-video bg-dark-700 overflow-hidden">
							<img
								src={project.image}
								alt={project.title}
								class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
							/>
						</div>

						<!-- Project Content -->
						<div class="p-6">
							<h3 class="text-xl font-bold text-dark-100 mb-3 group-hover:text-primary-400 transition-colors">
								{project.title}
							</h3>
							<p class="text-dark-400 text-sm leading-relaxed mb-4">
								{project.description}
							</p>

							<!-- Tags -->
							<div class="flex flex-wrap gap-2">
								{#each project.tags as tag}
									<span class="px-3 py-1 bg-dark-700 text-accent-400 text-xs rounded-full">
										{tag}
									</span>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/key}

		{#if filteredProjects.length === 0}
			<div class="text-center py-20" in:fade={{ duration: 300 }}>
				<p class="text-dark-400 text-lg">No projects found in this category.</p>
			</div>
		{/if}
	</div>
</section>

<!-- Services Overview -->
<section class="py-20 bg-dark-800/30">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-5xl mx-auto">
			<Animate variant="slide-up" duration={0.8}>
				<h2 class="text-3xl md:text-4xl font-bold text-dark-100 mb-12 text-center">
					What I Offer
				</h2>
			</Animate>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				<Animate variant="slide-up" duration={0.6} delay={0}>
					<div class="p-8 bg-dark-800 border border-primary-600/30 rounded-2xl">
					<h3 class="text-2xl font-bold text-primary-400 mb-4">🎵 Music & Sound Production</h3>
					<ul class="space-y-3 text-dark-300">
						<li class="flex items-start space-x-2">
							<span class="text-accent-500 mt-1">•</span>
							<span>Studio recordings and music production</span>
						</li>
						<li class="flex items-start space-x-2">
							<span class="text-accent-500 mt-1">•</span>
							<span>Live sound setups for events and concerts</span>
						</li>
						<li class="flex items-start space-x-2">
							<span class="text-accent-500 mt-1">•</span>
							<span>Professional mixing and mastering</span>
						</li>
						<li class="flex items-start space-x-2">
							<span class="text-accent-500 mt-1">•</span>
							<span>Event production and technical direction</span>
						</li>
					</ul>
					</div>
				</Animate>

				<Animate variant="slide-up" duration={0.6} delay={0.1}>
					<div class="p-8 bg-dark-800 border border-primary-600/30 rounded-2xl">
						<h3 class="text-2xl font-bold text-primary-400 mb-4">🎬 Media & Video Works</h3>
					<ul class="space-y-3 text-dark-300">
						<li class="flex items-start space-x-2">
							<span class="text-accent-500 mt-1">•</span>
							<span>Music video production and direction</span>
						</li>
						<li class="flex items-start space-x-2">
							<span class="text-accent-500 mt-1">•</span>
							<span>Documentary filmmaking</span>
						</li>
						<li class="flex items-start space-x-2">
							<span class="text-accent-500 mt-1">•</span>
							<span>Promotional content creation</span>
						</li>
						<li class="flex items-start space-x-2">
							<span class="text-accent-500 mt-1">•</span>
							<span>Video editing and post-production</span>
						</li>
					</ul>
					</div>
				</Animate>

				<Animate variant="slide-up" duration={0.6} delay={0.2}>
					<div class="p-8 bg-dark-800 border border-primary-600/30 rounded-2xl">
						<h3 class="text-2xl font-bold text-primary-400 mb-4">📚 Training & Empowerment</h3>
					<ul class="space-y-3 text-dark-300">
						<li class="flex items-start space-x-2">
							<span class="text-accent-500 mt-1">•</span>
							<span>Creative skill workshops and programs</span>
						</li>
						<li class="flex items-start space-x-2">
							<span class="text-accent-500 mt-1">•</span>
							<span>Audio production training</span>
						</li>
						<li class="flex items-start space-x-2">
							<span class="text-accent-500 mt-1">•</span>
							<span>Photography and media literacy education</span>
						</li>
						<li class="flex items-start space-x-2">
							<span class="text-accent-500 mt-1">•</span>
							<span>Youth empowerment initiatives</span>
						</li>
					</ul>
					</div>
				</Animate>

				<Animate variant="slide-up" duration={0.6} delay={0.3}>
					<div class="p-8 bg-dark-800 border border-primary-600/30 rounded-2xl">
					<h3 class="text-2xl font-bold text-primary-400 mb-4">🤝 Technical Consultancy</h3>
					<ul class="space-y-3 text-dark-300">
						<li class="flex items-start space-x-2">
							<span class="text-accent-500 mt-1">•</span>
							<span>Church media setup and installation</span>
						</li>
						<li class="flex items-start space-x-2">
							<span class="text-accent-500 mt-1">•</span>
							<span>Live streaming systems</span>
						</li>
						<li class="flex items-start space-x-2">
							<span class="text-accent-500 mt-1">•</span>
							<span>Technical training and support</span>
						</li>
						<li class="flex items-start space-x-2">
							<span class="text-accent-500 mt-1">•</span>
							<span>Media strategy consulting</span>
						</li>
					</ul>
					</div>
				</Animate>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-20 bg-gradient-to-r from-primary-900/20 via-accent-900/20 to-primary-900/20">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
		<Animate variant="scale" duration={0.8}>
			<h2 class="text-3xl md:text-4xl font-bold text-dark-100 mb-6">
				Ready to Start Your Project?
			</h2>
			<p class="text-lg text-dark-300 max-w-2xl mx-auto mb-8">
				Let's discuss how I can help bring your creative vision to life or empower your community through media.
			</p>
			<a
				href="/contact"
				class="inline-flex items-center space-x-2 px-10 py-5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold text-lg hover:from-primary-500 hover:to-accent-500 transition-all duration-300 shadow-2xl hover:shadow-primary-600/50 hover:scale-105"
			>
				<span>Get in Touch</span>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
				</svg>
			</a>
		</Animate>
	</div>
</section>

<style>
	@keyframes bounce-slow {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-20px);
		}
	}

	.animate-bounce-slow {
		animation: bounce-slow 3s ease-in-out infinite;
	}
</style>
