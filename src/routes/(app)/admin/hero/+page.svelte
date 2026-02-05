<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';

	let slides = $state<any[]>([]);
	let loading = $state(true);
	let error = $state('');
	let success = $state('');
	let showModal = $state(false);
	let editingSlide = $state<any>(null);

	let form = $state({
		title: '',
		subtitle: '',
		image: null as File | null,
		sort_order: 0,
		active: true
	});

	onMount(async () => {
		await loadSlides();
	});

	async function loadSlides() {
		try {
			loading = true;
			const records = await pb.collection('hero_slides').getFullList({
				sort: 'sort_order'
			});
			slides = records;
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function openCreateModal() {
		editingSlide = null;
		form = {
			title: '',
			subtitle: '',
			image: null,
			sort_order: slides.length,
			active: true
		};
		showModal = true;
	}

	function openEditModal(slide: any) {
		editingSlide = slide;
		form = {
			title: slide.title || '',
			subtitle: slide.subtitle || '',
			image: null,
			sort_order: slide.sort_order || 0,
			active: slide.active ?? true
		};
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingSlide = null;
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			form.image = target.files[0];
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		try {
			const formData = new FormData();
			formData.append('title', form.title);
			formData.append('subtitle', form.subtitle);
			formData.append('sort_order', form.sort_order.toString());
			formData.append('active', form.active.toString());
			
			if (form.image) {
				formData.append('image', form.image);
			}

			if (editingSlide) {
				await pb.collection('hero_slides').update(editingSlide.id, formData);
				success = 'Slide updated successfully!';
			} else {
				await pb.collection('hero_slides').create(formData);
				success = 'Slide created successfully!';
			}

			await loadSlides();
			closeModal();
			setTimeout(() => success = '', 3000);
		} catch (err: any) {
			error = err.message;
		}
	}

	async function handleDelete(slide: any) {
		if (!confirm(`Are you sure you want to delete this slide?`)) return;

		try {
			await pb.collection('hero_slides').delete(slide.id);
			await loadSlides();
			success = 'Slide deleted successfully!';
			setTimeout(() => success = '', 3000);
		} catch (err: any) {
			error = err.message;
		}
	}

	function getImageUrl(slide: any) {
		if (!slide.image) return '/hero/portfolio-hero.jpg';
		return pb.files.getUrl(slide, slide.image);
	}
</script>

<svelte:head>
	<title>Hero Slider Management - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-slate-100">Hero Slider</h1>
			<p class="text-slate-400 mt-1">Manage the background images and text on your homepage hero section</p>
		</div>
		<button
			onclick={openCreateModal}
			class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium flex items-center space-x-2"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			<span>Add Slide</span>
		</button>
	</div>

	{#if error}
		<div class="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
			{error}
		</div>
	{/if}

	{#if success}
		<div class="bg-green-900/20 border border-green-800 text-green-400 px-4 py-3 rounded-lg">
			{success}
		</div>
	{/if}

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="text-slate-400">Loading slides...</div>
		</div>
	{:else if slides.length === 0}
		<div class="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
			<div class="text-6xl mb-4">🖼️</div>
			<h3 class="text-xl font-semibold text-slate-200 mb-2">No slides yet</h3>
			<p class="text-slate-400 mb-6">Create slides to show in the homepage hero section</p>
			<button
				onclick={openCreateModal}
				class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium"
			>
				Create First Slide
			</button>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each slides as slide}
				<div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-primary-600/50 transition-all group">
					<div class="aspect-video bg-slate-800 relative">
						<img
							src={getImageUrl(slide)}
							alt={slide.title}
							class="w-full h-full object-cover"
						/>
						<div class="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
							<h3 class="text-xl font-bold text-white">{slide.title}</h3>
							<p class="text-slate-200 text-sm line-clamp-1">{slide.subtitle}</p>
						</div>
						<div class="absolute top-4 right-4 flex space-x-2">
							<span class="px-2 py-1 bg-black/60 text-white text-xs rounded">
								Order: {slide.sort_order}
							</span>
							<span class="px-2 py-1 rounded text-xs {slide.active ? 'bg-green-600/80 text-white' : 'bg-red-600/80 text-white'}">
								{slide.active ? 'Active' : 'Inactive'}
							</span>
						</div>
					</div>
					<div class="p-4 flex items-center justify-end space-x-2">
						<button
							onclick={() => openEditModal(slide)}
							class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
						>
							Edit
						</button>
						<button
							onclick={() => handleDelete(slide)}
							class="px-4 py-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/40 transition-colors text-sm font-medium"
						>
							Delete
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Modal -->
{#if showModal}
	<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
		<div class="bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between p-6 border-b border-slate-800">
				<h2 class="text-2xl font-bold text-slate-100">
					{editingSlide ? 'Edit Slide' : 'Add New Slide'}
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

			<form onsubmit={handleSubmit} class="p-6 space-y-6">
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Title *</label>
					<input
						type="text"
						bind:value={form.title}
						required
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Subtitle</label>
					<input
						type="text"
						bind:value={form.subtitle}
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">Sort Order</label>
						<input
							type="number"
							bind:value={form.sort_order}
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						/>
					</div>
					<div class="flex items-center pt-8">
						<input
							type="checkbox"
							id="active"
							bind:checked={form.active}
							class="w-4 h-4 text-primary-600 bg-slate-800 border-slate-700 rounded focus:ring-primary-600"
						/>
						<label for="active" class="ml-2 text-sm text-slate-300">Active</label>
					</div>
				</div>

				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">
						Background Image {editingSlide ? '(Optional)' : '*'}
					</label>
					<input
						type="file"
						accept="image/*"
						onchange={handleFileChange}
						required={!editingSlide}
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-500"
					/>
				</div>

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
						{editingSlide ? 'Update' : 'Create'} Slide
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
