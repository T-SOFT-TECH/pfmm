<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Animate from '$lib/components/Animate.svelte';

	let projects = $state<any[]>([]);
	let loading = $state(true);
	let activeCategory = $state('all');

	// Extract unique categories from projects
	const categories = $derived([
		{ id: 'all', label: 'All Projects' },
		...Array.from(new Set(projects.map(p => p.category)))
			.map(cat => ({
				id: cat,
				label: cat.charAt(0).toUpperCase() + cat.slice(1)
			}))
	]);

	const filteredProjects = $derived(
		activeCategory === 'all'
			? projects
			: projects.filter((p) => p.category === activeCategory)
	);

	onMount(async () => {
		try {
			const projectsData = await pb.collection('portfolio').getFullList({
				filter: 'status = "published"',
				sort: '-published_date,-created'
			});
			projects = projectsData;
		} catch (err) {
			console.error('Error fetching portfolio:', err);
		} finally {
			loading = false;
		}
	});

	function getImageUrl(project: any) {
		if (!project.image) return '/logo.png';
		return pb.files.getUrl(project, project.image);
	}

	function getVideoEmbedUrl(url: string): string | null {
		if (!url) return null;

		// YouTube
		const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
		const youtubeMatch = url.match(youtubeRegex);
		if (youtubeMatch) {
			return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
		}

		// Vimeo
		const vimeoRegex = /vimeo\.com\/(?:.*\/)?(\d+)/;
		const vimeoMatch = url.match(vimeoRegex);
		if (vimeoMatch) {
			return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
		}

		return null;
	}

	function getMusicEmbedUrl(url: string): string | null {
		if (!url) return null;

		// Spotify track
		const spotifyTrackRegex = /spotify\.com\/track\/([a-zA-Z0-9]+)/;
		const spotifyTrackMatch = url.match(spotifyTrackRegex);
		if (spotifyTrackMatch) {
			return `https://open.spotify.com/embed/track/${spotifyTrackMatch[1]}`;
		}

		// Spotify playlist/album
		const spotifyPlaylistRegex = /spotify\.com\/(playlist|album)\/([a-zA-Z0-9]+)/;
		const spotifyPlaylistMatch = url.match(spotifyPlaylistRegex);
		if (spotifyPlaylistMatch) {
			return `https://open.spotify.com/embed/${spotifyPlaylistMatch[1]}/${spotifyPlaylistMatch[2]}`;
		}

		// SoundCloud
		if (url.includes('soundcloud.com')) {
			return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
		}

		// Apple Music (if URL contains music.apple.com)
		if (url.includes('music.apple.com')) {
			return url.replace('music.apple.com', 'embed.music.apple.com');
		}

		return null;
	}

	function getMusicFileUrl(project: any) {
		if (!project.music_file) return null;
		return pb.files.getUrl(project, project.music_file);
	}
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
		{#if loading}
			<div class="text-center py-20">
				<p class="text-dark-400 text-lg">Loading projects...</p>
			</div>
		{:else}
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
							<!-- Project Media (Video, Music, or Image) -->
							<div class="aspect-video bg-dark-700 overflow-hidden relative">
								{#if project.category === 'video' && project.video_url && getVideoEmbedUrl(project.video_url)}
									<!-- Video Embed -->
									<iframe
										src={getVideoEmbedUrl(project.video_url)}
										title={project.title}
										frameborder="0"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowfullscreen
										class="w-full h-full"
									></iframe>
								{:else if project.category === 'music'}
									<!-- Music Section -->
									<div class="w-full h-full flex flex-col">
										<!-- Thumbnail/Background -->
										<div class="flex-1 relative">
											<img
												src={getImageUrl(project)}
												alt={project.title}
												class="w-full h-full object-cover"
											/>
											<div class="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent"></div>
											<div class="absolute inset-0 flex items-center justify-center">
												<div class="text-6xl">🎵</div>
											</div>
										</div>

										<!-- Music Player -->
										<div class="bg-dark-900/95 p-4">
											{#if project.music_url && getMusicEmbedUrl(project.music_url)}
												<!-- Embedded Music Player (Spotify, SoundCloud, etc.) -->
												<iframe
													src={getMusicEmbedUrl(project.music_url)}
													title={project.title}
													frameborder="0"
													allow="encrypted-media"
													class="w-full h-20"
												></iframe>
											{:else if getMusicFileUrl(project)}
												<!-- HTML5 Audio Player for uploaded files -->
												<audio controls class="w-full">
													<source src={getMusicFileUrl(project)} type="audio/mpeg" />
													Your browser does not support the audio element.
												</audio>
											{:else}
												<p class="text-xs text-dark-400 text-center">No audio available</p>
											{/if}
										</div>
									</div>
								{:else}
									<!-- Project Image (for all other categories) -->
									<img
										src={getImageUrl(project)}
										alt={project.title}
										class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
									/>
								{/if}
							</div>

							<!-- Project Content -->
							<div class="p-6">
								<h3 class="text-xl font-bold text-dark-100 mb-3 group-hover:text-primary-400 transition-colors">
									{project.title}
								</h3>
								<p class="text-dark-400 text-sm leading-relaxed mb-4">
									{project.excerpt || project.description?.substring(0, 150) + '...'}
								</p>

								<!-- Tags -->
								{#if project.tags && Array.isArray(project.tags)}
									<div class="flex flex-wrap gap-2">
										{#each project.tags as tag}
											<span class="px-3 py-1 bg-dark-700 text-accent-400 text-xs rounded-full">
												{tag}
											</span>
										{/each}
									</div>
								{/if}
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
