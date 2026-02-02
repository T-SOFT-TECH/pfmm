<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { pb } from "$lib/pocketbase";
    import { fade } from "svelte/transition";
    import SEO from "$lib/components/SEO.svelte";

    let post = $state<any>(null);
    let loading = $state(true);
    let error = $state("");

    // Get slug from the page store
    let slug = $derived($page.params.slug);

    onMount(async () => {
        loadPost();
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
        } catch (err: any) {
            console.error("Error fetching post:", err);
            error = "Post not found or could not be loaded.";
        } finally {
            loading = false;
        }
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
</script>

<svelte:head>
    {#if post}
        <title>{post.title} - PFMM Blog</title>
    {:else}
        <title>Blog Post - PFMM</title>
    {/if}
</svelte:head>

<!-- SEO Component integration -->
{#if post}
    <SEO
        title={post.title}
        description={post.excerpt}
        image={post.featured_image ? getImageUrl(post) : "/logo.png"}
        url={`https://pfmm.com/blog/${slug}`}
        type="article"
    />
{/if}

<div class="min-h-screen bg-dark-900 pt-32 pb-20">
    {#if loading}
        <div class="flex items-center justify-center min-h-[50vh]">
            <div
                class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"
            ></div>
        </div>
    {:else if error}
        <div class="container mx-auto px-4 text-center py-20">
            <div class="text-6xl mb-6">😕</div>
            <h1 class="text-3xl font-bold text-dark-100 mb-4">Oops! {error}</h1>
            <a
                href="/blog"
                class="text-primary-400 hover:text-primary-300 transition-colors"
            >
                &larr; Back to all posts
            </a>
        </div>
    {:else if post}
        <article
            class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl"
            in:fade
        >
            <!-- Back Link -->
            <a
                href="/blog"
                class="inline-flex items-center space-x-2 text-dark-400 hover:text-primary-400 transition-colors mb-8 group"
            >
                <svg
                    class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
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
                <span>Back to Blog</span>
            </a>

            <!-- Header -->
            <header class="mb-12">
                <div class="flex items-center flex-wrap gap-4 text-sm mb-6">
                    <span
                        class="px-3 py-1 bg-primary-600/20 text-primary-400 rounded-full font-medium capitalize"
                    >
                        {post.category}
                    </span>
                    <span class="text-dark-400 flex items-center">
                        <svg
                            class="w-4 h-4 mr-2"
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
                        {formatDate(post.published_date || post.created)}
                    </span>
                    <span class="text-dark-400 flex items-center">
                        <svg
                            class="w-4 h-4 mr-2"
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
                        {post.read_time || 5} min read
                    </span>
                </div>

                <h1
                    class="text-3xl md:text-5xl font-bold text-dark-100 leading-tight mb-8"
                >
                    {post.title}
                </h1>

                {#if post.featured_image}
                    <div
                        class="aspect-video rounded-2xl overflow-hidden bg-dark-800 shadow-2xl"
                    >
                        <img
                            src={getImageUrl(post)}
                            alt={post.title}
                            class="w-full h-full object-cover"
                        />
                    </div>
                {/if}
            </header>

            <!-- Content -->
            <div
                class="prose prose-lg prose-invert max-w-none prose-headings:text-dark-100 prose-p:text-dark-300 prose-a:text-primary-400 hover:prose-a:text-primary-300 prose-strong:text-dark-100 prose-code:text-primary-300"
            >
                {@html post.content}
            </div>

            <!-- Tags -->
            {#if post.tags}
                <div class="mt-12 pt-8 border-t border-dark-800">
                    <div class="flex flex-wrap gap-2">
                        {#each typeof post.tags === "string" ? JSON.parse(post.tags) : post.tags as tag}
                            <span
                                class="px-3 py-1 bg-dark-800 text-dark-400 rounded-lg text-sm"
                            >
                                #{tag}
                            </span>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Author / Footer -->
            <div
                class="mt-12 p-8 bg-dark-800/50 rounded-2xl border border-dark-700/50"
            >
                <div class="flex items-center space-x-4">
                    <div class="flex-1">
                        <p class="text-dark-400 text-sm mb-1">Written by</p>
                        <h3 class="text-lg font-bold text-dark-100">
                            {post.expand?.author?.name || "PFMM Team"}
                        </h3>
                    </div>
                    <!-- Share buttons could go here -->
                </div>
            </div>
        </article>
    {/if}
</div>
