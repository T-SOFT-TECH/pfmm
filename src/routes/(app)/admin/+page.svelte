<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';

	let stats = $state([
		{ label: 'Total Projects', value: '0', icon: '📁', collection: 'portfolio' },
		{ label: 'Blog Posts', value: '0', icon: '📝', collection: 'blog' },
		{ label: 'Testimonials', value: '0', icon: '💬', collection: 'testimonials' },
		{ label: 'Messages', value: '0', icon: '📧', collection: 'contact_messages' }
	]);

	let recentActivity = $state<any[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			await Promise.all([
				loadStats(),
				loadRecentActivity()
			]);
		} catch (err) {
			console.error('Error loading dashboard data:', err);
		} finally {
			loading = false;
		}
	});

	async function loadStats() {
		const results = await Promise.all(
			stats.map(async (s) => {
				try {
					const result = await pb.collection(s.collection).getList(1, 1, {
						fields: 'id'
					});
					return { ...s, value: result.totalItems.toString() };
				} catch (err) {
					console.error(`Error loading stats for ${s.collection}:`, err);
					return s;
				}
			})
		);
		stats = results;
	}

	async function loadRecentActivity() {
		try {
			const [projects, posts, tests] = await Promise.all([
				pb.collection('portfolio').getList(1, 3, { sort: '-created' }),
				pb.collection('blog').getList(1, 3, { sort: '-created' }),
				pb.collection('testimonials').getList(1, 3, { sort: '-created' })
			]);

			const activity = [
				...projects.items.map(item => ({
					action: `Project added: ${item.title}`,
					time: item.created,
					icon: '📁',
					type: 'portfolio'
				})),
				...posts.items.map(item => ({
					action: `Blog post: ${item.title}`,
					time: item.created,
					icon: '📝',
					type: 'blog'
				})),
				...tests.items.map(item => ({
					action: `Testimonial from ${item.name}`,
					time: item.created,
					icon: '💬',
					type: 'testimonial'
				}))
			].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
			 .slice(0, 5);

			recentActivity = activity;
		} catch (err) {
			console.error('Error loading recent activity:', err);
		}
	}

	function formatTime(dateStr: string) {
		const date = new Date(dateStr);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMins < 60) return `${diffMins} minutes ago`;
		if (diffHours < 24) return `${diffHours} hours ago`;
		return `${diffDays} days ago`;
	}
</script>

<svelte:head>
	<title>Dashboard - Admin Panel</title>
</svelte:head>

<div class="space-y-8">
	<!-- Header -->
	<div>
		<h1 class="text-3xl font-bold text-slate-100 mb-2">Admin Dashboard</h1>
		<p class="text-slate-400">Welcome back! Here's what's happening with your website.</p>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="text-slate-400">Loading dashboard data...</div>
		</div>
	{:else}
		<!-- Stats Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each stats as stat}
				<div class="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-primary-600/50 transition-colors">
					<div class="flex items-start justify-between mb-4">
						<div class="text-3xl">{stat.icon}</div>
					</div>
					<div class="text-3xl font-bold text-slate-100 mb-1">{stat.value}</div>
					<div class="text-sm text-slate-400">{stat.label}</div>
				</div>
			{/each}
		</div>

		<!-- Recent Activity -->
		<div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
			<h2 class="text-xl font-bold text-slate-100 mb-6">Recent Activity</h2>
			<div class="space-y-4">
				{#if recentActivity.length === 0}
					<p class="text-slate-500 text-center py-4">No recent activity found.</p>
				{:else}
					{#each recentActivity as activity}
						<div class="flex items-start space-x-4 pb-4 border-b border-slate-800 last:border-0 last:pb-0">
							<div class="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
								<span class="text-xl">{activity.icon}</span>
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-slate-200 font-medium">{activity.action}</p>
								<p class="text-sm text-slate-500 mt-1">
									{formatTime(activity.time)}
								</p>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>