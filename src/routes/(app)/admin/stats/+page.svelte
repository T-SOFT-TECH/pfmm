<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';

	let stats = $state<any[]>([]);
	let loading = $state(true);
	let error = $state('');
	let showModal = $state(false);
	let editingStat = $state<any>(null);

	let form = $state({
		label: '',
		value: '',
		icon: '',
		sort_order: 0
	});

	onMount(async () => {
		await loadStats();
	});

	async function loadStats() {
		try {
			loading = true;
			error = '';
			const records = await pb.collection('stats').getFullList({
				sort: 'sort_order,-created'
			});
			stats = records;
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function openCreateModal() {
		editingStat = null;
		form = {
			label: '',
			value: '',
			icon: '',
			sort_order: 0
		};
		showModal = true;
	}

	function openEditModal(stat: any) {
		editingStat = stat;
		form = {
			label: stat.label || '',
			value: stat.value || '',
			icon: stat.icon || '',
			sort_order: stat.sort_order || 0
		};
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingStat = null;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		try {
			const data = {
				label: form.label,
				value: form.value,
				icon: form.icon,
				sort_order: form.sort_order || 0
			};

			if (editingStat) {
				await pb.collection('stats').update(editingStat.id, data);
			} else {
				await pb.collection('stats').create(data);
			}

			await loadStats();
			closeModal();
		} catch (err: any) {
			error = err.message;
		}
	}

	async function handleDelete(stat: any) {
		if (!confirm(`Are you sure you want to delete "${stat.label}"?`)) {
			return;
		}

		try {
			await pb.collection('stats').delete(stat.id);
			await loadStats();
		} catch (err: any) {
			error = err.message;
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">Statistics Management</h1>
		<button
			onclick={openCreateModal}
			class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
		>
			Add New Stat
		</button>
	</div>

	{#if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
			{error}
		</div>
	{/if}

	{#if loading}
		<div class="text-center py-8">
			<p class="text-gray-600">Loading statistics...</p>
		</div>
	{:else if stats.length === 0}
		<div class="text-center py-8">
			<p class="text-gray-600">No statistics found. Add your first stat!</p>
		</div>
	{:else}
		<div class="bg-white rounded-lg shadow overflow-hidden">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Label
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Value
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
					{#each stats as stat}
						<tr>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">{stat.label}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900 font-semibold">{stat.value}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">{stat.icon || '-'}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">{stat.sort_order || 0}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<button
									onclick={() => openEditModal(stat)}
									class="text-blue-600 hover:text-blue-900 mr-4"
								>
									Edit
								</button>
								<button onclick={() => handleDelete(stat)} class="text-red-600 hover:text-red-900">
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
					{editingStat ? 'Edit Statistic' : 'Add New Statistic'}
				</h2>

				<form onsubmit={handleSubmit}>
					<div class="space-y-4">
						<div>
							<label for="label" class="block text-sm font-medium text-gray-700 mb-1">
								Label *
							</label>
							<input
								type="text"
								id="label"
								bind:value={form.label}
								required
								placeholder="e.g., Years of Experience"
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label for="value" class="block text-sm font-medium text-gray-700 mb-1">
								Value *
							</label>
							<input
								type="text"
								id="value"
								bind:value={form.value}
								required
								placeholder="e.g., 15+"
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<p class="mt-1 text-sm text-gray-500">The numeric or text value to display</p>
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
								placeholder="lucide-trophy"
							/>
							<p class="mt-1 text-sm text-gray-500">Icon class name (e.g., lucide-trophy)</p>
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
							{editingStat ? 'Update' : 'Create'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
