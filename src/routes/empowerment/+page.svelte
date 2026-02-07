<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import Animate from '$lib/components/Animate.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let initiatives = $state<any[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const records = await pb.collection('initiatives').getFullList({
				filter: 'active = true',
				sort: 'sort_order,created'
			});
			initiatives = records;
		} catch (err) {
			console.error('Error fetching initiatives:', err);
		} finally {
			loading = false;
		}
	});

	const approach = [
		{
			title: 'Hands-On Training',
			description: 'Practical, project-based learning that gives participants real-world experience.',
			icon: '👐'
		},
		{
			title: 'Mentorship & Guidance',
			description: 'Ongoing support and mentorship to help participants grow and succeed.',
			icon: '🎯'
		},
		{
			title: 'Community Building',
			description: 'Creating networks and communities that support continued growth.',
			icon: '🤝'
		},
		{
			title: 'Sustainable Impact',
			description: 'Equipping individuals with skills that create lasting economic opportunities.',
			icon: '🚀'
		}
	];

	function getImageUrl(initiative: any) {
		if (!initiative.image) return null;
		return pb.files.getUrl(initiative, initiative.image);
	}
</script>

<SEO
	title="Empowerment Initiatives - Building Communities"
	description="Discover our media and digital literacy programs focused on empowering young people with practical creative skills. Learn about Jesutofunwa Empowerment Foundation and SASIF & ZEDD Empowerment Foundation."
	image="/logo.png"
	url="https://pfmm.com/empowerment"
	keywords={['empowerment', 'youth development', 'creative skills', 'digital literacy', 'mentorship', 'community building', 'Jesutofunwa Foundation']}
/>

<!-- Hero Section -->
<section class="relative pt-32 pb-20 overflow-hidden">
	<!-- Background Image -->
	<div class="absolute inset-0">
		<img
			src="/hero/empowerment-hero.jpg"
			alt="Empowerment Initiatives"
			class="w-full h-full object-cover"
		/>
		<!-- Gradient Overlays -->
		<div class="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/70 to-dark-900/90"></div>
		<div class="absolute inset-0 bg-gradient-to-r from-dark-900/60 via-transparent to-dark-900/60"></div>
	</div>

	<!-- Content -->
	<div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-5xl mx-auto text-center">
			<div class="text-6xl mb-6">💡</div>
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-100 mb-6">
				<span class="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
					Empowering Creators, Building Communities
				</span>
			</h1>
			<p class="text-xl text-dark-300 max-w-3xl mx-auto leading-relaxed">
				As part of my leadership at Jesutofunwa Empowerment Foundation and SASIF & ZEDD Empowerment Foundation, I coordinate media and digital literacy programs focused on empowering young people with practical creative skills.
			</p>
		</div>
	</div>
</section>

<!-- Mission Statement -->
<section class="py-20 bg-dark-900">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-4xl mx-auto">
			<Animate variant="fade" duration={0.8}>
				<div class="bg-dark-800 border border-primary-600/30 rounded-2xl p-8 md:p-12">
					<h2 class="text-3xl md:text-4xl font-bold text-dark-100 mb-6 text-center">
						Our Mission
					</h2>
					<p class="text-lg text-dark-300 leading-relaxed text-center">
						Through workshops, mentorship, and collaborative projects, we help participants gain professional experience, confidence, and purpose. These initiatives are designed to create sustainable change by connecting creativity with community development.
					</p>
				</div>
			</Animate>
		</div>
	</div>
</section>

<!-- Main Initiatives -->
<section class="py-20 bg-dark-800/30">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		{#if loading}
			<div class="text-center py-20">
				<p class="text-dark-400 text-lg">Loading initiatives...</p>
			</div>
		{:else if initiatives.length > 0}
			<div class="max-w-6xl mx-auto space-y-12">
				{#each initiatives as initiative, i}
					<Animate variant="slide-up" duration={0.6} delay={i * 0.2}>
						<div class="bg-dark-800 border border-primary-600/30 rounded-2xl p-8 md:p-12">
						<div class="flex flex-col md:flex-row md:items-start md:space-x-8">
							<div class="text-6xl mb-6 md:mb-0">
								{#if initiative.image}
									<img src={getImageUrl(initiative)} alt={initiative.name} class="w-24 h-24 rounded-2xl object-cover" />
								{:else}
									{initiative.icon || '💡'}
								{/if}
							</div>
							<div class="flex-1">
								<div class="mb-4">
									<h3 class="text-3xl font-bold text-primary-400 mb-2">
										{initiative.name}
									</h3>
									<div class="text-accent-400 font-medium">{initiative.role}</div>
								</div>

								<p class="text-dark-300 leading-relaxed mb-6">
									{initiative.description}
								</p>

								{#if initiative.programs && Array.isArray(initiative.programs)}
									<div class="mb-6">
										<h4 class="text-lg font-semibold text-dark-100 mb-3">Key Programs:</h4>
										<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
											{#each initiative.programs as program}
												<div class="flex items-center space-x-2 text-dark-400">
													<svg class="w-5 h-5 text-accent-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
														<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
													</svg>
													<span>{program}</span>
												</div>
											{/each}
										</div>
									</div>
								{/if}

								{#if initiative.impact_metrics && Array.isArray(initiative.impact_metrics)}
									<div class="flex flex-wrap gap-4">
										{#each initiative.impact_metrics as metric}
											<div class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-600/20 to-accent-600/20 border border-primary-600/50 rounded-lg">
												<svg class="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
												</svg>
												<span class="text-primary-400 font-semibold">{metric}</span>
											</div>
										{/each}
									</div>
								{/if}
							</div>
						</div>
						</div>
					</Animate>
				{/each}
			</div>
		{:else}
			<div class="text-center py-20">
				<p class="text-dark-400 text-lg">No empowerment initiatives to display yet.</p>
			</div>
		{/if}
	</div>
</section>

<!-- Our Approach -->
<section class="py-20 bg-dark-900">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<Animate variant="slide-up" duration={0.8}>
			<div class="text-center mb-16">
				<h2 class="text-3xl md:text-4xl font-bold text-dark-100 mb-4">
					Our Approach to Empowerment
				</h2>
				<p class="text-lg text-dark-300 max-w-2xl mx-auto">
					Creating lasting impact through structured, comprehensive support
				</p>
			</div>
		</Animate>

		<div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each approach as item, i}
				<Animate variant="scale" duration={0.6} delay={i * 0.1}>
					<div class="text-center p-6 bg-dark-800 border border-primary-600/30 rounded-2xl hover:border-primary-600 transition-all duration-300 hover:-translate-y-1">
					<div class="text-5xl mb-4">{item.icon}</div>
					<h3 class="text-lg font-bold text-primary-400 mb-3">
						{item.title}
					</h3>
					<p class="text-dark-400 text-sm leading-relaxed">
						{item.description}
					</p>
					</div>
				</Animate>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-20 bg-gradient-to-r from-primary-900/20 via-accent-900/20 to-primary-900/20">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
		<Animate variant="scale" duration={0.8}>
			<h2 class="text-3xl md:text-4xl font-bold text-dark-100 mb-6">
				Join Our Empowerment Programs
			</h2>
			<p class="text-lg text-dark-300 max-w-2xl mx-auto mb-8">
				Interested in participating in our training programs or collaborating on empowerment initiatives?
			</p>
			<a
				href="/contact"
				class="inline-flex items-center space-x-2 px-10 py-5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold text-lg hover:from-primary-500 hover:to-accent-500 transition-all duration-300 shadow-2xl hover:shadow-primary-600/50 hover:scale-105"
			>
				<span>Get Involved</span>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
				</svg>
			</a>
		</Animate>
	</div>
</section>


<!-- CTA Section -->
<section class="py-20 bg-gradient-to-r from-primary-900/20 via-accent-900/20 to-primary-900/20">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
		<Animate variant="scale" duration={0.8}>
			<h2 class="text-3xl md:text-4xl font-bold text-dark-100 mb-6">
				Join Our Empowerment Programs
			</h2>
			<p class="text-lg text-dark-300 max-w-2xl mx-auto mb-8">
				Interested in participating in our training programs or collaborating on empowerment initiatives?
			</p>
			<a
				href="/contact"
				class="inline-flex items-center space-x-2 px-10 py-5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold text-lg hover:from-primary-500 hover:to-accent-500 transition-all duration-300 shadow-2xl hover:shadow-primary-600/50 hover:scale-105"
			>
				<span>Get Involved</span>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
				</svg>
			</a>
		</Animate>
	</div>
</section>
