<script lang="ts">
	import { onMount } from "svelte";
	import { pb } from "$lib/pocketbase";
	import SEO from "$lib/components/SEO.svelte";

	let posts = $state<any[]>([]);
	let loading = $state(true);
	let activeCategory = $state("all");
	let searchQuery = $state("");

	// Get unique categories from posts
	let categories = $derived(() => {
		const cats = new Set(posts.map((p) => p.category));
		return ["all", ...Array.from(cats)];
	});

	// Filter posts based on category and search
	let filteredPosts = $derived(() => {
		return posts.filter((post) => {
			const matchesCategory =
				activeCategory === "all" || post.category === activeCategory;
			const matchesSearch =
				searchQuery === "" ||
				post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesCategory && matchesSearch;
		});
	});

	// Featured post (first/latest)
	let featuredPost = $derived(() => filteredPosts()[0]);

	// Remaining posts
	let remainingPosts = $derived(() => filteredPosts().slice(1));

	onMount(async () => {
		try {
			const postsData = await pb.collection("blog").getFullList({
				filter: 'status = "published"',
				sort: "-published_date,-created",
				expand: "author",
			});
			posts = postsData;
		} catch (err) {
			console.error("Error fetching blog posts:", err);
		} finally {
			loading = false;
		}
	});

	function getImageUrl(post: any) {
		if (!post.featured_image) return "/logo.png";
		return pb.files.getUrl(post, post.featured_image);
	}

	function formatDate(date: string) {
		if (!date) return "";
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}

	function formatDateShort(date: string) {
		if (!date) return "";
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	}

	function getReadTime(post: any) {
		return post.read_time || 5;
	}

	function getCategoryColor(category: string) {
		const colors: Record<string, string> = {
			music: "from-primary-500 to-primary-600",
			ministry: "from-secondary-500 to-secondary-600",
			technology: "from-accent-500 to-accent-600",
			training: "from-emerald-500 to-emerald-600",
			lifestyle: "from-violet-500 to-violet-600",
		};
		return colors[category] || "from-primary-500 to-accent-500";
	}
</script>

<SEO
	title="Blog & Insights"
	description="Read articles, stories, and insights about music ministry, media production, creative empowerment, and faith-driven work."
	image="/logo.png"
	url="https://pfmusicmedia.com.ng/blog"
	keywords={[
		"music ministry blog",
		"media production insights",
		"sound engineering tips",
		"creative empowerment",
	]}
/>

<div class="min-h-screen bg-dark-950 overflow-hidden">
	<!-- Atmospheric Background -->
	<div class="fixed inset-0 pointer-events-none">
		<div
			class="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary-600/5 rounded-full blur-[150px]"
		></div>
		<div
			class="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-600/5 rounded-full blur-[120px]"
		></div>
		<div
			class="absolute inset-0 opacity-[0.015]"
			style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E');"
		></div>
	</div>

	<!-- Hero Section -->
	<section class="relative pt-32 pb-16">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Header -->
			<div class="max-w-4xl mb-16">
				<div class="flex items-center gap-3 mb-6">
					<div
						class="w-12 h-[2px] bg-gradient-to-r from-primary-500 to-accent-500"
					></div>
					<span
						class="text-sm font-medium tracking-[0.2em] uppercase text-dark-400"
						>The Journal</span
					>
				</div>
				<h1
					class="blog-title text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-8"
				>
					<span class="text-dark-100">Stories &</span>
					<br />
					<span
						class="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
					>
						Insights
					</span>
				</h1>
				<p
					class="text-xl md:text-2xl text-dark-400 max-w-2xl leading-relaxed font-light"
				>
					Thoughts on creativity, purpose, and building things that
					matter.
				</p>
			</div>

			<!-- Search & Filter Bar -->
			<div
				class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-12 pb-8 border-b border-dark-800/50"
			>
				<!-- Categories -->
				<div class="flex flex-wrap gap-2">
					{#each categories() as category}
						<button
							onclick={() => (activeCategory = category)}
							class="category-pill px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 {activeCategory ===
							category
								? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg shadow-primary-600/25'
								: 'bg-dark-800/50 text-dark-400 hover:bg-dark-800 hover:text-dark-200 border border-dark-700/50'}"
						>
							{category === "all"
								? "All Posts"
								: category.charAt(0).toUpperCase() +
									category.slice(1)}
						</button>
					{/each}
				</div>

				<!-- Search -->
				<div class="relative w-full md:w-72">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search articles..."
						class="w-full px-5 py-3 pl-12 bg-dark-800/50 border border-dark-700/50 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-600/50 focus:bg-dark-800 transition-all duration-300"
					/>
					<svg
						class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
			</div>
		</div>
	</section>

	<!-- Content -->
	{#if loading}
		<section class="py-20">
			<div class="container mx-auto px-4">
				<div class="flex flex-col items-center justify-center gap-4">
					<div class="relative">
						<div
							class="w-16 h-16 rounded-full border-2 border-dark-700"
						></div>
						<div
							class="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-primary-500 animate-spin"
						></div>
					</div>
					<p class="text-dark-500 text-sm tracking-wide">
						Loading stories...
					</p>
				</div>
			</div>
		</section>
	{:else if filteredPosts().length > 0}
		<!-- Featured Post -->
		{#if featuredPost()}
			<section class="pb-20">
				<div class="container mx-auto px-4 sm:px-6 lg:px-8">
					<a
						href={`/blog/${featuredPost().slug}`}
						class="featured-card group block relative rounded-3xl overflow-hidden bg-dark-900 border border-dark-800/50 hover:border-primary-600/30 transition-all duration-500"
					>
						<div
							class="grid lg:grid-cols-2 gap-0 min-h-[500px] lg:min-h-[600px]"
						>
							<!-- Image Side -->
							<div class="relative overflow-hidden">
								<div
									class="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-dark-900 z-10"
								></div>
								<img
									src={getImageUrl(featuredPost())}
									alt={featuredPost().title}
									class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								<!-- Category Badge -->
								<div class="absolute top-6 left-6 z-20">
									<span
										class="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r {getCategoryColor(
											featuredPost().category,
										)} text-white shadow-xl"
									>
										{featuredPost().category}
									</span>
								</div>
							</div>

							<!-- Content Side -->
							<div
								class="relative z-20 flex flex-col justify-center p-8 lg:p-12 xl:p-16"
							>
								<div class="mb-6">
									<span
										class="text-xs font-medium tracking-[0.15em] uppercase text-primary-400"
										>Featured Story</span
									>
								</div>

								<h2
									class="text-3xl md:text-4xl xl:text-5xl font-bold text-dark-100 leading-tight mb-6 group-hover:text-primary-300 transition-colors duration-300"
								>
									{featuredPost().title}
								</h2>

								<p
									class="text-lg text-dark-400 leading-relaxed mb-8 line-clamp-3"
								>
									{featuredPost().excerpt}
								</p>

								<div
									class="flex items-center gap-6 text-sm text-dark-500"
								>
									<div class="flex items-center gap-2">
										<svg
											class="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
										<span
											>{formatDate(
												featuredPost().published_date ||
													featuredPost().created,
											)}</span
										>
									</div>
									<div class="flex items-center gap-2">
										<svg
											class="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<span
											>{getReadTime(featuredPost())} min
											read</span
										>
									</div>
								</div>

								<!-- Read More Arrow -->
								<div
									class="mt-8 flex items-center gap-3 text-primary-400 font-medium"
								>
									<span>Read Article</span>
									<svg
										class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17 8l4 4m0 0l-4 4m4-4H3"
										/>
									</svg>
								</div>
							</div>
						</div>

						<!-- Decorative Corner -->
						<div
							class="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary-600/10 to-transparent rounded-tl-[100px]"
						></div>
					</a>
				</div>
			</section>
		{/if}

		<!-- Posts Grid -->
		{#if remainingPosts().length > 0}
			<section class="pb-24">
				<div class="container mx-auto px-4 sm:px-6 lg:px-8">
					<div class="flex items-center gap-4 mb-12">
						<h2
							class="text-2xl font-bold text-dark-200 tracking-tight"
						>
							More Stories
						</h2>
						<div class="flex-1 h-px bg-dark-800"></div>
						<span class="text-sm text-dark-500"
							>{remainingPosts().length} articles</span
						>
					</div>

					<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{#each remainingPosts() as post, i}
							<article
								class="post-card group relative bg-dark-900/50 border border-dark-800/50 rounded-2xl overflow-hidden hover:border-primary-600/30 hover:bg-dark-900 transition-all duration-500"
								style="animation-delay: {i * 0.1}s"
							>
								<!-- Image -->
								<a
									href={`/blog/${post.slug}`}
									class="block aspect-[16/10] overflow-hidden relative"
								>
									<img
										src={getImageUrl(post)}
										alt={post.title}
										class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
									/>
									<div
										class="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent"
									></div>

									<!-- Category -->
									<div
										class="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide bg-dark-900/80 backdrop-blur-sm text-dark-200 border border-dark-700/50"
									>
										{post.category}
									</div>

									<!-- Read Time Badge -->
									<div
										class="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg text-xs font-medium bg-dark-900/80 backdrop-blur-sm text-dark-300 flex items-center gap-1.5"
									>
										<svg
											class="w-3.5 h-3.5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										{getReadTime(post)} min
									</div>
								</a>

								<!-- Content -->
								<div class="p-6">
									<!-- Date -->
									<time
										class="text-xs text-dark-500 font-medium tracking-wide"
									>
										{formatDate(
											post.published_date || post.created,
										)}
									</time>

									<!-- Title -->
									<a href={`/blog/${post.slug}`} class="block mt-3 mb-4">
										<h3
											class="text-xl font-bold text-dark-100 leading-snug group-hover:text-primary-400 transition-colors duration-300 line-clamp-2"
										>
											{post.title}
										</h3>
									</a>

									<!-- Excerpt -->
									<p
										class="text-dark-400 text-sm leading-relaxed line-clamp-2 mb-6"
									>
										{post.excerpt}
									</p>

									<!-- Read More -->
									<a
										href={`/blog/${post.slug}`}
										class="inline-flex items-center gap-2 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors group/link"
									>
										<span>Continue Reading</span>
										<svg
											class="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</a>
								</div>

								<!-- Hover Glow Effect -->
								<div
									class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
									style="box-shadow: inset 0 0 60px rgba(var(--color-primary-500), 0.03);"
								></div>
							</article>
						{/each}
					</div>
				</div>
			</section>
		{/if}
	{:else}
		<!-- Empty State -->
		<section class="py-32">
			<div class="container mx-auto px-4 text-center">
				<div
					class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-dark-800/50 border border-dark-700/50 mb-8"
				>
					<svg
						class="w-10 h-10 text-dark-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
						/>
					</svg>
				</div>
				<h3 class="text-2xl font-bold text-dark-200 mb-4">
					No stories found
				</h3>
				<p class="text-dark-400 max-w-md mx-auto mb-8">
					{#if searchQuery || activeCategory !== "all"}
						Try adjusting your filters or search terms.
					{:else}
						Stories are coming soon. Check back later for insights on
						creativity and empowerment.
					{/if}
				</p>
				{#if searchQuery || activeCategory !== "all"}
					<button
						onclick={() => {
							searchQuery = "";
							activeCategory = "all";
						}}
						class="px-6 py-3 bg-dark-800 text-dark-200 rounded-xl font-medium hover:bg-dark-700 transition-colors"
					>
						Clear Filters
					</button>
				{/if}
			</div>
		</section>
	{/if}

	<!-- Newsletter Section -->
	<section class="relative py-24 overflow-hidden">
		<!-- Background -->
		<div class="absolute inset-0 bg-dark-900"></div>
		<div
			class="absolute inset-0 bg-gradient-to-b from-primary-950/20 via-dark-900 to-dark-950"
		></div>
		<div
			class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-600/30 to-transparent"
		></div>

		<div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="max-w-3xl mx-auto text-center">
				<div class="inline-flex items-center gap-2 mb-6">
					<div class="w-8 h-px bg-primary-600"></div>
					<span
						class="text-xs font-medium tracking-[0.2em] uppercase text-primary-400"
						>Newsletter</span
					>
					<div class="w-8 h-px bg-primary-600"></div>
				</div>

				<h2
					class="text-3xl md:text-5xl font-bold text-dark-100 mb-6 tracking-tight"
				>
					Stay in the Loop
				</h2>
				<p class="text-lg text-dark-400 mb-10 max-w-xl mx-auto">
					Get the latest insights on creativity, media production, and
					empowerment delivered straight to your inbox.
				</p>

				<form
					class="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
					onsubmit={(e) => e.preventDefault()}
				>
					<input
						type="email"
						placeholder="Enter your email"
						class="flex-1 px-6 py-4 bg-dark-800 border border-dark-700 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 transition-all duration-300"
					/>
					<button
						type="submit"
						class="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-600/25 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
					>
						Subscribe
					</button>
				</form>

				<p class="text-xs text-dark-500 mt-4">
					No spam, unsubscribe anytime.
				</p>
			</div>
		</div>
	</section>
</div>

<style>
	/* Custom Font Import */
	@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&display=swap");

	:global(.blog-title) {
		font-family: "Outfit", system-ui, sans-serif;
	}

	/* Gradient Animation */
	@keyframes gradient {
		0%,
		100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}

	.animate-gradient {
		animation: gradient 6s ease infinite;
	}

	/* Post Card Animation */
	.post-card {
		animation: fadeInUp 0.6s ease-out forwards;
		opacity: 0;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Featured Card Shine Effect */
	.featured-card::before {
		content: "";
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.03),
			transparent
		);
		transition: left 0.7s ease;
		z-index: 30;
		pointer-events: none;
	}

	.featured-card:hover::before {
		left: 100%;
	}

	/* Category Pill Hover */
	.category-pill {
		position: relative;
		overflow: hidden;
	}

	.category-pill::before {
		content: "";
		position: absolute;
		inset: 0;
		background: linear-gradient(
			45deg,
			transparent,
			rgba(255, 255, 255, 0.1),
			transparent
		);
		transform: translateX(-100%);
		transition: transform 0.5s ease;
	}

	.category-pill:hover::before {
		transform: translateX(100%);
	}
</style>
