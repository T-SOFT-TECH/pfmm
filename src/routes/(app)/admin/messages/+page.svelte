<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';

	let messages = $state<any[]>([]);
	let loading = $state(true);
	let error = $state('');
	let selectedMessage = $state<any>(null);
	let filterStatus = $state('all');

	const statuses = ['new', 'read', 'replied', 'archived'];

	onMount(async () => {
		await loadMessages();
	});

	async function loadMessages() {
		try {
			loading = true;
			const filter = filterStatus === 'all' ? '' : `status = "${filterStatus}"`;
			const records = await pb.collection('contact_messages').getFullList({
				sort: '-created',
				filter,
				expand: 'replied_by'
			});
			messages = records;
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	async function handleStatusChange(message: any, newStatus: string) {
		try {
			const data: any = { status: newStatus };

			if (newStatus === 'read' && message.status === 'new') {
				// Auto-mark as read when opened
			} else if (newStatus === 'replied' && message.status !== 'replied') {
				data.replied_at = new Date().toISOString();
				data.replied_by = pb.authStore.model?.id;
			}

			await pb.collection('contact_messages').update(message.id, data);
			await loadMessages();
		} catch (err: any) {
			error = err.message;
		}
	}

	async function handleDelete(message: any) {
		if (!confirm(`Are you sure you want to delete this message from ${message.name}?`)) return;

		try {
			await pb.collection('contact_messages').delete(message.id);
			await loadMessages();
			if (selectedMessage?.id === message.id) {
				selectedMessage = null;
			}
		} catch (err: any) {
			error = err.message;
		}
	}

	async function openMessage(message: any) {
		selectedMessage = message;
		if (message.status === 'new') {
			await handleStatusChange(message, 'read');
		}
	}

	function closeMessageDetail() {
		selectedMessage = null;
	}

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Contact Messages - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-3xl font-bold text-slate-100">Contact Messages</h1>
		<p class="text-slate-400 mt-1">Manage contact form submissions</p>
	</div>

	<!-- Filter -->
	<div class="flex items-center space-x-2">
		<span class="text-sm text-slate-400">Filter:</span>
		{#each ['all', ...statuses] as status}
			<button
				onclick={async () => { filterStatus = status; await loadMessages(); }}
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

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Messages List -->
		<div class="lg:col-span-1 space-y-3">
			{#if loading}
				<div class="flex items-center justify-center py-12">
					<div class="text-slate-400">Loading messages...</div>
				</div>
			{:else if messages.length === 0}
				<div class="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
					<div class="text-4xl mb-3">📧</div>
					<p class="text-slate-400">No messages found</p>
				</div>
			{:else}
				{#each messages as message}
					<button
						onclick={() => openMessage(message)}
						class="w-full text-left bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-primary-600/50 transition-all {selectedMessage?.id === message.id ? 'border-primary-600 bg-primary-900/10' : ''}"
					>
						<div class="flex items-start justify-between mb-2">
							<div class="flex-1 min-w-0">
								<h3 class="font-semibold text-slate-100 truncate">{message.name}</h3>
								<p class="text-sm text-slate-400 truncate">{message.subject}</p>
							</div>
							{#if message.status === 'new'}
								<span class="ml-2 w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-2"></span>
							{/if}
						</div>
						<div class="flex items-center justify-between text-xs">
							<span class="text-slate-500">{formatDate(message.created)}</span>
							<span class="px-2 py-1 rounded capitalize {
								message.status === 'new' ? 'bg-primary-900/20 text-primary-400' :
								message.status === 'read' ? 'bg-yellow-900/20 text-yellow-400' :
								message.status === 'replied' ? 'bg-green-900/20 text-green-400' :
								'bg-slate-800 text-slate-400'
							}">
								{message.status}
							</span>
						</div>
					</button>
				{/each}
			{/if}
		</div>

		<!-- Message Detail -->
		<div class="lg:col-span-2">
			{#if selectedMessage}
				<div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
					<!-- Header -->
					<div class="flex items-start justify-between mb-6 pb-6 border-b border-slate-800">
						<div class="flex-1">
							<h2 class="text-2xl font-bold text-slate-100 mb-2">{selectedMessage.subject}</h2>
							<div class="space-y-1 text-sm text-slate-400">
								<p><span class="font-medium">From:</span> {selectedMessage.name} ({selectedMessage.email})</p>
								<p><span class="font-medium">Date:</span> {formatDate(selectedMessage.created)}</p>
								{#if selectedMessage.replied_at}
									<p class="text-green-400"><span class="font-medium">Replied:</span> {formatDate(selectedMessage.replied_at)}</p>
								{/if}
							</div>
						</div>
						<button
							onclick={closeMessageDetail}
							class="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
						>
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					<!-- Message Content -->
					<div class="mb-6">
						<h3 class="text-sm font-medium text-slate-300 mb-3">Message:</h3>
						<div class="bg-slate-800 rounded-lg p-4 text-slate-200 whitespace-pre-wrap">
							{selectedMessage.message}
						</div>
					</div>

					<!-- Actions -->
					<div class="flex items-center space-x-2">
						<a
							href="mailto:{selectedMessage.email}?subject=Re: {selectedMessage.subject}"
							onclick={() => handleStatusChange(selectedMessage, 'replied')}
							class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium"
						>
							Reply via Email
						</a>

						{#if selectedMessage.status !== 'archived'}
							<button
								onclick={() => handleStatusChange(selectedMessage, 'archived')}
								class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors font-medium"
							>
								Archive
							</button>
						{/if}

						{#if selectedMessage.status === 'archived'}
							<button
								onclick={() => handleStatusChange(selectedMessage, 'read')}
								class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors font-medium"
							>
								Unarchive
							</button>
						{/if}

						<button
							onclick={() => handleDelete(selectedMessage)}
							class="px-4 py-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/40 transition-colors font-medium"
						>
							Delete
						</button>
					</div>

					<!-- Status Buttons -->
					<div class="mt-4 pt-4 border-t border-slate-800">
						<p class="text-xs text-slate-500 mb-2">Change status:</p>
						<div class="flex items-center space-x-2">
							{#each statuses as status}
								<button
									onclick={() => handleStatusChange(selectedMessage, status)}
									class="px-3 py-1 rounded text-xs font-medium transition-colors capitalize {selectedMessage.status === status ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}"
								>
									{status}
								</button>
							{/each}
						</div>
					</div>
				</div>
			{:else}
				<div class="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
					<div class="text-6xl mb-4">📨</div>
					<h3 class="text-xl font-semibold text-slate-200 mb-2">Select a message</h3>
					<p class="text-slate-400">Click on a message from the list to view its details</p>
				</div>
			{/if}
		</div>
	</div>
</div>
