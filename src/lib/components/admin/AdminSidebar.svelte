<script lang="ts">
	import { logout } from '$lib/pocketbase';

	let { sidebarOpen = $bindable(true) } = $props();

	const menuItems = [
		{ href: '/admin', label: 'Dashboard', icon: '📊' },
		{ href: '/admin/portfolio', label: 'Portfolio', icon: '💼' },
		{ href: '/admin/blog', label: 'Blog Posts', icon: '📝' },
		{ href: '/admin/testimonials', label: 'Testimonials', icon: '💬' },
		{ href: '/admin/awards', label: 'Awards', icon: '🏆' },
		{ href: '/admin/collaborations', label: 'Collaborations', icon: '🤝' },
		{ href: '/admin/settings', label: 'Settings', icon: '⚙️' }
	];

	function handleLogout() {
		logout();
		window.location.href = '/login';
	}
</script>

<aside class="w-64 bg-dark-900 border-r border-dark-800 fixed h-full z-30 transition-transform {sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0">
	<!-- Logo/Brand -->
	<div class="p-6 border-b border-dark-800">
		<div class="flex items-center space-x-3">
			<img src="/logo.png" alt="Logo" class="h-10 w-10 object-contain" />
			<div>
				<div class="text-primary-400 font-bold text-lg">Admin Panel</div>
				<div class="text-xs text-dark-500">Preaching Fingers</div>
			</div>
		</div>
	</div>

	<!-- Navigation -->
	<nav class="p-4">
		<ul class="space-y-2">
			{#each menuItems as item}
				<li>
					<a
						href={item.href}
						class="flex items-center space-x-3 px-4 py-3 rounded-lg text-dark-300 hover:bg-dark-800 hover:text-primary-400 transition-colors"
					>
						<span class="text-xl">{item.icon}</span>
						<span class="font-medium">{item.label}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<!-- Logout Button -->
	<div class="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-800">
		<button
			onclick={handleLogout}
			class="w-full px-4 py-3 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center space-x-2"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
			</svg>
			<span>Logout</span>
		</button>
	</div>
</aside>
