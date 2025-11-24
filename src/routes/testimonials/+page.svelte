<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import Animate from '$lib/components/Animate.svelte';

	let testimonials = $state<any[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const testimonialsData = await pb.collection('testimonials').getFullList({
				filter: 'status = "approved"',
				sort: '-created'
			});
			testimonials = testimonialsData;
		} catch (err) {
			console.error('Error fetching testimonials:', err);
		} finally {
			loading = false;
		}
	});

	function getAvatarUrl(testimonial: any) {
		if (!testimonial.avatar) return '/logo.png';
		return pb.files.getUrl(testimonial, testimonial.avatar);
	}
</script>

<svelte:head>
	<title>Testimonials - Aliu Ifeoluwa Philemon</title>
</svelte:head>

<!-- Hero Section -->
<section class="relative pt-32 pb-20 overflow-hidden">
	<!-- Background Image -->
	<div class="absolute inset-0">
		<img
			src="/hero/testimonials-hero.jpg"
			alt="Testimonials"
			class="w-full h-full object-cover"
		/>
		<!-- Gradient Overlays -->
		<div class="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/70 to-dark-900/90"></div>
		<div class="absolute inset-0 bg-gradient-to-r from-dark-900/60 via-transparent to-dark-900/60"></div>
	</div>

	<!-- Content -->
	<div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-5xl mx-auto text-center">
			<div class="text-6xl mb-6">💬</div>
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-100 mb-6">
				<span class="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
					Stories of Impact and Collaboration
				</span>
			</h1>
			<p class="text-xl text-dark-300 max-w-3xl mx-auto leading-relaxed">
				Hear from artists, trainees, and partners whose lives and projects have been positively impacted through collaboration and mentorship.
			</p>
		</div>
	</div>
</section>

<!-- Testimonials Grid -->
<section class="py-20 bg-dark-900">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		{#if loading}
			<div class="text-center py-20">
				<p class="text-dark-400 text-lg">Loading testimonials...</p>
			</div>
		{:else if testimonials.length > 0}
			<div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each testimonials as testimonial, i}
					<Animate variant="slide-up" duration={0.6} delay={i * 0.1}>
						<div class="bg-dark-800 border border-primary-600/30 rounded-2xl p-8 hover:border-primary-600 transition-all duration-300 hover:shadow-xl">
						<!-- Rating Stars -->
						<div class="flex space-x-1 mb-4">
							{#each Array(testimonial.rating || 5) as _}
								<svg class="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
								</svg>
							{/each}
						</div>

						<!-- Testimonial Content -->
						<blockquote class="text-dark-300 leading-relaxed mb-6">
							"{testimonial.content}"
						</blockquote>

						<!-- Author Info -->
						<div class="flex items-center space-x-4 pt-4 border-t border-dark-700">
							<div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold overflow-hidden">
								<img src={getAvatarUrl(testimonial)} alt={testimonial.name} class="w-full h-full object-cover" />
							</div>
							<div>
								<div class="text-dark-100 font-semibold">{testimonial.name}</div>
								<div class="text-dark-500 text-sm">{testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ''}</div>
							</div>
						</div>
						</div>
					</Animate>
				{/each}
			</div>
		{:else}
			<div class="text-center py-20">
				<p class="text-dark-400 text-lg">No testimonials available yet.</p>
			</div>
		{/if}
	</div>
</section>

<!-- Stats Section -->
<section class="py-20 bg-dark-800/30">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-5xl mx-auto">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
				<Animate variant="scale" duration={0.6} delay={0}>
					<div>
					<div class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-2">
						1000+
					</div>
					<div class="text-dark-400 text-sm">People Trained</div>
					</div>
				</Animate>
				<Animate variant="scale" duration={0.6} delay={0.1}>
					<div>
					<div class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-2">
						500+
					</div>
					<div class="text-dark-400 text-sm">Projects Completed</div>
					</div>
				</Animate>
				<Animate variant="scale" duration={0.6} delay={0.2}>
					<div>
					<div class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-2">
						100%
					</div>
					<div class="text-dark-400 text-sm">Client Satisfaction</div>
					</div>
				</Animate>
				<Animate variant="scale" duration={0.6} delay={0.3}>
					<div>
					<div class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-2">
						10+
					</div>
					<div class="text-dark-400 text-sm">Years Experience</div>
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
				Ready to Create Your Success Story?
			</h2>
			<p class="text-lg text-dark-300 max-w-2xl mx-auto mb-8">
				Join the many individuals and organizations who have benefited from our creative services and empowerment programs.
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
					Get Started
				</a>
			</div>
		</Animate>
	</div>
</section>
