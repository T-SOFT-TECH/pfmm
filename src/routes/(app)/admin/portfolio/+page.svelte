<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';

	let projects = $state<any[]>([]);
	let loading = $state(true);
	let error = $state('');
	let showModal = $state(false);
	let editingProject = $state<any>(null);
	let deleteConfirm = $state<any>(null);

	// Form state
	let form = $state({
		title: '',
		slug: '',
		description: '',
		excerpt: '',
		category: 'music',
		tags: [] as string[],
		video_url: '',
		music_url: '',
		music_file: null as File | null,
		image: null as File | null,
		featured: false,
		status: 'draft'
	});

	let tagInput = $state('');

	const categories = ['music', 'video', 'training', 'installation', 'photography', 'live studio sessions', 'other'];
	const statuses = ['draft', 'published'];

	onMount(async () => {
		await loadProjects();
	});

	async function loadProjects() {
		try {
			loading = true;
			const records = await pb.collection('portfolio').getFullList({
				sort: '-created',
			});
			projects = records;
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function openCreateModal() {
		editingProject = null;
		form = {
			title: '',
			slug: '',
			description: '',
			excerpt: '',
			category: 'music',
			tags: [],
			video_url: '',
			music_url: '',
			music_file: null,
			image: null,
			featured: false,
			status: 'draft'
		};
		tagInput = '';
		showModal = true;
	}

	function openEditModal(project: any) {
		editingProject = project;
		form = {
			title: project.title || '',
			slug: project.slug || '',
			description: project.description || '',
			excerpt: project.excerpt || '',
			category: project.category || 'music',
			tags: Array.isArray(project.tags) ? project.tags : [],
			video_url: project.video_url || '',
			music_url: project.music_url || '',
			music_file: null,
			image: null,
			featured: project.featured || false,
			status: project.status || 'draft'
		};
		tagInput = '';
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingProject = null;
		form = {
			title: '',
			slug: '',
			description: '',
			excerpt: '',
			category: 'music',
			tags: [],
			video_url: '',
			music_url: '',
			music_file: null,
			image: null,
			featured: false,
			status: 'draft'
		};
		tagInput = '';
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			form.image = target.files[0];
		}
	}

	function handleMusicFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			form.music_file = target.files[0];
		}
	}

	function generateSlug() {
		form.slug = form.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	}

	function handleTagInput(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTag();
		}
	}

	function addTag() {
		const tag = tagInput.trim();
		if (tag && !form.tags.includes(tag)) {
			form.tags = [...form.tags, tag];
			tagInput = '';
		}
	}

	function removeTag(tagToRemove: string) {
		form.tags = form.tags.filter(tag => tag !== tagToRemove);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		try {
			const formData = new FormData();
			formData.append('title', form.title);
			formData.append('slug', form.slug);
			formData.append('description', form.description);
			formData.append('excerpt', form.excerpt);
			formData.append('category', form.category);
			formData.append('tags', JSON.stringify(form.tags));
			formData.append('featured', form.featured.toString());
			formData.append('status', form.status);

			// Category-specific fields
			if (form.category === 'video' && form.video_url) {
				formData.append('video_url', form.video_url);
			}

			if (form.category === 'music') {
				if (form.music_url) {
					formData.append('music_url', form.music_url);
				}
				if (form.music_file) {
					formData.append('music_file', form.music_file);
				}
			}

			// Featured image (for all categories)
			if (form.image) {
				formData.append('image', form.image);
			}

			if (editingProject) {
				await pb.collection('portfolio').update(editingProject.id, formData);
			} else {
				await pb.collection('portfolio').create(formData);
			}

			await loadProjects();
			closeModal();
		} catch (err: any) {
			error = err.message;
		}
	}

	async function handleDelete(project: any) {
		if (!confirm(`Are you sure you want to delete "${project.title}"?`)) return;

		try {
			await pb.collection('portfolio').delete(project.id);
			await loadProjects();
		} catch (err: any) {
			error = err.message;
		}
	}

	function getImageUrl(project: any) {
		if (!project.image) return '/logo.png';
		return pb.files.getUrl(project, project.image);
	}
</script>

<svelte:head>
	<title>Portfolio Management - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-slate-100">Portfolio Projects</h1>
			<p class="text-slate-400 mt-1">Manage your portfolio projects and showcase work</p>
		</div>
		<button
			onclick={openCreateModal}
			class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium flex items-center space-x-2"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			<span>Add Project</span>
		</button>
	</div>

	{#if error}
		<div class="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
			{error}
		</div>
	{/if}

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="text-slate-400">Loading projects...</div>
		</div>
	{:else if projects.length === 0}
		<div class="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
			<div class="text-6xl mb-4">📁</div>
			<h3 class="text-xl font-semibold text-slate-200 mb-2">No projects yet</h3>
			<p class="text-slate-400 mb-6">Get started by creating your first portfolio project</p>
			<button
				onclick={openCreateModal}
				class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium"
			>
				Create First Project
			</button>
		</div>
	{:else}
		<!-- Projects Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each projects as project}
				<div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-primary-600/50 transition-all group">
					<!-- Image -->
					<div class="aspect-video bg-slate-800 overflow-hidden">
						<img
							src={getImageUrl(project)}
							alt={project.title}
							class="w-full h-full object-cover group-hover:scale-105 transition-transform"
						/>
					</div>

					<!-- Content -->
					<div class="p-6">
						<div class="flex items-start justify-between mb-3">
							<div class="flex-1">
								<h3 class="text-lg font-semibold text-slate-100 mb-1">{project.title}</h3>
								<div class="flex items-center space-x-2 text-sm">
									<span class="px-2 py-1 bg-primary-600/20 text-primary-400 rounded capitalize">
										{project.category}
									</span>
									<span class="px-2 py-1 bg-slate-800 text-slate-400 rounded capitalize">
										{project.status}
									</span>
									{#if project.featured}
										<span class="text-yellow-400" title="Featured">⭐</span>
									{/if}
								</div>
							</div>
						</div>

						{#if project.excerpt}
							<p class="text-sm text-slate-400 mb-4 line-clamp-2">{project.excerpt}</p>
						{/if}

						<!-- Actions -->
						<div class="flex items-center space-x-2">
							<button
								onclick={() => openEditModal(project)}
								class="flex-1 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
							>
								Edit
							</button>
							<button
								onclick={() => handleDelete(project)}
								class="px-4 py-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/40 transition-colors text-sm font-medium"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Modal -->
{#if showModal}
	<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
		<div class="bg-slate-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
			<!-- Modal Header -->
			<div class="flex items-center justify-between p-6 border-b border-slate-800">
				<h2 class="text-2xl font-bold text-slate-100">
					{editingProject ? 'Edit Project' : 'Create New Project'}
				</h2>
				<button
					onclick={closeModal}
					class="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Modal Body -->
			<form onsubmit={handleSubmit} class="p-6 space-y-6">
				<!-- Title -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">
						Title *
					</label>
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
					<label class="block text-sm font-medium text-slate-300 mb-2">
						Slug *
					</label>
					<input
						type="text"
						bind:value={form.slug}
						required
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
					<p class="text-xs text-slate-500 mt-1">URL-friendly version of the title</p>
				</div>

				<!-- Excerpt -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">
						Excerpt
					</label>
					<textarea
						bind:value={form.excerpt}
						rows="2"
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					></textarea>
				</div>

				<!-- Description -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">
						Description *
					</label>
					<textarea
						bind:value={form.description}
						rows="4"
						required
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					></textarea>
				</div>

				<!-- Category & Status -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">
							Category *
						</label>
						<select
							bind:value={form.category}
							required
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						>
							{#each categories as category}
								<option value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
							{/each}
						</select>
					</div>

					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">
							Status *
						</label>
						<select
							bind:value={form.status}
							required
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						>
							{#each statuses as status}
								<option value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Tags -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">
						Tags
					</label>

					<!-- Tag Chips Display -->
					{#if form.tags.length > 0}
						<div class="flex flex-wrap gap-2 mb-3">
							{#each form.tags as tag}
								<span class="inline-flex items-center px-3 py-1 bg-primary-600/20 text-primary-400 rounded-full text-sm">
									{tag}
									<button
										type="button"
										onclick={() => removeTag(tag)}
										class="ml-2 text-primary-400 hover:text-primary-300 focus:outline-none"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</span>
							{/each}
						</div>
					{/if}

					<!-- Tag Input -->
					<div class="flex items-center space-x-2">
						<input
							type="text"
							bind:value={tagInput}
							onkeydown={handleTagInput}
							placeholder="Type a tag and press Enter"
							class="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						/>
						<button
							type="button"
							onclick={addTag}
							class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors"
						>
							Add
						</button>
					</div>
					<p class="text-xs text-slate-500 mt-1">Press Enter or click Add to add a tag</p>
				</div>

				<!-- Category-specific fields -->
				{#if form.category === 'video'}
					<!-- Video URL -->
					<div class="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
						<h3 class="text-sm font-semibold text-primary-400 mb-3">Video Settings</h3>
						<div>
							<label class="block text-sm font-medium text-slate-300 mb-2">
								Video URL <span class="text-red-400">*</span>
							</label>
							<input
								type="url"
								bind:value={form.video_url}
								placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
								required={form.category === 'video'}
								class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
							/>
							<p class="text-xs text-slate-500 mt-1">YouTube, Vimeo, or other video platform URL</p>
						</div>
					</div>
				{:else if form.category === 'music'}
					<!-- Music Settings -->
					<div class="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-4">
						<h3 class="text-sm font-semibold text-primary-400 mb-3">Music Settings</h3>

						<!-- Music URL -->
						<div>
							<label class="block text-sm font-medium text-slate-300 mb-2">
								Music Streaming URL
							</label>
							<input
								type="url"
								bind:value={form.music_url}
								placeholder="https://open.spotify.com/track/... or https://soundcloud.com/..."
								class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
							/>
							<p class="text-xs text-slate-500 mt-1">Spotify, SoundCloud, Apple Music, or other music platform URL</p>
						</div>

						<!-- OR Separator -->
						<div class="flex items-center space-x-4">
							<div class="flex-1 h-px bg-slate-700"></div>
							<span class="text-sm text-slate-500 font-medium">OR</span>
							<div class="flex-1 h-px bg-slate-700"></div>
						</div>

						<!-- Music File Upload -->
						<div>
							<label class="block text-sm font-medium text-slate-300 mb-2">
								Upload Audio File
							</label>
							<input
								type="file"
								accept="audio/*"
								onchange={handleMusicFileChange}
								class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-500"
							/>
							<p class="text-xs text-slate-500 mt-1">MP3, WAV, or other audio format</p>
						</div>
					</div>
				{/if}

				<!-- Image -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">
						Featured Image / Thumbnail {editingProject ? '' : '*'}
					</label>
					<input
						type="file"
						accept="image/*"
						onchange={handleFileChange}
						required={!editingProject}
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
				<div class="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
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
						{editingProject ? 'Update' : 'Create'} Project
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
