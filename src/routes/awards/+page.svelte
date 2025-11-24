<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import Animate from '$lib/components/Animate.svelte';

	let awards = $state<any[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const awardsData = await pb.collection('awards').getFullList({
				sort: '-year,-created'
			});
			awards = awardsData;
		} catch (err) {
			console.error('Error fetching awards:', err);
		} finally {
			loading = false;
		}
	});

	function getImageUrl(award: any) {
		if (!award.image) return null;
		return pb.files.getUrl(award, award.image);
	}
</script>

<svelte:head>
	<title>Awards & Recognitions - Aliu Ifeoluwa Philemon</title>
</svelte:head>

<!-- Hero Section -->
<section class="relative pt-32 pb-20 overflow-hidden">
	<!-- Background Image -->
	<div class="absolute inset-0">
		<img
			src="/hero/awards-hero.jpg"
			alt="Awards and Recognitions"
			class="w-full h-full object-cover"
		/>
		<!-- Gradient Overlays -->
		<div class="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/70 to-dark-900/90"></div>
		<div class="absolute inset-0 bg-gradient-to-r from-dark-900/60 via-transparent to-dark-900/60"></div>
	</div>

	<!-- Content -->
	<div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-5xl mx-auto text-center">
			<div class="text-6xl mb-6">🏆</div>
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-100 mb-6">
				<span class="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
					Awards & Recognitions
				</span>
			</h1>
			<p class="text-xl text-dark-300 max-w-3xl mx-auto leading-relaxed">
				My contributions to the creative and empowerment sectors have earned recognition from several reputable organizations. These awards reflect the dedication and collaborative spirit that define my work.
			</p>
		</div>
	</div>
</section>

<!-- Awards Timeline -->
<section class="py-20 bg-dark-900">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		{#if loading}
			<div class="text-center py-20">
				<p class="text-dark-400 text-lg">Loading awards...</p>
			</div>
		{:else if awards.length > 0}
			<div class="max-w-4xl mx-auto space-y-12">
				{#each awards as award, index}
					<Animate variant="slide-up" duration={0.6} delay={index * 0.15}>
						<div class="relative pl-8 md:pl-16 border-l-2 border-primary-600">
						<!-- Year Badge -->
						<div class="absolute left-0 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
							{String(award.year).slice(-2)}
						</div>

						<!-- Award Content -->
						<div class="bg-dark-800 border border-primary-600/30 rounded-2xl p-8 hover:border-primary-600 transition-all duration-300 hover:shadow-xl ml-4">
							<div class="flex flex-wrap items-center gap-3 mb-4">
								{#if award.category}
									<span class="px-3 py-1 bg-primary-600/20 text-primary-400 text-xs font-medium rounded-full">
										{award.category}
									</span>
								{/if}
								<span class="text-dark-500 text-sm">{award.year}</span>
							</div>

							<h3 class="text-2xl font-bold text-dark-100 mb-2">
								{award.title}
							</h3>

							<div class="text-accent-400 font-medium mb-4">
								{award.organization}
							</div>

							{#if award.description}
								<p class="text-dark-400 leading-relaxed">
									{award.description}
								</p>
							{/if}
						</div>
						</div>
					</Animate>
				{/each}
			</div>
		{:else}
			<div class="text-center py-20">
				<p class="text-dark-400 text-lg">No awards to display yet.</p>
			</div>
		{/if}
	</div>
</section>

<!-- Impact Statement -->
<section class="py-20 bg-dark-800/30">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-4xl mx-auto text-center">
			<Animate variant="fade" duration={0.8}>
				<h2 class="text-3xl md:text-4xl font-bold text-dark-100 mb-6">
					Beyond Recognition
				</h2>
				<p class="text-lg text-dark-300 leading-relaxed">
					While these awards are deeply appreciated, the true reward lies in the lives transformed, skills developed, and communities empowered through creative media. Every recognition motivates me to continue pushing boundaries and creating meaningful impact.
				</p>
			</Animate>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-20 bg-gradient-to-r from-primary-900/20 via-accent-900/20 to-primary-900/20">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
		<Animate variant="scale" duration={0.8}>
			<h2 class="text-3xl md:text-4xl font-bold text-dark-100 mb-6">
				Let's Create Award-Worthy Work Together
			</h2>
			<p class="text-lg text-dark-300 max-w-2xl mx-auto mb-8">
				Partner with me to create exceptional projects that make a lasting impact.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a
					href="/portfolio"
					class="px-8 py-4 bg-dark-800 text-primary-400 border-2 border-primary-600 rounded-xl font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300"
				>
					View Portfolio
				</a>
				<a
					href="/contact"
					class="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:from-primary-500 hover:to-accent-500 transition-all duration-300 shadow-lg"
				>
					Get in Touch
				</a>
			</div>
		</Animate>
	</div>
</section>
