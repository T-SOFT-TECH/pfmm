<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';

	let testimonials = $state<any[]>([]);
	let loading = $state(true);
	let error = $state('');
	let showModal = $state(false);
	let editingTestimonial = $state<any>(null);
	let filterStatus = $state('all');

	// Form state
	let form = $state({
		name: '',
		role: '',
		company: '',
		quote: '',
		avatar: null as File | null,
		rating: 5,
		type: 'client',
		featured: false,
		status: 'pending'
	});

	const types = ['client', 'trainee', 'partner', 'collaborator'];
	const statuses = ['pending', 'approved', 'rejected'];

	onMount(async () => {
		await loadTestimonials();
	});

	async function loadTestimonials() {
		try {
			loading = true;
			const filter = filterStatus === 'all' ? '' : `status = "${filterStatus}"`;
			const records = await pb.collection('testimonials').getFullList({
				sort: '-created',
				filter
			});
			testimonials = records;
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function openCreateModal() {
		editingTestimonial = null;
		form = {
			name: '',
			role: '',
			company: '',
			quote: '',
			avatar: null,
			rating: 5,
			type: 'client',
			featured: false,
			status: 'pending'
		};
		showModal = true;
	}

	function openEditModal(testimonial: any) {
		editingTestimonial = testimonial;
		form = {
			name: testimonial.name || '',
			role: testimonial.role || '',
			company: testimonial.company || '',
			quote: testimonial.quote || '',
			avatar: null,
			rating: testimonial.rating || 5,
			type: testimonial.type || 'client',
			featured: testimonial.featured || false,
			status: testimonial.status || 'pending'
		};
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingTestimonial = null;
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			form.avatar = target.files[0];
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		try {
			const formData = new FormData();
			formData.append('name', form.name);
			formData.append('role', form.role);
			formData.append('company', form.company);
			formData.append('quote', form.quote);
			formData.append('rating', form.rating.toString());
			formData.append('type', form.type);
			formData.append('featured', form.featured.toString());
			formData.append('status', form.status);

			if (form.avatar) {
				formData.append('avatar', form.avatar);
			}

			if (editingTestimonial) {
				await pb.collection('testimonials').update(editingTestimonial.id, formData);
			} else {
				await pb.collection('testimonials').create(formData);
			}

			await loadTestimonials();
			closeModal();
		} catch (err: any) {
			error = err.message;
		}
	}

	async function handleDelete(testimonial: any) {
		if (!confirm(`Are you sure you want to delete the testimonial from ${testimonial.name}?`)) return;

		try {
			await pb.collection('testimonials').delete(testimonial.id);
			await loadTestimonials();
		} catch (err: any) {
			error = err.message;
		}
	}

	async function handleStatusChange(testimonial: any, newStatus: string) {
		try {
			await pb.collection('testimonials').update(testimonial.id, { status: newStatus });
			await loadTestimonials();
		} catch (err: any) {
			error = err.message;
		}
	}

	function getAvatarUrl(testimonial: any) {
		if (!testimonial.avatar) return `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=f97316&color=fff`;
		return pb.files.getUrl(testimonial, testimonial.avatar);
	}

	function getStars(rating: number) {
		return '⭐'.repeat(rating);
	}
</script>

<svelte:head>
	<title>Testimonials Management - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-slate-100">Testimonials</h1>
			<p class="text-slate-400 mt-1">Manage client testimonials and reviews</p>
		</div>
		<button
			onclick={openCreateModal}
			class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium flex items-center space-x-2"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			<span>Add Testimonial</span>
		</button>
	</div>

	<!-- Filter -->
	<div class="flex items-center space-x-2">
		<span class="text-sm text-slate-400">Filter:</span>
		{#each ['all', ...statuses] as status}
			<button
				onclick={async () => { filterStatus = status; await loadTestimonials(); }}
				class="px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize {filterStatus === status ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}"
			>
				{status}
			</button>
		{/each}
	</div>

	{#if error}
		<div class="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
			{error}
		</div>
	{/if}

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="text-slate-400">Loading testimonials...</div>
		</div>
	{:else if testimonials.length === 0}
		<div class="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
			<div class="text-6xl mb-4">💬</div>
			<h3 class="text-xl font-semibold text-slate-200 mb-2">No testimonials yet</h3>
			<p class="text-slate-400 mb-6">Start collecting feedback from your clients</p>
			<button
				onclick={openCreateModal}
				class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium"
			>
				Add First Testimonial
			</button>
		</div>
	{:else}
		<!-- Testimonials Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each testimonials as testimonial}
				<div class="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-primary-600/50 transition-all">
					<!-- Header -->
					<div class="flex items-start justify-between mb-4">
						<div class="flex items-center space-x-4">
							<img
								src={getAvatarUrl(testimonial)}
								alt={testimonial.name}
								class="w-12 h-12 rounded-full object-cover"
							/>
							<div>
								<h3 class="text-lg font-semibold text-slate-100">{testimonial.name}</h3>
								<p class="text-sm text-slate-400">{testimonial.role}</p>
								{#if testimonial.company}
									<p class="text-xs text-slate-500">{testimonial.company}</p>
								{/if}
							</div>
						</div>
						{#if testimonial.featured}
							<span class="text-yellow-400 text-xl" title="Featured">⭐</span>
						{/if}
					</div>

					<!-- Rating -->
					<div class="mb-3 text-xl">
						{getStars(testimonial.rating)}
					</div>

					<!-- Quote -->
					<p class="text-slate-300 mb-4 italic">"{testimonial.quote}"</p>

					<!-- Meta -->
					<div class="flex items-center space-x-2 text-sm mb-4">
						<span class="px-2 py-1 bg-primary-600/20 text-primary-400 rounded capitalize">
							{testimonial.type}
						</span>
						<span class="px-2 py-1 rounded capitalize {
							testimonial.status === 'approved' ? 'bg-green-900/20 text-green-400' :
							testimonial.status === 'pending' ? 'bg-yellow-900/20 text-yellow-400' :
							'bg-red-900/20 text-red-400'
						}">
							{testimonial.status}
						</span>
					</div>

					<!-- Actions -->
					<div class="flex items-center space-x-2">
						{#if testimonial.status === 'pending'}
							<button
								onclick={() => handleStatusChange(testimonial, 'approved')}
								class="flex-1 px-3 py-2 bg-green-900/20 text-green-400 rounded-lg hover:bg-green-900/40 transition-colors text-sm font-medium"
							>
								Approve
							</button>
							<button
								onclick={() => handleStatusChange(testimonial, 'rejected')}
								class="flex-1 px-3 py-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/40 transition-colors text-sm font-medium"
							>
								Reject
							</button>
						{/if}
						<button
							onclick={() => openEditModal(testimonial)}
							class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
						>
							Edit
						</button>
						<button
							onclick={() => handleDelete(testimonial)}
							class="px-4 py-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/40 transition-colors text-sm font-medium"
						>
							Delete
						</button>
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
					{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
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
				<!-- Name & Role -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">Name *</label>
						<input
							type="text"
							bind:value={form.name}
							required
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">Role *</label>
						<input
							type="text"
							bind:value={form.role}
							required
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						/>
					</div>
				</div>

				<!-- Company -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Company/Organization</label>
					<input
						type="text"
						bind:value={form.company}
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					/>
				</div>

				<!-- Quote -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Testimonial *</label>
					<textarea
						bind:value={form.quote}
						rows="4"
						required
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
					></textarea>
				</div>

				<!-- Rating, Type, Status -->
				<div class="grid grid-cols-3 gap-4">
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">Rating *</label>
						<select
							bind:value={form.rating}
							required
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						>
							{#each [1, 2, 3, 4, 5] as rating}
								<option value={rating}>{rating} {'⭐'.repeat(rating)}</option>
							{/each}
						</select>
					</div>

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
						<label class="block text-sm font-medium text-slate-300 mb-2">Status *</label>
						<select
							bind:value={form.status}
							required
							class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600"
						>
							{#each statuses as status}
								<option value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Avatar -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Avatar (Optional)</label>
					<input
						type="file"
						accept="image/*"
						onchange={handleFileChange}
						class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-500"
					/>
					<p class="text-xs text-slate-500 mt-1">If no avatar is provided, initials will be used</p>
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
						{editingTestimonial ? 'Update' : 'Add'} Testimonial
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
