<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import Animate from '$lib/components/Animate.svelte';

	let collaborations = $state<any[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const collabsData = await pb.collection('collaborations').getFullList({
				sort: '-start_date,-created'
			});
			collaborations = collabsData;
		} catch (err) {
			console.error('Error fetching collaborations:', err);
		} finally {
			loading = false;
		}
	});

	function getLogoUrl(collab: any) {
		if (!collab.logo) return null;
		return pb.files.getUrl(collab, collab.logo);
	}

	function getTypeIcon(type: string) {
		const icons: Record<string, string> = {
			'media': '📻',
			'education': '🎓',
			'corporate': '💻',
			'nonprofit': '🌱',
			'other': '🤝'
		};
		return icons[type] || '🤝';
	}
</script>

<svelte:head>
	<title>Media & Collaborations - Aliu Ifeoluwa Philemon</title>
</svelte:head>

<!-- Hero Section -->
<section class="relative pt-32 pb-20 overflow-hidden">
	<!-- Background Image -->
	<div class="absolute inset-0">
		<img
			src="/hero/collaborations-hero.jpg"
			alt="Media and Collaborations"
			class="w-full h-full object-cover"
		/>
		<!-- Gradient Overlays -->
		<div class="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/70 to-dark-900/90"></div>
		<div class="absolute inset-0 bg-gradient-to-r from-dark-900/60 via-transparent to-dark-900/60"></div>
	</div>

	<!-- Content -->
	<div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-5xl mx-auto text-center">
			<div class="text-6xl mb-6">📡</div>
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-100 mb-6">
				<span class="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
					Partnerships that Drive Creativity and Change
				</span>
			</h1>
			<p class="text-xl text-dark-300 max-w-3xl mx-auto leading-relaxed">
				Collaboration is at the heart of my journey. I have worked with studios, organizations, and institutions in Nigeria and abroad to deliver inspiring media and educational projects.
			</p>
		</div>
	</div>
</section>

<!-- Collaborations Grid -->
<section class="py-20 bg-dark-900">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		{#if loading}
			<div class="text-center py-20">
				<p class="text-dark-400 text-lg">Loading collaborations...</p>
			</div>
		{:else if collaborations.length > 0}
			<div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
				{#each collaborations as collab, i}
					<Animate variant="slide-up" duration={0.6} delay={i * 0.1}>
						<div class="bg-dark-800 border border-primary-600/30 rounded-2xl p-8 hover:border-primary-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
						<div class="flex items-start space-x-4 mb-6">
							<div class="text-5xl">{getTypeIcon(collab.type)}</div>
							<div class="flex-1">
								<div class="text-accent-400 text-sm font-medium mb-2">{collab.type}</div>
								<h3 class="text-2xl font-bold text-dark-100">
									{collab.partner_name}
								</h3>
								{#if collab.website}
									<a href={collab.website} target="_blank" rel="noopener noreferrer" class="text-primary-400 text-sm hover:underline">
										Visit website →
									</a>
								{/if}
							</div>
						</div>

						<p class="text-dark-400 leading-relaxed mb-6">
							{collab.description}
						</p>

						{#if collab.services && Array.isArray(collab.services)}
							<div class="flex flex-wrap gap-2">
								{#each collab.services as service}
									<span class="px-3 py-1 bg-dark-700 text-primary-400 text-xs rounded-full">
										{service}
									</span>
								{/each}
							</div>
						{/if}
						</div>
					</Animate>
				{/each}
			</div>
		{:else}
			<div class="text-center py-20">
				<p class="text-dark-400 text-lg">No collaborations to display yet.</p>
			</div>
		{/if}
	</div>
</section>

<!-- Partnership Benefits -->
<section class="py-20 bg-dark-800/30">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-5xl mx-auto">
			<Animate variant="slide-up" duration={0.8}>
				<h2 class="text-3xl md:text-4xl font-bold text-dark-100 mb-12 text-center">
					Why Partner With Me?
				</h2>
			</Animate>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<Animate variant="scale" duration={0.6} delay={0}>
					<div class="text-center p-6">
					<div class="text-5xl mb-4">🎯</div>
					<h3 class="text-xl font-bold text-primary-400 mb-3">Results-Driven</h3>
					<p class="text-dark-400">
						Every collaboration is approached with a commitment to excellence and measurable outcomes.
					</p>
					</div>
				</Animate>

				<Animate variant="scale" duration={0.6} delay={0.1}>
					<div class="text-center p-6">
					<div class="text-5xl mb-4">🤝</div>
					<h3 class="text-xl font-bold text-primary-400 mb-3">Collaborative Spirit</h3>
					<p class="text-dark-400">
						I work closely with partners to understand their vision and deliver beyond expectations.
					</p>
					</div>
				</Animate>

				<Animate variant="scale" duration={0.6} delay={0.2}>
					<div class="text-center p-6">
					<div class="text-5xl mb-4">🌍</div>
					<h3 class="text-xl font-bold text-primary-400 mb-3">Global Experience</h3>
					<p class="text-dark-400">
						Experience working with clients across Nigeria, UK, and international communities.
					</p>
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
				Ready to Collaborate?
			</h2>
			<p class="text-lg text-dark-300 max-w-2xl mx-auto mb-8">
				Let's explore how we can work together to create impactful media projects and empower communities.
			</p>
			<a
				href="/contact"
				class="inline-flex items-center space-x-2 px-10 py-5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold text-lg hover:from-primary-500 hover:to-accent-500 transition-all duration-300 shadow-2xl hover:shadow-primary-600/50 hover:scale-105"
			>
				<span>Start a Conversation</span>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
				</svg>
			</a>
		</Animate>
	</div>
</section>
