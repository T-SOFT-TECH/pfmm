<script lang="ts">
	import { onMount } from "svelte";
	import { pb } from "$lib/pocketbase";

	let posts = $state<any[]>([]);
	let loading = $state(true);
	let error = $state("");
	let showModal = $state(false);
	let editingPost = $state<any>(null);

	// Form state
	let form = $state({
		title: "",
		slug: "",
		content: "",
		excerpt: "",
		category: "Education",
		tags: "",
		featured_image: null as File | null,
		read_time: 5,
		featured: false,
		status: "draft",
	});

	const categories = [
		"Education",
		"Music",
		"Empowerment",
		"Technology",
		"Other",
	];
	const statuses = ["draft", "published"];

	onMount(async () => {
		await loadPosts();
	});

	async function loadPosts() {
		try {
			loading = true;
			const records = await pb.collection("blog").getFullList({
				sort: "-created",
				expand: "author",
			});
			posts = records;
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function openCreateModal() {
		editingPost = null;
		form = {
			title: "",
			slug: "",
			content: "",
			excerpt: "",
			category: "Education",
			tags: "",
			featured_image: null,
			read_time: 5,
			featured: false,
			status: "draft",
		};
		showModal = true;
	}

	function openEditModal(post: any) {
		editingPost = post;
		form = {
			title: post.title || "",
			slug: post.slug || "",
			content: post.content || "",
			excerpt: post.excerpt || "",
			category: post.category || "Education",
			tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
			featured_image: null,
			read_time: post.read_time || 5,
			featured: post.featured || false,
			status: post.status || "draft",
		};
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingPost = null;
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			form.featured_image = target.files[0];
		}
	}

	function generateSlug() {
		form.slug = form.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		try {
			const formData = new FormData();
			formData.append("title", form.title);
			formData.append("slug", form.slug);
			formData.append("content", form.content);
			formData.append("excerpt", form.excerpt);
			formData.append("category", form.category);
			formData.append(
				"tags",
				JSON.stringify(
					form.tags
						.split(",")
						.map((t) => t.trim())
						.filter((t) => t),
				),
			);
			formData.append("read_time", form.read_time.toString());
			formData.append("featured", form.featured.toString());
			formData.append("status", form.status);
			formData.append("author", pb.authStore.model?.id || "");

			if (form.status === "published" && !editingPost) {
				formData.append("published_date", new Date().toISOString());
			}

			if (form.featured_image) {
				formData.append("featured_image", form.featured_image);
			}

			if (editingPost) {
				await pb.collection("blog").update(editingPost.id, formData);
			} else {
				await pb.collection("blog").create(formData);
			}

			await loadPosts();
			closeModal();
		} catch (err: any) {
			error = err.message;
		}
	}

	async function handleDelete(post: any) {
		if (!confirm(`Are you sure you want to delete "${post.title}"?`))
			return;

		try {
			await pb.collection("blog").delete(post.id);
			await loadPosts();
		} catch (err: any) {
			error = err.message;
		}
	}

	function getImageUrl(post: any) {
		if (!post.featured_image) return "/logo.png";
		return pb.files.getUrl(post, post.featured_image);
	}

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	}
</script>

<svelte:head>
	<title>Blog Management - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-slate-100">Blog Posts</h1>
			<p class="text-slate-400 mt-1">Manage blog posts and articles</p>
		</div>
		<button
			onclick={openCreateModal}
			class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium flex items-center space-x-2"
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
					d="M12 4v16m8-8H4"
				/>
			</svg>
			<span>New Post</span>
		</button>
	</div>

	{#if error}
		<div
			class="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg"
		>
			{error}
		</div>
	{/if}

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="text-slate-400">Loading posts...</div>
		</div>
	{:else if posts.length === 0}
		<div
			class="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center"
		>
			<div class="text-6xl mb-4">📝</div>
			<h3 class="text-xl font-semibold text-slate-200 mb-2">
				No blog posts yet
			</h3>
			<p class="text-slate-400 mb-6">
				Start sharing your insights and stories
			</p>
			<button
				onclick={openCreateModal}
				class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium"
			>
				Write First Post
			</button>
		</div>
	{:else}
		<!-- Posts List -->
		<div class="space-y-4">
			{#each posts as post}
				<div
					class="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-primary-600/50 transition-all"
				>
					<div class="flex gap-6">
						<!-- Featured Image -->
						<div
							class="w-48 h-32 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0"
						>
							<img
								src={getImageUrl(post)}
								alt={post.title}
								class="w-full h-full object-cover"
							/>
						</div>

						<!-- Content -->
						<div class="flex-1 min-w-0">
							<div class="flex items-start justify-between mb-3">
								<div class="flex-1">
									<h3
										class="text-xl font-semibold text-slate-100 mb-2"
									>
										{post.title}
									</h3>
									<div
										class="flex items-center space-x-2 text-sm mb-3"
									>
										<span
											class="px-2 py-1 bg-primary-600/20 text-primary-400 rounded capitalize"
										>
											{post.category}
										</span>
										<span
											class="px-2 py-1 bg-slate-800 text-slate-400 rounded capitalize"
										>
											{post.status}
										</span>
										{#if post.featured}
											<span
												class="text-yellow-400"
												title="Featured">⭐</span
											>
										{/if}
										<span class="text-slate-500">•</span>
										<span class="text-slate-500"
											>{post.read_time} min read</span
										>
										{#if post.published_date}
											<span class="text-slate-500">•</span
											>
											<span class="text-slate-500"
												>{formatDate(
													post.published_date,
												)}</span
											>
										{/if}
									</div>
									<p class="text-slate-400 line-clamp-2">
										{post.excerpt}
									</p>
								</div>
							</div>

							<!-- Actions -->
							<div class="flex items-center space-x-2">
								<button
									onclick={() => openEditModal(post)}
									class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
								>
									Edit
								</button>
								<button
									onclick={() => handleDelete(post)}
									class="px-4 py-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/40 transition-colors text-sm font-medium"
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Modal -->
{#if showModal}
	<div
		class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
	>
		<div
			class="bg-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
		>
			<!-- Modal Header -->
			<div
				class="flex items-center justify-between p-6 border-b border-slate-800"
			>
				<h2 class="text-2xl font-bold text-slate-100">
					{editingPost ? "Edit Post" : "Create New Post"}
				</h2>
				<button
					onclick={closeModal}
					class="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
				>
					<svg
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Modal Body -->
			<form onsubmit={handleSubmit} class="p-6 space-y-6">
				<!-- Title -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2"
						>Title *</label
					>
					<input
						type="text"
						bind:value={form.title}
						oninput={generateSlug}
						required
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<!-- Slug -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2"
						>Slug *</label
					>
					<input
						type="text"
						bind:value={form.slug}
						required
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<!-- Excerpt -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2"
						>Excerpt *</label
					>
					<textarea
						bind:value={form.excerpt}
						rows="2"
						required
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					></textarea>
				</div>

				<!-- Content -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2"
						>Content *</label
					>
					<textarea
						bind:value={form.content}
						rows="8"
						required
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					></textarea>
				</div>

				<!-- Category, Status, Read Time -->
				<div class="grid grid-cols-3 gap-4">
					<div>
						<label
							class="block text-sm font-medium text-slate-300 mb-2"
							>Category *</label
						>
						<select
							bind:value={form.category}
							required
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						>
							{#each categories as category}
								<option value={category}
									>{category.charAt(0).toUpperCase() +
										category.slice(1)}</option
								>
							{/each}
						</select>
					</div>

					<div>
						<label
							class="block text-sm font-medium text-slate-300 mb-2"
							>Status *</label
						>
						<select
							bind:value={form.status}
							required
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						>
							{#each statuses as status}
								<option value={status}
									>{status.charAt(0).toUpperCase() +
										status.slice(1)}</option
								>
							{/each}
						</select>
					</div>

					<div>
						<label
							class="block text-sm font-medium text-slate-300 mb-2"
							>Read Time (min)</label
						>
						<input
							type="number"
							bind:value={form.read_time}
							min="1"
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						/>
					</div>
				</div>

				<!-- Tags -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2"
						>Tags</label
					>
					<input
						type="text"
						bind:value={form.tags}
						placeholder="tag1, tag2, tag3"
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<!-- Featured Image -->
				<div>
					<label
						class="block text-sm font-medium text-slate-300 mb-2"
					>
						Featured Image {editingPost ? "" : "*"}
					</label>
					<input
						type="file"
						accept="image/*"
						onchange={handleFileChange}
						required={!editingPost}
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-500"
					/>
				</div>

				<!-- Featured Checkbox -->
				<div class="flex items-center">
					<input
						type="checkbox"
						id="featured"
						bind:checked={form.featured}
						class="w-4 h-4 text-primary-600 bg-slate-800 border-slate-700 rounded focus:ring-primary-600"
					/>
					<label for="featured" class="ml-2 text-sm text-slate-300">
						Mark as featured
					</label>
				</div>

				<!-- Actions -->
				<div
					class="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800"
				>
					<button
						type="button"
						onclick={closeModal}
						class="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors font-medium"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium"
					>
						{editingPost ? "Update" : "Publish"} Post
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
