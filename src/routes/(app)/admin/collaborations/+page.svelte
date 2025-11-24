<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';

	let collaborations = $state<any[]>([]);
	let loading = $state(true);
	let error = $state('');
	let showModal = $state(false);
	let editingCollaboration = $state<any>(null);

	// Form state
	let form = $state({
		partner_name: '',
		type: 'media',
		description: '',
		services: '',
		logo: null as File | null,
		website: '',
		start_date: '',
		end_date: '',
		active: true,
		featured: false
	});

	const types = ['media', 'education', 'corporate', 'nonprofit', 'other'];

	onMount(async () => {
		await loadCollaborations();
	});

	async function loadCollaborations() {
		try {
			loading = true;
			const records = await pb.collection('collaborations').getFullList({
				sort: '-active,-created',
			});
			collaborations = records;
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function openCreateModal() {
		editingCollaboration = null;
		form = {
			partner_name: '',
			type: 'media',
			description: '',
			services: '',
			logo: null,
			website: '',
			start_date: '',
			end_date: '',
			active: true,
			featured: false
		};
		showModal = true;
	}

	function openEditModal(collab: any) {
		editingCollaboration = collab;
		form = {
			partner_name: collab.partner_name || '',
			type: collab.type || 'media',
			description: collab.description || '',
			services: Array.isArray(collab.services) ? collab.services.join(', ') : '',
			logo: null,
			website: collab.website || '',
			start_date: collab.start_date || '',
			end_date: collab.end_date || '',
			active: collab.active ?? true,
			featured: collab.featured || false
		};
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingCollaboration = null;
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			form.logo = target.files[0];
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		try {
			const formData = new FormData();
			formData.append('partner_name', form.partner_name);
			formData.append('type', form.type);
			formData.append('description', form.description);
			formData.append('services', JSON.stringify(form.services.split(',').map(s => s.trim()).filter(s => s)));
			formData.append('website', form.website);
			formData.append('start_date', form.start_date);
			formData.append('end_date', form.end_date);
			formData.append('active', form.active.toString());
			formData.append('featured', form.featured.toString());

			if (form.logo) {
				formData.append('logo', form.logo);
			}

			if (editingCollaboration) {
				await pb.collection('collaborations').update(editingCollaboration.id, formData);
			} else {
				await pb.collection('collaborations').create(formData);
			}

			await loadCollaborations();
			closeModal();
		} catch (err: any) {
			error = err.message;
		}
	}

	async function handleDelete(collab: any) {
		if (!confirm(`Are you sure you want to delete the collaboration with "${collab.partner_name}"?`)) return;

		try {
			await pb.collection('collaborations').delete(collab.id);
			await loadCollaborations();
		} catch (err: any) {
			error = err.message;
		}
	}

	function getLogoUrl(collab: any) {
		if (!collab.logo) return '/logo.png';
		return pb.files.getUrl(collab, collab.logo);
	}
</script>

<svelte:head>
	<title>Collaborations Management - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-slate-100">Media & Collaborations</h1>
			<p class="text-slate-400 mt-1">Manage partnerships and collaborations</p>
		</div>
		<button
			onclick={openCreateModal}
			class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium flex items-center space-x-2"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			<span>Add Collaboration</span>
		</button>
	</div>

	{#if error}
		<div class="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
			{error}
		</div>
	{/if}

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="text-slate-400">Loading collaborations...</div>
		</div>
	{:else if collaborations.length === 0}
		<div class="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
			<div class="text-6xl mb-4">🤝</div>
			<h3 class="text-xl font-semibold text-slate-200 mb-2">No collaborations yet</h3>
			<p class="text-slate-400 mb-6">Start documenting your partnerships</p>
			<button
				onclick={openCreateModal}
				class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium"
			>
				Add First Collaboration
			</button>
		</div>
	{:else}
		<!-- Collaborations Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each collaborations as collab}
				<div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-primary-600/50 transition-all">
					<!-- Logo -->
					<div class="h-48 bg-slate-800 flex items-center justify-center p-6">
						<img
							src={getLogoUrl(collab)}
							alt={collab.partner_name}
							class="max-w-full max-h-full object-contain"
						/>
					</div>

					<!-- Content -->
					<div class="p-6">
						<div class="flex items-start justify-between mb-3">
							<div class="flex-1">
								<h3 class="text-lg font-semibold text-slate-100 mb-2">{collab.partner_name}</h3>
								<div class="flex items-center space-x-2 text-sm mb-3">
									<span class="px-2 py-1 bg-primary-600/20 text-primary-400 rounded capitalize">
										{collab.type}
									</span>
									{#if collab.active}
										<span class="px-2 py-1 bg-green-900/20 text-green-400 rounded">Active</span>
									{:else}
										<span class="px-2 py-1 bg-slate-800 text-slate-400 rounded">Inactive</span>
									{/if}
									{#if collab.featured}
										<span class="text-yellow-400" title="Featured">⭐</span>
									{/if}
								</div>
							</div>
						</div>

						{#if collab.description}
							<p class="text-sm text-slate-400 mb-4 line-clamp-3">{collab.description}</p>
						{/if}

						{#if collab.services && collab.services.length > 0}
							<div class="flex flex-wrap gap-2 mb-4">
								{#each collab.services.slice(0, 3) as service}
									<span class="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs">
										{service}
									</span>
								{/each}
								{#if collab.services.length > 3}
									<span class="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs">
										+{collab.services.length - 3} more
									</span>
								{/if}
							</div>
						{/if}

						<!-- Actions -->
						<div class="flex items-center space-x-2">
							{#if collab.website}
								<a
									href={collab.website}
									target="_blank"
									class="flex-1 px-3 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium text-center"
								>
									Visit Site
								</a>
							{/if}
							<button
								onclick={() => openEditModal(collab)}
								class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
							>
								Edit
							</button>
							<button
								onclick={() => handleDelete(collab)}
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
					{editingCollaboration ? 'Edit Collaboration' : 'Add New Collaboration'}
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
				<!-- Partner Name -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Partner/Organization Name *</label>
					<input
						type="text"
						bind:value={form.partner_name}
						required
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<!-- Type & Website -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">Type *</label>
						<select
							bind:value={form.type}
							required
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						>
							{#each types as type}
								<option value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">Website</label>
						<input
							type="url"
							bind:value={form.website}
							placeholder="https://example.com"
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						/>
					</div>
				</div>

				<!-- Description -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Description *</label>
					<textarea
						bind:value={form.description}
						rows="4"
						required
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					></textarea>
				</div>

				<!-- Services -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Services Provided *</label>
					<input
						type="text"
						bind:value={form.services}
						placeholder="Service 1, Service 2, Service 3"
						required
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
					<p class="text-xs text-slate-500 mt-1">Separate services with commas</p>
				</div>

				<!-- Start & End Date -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
						<input
							type="date"
							bind:value={form.start_date}
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">End Date</label>
						<input
							type="date"
							bind:value={form.end_date}
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						/>
					</div>
				</div>

				<!-- Logo -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Partner Logo</label>
					<input
						type="file"
						accept="image/*"
						onchange={handleFileChange}
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-500"
					/>
				</div>

				<!-- Checkboxes -->
				<div class="space-y-3">
					<div class="flex items-center">
						<input
							type="checkbox"
							id="active"
							bind:checked={form.active}
							class="w-4 h-4 text-primary-600 bg-slate-800 border-slate-700 rounded focus:ring-primary-600"
						/>
						<label for="active" class="ml-2 text-sm text-slate-300">
							Active collaboration
						</label>
					</div>
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
						{editingCollaboration ? 'Update' : 'Add'} Collaboration
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
