<script lang="ts">
	let { toggleSidebar } = $props<{ toggleSidebar: () => void }>();
</script>

<header class="bg-dark-900 border-b border-dark-800 sticky top-0 z-20">
	<div class="flex items-center justify-between p-4">
		<!-- Mobile Menu Button -->
		<button
			onclick={toggleSidebar}
			class="lg:hidden p-2 rounded-lg text-dark-300 hover:bg-dark-800 hover:text-accent-400"
			aria-label="Toggle sidebar"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</button>

		<!-- Search Bar -->
		<div class="flex-1 max-w-2xl mx-4">
			<input
				type="search"
				placeholder="Search courses, projects..."
				class="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-accent-600"
			/>
		</div>

		<!-- Right Side Actions -->
		<div class="flex items-center space-x-4">
			<!-- Notifications -->
			<button class="p-2 rounded-lg text-dark-300 hover:bg-dark-800 hover:text-accent-400 relative" aria-label="Notifications">
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
				</svg>
				<span class="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full"></span>
			</button>

			<!-- User Profile -->
			<button class="flex items-center space-x-2 p-2 rounded-lg text-dark-300 hover:bg-dark-800 hover:text-accent-400">
				<div class="w-8 h-8 bg-gradient-to-br from-accent-600 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
					U
				</div>
				<span class="text-sm font-medium hidden md:block">User Name</span>
			</button>
		</div>
	</div>
</header>
