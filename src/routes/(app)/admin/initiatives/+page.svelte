<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';

	let initiatives = $state<any[]>([]);
	let loading = $state(true);
	let error = $state('');
	let showModal = $state(false);
	let editingInitiative = $state<any>(null);

	// Form state
	let form = $state({
		name: '',
		role: '',
		description: '',
		programs: '',
		impact_metrics: '',
		icon: '',
		image: null as File | null,
		active: true,
		sort_order: 0
	});

	onMount(async () => {
		await loadInitiatives();
	});

	async function loadInitiatives() {
		try {
			loading = true;
			error = '';
			const records = await pb.collection('initiatives').getFullList({
				sort: 'sort_order,created'
			});
			initiatives = records;
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function openCreateModal() {
		editingInitiative = null;
		form = {
			name: '',
			role: '',
			description: '',
			programs: '',
			impact_metrics: '',
			icon: '',
			image: null,
			active: true,
			sort_order: initiatives.length
		};
		showModal = true;
	}

	function openEditModal(initiative: any) {
		editingInitiative = initiative;
		form = {
			name: initiative.name || '',
			role: initiative.role || '',
			description: initiative.description || '',
			programs: Array.isArray(initiative.programs) ? initiative.programs.join(', ') : '',
			impact_metrics: Array.isArray(initiative.impact_metrics) ? initiative.impact_metrics.join(', ') : '',
			icon: initiative.icon || '',
			image: null,
			active: initiative.active ?? true,
			sort_order: initiative.sort_order || 0
		};
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingInitiative = null;
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
			formData.append('name', form.name);
			formData.append('role', form.role);
			formData.append('description', form.description);
			formData.append('programs', JSON.stringify(form.programs.split(',').map(s => s.trim()).filter(s => s)));
			formData.append('impact_metrics', JSON.stringify(form.impact_metrics.split(',').map(s => s.trim()).filter(s => s)));
			formData.append('icon', form.icon);
			formData.append('active', form.active.toString());
			formData.append('sort_order', form.sort_order.toString());

			if (form.image) {
				formData.append('image', form.image);
			}

			if (editingInitiative) {
				await pb.collection('initiatives').update(editingInitiative.id, formData);
			} else {
				await pb.collection('initiatives').create(formData);
			}

			await loadInitiatives();
			closeModal();
		} catch (err: any) {
			error = err.message;
		}
	}

	async function handleDelete(initiative: any) {
		if (!confirm(`Are you sure you want to delete "${initiative.name}"?`)) {
			return;
		}

		try {
			await pb.collection('initiatives').delete(initiative.id);
			await loadInitiatives();
		} catch (err: any) {
			error = err.message;
		}
	}

	function getImageUrl(initiative: any) {
		if (!initiative.image) return null;
		return pb.files.getUrl(initiative, initiative.image);
	}
</script>

<svelte:head>
	<title>Initiatives Management - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-slate-100">Empowerment Initiatives</h1>
			<p class="text-slate-400 mt-1">Manage foundations and programs</p>
		</div>
		<button
			onclick={openCreateModal}
			class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium flex items-center space-x-2"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			<span>Add Initiative</span>
		</button>
	</div>

	{#if error}
		<div class="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
			{error}
		</div>
	{/if}

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="text-slate-400">Loading initiatives...</div>
		</div>
	{:else if initiatives.length === 0}
		<div class="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
			<div class="text-6xl mb-4">💡</div>
			<h3 class="text-xl font-semibold text-slate-200 mb-2">No initiatives yet</h3>
			<p class="text-slate-400 mb-6">Start documenting your empowerment work</p>
			<button
				onclick={openCreateModal}
				class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium"
			>
				Add First Initiative
			</button>
		</div>
	{:else}
		<!-- Initiatives List -->
		<div class="space-y-4">
			{#each initiatives as initiative}
				<div class="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-primary-600/50 transition-all">
					<div class="flex gap-6">
						<!-- Icon/Image -->
						<div class="w-24 h-24 bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden border border-slate-700 flex-shrink-0">
							{#if initiative.image}
								<img src={getImageUrl(initiative)} alt={initiative.name} class="w-full h-full object-cover" />
							{:else}
								<span class="text-4xl">{initiative.icon || '💡'}</span>
							{/if}
						</div>

						<!-- Content -->
						<div class="flex-1">
							<div class="flex items-start justify-between mb-3">
								<div class="flex-1">
									<h3 class="text-xl font-semibold text-slate-100 mb-1">{initiative.name}</h3>
									<div class="flex items-center space-x-2 text-sm mb-3">
										<span class="text-primary-400 font-medium">{initiative.role}</span>
										<span class="text-slate-600">|</span>
										{#if initiative.active}
											<span class="px-2 py-0.5 bg-green-900/20 text-green-400 rounded text-xs">Active</span>
										{:else}
											<span class="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-xs">Inactive</span>
										{/if}
									</div>
								</div>
							</div>

							<p class="text-slate-400 text-sm mb-4 line-clamp-2">{initiative.description}</p>

							{#if initiative.programs && initiative.programs.length > 0}
								<div class="flex flex-wrap gap-2 mb-4">
									{#each initiative.programs as program}
										<span class="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs">
											{program}
										</span>
									{/each}
								</div>
							{/if}

							<!-- Actions -->
							<div class="flex items-center space-x-2">
								<button
									onclick={() => openEditModal(initiative)}
									class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
								>
									Edit
								</button>
								<button
									onclick={() => handleDelete(initiative)}
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
					{editingInitiative ? 'Edit Initiative' : 'Add New Initiative'}
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
				<!-- Name -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Initiative/Foundation Name *</label>
					<input
						type="text"
						bind:value={form.name}
						required
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<!-- Role -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Your Role *</label>
					<input
						type="text"
						bind:value={form.role}
						placeholder="e.g., Program Coordinator, Director"
						required
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
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

				<!-- Programs -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Programs *</label>
					<input
						type="text"
						bind:value={form.programs}
						placeholder="Program 1, Program 2, Program 3"
						required
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
					<p class="text-xs text-slate-500 mt-1">Separate programs with commas</p>
				</div>

				<!-- Impact Metrics -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Impact Metrics</label>
					<input
						type="text"
						bind:value={form.impact_metrics}
						placeholder="500+ Youth Trained, 1000+ Lives Impacted"
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
					<p class="text-xs text-slate-500 mt-1">Separate metrics with commas</p>
				</div>

				<!-- Icon & Sort Order -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">Icon (emoji)</label>
						<input
							type="text"
							bind:value={form.icon}
							placeholder="💡"
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">Sort Order</label>
						<input
							type="number"
							bind:value={form.sort_order}
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						/>
					</div>
				</div>

				<!-- Image -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Featured Image</label>
					<input
						type="file"
						accept="image/*"
						onchange={handleFileChange}
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-500"
					/>
				</div>

				<!-- Active Checkbox -->
				<div class="flex items-center">
					<input
						type="checkbox"
						id="active"
						bind:checked={form.active}
						class="w-4 h-4 text-primary-600 bg-slate-800 border-slate-700 rounded focus:ring-primary-600"
					/>
					<label for="active" class="ml-2 text-sm text-slate-300">
						Active initiative
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
						{editingInitiative ? 'Update' : 'Add'} Initiative
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

