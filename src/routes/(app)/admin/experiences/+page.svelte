<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';

	let experiences = $state<any[]>([]);
	let loading = $state(true);
	let error = $state('');
	let showModal = $state(false);
	let editingExperience = $state<any>(null);

	let form = $state({
		role: '',
		organization: '',
		start_date: '',
		end_date: '',
		current: false,
		description: '',
		responsibilities: ''
	});

	onMount(async () => {
		await loadExperiences();
	});

	async function loadExperiences() {
		try {
			loading = true;
			error = '';
			const records = await pb.collection('experiences').getFullList({
				sort: '-start_date'
			});
			experiences = records;
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function openCreateModal() {
		editingExperience = null;
		form = {
			role: '',
			organization: '',
			start_date: '',
			end_date: '',
			current: false,
			description: '',
			responsibilities: ''
		};
		showModal = true;
	}

	function openEditModal(experience: any) {
		editingExperience = experience;
		form = {
			role: experience.role || '',
			organization: experience.organization || '',
			start_date: experience.start_date || '',
			end_date: experience.end_date || '',
			current: experience.current || false,
			description: experience.description || '',
			responsibilities: experience.responsibilities
				? JSON.stringify(experience.responsibilities, null, 2)
				: ''
		};
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingExperience = null;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		try {
			let responsibilitiesData = null;
			if (form.responsibilities.trim()) {
				try {
					responsibilitiesData = JSON.parse(form.responsibilities);
				} catch {
					error = 'Invalid JSON format for responsibilities';
					return;
				}
			}

			const data = {
				role: form.role,
				organization: form.organization,
				start_date: form.start_date,
				end_date: form.end_date || null,
				current: form.current,
				description: form.description,
				responsibilities: responsibilitiesData
			};

			if (editingExperience) {
				await pb.collection('experiences').update(editingExperience.id, data);
			} else {
				await pb.collection('experiences').create(data);
			}

			await loadExperiences();
			closeModal();
		} catch (err: any) {
			error = err.message;
		}
	}

	async function handleDelete(experience: any) {
		if (!confirm(`Are you sure you want to delete "${experience.role} at ${experience.organization}"?`)) {
			return;
		}

		try {
			await pb.collection('experiences').delete(experience.id);
			await loadExperiences();
		} catch (err: any) {
			error = err.message;
		}
	}

	function formatDate(date: string) {
		if (!date) return '';
		return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">Work Experience</h1>
		<button
			onclick={openCreateModal}
			class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
		>
			Add New Experience
		</button>
	</div>

	{#if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
			{error}
		</div>
	{/if}

	{#if loading}
		<div class="text-center py-8">
			<p class="text-gray-600">Loading experiences...</p>
		</div>
	{:else if experiences.length === 0}
		<div class="text-center py-8">
			<p class="text-gray-600">No experiences found. Add your first experience!</p>
		</div>
	{:else}
		<div class="bg-white rounded-lg shadow overflow-hidden">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Role
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Organization
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Period
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
					{#each experiences as experience}
						<tr>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">{experience.role}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">{experience.organization}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">
									{formatDate(experience.start_date)} -
									{experience.current ? 'Present' : formatDate(experience.end_date)}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {experience.current
										? 'bg-green-100 text-green-800'
										: 'bg-gray-100 text-gray-800'}"
								>
									{experience.current ? 'Current' : 'Past'}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<button
									onclick={() => openEditModal(experience)}
									class="text-blue-600 hover:text-blue-900 mr-4"
								>
									Edit
								</button>
								<button
									onclick={() => handleDelete(experience)}
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
					{editingExperience ? 'Edit Experience' : 'Add New Experience'}
				</h2>

				<form onsubmit={handleSubmit}>
					<div class="space-y-4">
						<div>
							<label for="role" class="block text-sm font-medium text-gray-700 mb-1">
								Role *
							</label>
							<input
								type="text"
								id="role"
								bind:value={form.role}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label for="organization" class="block text-sm font-medium text-gray-700 mb-1">
								Organization *
							</label>
							<input
								type="text"
								id="organization"
								bind:value={form.organization}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<label for="start_date" class="block text-sm font-medium text-gray-700 mb-1">
									Start Date *
								</label>
								<input
									type="date"
									id="start_date"
									bind:value={form.start_date}
									required
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label for="end_date" class="block text-sm font-medium text-gray-700 mb-1">
									End Date
								</label>
								<input
									type="date"
									id="end_date"
									bind:value={form.end_date}
									disabled={form.current}
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
								/>
							</div>
						</div>

						<div class="flex items-center">
							<input
								type="checkbox"
								id="current"
								bind:checked={form.current}
								class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label for="current" class="ml-2 block text-sm text-gray-700">
								Currently working here
							</label>
						</div>

						<div>
							<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
								Description
							</label>
							<textarea
								id="description"
								bind:value={form.description}
								rows="3"
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							></textarea>
						</div>

						<div>
							<label for="responsibilities" class="block text-sm font-medium text-gray-700 mb-1">
								Responsibilities (JSON)
							</label>
							<textarea
								id="responsibilities"
								bind:value={form.responsibilities}
								rows="4"
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
								placeholder='["Responsibility 1", "Responsibility 2"]'
							></textarea>
							<p class="mt-1 text-sm text-gray-500">Optional: Array of strings in JSON format</p>
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
							{editingExperience ? 'Update' : 'Create'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
