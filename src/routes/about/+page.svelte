<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import Animate from '$lib/components/Animate.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import StructuredData from '$lib/components/StructuredData.svelte';

	let experiences = $state<any[]>([]);
	let skills = $state<any[]>([]);
	let values = $state<any[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			// Fetch experiences
			const experiencesData = await pb.collection('experiences').getFullList({
				sort: '-start_date'
			});
			experiences = experiencesData;

			// Fetch skills
			const skillsData = await pb.collection('skills').getFullList({
				sort: 'category,name'
			});
			skills = skillsData;

			// Fetch values
			const valuesData = await pb.collection('values').getFullList({
				sort: 'sort_order'
			});
			values = valuesData;
		} catch (err) {
			console.error('Error fetching data:', err);
		} finally {
			loading = false;
		}
	});

	function formatDate(date: string) {
		if (!date) return '';
		return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
	}

	function formatPeriod(exp: any) {
		const start = formatDate(exp.start_date);
		const end = exp.current ? 'Present' : formatDate(exp.end_date);
		return `${start} - ${end}`;
	}

	// Group skills by category
	const groupedSkills = $derived(() => {
		const groups: Record<string, any[]> = {};
		skills.forEach(skill => {
			if (!groups[skill.category]) {
				groups[skill.category] = [];
			}
			groups[skill.category].push(skill);
		});
		return groups;
	});
</script>

<SEO
	title="About Me - Aliu Ifeoluwa Philemon"
	description="Learn about Aliu Ifeoluwa Philemon's journey in music ministry, media production, and community empowerment. Over 10 years of experience in sound engineering, video production, and creative training programs."
	image="/logo.png"
	url="https://pfmm.com/about"
	type="profile"
	keywords={['Aliu Ifeoluwa Philemon', 'music producer', 'sound engineer', 'media professional', 'creative mentor', 'ministry leader']}
/>
<StructuredData type="Person" />

<!-- Hero Section -->
<section class="relative pt-32 pb-20 overflow-hidden">
	<!-- Background Image -->
	<div class="absolute inset-0">
		<img
			src="/hero/about-hero.jpg"
			alt="About Aliu Ifeoluwa Philemon"
			class="w-full h-full object-cover"
		/>
		<!-- Gradient Overlays -->
		<div class="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/70 to-dark-900/90"></div>
		<div class="absolute inset-0 bg-gradient-to-r from-dark-900/60 via-transparent to-dark-900/60"></div>
	</div>

	<!-- Content -->
	<div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-5xl mx-auto text-center">
			<div class="text-6xl mb-6 animate-bounce-slow">🎙️</div>
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-100 mb-6">
				<span class="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
					Vision. Creativity. Empowerment.
				</span>
			</h1>
			<p class="text-xl text-dark-300 max-w-3xl mx-auto leading-relaxed">
				I am Aliu Ifeoluwa Philemon, a multidisciplinary creative professional with extensive experience in media production, sound engineering, creative education, and community development.
			</p>
		</div>
	</div>
</section>

<!-- Main Story -->
<section class="py-20 bg-dark-900">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-4xl mx-auto">
			<Animate variant="fade" duration={0.8}>
				<div class="prose prose-invert prose-lg max-w-none">
					<div class="bg-dark-800 border border-primary-600/30 rounded-2xl p-8 md:p-12">
						<p class="text-dark-200 leading-relaxed mb-6">
							I currently lead <span class="text-primary-400 font-semibold">Preaching Fingers Music and Multimedia</span>, where I specialize in music production, video editing, live sound, and media strategy. My work spans studio recordings, live events, and comprehensive media solutions for clients across Nigeria and beyond.
						</p>
						<p class="text-dark-200 leading-relaxed mb-6">
							As Program Coordinator at <span class="text-primary-400 font-semibold">Jesutofunwa Empowerment Foundation</span> and Director at <span class="text-primary-400 font-semibold">SASIF and ZEDD Empowerment Foundation</span>, I am dedicated to youth empowerment, creative skill acquisition, and sustainable community growth.
						</p>
						<p class="text-dark-200 leading-relaxed">
							My work bridges art, innovation, and social impact, empowering individuals and communities through training programs, creative media, and international collaborations.
						</p>
					</div>
				</div>
			</Animate>
		</div>
	</div>
</section>

<!-- Professional Experience -->
<section class="py-20 bg-dark-800/30">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<Animate variant="slide-up" duration={0.8}>
			<div class="text-center mb-16">
				<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-100 mb-4">
					Professional Experience
				</h2>
				<p class="text-lg text-dark-300">
					Leading organizations dedicated to creative excellence
				</p>
			</div>
		</Animate>

		{#if loading}
			<div class="text-center text-dark-400">Loading experiences...</div>
		{:else if experiences.length > 0}
			<div class="max-w-5xl mx-auto space-y-8">
				{#each experiences as exp, i}
					<Animate variant="slide-up" duration={0.6} delay={i * 0.15}>
						<div class="bg-dark-800 border border-primary-600/30 rounded-2xl p-8 hover:border-primary-600 transition-all duration-300 hover:shadow-xl">
						<div class="flex flex-col md:flex-row md:items-start md:space-x-6">
							<div class="text-5xl mb-4 md:mb-0">💼</div>
							<div class="flex-1">
								<div class="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
									<h3 class="text-2xl font-bold text-primary-400 mb-2 md:mb-0">
										{exp.organization}
									</h3>
									<span class="text-accent-400 text-sm font-medium">{formatPeriod(exp)}</span>
								</div>
								<div class="text-dark-200 font-medium mb-3">{exp.role}</div>
								{#if exp.description}
									<p class="text-dark-400 leading-relaxed">{exp.description}</p>
								{/if}
							</div>
						</div>
						</div>
					</Animate>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- Skills & Expertise -->
<section class="py-20 bg-dark-900">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<Animate variant="slide-up" duration={0.8}>
			<div class="text-center mb-16">
				<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-100 mb-4">
					Skills & Expertise
				</h2>
				<p class="text-lg text-dark-300">
					Comprehensive creative and technical capabilities
				</p>
			</div>
		</Animate>

		{#if loading}
			<div class="text-center text-dark-400">Loading skills...</div>
		{:else if skills.length > 0}
			<div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
				{#each Object.entries(groupedSkills()) as [category, categorySkills], i}
					<Animate variant="slide-up" duration={0.6} delay={i * 0.1}>
						<div class="bg-dark-800 border border-primary-600/30 rounded-2xl p-8">
						<h3 class="text-2xl font-bold text-primary-400 mb-6">
							{category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
						</h3>
						<ul class="space-y-3">
							{#each categorySkills as skill}
								<li class="flex items-center space-x-3 text-dark-200">
									<svg class="w-5 h-5 text-accent-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
									</svg>
									<span>{skill.name}</span>
								</li>
							{/each}
						</ul>
						</div>
					</Animate>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- Core Values -->
<section class="py-20 bg-dark-800/30">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<Animate variant="slide-up" duration={0.8}>
			<div class="text-center mb-16">
				<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-100 mb-4">
					Core Values
				</h2>
				<p class="text-lg text-dark-300">
					The principles that guide my work
				</p>
			</div>
		</Animate>

		{#if loading}
			<div class="text-center text-dark-400">Loading values...</div>
		{:else if values.length > 0}
			<div class="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each values as value, i}
					<Animate variant="scale" duration={0.6} delay={i * 0.1}>
						<div class="text-center p-8 bg-dark-800 border border-primary-600/30 rounded-2xl hover:border-primary-600 transition-all duration-300 hover:-translate-y-2">
						{#if value.icon}
							<div class="text-5xl mb-4">{value.icon}</div>
						{/if}
						<h3 class="text-xl font-bold text-primary-400 mb-3">
							{value.title}
						</h3>
						<p class="text-dark-400 text-sm leading-relaxed">
							{value.description}
						</p>
						</div>
					</Animate>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- CTA Section -->
<section class="py-20 bg-gradient-to-r from-primary-900/20 via-accent-900/20 to-primary-900/20">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
		<Animate variant="scale" duration={0.8}>
			<h2 class="text-3xl md:text-4xl font-bold text-dark-100 mb-6">
				Let's Create Something Amazing Together
			</h2>
			<p class="text-lg text-dark-300 max-w-2xl mx-auto mb-8">
				Ready to bring your creative vision to life or empower your community through media?
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a
					href="/portfolio"
					class="px-8 py-4 bg-dark-800 text-primary-400 border-2 border-primary-600 rounded-xl font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300"
				>
					View My Work
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
