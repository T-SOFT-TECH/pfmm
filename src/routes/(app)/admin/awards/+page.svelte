<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';

	let awards = $state<any[]>([]);
	let loading = $state(true);
	let error = $state('');
	let showModal = $state(false);
	let editingAward = $state<any>(null);

	// Form state
	let form = $state({
		title: '',
		organization: '',
		year: new Date().getFullYear(),
		category: '',
		description: '',
		image: null as File | null,
		featured: false
	});

	onMount(async () => {
		await loadAwards();
	});

	async function loadAwards() {
		try {
			loading = true;
			const records = await pb.collection('awards').getFullList({
				sort: '-year,-created',
			});
			awards = records;
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function openCreateModal() {
		editingAward = null;
		form = {
			title: '',
			organization: '',
			year: new Date().getFullYear(),
			category: '',
			description: '',
			image: null,
			featured: false
		};
		showModal = true;
	}

	function openEditModal(award: any) {
		editingAward = award;
		form = {
			title: award.title || '',
			organization: award.organization || '',
			year: award.year || new Date().getFullYear(),
			category: award.category || '',
			description: award.description || '',
			image: null,
			featured: award.featured || false
		};
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingAward = null;
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
			formData.append('organization', form.organization);
			formData.append('year', form.year.toString());
			formData.append('category', form.category);
			formData.append('description', form.description);
			formData.append('featured', form.featured.toString());

			if (form.image) {
				formData.append('image', form.image);
			}

			if (editingAward) {
				await pb.collection('awards').update(editingAward.id, formData);
			} else {
				await pb.collection('awards').create(formData);
			}

			await loadAwards();
			closeModal();
		} catch (err: any) {
			error = err.message;
		}
	}

	async function handleDelete(award: any) {
		if (!confirm(`Are you sure you want to delete "${award.title}"?`)) return;

		try {
			await pb.collection('awards').delete(award.id);
			await loadAwards();
		} catch (err: any) {
			error = err.message;
		}
	}

	function getImageUrl(award: any) {
		if (!award.image) return '/logo.png';
		return pb.files.getUrl(award, award.image);
	}
</script>

<svelte:head>
	<title>Awards Management - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-slate-100">Awards & Recognitions</h1>
			<p class="text-slate-400 mt-1">Manage awards and achievements</p>
		</div>
		<button
			onclick={openCreateModal}
			class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium flex items-center space-x-2"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			<span>Add Award</span>
		</button>
	</div>

	{#if error}
		<div class="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
			{error}
		</div>
	{/if}

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="text-slate-400">Loading awards...</div>
		</div>
	{:else if awards.length === 0}
		<div class="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
			<div class="text-6xl mb-4">🏆</div>
			<h3 class="text-xl font-semibold text-slate-200 mb-2">No awards yet</h3>
			<p class="text-slate-400 mb-6">Start documenting your achievements</p>
			<button
				onclick={openCreateModal}
				class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium"
			>
				Add First Award
			</button>
		</div>
	{:else}
		<!-- Awards Timeline -->
		<div class="space-y-6">
			{#each awards as award}
				<div class="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-primary-600/50 transition-all">
					<div class="flex gap-6">
						<!-- Year Badge -->
						<div class="flex-shrink-0">
							<div class="w-20 h-20 bg-primary-600/20 border-2 border-primary-600 rounded-full flex items-center justify-center">
								<span class="text-primary-400 font-bold text-lg">{award.year}</span>
							</div>
						</div>

						<!-- Content -->
						<div class="flex-1">
							<div class="flex items-start justify-between mb-3">
								<div class="flex-1">
									<h3 class="text-xl font-semibold text-slate-100 mb-1">{award.title}</h3>
									<p class="text-slate-400 mb-2">{award.organization}</p>
									{#if award.category}
										<span class="px-3 py-1 bg-primary-600/20 text-primary-400 rounded text-sm">
											{award.category}
										</span>
									{/if}
									{#if award.featured}
										<span class="ml-2 text-yellow-400" title="Featured">⭐</span>
									{/if}
								</div>
								{#if award.image}
									<img
										src={getImageUrl(award)}
										alt={award.title}
										class="w-24 h-24 object-cover rounded-lg"
									/>
								{/if}
							</div>

							{#if award.description}
								<p class="text-slate-300 mb-4">{award.description}</p>
							{/if}

							<!-- Actions -->
							<div class="flex items-center space-x-2">
								<button
									onclick={() => openEditModal(award)}
									class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
								>
									Edit
								</button>
								<button
									onclick={() => handleDelete(award)}
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
	<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
		<div class="bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
			<!-- Modal Header -->
			<div class="flex items-center justify-between p-6 border-b border-slate-800">
				<h2 class="text-2xl font-bold text-slate-100">
					{editingAward ? 'Edit Award' : 'Add New Award'}
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
					<label class="block text-sm font-medium text-slate-300 mb-2">Award Title *</label>
					<input
						type="text"
						bind:value={form.title}
						required
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<!-- Organization & Year -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">Organization *</label>
						<input
							type="text"
							bind:value={form.organization}
							required
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">Year *</label>
						<input
							type="number"
							bind:value={form.year}
							min="1900"
							max="2100"
							required
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						/>
					</div>
				</div>

				<!-- Category -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Category</label>
					<input
						type="text"
						bind:value={form.category}
						placeholder="e.g., Music Production, Education, Community Service"
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<!-- Description -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Description</label>
					<textarea
						bind:value={form.description}
						rows="3"
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					></textarea>
				</div>

				<!-- Image -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Award Image/Certificate</label>
					<input
						type="file"
						accept="image/*"
						onchange={handleFileChange}
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
						{editingAward ? 'Update' : 'Add'} Award
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
