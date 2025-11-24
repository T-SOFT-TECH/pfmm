<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';

	let skills = $state<any[]>([]);
	let loading = $state(true);
	let error = $state('');
	let showModal = $state(false);
	let editingSkill = $state<any>(null);

	let form = $state({
		name: '',
		category: 'music',
		level: 50,
		featured: false
	});

	const categories = ['music', 'technical', 'soft_skills', 'ministry'];

	onMount(async () => {
		await loadSkills();
	});

	async function loadSkills() {
		try {
			loading = true;
			error = '';
			const records = await pb.collection('skills').getFullList({
				sort: 'category,name'
			});
			skills = records;
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function openCreateModal() {
		editingSkill = null;
		form = {
			name: '',
			category: 'music',
			level: 50,
			featured: false
		};
		showModal = true;
	}

	function openEditModal(skill: any) {
		editingSkill = skill;
		form = {
			name: skill.name || '',
			category: skill.category || 'music',
			level: skill.level || 50,
			featured: skill.featured || false
		};
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingSkill = null;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		try {
			const data = {
				name: form.name,
				category: form.category,
				level: form.level || null,
				featured: form.featured
			};

			if (editingSkill) {
				await pb.collection('skills').update(editingSkill.id, data);
			} else {
				await pb.collection('skills').create(data);
			}

			await loadSkills();
			closeModal();
		} catch (err: any) {
			error = err.message;
		}
	}

	async function handleDelete(skill: any) {
		if (!confirm(`Are you sure you want to delete "${skill.name}"?`)) {
			return;
		}

		try {
			await pb.collection('skills').delete(skill.id);
			await loadSkills();
		} catch (err: any) {
			error = err.message;
		}
	}

	function getCategoryBadgeColor(category: string) {
		const colors: Record<string, string> = {
			music: 'bg-purple-100 text-purple-800',
			technical: 'bg-blue-100 text-blue-800',
			soft_skills: 'bg-green-100 text-green-800',
			ministry: 'bg-yellow-100 text-yellow-800'
		};
		return colors[category] || 'bg-gray-100 text-gray-800';
	}

	function formatCategory(category: string) {
		return category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">Skills Management</h1>
		<button
			onclick={openCreateModal}
			class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
		>
			Add New Skill
		</button>
	</div>

	{#if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
			{error}
		</div>
	{/if}

	{#if loading}
		<div class="text-center py-8">
			<p class="text-gray-600">Loading skills...</p>
		</div>
	{:else if skills.length === 0}
		<div class="text-center py-8">
			<p class="text-gray-600">No skills found. Add your first skill!</p>
		</div>
	{:else}
		<div class="bg-white rounded-lg shadow overflow-hidden">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Name
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Category
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Level
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Featured
						</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each skills as skill}
						<tr>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">{skill.name}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getCategoryBadgeColor(
										skill.category
									)}"
								>
									{formatCategory(skill.category)}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center">
									<div class="w-24 bg-gray-200 rounded-full h-2 mr-2">
										<div
											class="bg-blue-600 h-2 rounded-full"
											style="width: {skill.level || 0}%"
										></div>
									</div>
									<span class="text-sm text-gray-500">{skill.level || 0}%</span>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {skill.featured
										? 'bg-green-100 text-green-800'
										: 'bg-gray-100 text-gray-800'}"
								>
									{skill.featured ? 'Yes' : 'No'}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<button
									onclick={() => openEditModal(skill)}
									class="text-blue-600 hover:text-blue-900 mr-4"
								>
									Edit
								</button>
								<button onclick={() => handleDelete(skill)} class="text-red-600 hover:text-red-900">
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
					{editingSkill ? 'Edit Skill' : 'Add New Skill'}
				</h2>

				<form onsubmit={handleSubmit}>
					<div class="space-y-4">
						<div>
							<label for="name" class="block text-sm font-medium text-gray-700 mb-1">
								Skill Name *
							</label>
							<input
								type="text"
								id="name"
								bind:value={form.name}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label for="category" class="block text-sm font-medium text-gray-700 mb-1">
								Category *
							</label>
							<select
								id="category"
								bind:value={form.category}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								{#each categories as category}
									<option value={category}>{formatCategory(category)}</option>
								{/each}
							</select>
						</div>

						<div>
							<label for="level" class="block text-sm font-medium text-gray-700 mb-1">
								Proficiency Level (1-100)
							</label>
							<div class="flex items-center gap-4">
								<input
									type="range"
									id="level"
									bind:value={form.level}
									min="1"
									max="100"
									class="flex-1"
								/>
								<span class="text-sm font-medium text-gray-700 w-12 text-right"
									>{form.level}%</span
								>
							</div>
						</div>

						<div class="flex items-center">
							<input
								type="checkbox"
								id="featured"
								bind:checked={form.featured}
								class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label for="featured" class="ml-2 block text-sm text-gray-700">
								Featured Skill
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
							{editingSkill ? 'Update' : 'Create'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
