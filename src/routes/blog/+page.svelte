<script lang="ts">
	import { onMount } from "svelte";
	import { pb } from "$lib/pocketbase";
	import Animate from "$lib/components/Animate.svelte";
	import SEO from "$lib/components/SEO.svelte";

	let posts = $state<any[]>([]);
	let loading = $state(true);

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

	function getReadTime(post: any) {
		return post.read_time ? `${post.read_time} min read` : "5 min read";
	}
</script>

<SEO
	title="Blog & Insights"
	description="Read articles, stories, and insights about music ministry, media production, creative empowerment, and faith-driven work. Expert perspectives on sound engineering, video production, and community development."
	image="/logo.png"
	url="https://pfmusicmedia.com.ng/blog"
	keywords={[
		"music ministry blog",
		"media production insights",
		"sound engineering tips",
		"creative empowerment",
		"faith and creativity",
		"ministry leadership",
	]}
/>

<!-- Hero Section -->
<section class="relative pt-32 pb-20 overflow-hidden">
	<!-- Background Image -->
	<div class="absolute inset-0">
		<img
			src="/hero/blog-hero.jpg"
			alt="Blog and Insights"
			class="w-full h-full object-cover"
		/>
		<!-- Gradient Overlays -->
		<div
			class="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/70 to-dark-900/90"
		></div>
		<div
			class="absolute inset-0 bg-gradient-to-r from-dark-900/60 via-transparent to-dark-900/60"
		></div>
	</div>

	<!-- Content -->
	<div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-5xl mx-auto text-center">
			<div class="text-6xl mb-6">📝</div>
			<h1
				class="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-100 mb-6"
			>
				<span
					class="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent"
				>
					Thoughts on Creativity, Purpose, and Global Growth
				</span>
			</h1>
			<p class="text-xl text-dark-300 max-w-3xl mx-auto leading-relaxed">
				I share reflections and practical insights on creative
				entrepreneurship, digital innovation, and community empowerment
				— inspiring others to pursue excellence and social impact
				through their craft.
			</p>
		</div>
	</div>
</section>

<!-- Blog Posts Grid -->
<section class="py-20 bg-dark-900">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		{#if loading}
			<div class="text-center py-20">
				<p class="text-dark-400 text-lg">Loading blog posts...</p>
			</div>
		{:else if posts.length > 0}
			<div
				class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
			>
				{#each posts as post, i}
					<Animate variant="slide-up" duration={0.6} delay={i * 0.1}>
						<article
							class="group bg-dark-800 border border-primary-600/30 rounded-2xl overflow-hidden hover:border-primary-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full"
						>
							<!-- Featured Image -->
							<a
								href={`/blog/${post.slug}`}
								class="aspect-video bg-dark-700 overflow-hidden block"
							>
								<img
									src={getImageUrl(post)}
									alt={post.title}
									class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
								/>
							</a>

							<!-- Post Content -->
							<div class="p-6 flex flex-col flex-1">
								<div
									class="flex items-center space-x-3 text-sm text-dark-400 mb-3"
								>
									<span
										class="px-3 py-1 bg-primary-600/20 text-primary-400 rounded-full"
									>
										{post.category}
									</span>
									<span>{getReadTime(post)}</span>
								</div>

								<a
									href={`/blog/${post.slug}`}
									class="block mb-3"
								>
									<h2
										class="text-xl font-bold text-dark-100 group-hover:text-primary-400 transition-colors line-clamp-2"
									>
										{post.title}
									</h2>
								</a>

								<p
									class="text-dark-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1"
								>
									{post.excerpt}
								</p>

								<div
									class="flex items-center justify-between pt-4 border-t border-dark-700 mt-auto"
								>
									<time class="text-xs text-dark-500"
										>{formatDate(
											post.published_date || post.created,
										)}</time
									>
									<a
										href={`/blog/${post.slug}`}
										class="text-accent-400 text-sm font-medium flex items-center space-x-1 group-hover:space-x-2 transition-all"
									>
										<span>Read More</span>
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
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</a>
								</div>
							</div>
						</article>
					</Animate>
				{/each}
			</div>
		{:else}
			<div class="mt-16 text-center">
				<p class="text-dark-400 text-lg">
					More articles coming soon. Stay tuned for insights on
					creativity and empowerment.
				</p>
			</div>
		{/if}
	</div>
</section>

<!-- Newsletter Signup -->
<section
	class="py-20 bg-gradient-to-r from-primary-900/20 via-accent-900/20 to-primary-900/20"
>
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-3xl mx-auto text-center">
			<Animate variant="scale" duration={0.8}>
				<h2 class="text-3xl md:text-4xl font-bold text-dark-100 mb-6">
					Stay Updated
				</h2>
				<p class="text-lg text-dark-300 mb-8">
					Subscribe to get the latest insights on creativity, media,
					and empowerment delivered to your inbox.
				</p>
				<form class="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
					<input
						type="email"
						placeholder="your.email@example.com"
						class="flex-1 px-6 py-4 bg-dark-800 border border-dark-700 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-600 transition-colors"
					/>
					<button
						type="submit"
						class="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:from-primary-500 hover:to-accent-500 transition-all duration-300 shadow-lg whitespace-nowrap"
					>
						Subscribe
					</button>
				</form>
			</Animate>
		</div>
	</div>
</section>
