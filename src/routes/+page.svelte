<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import HeroSlider from '$lib/components/HeroSlider.svelte';
	import Animate from '$lib/components/Animate.svelte';

	let stats = $state<any[]>([]);
	let services = $state<any[]>([]);
	let initiatives = $state<any[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			// Fetch stats
			const statsData = await pb.collection('stats').getFullList({
				sort: 'sort_order'
			});
			stats = statsData;

			// Fetch services
			const servicesData = await pb.collection('services').getFullList({
				sort: 'sort_order',
				filter: 'featured = true || featured = false'
			});
			services = servicesData;

			// Fetch active initiatives
			const initiativesData = await pb.collection('initiatives').getFullList({
				filter: 'active = true',
				sort: '-created'
			});
			initiatives = initiativesData;
		} catch (err) {
			console.error('Error fetching data:', err);
		} finally {
			loading = false;
		}
	});

	function getServiceIcon(iconName: string) {
		const icons: Record<string, string> = {
			'music': '🎵',
			'video': '🎬',
			'education': '📚',
			'collaboration': '🤝',
			'lucide-music': '🎵',
			'lucide-video': '🎬',
			'lucide-book': '📚',
			'lucide-users': '🤝'
		};
		return icons[iconName] || '🎵';
	}
</script>

<svelte:head>
	<title>Aliu Ifeoluwa Philemon - Creative Media Producer & Empowerment Advocate</title>
</svelte:head>

<!-- Hero Slider -->
<HeroSlider />

<!-- Stats Section -->
<div id="content"></div>
<section class="relative py-28 bg-dark-800/50 overflow-hidden">
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-10">
		<div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgb(var(--color-primary-400) / 0.3) 1px, transparent 0); background-size: 40px 40px;"></div>
	</div>
	<div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
		{#if loading}
			<div class="text-center text-dark-400">Loading stats...</div>
		{:else if stats.length > 0}
			<div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
				{#each stats as stat, i}
					<Animate variant="scale" duration={0.6} delay={i * 0.1}>
						<div class="text-center group">
							<div class="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
								{stat.value}
							</div>
							<div class="text-dark-300 text-base md:text-lg mt-3">{stat.label}</div>
						</div>
					</Animate>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- Services Section -->
<section class="relative py-32 bg-dark-900 overflow-hidden">
	<!-- Background Image -->
	<div class="absolute inset-0">
		<img
			src="/images/services-bg.jpg"
			alt="Studio background"
			class="w-full h-full object-cover"
		/>
		<!-- Dark overlay for text readability -->
		<div class="absolute inset-0 bg-dark-900/85"></div>
	</div>
	<div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
		<Animate variant="slide-up" duration={0.8}>
			<div class="text-center mb-20">
				<h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-100 mb-6">
					What I Do
				</h2>
				<p class="text-xl text-dark-300 max-w-2xl mx-auto">
					Bridging art, innovation, and social impact through comprehensive creative services
				</p>
			</div>
		</Animate>

		{#if loading}
			<div class="text-center text-dark-400">Loading services...</div>
		{:else if services.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each services as service, i}
					<Animate variant="slide-up" duration={0.6} delay={i * 0.1}>
						<a
							href="/portfolio#{service.slug}"
							class="group p-8 bg-dark-800 border border-primary-600/30 rounded-2xl hover:border-primary-600 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-600/20 hover:-translate-y-2 block"
						>
							<div class="text-5xl mb-6">
								{getServiceIcon(service.icon || '')}
							</div>
							<h3 class="text-2xl font-bold text-dark-100 mb-4 group-hover:text-primary-400 transition-colors">
								{service.title}
							</h3>
							<p class="text-dark-400 text-base leading-relaxed">
								{service.description}
							</p>
							<div class="mt-5 text-accent-400 text-base font-medium flex items-center space-x-1 group-hover:space-x-2 transition-all">
								<span>Learn more</span>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
								</svg>
							</div>
						</a>
					</Animate>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- Leadership Highlights -->
<section class="relative py-32 bg-dark-800/30 overflow-hidden">
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-10">
		<div class="absolute inset-0" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(var(--color-primary-600) / 0.1) 35px, rgba(var(--color-primary-600) / 0.1) 70px);"></div>
	</div>
	<div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
		<Animate variant="slide-up" duration={0.8}>
			<div class="text-center mb-20">
				<h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-100 mb-6">
					Leadership & Impact
				</h2>
				<p class="text-xl text-dark-300 max-w-2xl mx-auto">
					Leading organizations dedicated to creative excellence and community empowerment
				</p>
			</div>
		</Animate>

		{#if loading}
			<div class="text-center text-dark-400">Loading initiatives...</div>
		{:else if initiatives.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				{#each initiatives as initiative, i}
					<Animate variant="slide-up" duration={0.6} delay={i * 0.15}>
						<div class="p-10 bg-gradient-to-br from-dark-800 to-dark-900 border border-primary-600/30 rounded-2xl hover:border-primary-600 transition-all duration-300 hover:shadow-xl">
						<div class="h-1 w-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full mb-6"></div>
						{#if initiative.icon}
							<div class="text-4xl mb-4">{initiative.icon}</div>
						{/if}
						<h3 class="text-2xl font-bold text-primary-400 mb-3">
							{initiative.title}
						</h3>
						<p class="text-dark-300 text-base leading-relaxed">
							{initiative.description}
						</p>
						</div>
					</Animate>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- CTA Section -->
<section class="relative py-32 bg-gradient-to-r from-primary-900/20 via-accent-900/20 to-primary-900/20 overflow-hidden">
	<!-- Background Glow Effect -->
	<div class="absolute inset-0">
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl"></div>
	</div>
	<div class="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
		<Animate variant="scale" duration={0.8}>
			<h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-100 mb-8">
				Let's Build Something Meaningful Together
			</h2>
			<p class="text-xl text-dark-300 max-w-3xl mx-auto mb-10">
				Whether you're looking for creative collaboration, training opportunities, or media consultancy, I'm always open to meaningful partnerships that inspire change.
			</p>
			<a
				href="/contact"
				class="inline-flex items-center space-x-2 px-12 py-6 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold text-xl hover:from-primary-500 hover:to-accent-500 transition-all duration-300 shadow-2xl hover:shadow-primary-600/50 hover:scale-105"
			>
				<span>Start a Conversation</span>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
				</svg>
			</a>
		</Animate>
	</div>
</section>
