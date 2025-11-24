<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';

	let initiatives = $state<any[]>([]);
	let loading = $state(true);
	let error = $state('');
	let showModal = $state(false);
	let editingInitiative = $state<any>(null);

	let form = $state({
		title: '',
		description: '',
		icon: '',
		active: true
	});

	onMount(async () => {
		await loadInitiatives();
	});

	async function loadInitiatives() {
		try {
			loading = true;
			error = '';
			const records = await pb.collection('initiatives').getFullList({
				sort: '-created'
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
			title: '',
			description: '',
			icon: '',
			active: true
		};
		showModal = true;
	}

	function openEditModal(initiative: any) {
		editingInitiative = initiative;
		form = {
			title: initiative.title || '',
			description: initiative.description || '',
			icon: initiative.icon || '',
			active: initiative.active ?? true
		};
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingInitiative = null;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		try {
			const data = {
				title: form.title,
				description: form.description,
				icon: form.icon,
				active: form.active
			};

			if (editingInitiative) {
				await pb.collection('initiatives').update(editingInitiative.id, data);
			} else {
				await pb.collection('initiatives').create(data);
			}

			await loadInitiatives();
			closeModal();
		} catch (err: any) {
			error = err.message;
		}
	}

	async function handleDelete(initiative: any) {
		if (!confirm(`Are you sure you want to delete "${initiative.title}"?`)) {
			return;
		}

		try {
			await pb.collection('initiatives').delete(initiative.id);
			await loadInitiatives();
		} catch (err: any) {
			error = err.message;
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">Ministry Initiatives</h1>
		<button
			onclick={openCreateModal}
			class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
		>
			Add New Initiative
		</button>
	</div>

	{#if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
			{error}
		</div>
	{/if}

	{#if loading}
		<div class="text-center py-8">
			<p class="text-gray-600">Loading initiatives...</p>
		</div>
	{:else if initiatives.length === 0}
		<div class="text-center py-8">
			<p class="text-gray-600">No initiatives found. Add your first initiative!</p>
		</div>
	{:else}
		<div class="bg-white rounded-lg shadow overflow-hidden">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Title
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Description
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Icon
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Status
						</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each initiatives as initiative}
						<tr>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">{initiative.title}</div>
							</td>
							<td class="px-6 py-4">
								<div class="text-sm text-gray-500 max-w-md truncate">
									{initiative.description}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">{initiative.icon || '-'}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {initiative.active
										? 'bg-green-100 text-green-800'
										: 'bg-gray-100 text-gray-800'}"
								>
									{initiative.active ? 'Active' : 'Inactive'}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<button
									onclick={() => openEditModal(initiative)}
									class="text-blue-600 hover:text-blue-900 mr-4"
								>
									Edit
								</button>
								<button
									onclick={() => handleDelete(initiative)}
									class="text-red-600 hover:text-red-900"
								>
									Delete
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<!-- Modal -->
{#if showModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
			<div class="p-6">
				<h2 class="text-2xl font-bold mb-4">
					{editingInitiative ? 'Edit Initiative' : 'Add New Initiative'}
				</h2>

				<form onsubmit={handleSubmit}>
					<div class="space-y-4">
						<div>
							<label for="title" class="block text-sm font-medium text-gray-700 mb-1">
								Title *
							</label>
							<input
								type="text"
								id="title"
								bind:value={form.title}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
								Description *
							</label>
							<textarea
								id="description"
								bind:value={form.description}
								required
								rows="4"
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							></textarea>
						</div>

						<div>
							<label for="icon" class="block text-sm font-medium text-gray-700 mb-1">
								Icon
							</label>
							<input
								type="text"
								id="icon"
								bind:value={form.icon}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<p class="mt-1 text-sm text-gray-500">Icon class name (e.g., lucide-heart)</p>
						</div>

						<div class="flex items-center">
							<input
								type="checkbox"
								id="active"
								bind:checked={form.active}
								class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label for="active" class="ml-2 block text-sm text-gray-700">
								Active Initiative
							</label>
						</div>
					</div>

					<div class="flex justify-end gap-3 mt-6">
						<button
							type="button"
							onclick={closeModal}
							class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
						>
							{editingInitiative ? 'Update' : 'Create'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
