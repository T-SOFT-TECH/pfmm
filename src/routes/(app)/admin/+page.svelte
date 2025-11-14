<script lang="ts">
	const stats = [
		{ label: 'Total Projects', value: '127', change: '+12%', trend: 'up', icon: '📁' },
		{ label: 'Blog Posts', value: '45', change: '+8%', trend: 'up', icon: '📝' },
		{ label: 'Testimonials', value: '89', change: '+5%', trend: 'up', icon: '💬' },
		{ label: 'Page Views', value: '12.5K', change: '+23%', trend: 'up', icon: '👁️' }
	];

	const recentActivity = [
		{ action: 'New testimonial added', user: 'Samuel Adebayo', time: '2 hours ago', type: 'testimonial' },
		{ action: 'Portfolio project updated', user: 'Admin', time: '5 hours ago', type: 'portfolio' },
		{ action: 'Blog post published', user: 'Admin', time: '1 day ago', type: 'blog' },
		{ action: 'New collaboration added', user: 'Admin', time: '2 days ago', type: 'collaboration' },
		{ action: 'Award recognition added', user: 'Admin', time: '3 days ago', type: 'award' }
	];
</script>

<svelte:head>
	<title>Dashboard - Admin Panel</title>
</svelte:head>

<div class="space-y-8">
	<!-- Header -->
	<div>
		<h1 class="text-3xl font-bold text-dark-100 mb-2">Admin Dashboard</h1>
		<p class="text-dark-400">Welcome back! Here's what's happening with your website.</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		{#each stats as stat}
			<div class="bg-dark-900 border border-dark-800 rounded-xl p-6 hover:border-primary-600/50 transition-colors">
				<div class="flex items-start justify-between mb-4">
					<div class="text-3xl">{stat.icon}</div>
					<span class="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
						{stat.change}
					</span>
				</div>
				<div class="text-3xl font-bold text-dark-100 mb-1">{stat.value}</div>
				<div class="text-sm text-dark-400">{stat.label}</div>
			</div>
		{/each}
	</div>

	<!-- Recent Activity -->
	<div class="bg-dark-900 border border-dark-800 rounded-xl p-6">
		<h2 class="text-xl font-bold text-dark-100 mb-6">Recent Activity</h2>
		<div class="space-y-4">
			{#each recentActivity as activity}
				<div class="flex items-start space-x-4 pb-4 border-b border-dark-800 last:border-0 last:pb-0">
					<div class="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
						<svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<circle cx="12" cy="12" r="10" stroke-width="2"/>
						</svg>
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-dark-200 font-medium">{activity.action}</p>
						<p class="text-sm text-dark-500 mt-1">
							by {activity.user} · {activity.time}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
