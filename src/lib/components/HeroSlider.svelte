<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut, backOut, elasticOut } from 'svelte/easing';

	const slides = [
		{
			image: '/hero/adi-goldstein-sdtnZ4LgbWk-unsplash.jpg',
			title: 'Creativity that empowers.',
			subtitle: 'Media that transforms.',
			imageEffect: 'zoom-in',
			textEffect: 'slide-left'
		},
		{
			image: '/hero/caught-in-joy-ptVBlniJi50-unsplash.jpg',
			title: 'Sound. Storytelling. Innovation.',
			subtitle: 'Inspiring the next generation of creators.',
			imageEffect: 'zoom-out',
			textEffect: 'slide-right'
		},
		{
			image: '/hero/caught-in-joy-PukZSAi_K5o-unsplash.jpg',
			title: 'Empowering Communities.',
			subtitle: 'Through creative media and training.',
			imageEffect: 'pan-left',
			textEffect: 'slide-bottom'
		},
		{
			image: '/hero/panagiotis-falcos-aR5wLLNdt54-unsplash.jpg',
			title: 'Excellence in Production.',
			subtitle: 'From concept to completion.',
			imageEffect: 'pan-right',
			textEffect: 'scale-fade'
		}
	];

	let currentSlide = $state(0);
	let isPlaying = $state(true);
	let interval: ReturnType<typeof setInterval> | null = null;
	let textAnimationKey = $state(0);

	function nextSlide() {
		currentSlide = (currentSlide + 1) % slides.length;
		textAnimationKey++;
	}

	function prevSlide() {
		currentSlide = (currentSlide - 1 + slides.length) % slides.length;
		textAnimationKey++;
	}

	function goToSlide(index: number) {
		currentSlide = index;
		textAnimationKey++;
	}

	function togglePlayPause() {
		isPlaying = !isPlaying;
		if (isPlaying) {
			startAutoPlay();
		} else {
			stopAutoPlay();
		}
	}

	function startAutoPlay() {
		stopAutoPlay();
		interval = setInterval(() => {
			nextSlide();
		}, 5000);
	}

	function stopAutoPlay() {
		if (interval) {
			clearInterval(interval);
			interval = null;
		}
	}

	onMount(() => {
		if (isPlaying) {
			startAutoPlay();
		}
	});

	onDestroy(() => {
		stopAutoPlay();
	});
</script>

<div class="relative h-screen w-full overflow-hidden">
	<!-- Background Slides -->
	{#each slides as slide, index (index)}
		{#if index === currentSlide}
			<div
				class="absolute inset-0"
				in:fade={{ duration: 1000, easing: quintOut }}
				out:fade={{ duration: 500 }}
			>
				<!-- Image with different effects for each slide -->
				<div class="absolute inset-0 animate-{slide.imageEffect}">
					<img
						src={slide.image}
						alt={slide.title}
						class="w-full h-full object-cover"
					/>
				</div>

				<!-- Gradient Overlay -->
				<div class="absolute inset-0 bg-gradient-to-b from-dark-900/70 via-dark-900/50 to-dark-900/90"></div>
				<div class="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-transparent to-dark-900/80"></div>
			</div>
		{/if}
	{/each}

	<!-- Content Container -->
	<div class="relative h-full flex items-center justify-center z-10">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="max-w-5xl mx-auto text-center">
				{#key textAnimationKey}
					<div class="space-y-8">
						<!-- Logo/Icon -->
						<div
							in:scale={{ delay: 200, duration: 600, easing: backOut, start: 0.5 }}
							class="text-6xl sm:text-7xl md:text-8xl animate-float mb-8"
						>
							🎧
						</div>

						<!-- Main Title -->
						<h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
							<!-- Animated Title -->
							<span
								class="block mb-4 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent animate-gradient-shift"
								in:fly={{ delay: 300, duration: 800, y: 30, easing: quintOut }}
							>
								{slides[currentSlide].title}
							</span>

							<!-- Animated Subtitle -->
							<span
								class="block text-dark-100"
								in:fly={{ delay: 500, duration: 800, y: 30, easing: quintOut }}
							>
								{slides[currentSlide].subtitle}
							</span>
						</h1>

						<!-- Description -->
						<p
							in:fly={{ delay: 700, duration: 800, y: 30, easing: quintOut }}
							class="text-lg sm:text-xl md:text-2xl text-dark-300 max-w-3xl mx-auto leading-relaxed px-4"
						>
							Welcome to the official website of <span class="text-primary-400 font-semibold">Aliu Ifeoluwa Philemon</span> — a creative media producer, educator, and empowerment advocate.
						</p>

						<!-- CTA Buttons -->
						<div
							in:fly={{ delay: 900, duration: 800, y: 30, easing: quintOut }}
							class="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
						>
							<a
								href="/portfolio"
								class="group px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold text-lg hover:from-primary-500 hover:to-accent-500 transition-all duration-300 shadow-2xl hover:shadow-primary-600/50 hover:scale-105 flex items-center space-x-2"
							>
								<span>Explore My Work</span>
								<svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
								</svg>
							</a>
							<a
								href="/contact"
								class="px-8 py-4 bg-dark-800/80 backdrop-blur-sm text-primary-400 border-2 border-primary-600 rounded-xl font-semibold text-lg hover:bg-primary-600 hover:text-white transition-all duration-300 hover:scale-105"
							>
								Get in Touch
							</a>
						</div>
					</div>
				{/key}
			</div>
		</div>
	</div>

	<!-- Navigation Controls -->
	<div class="absolute bottom-8 left-0 right-0 z-20">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-center space-x-4">
				<!-- Previous Button -->
				<button
					onclick={prevSlide}
					class="w-12 h-12 rounded-full bg-dark-800/80 backdrop-blur-sm border border-dark-700 hover:border-primary-600 text-dark-300 hover:text-primary-400 transition-all duration-200 flex items-center justify-center group"
					aria-label="Previous slide"
				>
					<svg class="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
				</button>

				<!-- Slide Indicators -->
				<div class="flex space-x-3">
					{#each slides as _, index (index)}
						<button
							onclick={() => goToSlide(index)}
							class="group relative"
							aria-label="Go to slide {index + 1}"
						>
							<div class="w-12 h-1 bg-dark-700 rounded-full overflow-hidden">
								<div
									class="h-full bg-gradient-to-r from-primary-600 to-accent-600 transition-all duration-300"
									class:w-full={index === currentSlide}
									class:w-0={index !== currentSlide}
								></div>
							</div>
						</button>
					{/each}
				</div>

				<!-- Next Button -->
				<button
					onclick={nextSlide}
					class="w-12 h-12 rounded-full bg-dark-800/80 backdrop-blur-sm border border-dark-700 hover:border-primary-600 text-dark-300 hover:text-primary-400 transition-all duration-200 flex items-center justify-center group"
					aria-label="Next slide"
				>
					<svg class="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</button>

				<!-- Play/Pause Button -->
				<button
					onclick={togglePlayPause}
					class="ml-4 w-12 h-12 rounded-full bg-dark-800/80 backdrop-blur-sm border border-dark-700 hover:border-primary-600 text-dark-300 hover:text-primary-400 transition-all duration-200 flex items-center justify-center"
					aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
				>
					{#if isPlaying}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
						</svg>
					{:else}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M8 5v14l11-7z"/>
						</svg>
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Scroll Indicator -->
	<div class="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 animate-bounce">
		<a
			href="#content"
			class="flex flex-col items-center space-y-2 text-dark-400 hover:text-primary-400 transition-colors"
		>
			<span class="text-xs uppercase tracking-wider">Scroll Down</span>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
			</svg>
		</a>
	</div>
</div>

<style>
	/* Image Effect 1: Zoom In - Ken Burns style zoom in */
	@keyframes zoom-in {
		0% {
			transform: scale(1) translate(0, 0);
		}
		100% {
			transform: scale(1.15) translate(-3%, -3%);
		}
	}

	.animate-zoom-in {
		animation: zoom-in 20s ease-out infinite alternate;
	}

	/* Image Effect 2: Zoom Out - Reverse Ken Burns */
	@keyframes zoom-out {
		0% {
			transform: scale(1.15) translate(3%, 3%);
		}
		100% {
			transform: scale(1) translate(0, 0);
		}
	}

	.animate-zoom-out {
		animation: zoom-out 20s ease-out infinite alternate;
	}

	/* Image Effect 3: Pan Left - Horizontal pan to the left */
	@keyframes pan-left {
		0% {
			transform: scale(1.1) translateX(0);
		}
		100% {
			transform: scale(1.1) translateX(-5%);
		}
	}

	.animate-pan-left {
		animation: pan-left 20s ease-in-out infinite alternate;
	}

	/* Image Effect 4: Pan Right - Horizontal pan to the right */
	@keyframes pan-right {
		0% {
			transform: scale(1.1) translateX(-5%);
		}
		100% {
			transform: scale(1.1) translateX(0);
		}
	}

	.animate-pan-right {
		animation: pan-right 20s ease-in-out infinite alternate;
	}

	/* Float Animation for Icon */
	@keyframes float {
		0%, 100% {
			transform: translateY(0) rotate(0deg);
		}
		25% {
			transform: translateY(-10px) rotate(-2deg);
		}
		50% {
			transform: translateY(-20px) rotate(0deg);
		}
		75% {
			transform: translateY(-10px) rotate(2deg);
		}
	}

	.animate-float {
		animation: float 6s ease-in-out infinite;
	}

	/* Gradient Shift Animation for Text */
	@keyframes gradient-shift {
		0%, 100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}

	.animate-gradient-shift {
		background-size: 200% auto;
		animation: gradient-shift 3s ease infinite;
	}
</style>
