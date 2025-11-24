<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';

	let services = $state<any[]>([]);
	let loading = $state(true);
	let error = $state('');
	let showModal = $state(false);
	let editingService = $state<any>(null);

	let form = $state({
		title: '',
		slug: '',
		description: '',
		icon: '',
		featured: false,
		sort_order: 0
	});

	onMount(async () => {
		await loadServices();
	});

	async function loadServices() {
		try {
			loading = true;
			error = '';
			const records = await pb.collection('services').getFullList({
				sort: 'sort_order,-created'
			});
			services = records;
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function openCreateModal() {
		editingService = null;
		form = {
			title: '',
			slug: '',
			description: '',
			icon: '',
			featured: false,
			sort_order: 0
		};
		showModal = true;
	}

	function openEditModal(service: any) {
		editingService = service;
		form = {
			title: service.title || '',
			slug: service.slug || '',
			description: service.description || '',
			icon: service.icon || '',
			featured: service.featured || false,
			sort_order: service.sort_order || 0
		};
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingService = null;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		try {
			const data = {
				title: form.title,
				slug: form.slug,
				description: form.description,
				icon: form.icon,
				featured: form.featured,
				sort_order: form.sort_order || 0
			};

			if (editingService) {
				await pb.collection('services').update(editingService.id, data);
			} else {
				await pb.collection('services').create(data);
			}

			await loadServices();
			closeModal();
		} catch (err: any) {
			error = err.message;
		}
	}

	async function handleDelete(service: any) {
		if (!confirm(`Are you sure you want to delete "${service.title}"?`)) {
			return;
		}

		try {
			await pb.collection('services').delete(service.id);
			await loadServices();
		} catch (err: any) {
			error = err.message;
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">Services Management</h1>
		<button
			onclick={openCreateModal}
			class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
		>
			Add New Service
		</button>
	</div>

	{#if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
			{error}
		</div>
	{/if}

	{#if loading}
		<div class="text-center py-8">
			<p class="text-gray-600">Loading services...</p>
		</div>
	{:else if services.length === 0}
		<div class="text-center py-8">
			<p class="text-gray-600">No services found. Add your first service!</p>
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
							Slug
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Icon
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Featured
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
					{#each services as service}
						<tr>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">{service.title}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">{service.slug}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">{service.icon || '-'}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {service.featured
										? 'bg-green-100 text-green-800'
										: 'bg-gray-100 text-gray-800'}"
								>
									{service.featured ? 'Yes' : 'No'}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">{service.sort_order || 0}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<button
									onclick={() => openEditModal(service)}
									class="text-blue-600 hover:text-blue-900 mr-4"
								>
									Edit
								</button>
								<button
									onclick={() => handleDelete(service)}
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
					{editingService ? 'Edit Service' : 'Add New Service'}
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
							<label for="slug" class="block text-sm font-medium text-gray-700 mb-1">
								Slug *
							</label>
							<input
								type="text"
								id="slug"
								bind:value={form.slug}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<p class="mt-1 text-sm text-gray-500">URL-friendly version (e.g., music-production)</p>
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
							<p class="mt-1 text-sm text-gray-500">Icon class name (e.g., lucide-music)</p>
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

						<div class="flex items-center">
							<input
								type="checkbox"
								id="featured"
								bind:checked={form.featured}
								class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label for="featured" class="ml-2 block text-sm text-gray-700">
								Featured Service
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
							{editingService ? 'Update' : 'Create'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
