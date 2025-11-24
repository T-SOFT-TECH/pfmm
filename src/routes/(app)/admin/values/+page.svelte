<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';

	let values = $state<any[]>([]);
	let loading = $state(true);
	let error = $state('');
	let showModal = $state(false);
	let editingValue = $state<any>(null);

	let form = $state({
		title: '',
		description: '',
		icon: '',
		sort_order: 0
	});

	onMount(async () => {
		await loadValues();
	});

	async function loadValues() {
		try {
			loading = true;
			error = '';
			const records = await pb.collection('values').getFullList({
				sort: 'sort_order,-created'
			});
			values = records;
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function openCreateModal() {
		editingValue = null;
		form = {
			title: '',
			description: '',
			icon: '',
			sort_order: 0
		};
		showModal = true;
	}

	function openEditModal(value: any) {
		editingValue = value;
		form = {
			title: value.title || '',
			description: value.description || '',
			icon: value.icon || '',
			sort_order: value.sort_order || 0
		};
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingValue = null;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		try {
			const data = {
				title: form.title,
				description: form.description,
				icon: form.icon,
				sort_order: form.sort_order || 0
			};

			if (editingValue) {
				await pb.collection('values').update(editingValue.id, data);
			} else {
				await pb.collection('values').create(data);
			}

			await loadValues();
			closeModal();
		} catch (err: any) {
			error = err.message;
		}
	}

	async function handleDelete(value: any) {
		if (!confirm(`Are you sure you want to delete "${value.title}"?`)) {
			return;
		}

		try {
			await pb.collection('values').delete(value.id);
			await loadValues();
		} catch (err: any) {
			error = err.message;
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">Core Values</h1>
		<button
			onclick={openCreateModal}
			class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
		>
			Add New Value
		</button>
	</div>

	{#if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
			{error}
		</div>
	{/if}

	{#if loading}
		<div class="text-center py-8">
			<p class="text-gray-600">Loading values...</p>
		</div>
	{:else if values.length === 0}
		<div class="text-center py-8">
			<p class="text-gray-600">No values found. Add your first core value!</p>
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
							Order
						</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each values as value}
						<tr>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">{value.title}</div>
							</td>
							<td class="px-6 py-4">
								<div class="text-sm text-gray-500 max-w-md truncate">
									{value.description}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">{value.icon || '-'}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">{value.sort_order || 0}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<button
									onclick={() => openEditModal(value)}
									class="text-blue-600 hover:text-blue-900 mr-4"
								>
									Edit
								</button>
								<button onclick={() => handleDelete(value)} class="text-red-600 hover:text-red-900">
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
					{editingValue ? 'Edit Value' : 'Add New Value'}
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

						<div>
							<label for="sort_order" class="block text-sm font-medium text-gray-700 mb-1">
								Sort Order
							</label>
							<input
								type="number"
								id="sort_order"
								bind:value={form.sort_order}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<p class="mt-1 text-sm text-gray-500">Lower numbers appear first</p>
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
							{editingValue ? 'Update' : 'Create'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
