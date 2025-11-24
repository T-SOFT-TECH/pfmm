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
		{ href: '/admin/services', label: 'Services', icon: '🎵' },
		{ href: '/admin/initiatives', label: 'Initiatives', icon: '✨' },
		{ href: '/admin/experiences', label: 'Experience', icon: '💼' },
		{ href: '/admin/skills', label: 'Skills', icon: '🎯' },
		{ href: '/admin/values', label: 'Values', icon: '❤️' },
		{ href: '/admin/stats', label: 'Statistics', icon: '📈' },
		{ href: '/admin/messages', label: 'Messages', icon: '📧' },
		{ href: '/admin/settings', label: 'Settings', icon: '⚙️' }
	];

	function handleLogout() {
		logout();
		window.location.href = '/login';
	}
</script>

<style>
	/* Custom scrollbar styling */
	nav::-webkit-scrollbar {
		width: 6px;
	}

	nav::-webkit-scrollbar-track {
		background: rgb(15 23 42); /* slate-900 */
	}

	nav::-webkit-scrollbar-thumb {
		background: rgb(51 65 85); /* slate-700 */
		border-radius: 3px;
	}

	nav::-webkit-scrollbar-thumb:hover {
		background: rgb(71 85 105); /* slate-600 */
	}

	/* Firefox scrollbar */
	nav {
		scrollbar-width: thin;
		scrollbar-color: rgb(51 65 85) rgb(15 23 42);
	}
</style>

<aside class="w-64 bg-slate-900 border-r border-slate-800 fixed h-full z-30 transition-transform {sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col">
	<!-- Logo/Brand -->
	<div class="p-6 border-b border-slate-800 flex-shrink-0">
		<div class="flex items-center space-x-3">
			<img src="/logo.png" alt="Logo" class="h-10 w-10 object-contain" />
			<div>
				<div class="text-primary-400 font-bold text-lg">Admin Panel</div>
				<div class="text-xs text-slate-500">Preaching Fingers</div>
			</div>
		</div>
	</div>

	<!-- Navigation (Scrollable) -->
	<nav class="flex-1 overflow-y-auto p-4">
		<ul class="space-y-2">
			{#each menuItems as item}
				<li>
					<a
						href={item.href}
						class="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-primary-400 transition-colors"
					>
						<span class="text-xl">{item.icon}</span>
						<span class="font-medium">{item.label}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<!-- Logout Button -->
	<div class="p-4 border-t border-slate-800 flex-shrink-0">
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
