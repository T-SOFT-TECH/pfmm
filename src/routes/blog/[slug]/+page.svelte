<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { pb } from "$lib/pocketbase";
	import SEO from "$lib/components/SEO.svelte";

	let post = $state<any>(null);
	let loading = $state(true);
	let error = $state("");
	let readingProgress = $state(0);
	let relatedPosts = $state<any[]>([]);

	// Get slug from the page store
	let slug = $derived($page.params.slug);

	onMount(async () => {
		await loadPost();
		setupScrollProgress();
	});

	async function loadPost() {
		try {
			loading = true;
			// Filter by slug
			const result = await pb
				.collection("blog")
				.getFirstListItem(`slug="${slug}"`, {
					expand: "author",
				});
			post = result;

			// Load related posts
			const related = await pb.collection("blog").getList(1, 3, {
				filter: `status = "published" && id != "${result.id}" && category = "${result.category}"`,
				sort: "-published_date",
			});
			relatedPosts = related.items;
		} catch (err: any) {
			console.error("Error fetching post:", err);
			error = "Post not found or could not be loaded.";
		} finally {
			loading = false;
		}
	}

	function setupScrollProgress() {
		const updateProgress = () => {
			const article = document.querySelector(".article-content");
			if (!article) return;

			const articleRect = article.getBoundingClientRect();
			const articleTop = articleRect.top + window.scrollY;
			const articleHeight = articleRect.height;
			const windowHeight = window.innerHeight;
			const scrolled = window.scrollY - articleTop + windowHeight * 0.3;
			const progress = Math.min(
				100,
				Math.max(0, (scrolled / articleHeight) * 100),
			);
			readingProgress = progress;
		};

		window.addEventListener("scroll", updateProgress);
		return () => window.removeEventListener("scroll", updateProgress);
	}

	function getImageUrl(record: any) {
		if (!record || !record.featured_image) return "/hero/blog-hero.jpg";
		return pb.files.getUrl(record, record.featured_image);
	}

	function formatDate(date: string) {
		if (!date) return "";
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
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

	function shareOnTwitter() {
		const url = encodeURIComponent(window.location.href);
		const text = encodeURIComponent(post.title);
		window.open(
			`https://twitter.com/intent/tweet?url=${url}&text=${text}`,
			"_blank",
		);
	}

	function shareOnLinkedIn() {
		const url = encodeURIComponent(window.location.href);
		window.open(
			`https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
			"_blank",
		);
	}

	function copyLink() {
		navigator.clipboard.writeText(window.location.href);
	}
</script>

<svelte:head>
	{#if post}
		<title>{post.title} - PFMM Blog</title>
	{:else}
		<title>Blog Post - PFMM</title>
	{/if}
</svelte:head>

{#if post}
	<SEO
		title={post.title}
		description={post.excerpt}
		image={post.featured_image ? getImageUrl(post) : "/logo.png"}
		url={`https://pfmm.com/blog/${slug}`}
		type="article"
	/>
{/if}

<!-- Reading Progress Bar -->
<div
	class="fixed top-0 left-0 right-0 h-1 bg-dark-800 z-50"
	style="opacity: {readingProgress > 0 ? 1 : 0}"
>
	<div
		class="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-150 ease-out"
		style="width: {readingProgress}%"
	></div>
</div>

<div class="min-h-screen bg-dark-950">
	<!-- Atmospheric Background -->
	<div class="fixed inset-0 pointer-events-none">
		<div
			class="absolute top-1/4 right-0 w-[600px] h-[600px] bg-primary-600/3 rounded-full blur-[150px]"
		></div>
		<div
			class="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-accent-600/3 rounded-full blur-[120px]"
		></div>
	</div>

	{#if loading}
		<div
			class="flex items-center justify-center min-h-screen relative z-10"
		>
			<div class="flex flex-col items-center gap-4">
				<div class="relative">
					<div
						class="w-16 h-16 rounded-full border-2 border-dark-700"
					></div>
					<div
						class="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-primary-500 animate-spin"
					></div>
				</div>
				<p class="text-dark-500 text-sm tracking-wide">
					Loading article...
				</p>
			</div>
		</div>
	{:else if error}
		<div
			class="container mx-auto px-4 text-center py-32 relative z-10 pt-40"
		>
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
						d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
			<h1 class="text-3xl font-bold text-dark-100 mb-4">{error}</h1>
			<a
				href="/blog"
				class="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors font-medium"
			>
				<svg
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
				Back to all posts
			</a>
		</div>
	{:else if post}
		<article class="relative z-10">
			<!-- Hero Section -->
			<header class="relative pt-32 pb-16 overflow-hidden">
				<div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
					<!-- Back Link -->
					<a
						href="/blog"
						class="inline-flex items-center gap-2 text-dark-400 hover:text-primary-400 transition-colors mb-12 group"
					>
						<svg
							class="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						<span class="text-sm font-medium">Back to Journal</span>
					</a>

					<!-- Meta Info -->
					<div class="flex flex-wrap items-center gap-4 mb-8">
						<span
							class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r {getCategoryColor(
								post.category,
							)} text-white"
						>
							{post.category}
						</span>
						<div
							class="flex items-center gap-6 text-sm text-dark-400"
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
										post.published_date || post.created,
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
								<span>{post.read_time || 5} min read</span>
							</div>
						</div>
					</div>

					<!-- Title -->
					<h1
						class="article-title text-4xl md:text-5xl lg:text-6xl font-black text-dark-100 leading-[1.1] tracking-tight mb-10"
					>
						{post.title}
					</h1>

					<!-- Excerpt -->
					<p
						class="text-xl md:text-2xl text-dark-400 leading-relaxed max-w-3xl font-light"
					>
						{post.excerpt}
					</p>
				</div>
			</header>

			<!-- Featured Image -->
			{#if post.featured_image}
				<div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl mb-16">
					<div
						class="relative aspect-[21/9] rounded-3xl overflow-hidden bg-dark-800 shadow-2xl shadow-dark-950/50"
					>
						<img
							src={getImageUrl(post)}
							alt={post.title}
							class="w-full h-full object-cover"
						/>
						<div
							class="absolute inset-0 bg-gradient-to-t from-dark-950/20 to-transparent"
						></div>
					</div>
				</div>
			{/if}

			<!-- Content -->
			<div
				class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl article-content"
			>
				<div
					class="prose prose-lg prose-invert max-w-none
                    prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-dark-100
                    prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6
                    prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4
                    prose-p:text-dark-300 prose-p:leading-relaxed prose-p:text-lg
                    prose-a:text-primary-400 prose-a:no-underline hover:prose-a:text-primary-300 prose-a:transition-colors
                    prose-strong:text-dark-100 prose-strong:font-semibold
                    prose-code:text-primary-300 prose-code:bg-dark-800 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                    prose-pre:bg-dark-800 prose-pre:border prose-pre:border-dark-700 prose-pre:rounded-xl
                    prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-dark-900/50 prose-blockquote:rounded-r-xl prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic
                    prose-blockquote:text-dark-300
                    prose-ul:text-dark-300 prose-ol:text-dark-300
                    prose-li:marker:text-primary-500
                    prose-img:rounded-2xl prose-img:shadow-xl"
				>
					{@html post.content}
				</div>

				<!-- Tags -->
				{#if post.tags && post.tags.length > 0}
					<div class="mt-16 pt-8 border-t border-dark-800/50">
						<div class="flex flex-wrap gap-2">
							{#each typeof post.tags === "string" ? JSON.parse(post.tags) : post.tags as tag}
								<span
									class="px-4 py-2 bg-dark-800/50 text-dark-400 rounded-lg text-sm font-medium border border-dark-700/50 hover:border-primary-600/30 hover:text-primary-400 transition-all cursor-default"
								>
									#{tag}
								</span>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Share Section -->
				<div
					class="mt-12 p-8 bg-dark-900/50 rounded-2xl border border-dark-800/50"
				>
					<div
						class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
					>
						<div>
							<p class="text-dark-500 text-sm mb-1">
								Enjoyed this article?
							</p>
							<p class="text-dark-200 font-medium">
								Share it with your network
							</p>
						</div>
						<div class="flex items-center gap-3">
							<button
								onclick={shareOnTwitter}
								class="w-11 h-11 flex items-center justify-center rounded-xl bg-dark-800 text-dark-400 hover:text-white hover:bg-[#1DA1F2] transition-all duration-300"
								title="Share on Twitter"
							>
								<svg
									class="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
									/>
								</svg>
							</button>
							<button
								onclick={shareOnLinkedIn}
								class="w-11 h-11 flex items-center justify-center rounded-xl bg-dark-800 text-dark-400 hover:text-white hover:bg-[#0A66C2] transition-all duration-300"
								title="Share on LinkedIn"
							>
								<svg
									class="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
									/>
								</svg>
							</button>
							<button
								onclick={copyLink}
								class="w-11 h-11 flex items-center justify-center rounded-xl bg-dark-800 text-dark-400 hover:text-primary-400 hover:bg-dark-700 transition-all duration-300"
								title="Copy link"
							>
								<svg
									class="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>

				<!-- Author Box -->
				<div
					class="mt-8 p-8 bg-gradient-to-br from-dark-900 to-dark-900/50 rounded-2xl border border-dark-800/50"
				>
					<div class="flex items-start gap-6">
						<div
							class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
						>
							{(post.expand?.author?.name || "P")[0]}
						</div>
						<div class="flex-1">
							<p class="text-dark-500 text-sm mb-1">Written by</p>
							<h3 class="text-xl font-bold text-dark-100 mb-2">
								{post.expand?.author?.name || "PFMM Team"}
							</h3>
							<p class="text-dark-400 text-sm leading-relaxed">
								Sharing insights on creativity, media
								production, and empowerment through faith-driven
								work.
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Related Posts -->
			{#if relatedPosts.length > 0}
				<section class="py-24">
					<div
						class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl"
					>
						<div class="flex items-center gap-4 mb-12">
							<h2
								class="text-2xl font-bold text-dark-200 tracking-tight"
							>
								Related Stories
							</h2>
							<div class="flex-1 h-px bg-dark-800"></div>
						</div>

						<div class="grid md:grid-cols-3 gap-8">
							{#each relatedPosts as relatedPost}
								<a
									href={`/blog/${relatedPost.slug}`}
									class="group block bg-dark-900/50 border border-dark-800/50 rounded-2xl overflow-hidden hover:border-primary-600/30 transition-all duration-500"
								>
									<div
										class="aspect-[16/10] overflow-hidden relative"
									>
										<img
											src={getImageUrl(relatedPost)}
											alt={relatedPost.title}
											class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
										/>
										<div
											class="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent"
										></div>
									</div>
									<div class="p-6">
										<time
											class="text-xs text-dark-500 font-medium"
										>
											{formatDate(
												relatedPost.published_date ||
													relatedPost.created,
											)}
										</time>
										<h3
											class="text-lg font-bold text-dark-100 mt-2 group-hover:text-primary-400 transition-colors line-clamp-2"
										>
											{relatedPost.title}
										</h3>
									</div>
								</a>
							{/each}
						</div>
					</div>
				</section>
			{/if}

			<!-- CTA Section -->
			<section class="py-20 relative overflow-hidden">
				<div class="absolute inset-0 bg-dark-900"></div>
				<div
					class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-600/30 to-transparent"
				></div>

				<div
					class="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center"
				>
					<h2
						class="text-3xl md:text-4xl font-bold text-dark-100 mb-6"
					>
						Want more insights?
					</h2>
					<p class="text-lg text-dark-400 mb-8">
						Explore more articles on creativity, media, and
						empowerment.
					</p>
					<a
						href="/blog"
						class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-600/25 hover:-translate-y-0.5 transition-all duration-300"
					>
						<span>Browse All Articles</span>
						<svg
							class="w-5 h-5"
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
					</a>
				</div>
			</section>
		</article>
	{/if}
</div>

<style>
	@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap");

	:global(.article-title) {
		font-family: "Outfit", system-ui, sans-serif;
	}

	/* Smooth content fade in */
	.article-content {
		animation: fadeIn 0.8s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Custom selection color */
	:global(.article-content ::selection) {
		background: rgba(var(--color-primary-500), 0.3);
	}
</style>
