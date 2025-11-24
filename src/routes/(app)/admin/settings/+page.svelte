<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';

	let loading = $state(true);
	let error = $state('');
	let success = $state('');
	let activeTab = $state('general');

	// Settings state
	let settings = $state({
		site_name: '',
		site_description: '',
		contact_email: '',
		contact_phone: '',
		contact_address: '',
		social_facebook: '',
		social_twitter: '',
		social_linkedin: '',
		social_instagram: '',
		social_youtube: ''
	});

	// Stats state
	let stats = $state<any[]>([]);
	let showStatsModal = $state(false);
	let editingStat = $state<any>(null);
	let statForm = $state({
		key: '',
		label: '',
		value: '',
		suffix: '',
		icon: '',
		category: 'global',
		active: true
	});

	const tabs = [
		{ id: 'general', label: 'General', icon: '⚙️' },
		{ id: 'contact', label: 'Contact Info', icon: '📧' },
		{ id: 'social', label: 'Social Media', icon: '🔗' },
		{ id: 'stats', label: 'Statistics', icon: '📊' }
	];

	const statCategories = ['global', 'home', 'about', 'testimonials', 'admin'];

	onMount(async () => {
		await loadSettings();
		await loadStats();
	});

	async function loadSettings() {
		try {
			loading = true;
			const records = await pb.collection('site_settings').getFullList();

			records.forEach((record: any) => {
				if (record.key in settings) {
					settings[record.key as keyof typeof settings] = record.value;
				}
			});
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	async function loadStats() {
		try {
			const records = await pb.collection('stats').getFullList({
				sort: 'category,sort_order'
			});
			stats = records;
		} catch (err: any) {
			error = err.message;
		}
	}

	async function handleSaveSettings() {
		try {
			error = '';
			success = '';

			for (const [key, value] of Object.entries(settings)) {
				try {
					// Try to get existing setting
					const existing = await pb.collection('site_settings').getFirstListItem(`key="${key}"`);
					await pb.collection('site_settings').update(existing.id, { value });
				} catch {
					// Create if doesn't exist
					const category = key.startsWith('social_') ? 'social' :
									 key.startsWith('contact_') ? 'contact' : 'general';
					await pb.collection('site_settings').create({
						key,
						value,
						category
					});
				}
			}

			success = 'Settings saved successfully!';
			setTimeout(() => success = '', 3000);
		} catch (err: any) {
			error = err.message;
		}
	}

	function openStatsModal(stat?: any) {
		if (stat) {
			editingStat = stat;
			statForm = {
				key: stat.key || '',
				label: stat.label || '',
				value: stat.value || '',
				suffix: stat.suffix || '',
				icon: stat.icon || '',
				category: stat.category || 'global',
				active: stat.active ?? true
			};
		} else {
			editingStat = null;
			statForm = {
				key: '',
				label: '',
				value: '',
				suffix: '',
				icon: '',
				category: 'global',
				active: true
			};
		}
		showStatsModal = true;
	}

	function closeStatsModal() {
		showStatsModal = false;
		editingStat = null;
	}

	async function handleSaveStat(e: Event) {
		e.preventDefault();

		try {
			const data = {
				key: statForm.key,
				label: statForm.label,
				value: statForm.value,
				suffix: statForm.suffix,
				icon: statForm.icon,
				category: statForm.category,
				active: statForm.active
			};

			if (editingStat) {
				await pb.collection('stats').update(editingStat.id, data);
			} else {
				await pb.collection('stats').create(data);
			}

			await loadStats();
			closeStatsModal();
			success = 'Statistic saved successfully!';
			setTimeout(() => success = '', 3000);
		} catch (err: any) {
			error = err.message;
		}
	}

	async function handleDeleteStat(stat: any) {
		if (!confirm(`Are you sure you want to delete "${stat.label}"?`)) return;

		try {
			await pb.collection('stats').delete(stat.id);
			await loadStats();
		} catch (err: any) {
			error = err.message;
		}
	}
</script>

<svelte:head>
	<title>Settings - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-3xl font-bold text-slate-100">Settings</h1>
		<p class="text-slate-400 mt-1">Manage site configuration and settings</p>
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

	<!-- Tabs -->
	<div class="border-b border-slate-800">
		<div class="flex space-x-1">
			{#each tabs as tab}
				<button
					onclick={() => activeTab = tab.id}
					class="px-6 py-3 font-medium transition-colors {activeTab === tab.id ? 'text-primary-400 border-b-2 border-primary-600' : 'text-slate-400 hover:text-slate-200'}"
				>
					<span class="mr-2">{tab.icon}</span>
					{tab.label}
				</button>
			{/each}
		</div>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="text-slate-400">Loading settings...</div>
		</div>
	{:else}
		<!-- General Settings -->
		{#if activeTab === 'general'}
			<div class="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Site Name</label>
					<input
						type="text"
						bind:value={settings.site_name}
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Site Description</label>
					<textarea
						bind:value={settings.site_description}
						rows="3"
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					></textarea>
				</div>

				<button
					onclick={handleSaveSettings}
					class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium"
				>
					Save Changes
				</button>
			</div>
		{/if}

		<!-- Contact Info -->
		{#if activeTab === 'contact'}
			<div class="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
					<input
						type="email"
						bind:value={settings.contact_email}
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
					<input
						type="tel"
						bind:value={settings.contact_phone}
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Address</label>
					<textarea
						bind:value={settings.contact_address}
						rows="2"
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					></textarea>
				</div>

				<button
					onclick={handleSaveSettings}
					class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium"
				>
					Save Changes
				</button>
			</div>
		{/if}

		<!-- Social Media -->
		{#if activeTab === 'social'}
			<div class="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Facebook URL</label>
					<input
						type="url"
						bind:value={settings.social_facebook}
						placeholder="https://facebook.com/..."
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Twitter/X URL</label>
					<input
						type="url"
						bind:value={settings.social_twitter}
						placeholder="https://twitter.com/..."
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">LinkedIn URL</label>
					<input
						type="url"
						bind:value={settings.social_linkedin}
						placeholder="https://linkedin.com/in/..."
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Instagram URL</label>
					<input
						type="url"
						bind:value={settings.social_instagram}
						placeholder="https://instagram.com/..."
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">YouTube URL</label>
					<input
						type="url"
						bind:value={settings.social_youtube}
						placeholder="https://youtube.com/..."
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<button
					onclick={handleSaveSettings}
					class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium"
				>
					Save Changes
				</button>
			</div>
		{/if}

		<!-- Statistics -->
		{#if activeTab === 'stats'}
			<div>
				<div class="flex items-center justify-between mb-4">
					<p class="text-slate-400">Manage site statistics displayed across the website</p>
					<button
						onclick={() => openStatsModal()}
						class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium"
					>
						Add Statistic
					</button>
				</div>

				<div class="space-y-3">
					{#each stats as stat}
						<div class="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
							<div>
								<div class="flex items-center space-x-3 mb-1">
									{#if stat.icon}
										<span class="text-2xl">{stat.icon}</span>
									{/if}
									<h3 class="text-lg font-semibold text-slate-100">
										{stat.value}{stat.suffix || ''}
									</h3>
								</div>
								<p class="text-slate-400">{stat.label}</p>
								<div class="flex items-center space-x-2 mt-2">
									<span class="px-2 py-1 bg-primary-600/20 text-primary-400 rounded text-xs capitalize">
										{stat.category}
									</span>
									<span class="px-2 py-1 rounded text-xs {stat.active ? 'bg-green-900/20 text-green-400' : 'bg-slate-800 text-slate-400'}">
										{stat.active ? 'Active' : 'Inactive'}
									</span>
								</div>
							</div>
							<div class="flex items-center space-x-2">
								<button
									onclick={() => openStatsModal(stat)}
									class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
								>
									Edit
								</button>
								<button
									onclick={() => handleDeleteStat(stat)}
									class="px-4 py-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/40 transition-colors text-sm font-medium"
								>
									Delete
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>

<!-- Stats Modal -->
{#if showStatsModal}
	<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
		<div class="bg-slate-900 rounded-xl max-w-2xl w-full">
			<!-- Modal Header -->
			<div class="flex items-center justify-between p-6 border-b border-slate-800">
				<h2 class="text-2xl font-bold text-slate-100">
					{editingStat ? 'Edit Statistic' : 'Add New Statistic'}
				</h2>
				<button
					onclick={closeStatsModal}
					class="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Modal Body -->
			<form onsubmit={handleSaveStat} class="p-6 space-y-6">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">Key *</label>
						<input
							type="text"
							bind:value={statForm.key}
							placeholder="years_experience"
							required
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">Category *</label>
						<select
							bind:value={statForm.category}
							required
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						>
							{#each statCategories as category}
								<option value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
							{/each}
						</select>
					</div>
				</div>

				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Label *</label>
					<input
						type="text"
						bind:value={statForm.label}
						placeholder="Years Experience"
						required
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">Value *</label>
						<input
							type="text"
							bind:value={statForm.value}
							placeholder="10+"
							required
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">Suffix</label>
						<input
							type="text"
							bind:value={statForm.suffix}
							placeholder="Years"
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						/>
					</div>
				</div>

				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Icon (emoji)</label>
					<input
						type="text"
						bind:value={statForm.icon}
						placeholder="📊"
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<div class="flex items-center">
					<input
						type="checkbox"
						id="active"
						bind:checked={statForm.active}
						class="w-4 h-4 text-primary-600 bg-slate-800 border-slate-700 rounded focus:ring-primary-600"
					/>
					<label for="active" class="ml-2 text-sm text-slate-300">
						Active
					</label>
				</div>

				<!-- Actions -->
				<div class="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
					<button
						type="button"
						onclick={closeStatsModal}
						class="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors font-medium"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium"
					>
						{editingStat ? 'Update' : 'Add'} Statistic
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
