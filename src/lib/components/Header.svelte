<script lang="ts">
	import { page } from '$app/stores';
	import { pb, currentUser, logout } from '$lib/pocketbase';
	import type { User } from '$lib/pocketbase';

	let mobileMenuOpen = $state(false);
	let userMenuOpen = $state(false);

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/about', label: 'About' },
		{ href: '/portfolio', label: 'Portfolio' },
		{ href: '/awards', label: 'Awards' },
		{ href: '/collaborations', label: 'Collaborations' },
		{ href: '/empowerment', label: 'Empowerment' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/testimonials', label: 'Testimonials' },
		{ href: '/contact', label: 'Contact' }
	];

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function toggleUserMenu() {
		userMenuOpen = !userMenuOpen;
	}

	function handleLogout() {
		logout();
		userMenuOpen = false;
		window.location.href = '/';
	}

	function getDashboardLink(user: User | null) {
		if (!user) return '/login';
		return user.role === 'admin' ? '/admin' : '/user';
	}
</script>

<header class="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-md border-b border-dark-800">
	<nav class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-20">
			<!-- Logo -->
			<a href="/" class="flex items-center space-x-3 group">
				<img src="/logo.png" alt="Preaching Fingers" class="h-12 w-12 object-contain transition-transform group-hover:scale-110" />
				<div class="hidden md:block">
					<div class="text-lg font-bold text-primary-400 group-hover:text-primary-300 transition-colors">
						Preaching Fingers
					</div>
					<div class="text-xs text-accent-400 font-medium">Music & Multimedia</div>
				</div>
			</a>

			<!-- Desktop Navigation -->
			<div class="hidden lg:flex items-center space-x-1">
				{#each navLinks as link}
					<a
						href={link.href}
						class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
							{$page.url.pathname === link.href
								? 'bg-primary-600/20 text-primary-400'
								: 'text-dark-200 hover:text-primary-400 hover:bg-dark-800'}"
					>
						{link.label}
					</a>
				{/each}

				{#if $currentUser}
					<!-- User Menu -->
					<div class="relative ml-4">
						<button
							onclick={toggleUserMenu}
							class="flex items-center space-x-2 px-4 py-2 rounded-lg text-dark-200 hover:bg-dark-800 transition-all duration-200"
						>
							<div class="w-8 h-8 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 flex items-center justify-center text-white font-semibold">
								{$currentUser.username?.charAt(0).toUpperCase() || 'U'}
							</div>
							<span class="font-medium">{$currentUser.username}</span>
							<svg class="w-4 h-4 transition-transform {userMenuOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>

						{#if userMenuOpen}
							<div class="absolute right-0 mt-2 w-56 bg-dark-800 border border-dark-700 rounded-lg shadow-xl py-2 animate-fade-in">
								<div class="px-4 py-3 border-b border-dark-700">
									<p class="text-sm text-dark-400">Signed in as</p>
									<p class="text-sm font-medium text-dark-100 truncate">{$currentUser.email}</p>
								</div>
								<a
									href={getDashboardLink($currentUser as User)}
									class="block px-4 py-2 text-sm text-dark-200 hover:bg-dark-700 hover:text-primary-400 transition-colors"
								>
									Dashboard
								</a>
								<button
									onclick={handleLogout}
									class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-700 transition-colors"
								>
									Logout
								</button>
							</div>
						{/if}
					</div>
				{:else}
					<!-- Login Button -->
					<a
						href="/login"
						class="ml-4 px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-medium hover:from-primary-500 hover:to-accent-500 transition-all duration-200 shadow-lg hover:shadow-primary-600/50"
					>
						Login
					</a>
				{/if}
			</div>

			<!-- Mobile Menu Button -->
			<button
				onclick={toggleMobileMenu}
				class="lg:hidden p-2 rounded-lg text-dark-200 hover:text-primary-400 hover:bg-dark-800 transition-colors"
				aria-label="Toggle menu"
			>
				{#if mobileMenuOpen}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{:else}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				{/if}
			</button>
		</div>

		<!-- Mobile Navigation -->
		{#if mobileMenuOpen}
			<div class="lg:hidden py-4 border-t border-dark-800 animate-fade-in">
				<div class="flex flex-col space-y-2">
					{#each navLinks as link}
						<a
							href={link.href}
							onclick={closeMobileMenu}
							class="px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
								{$page.url.pathname === link.href
									? 'bg-primary-600/20 text-primary-400'
									: 'text-dark-200 hover:text-primary-400 hover:bg-dark-800'}"
						>
							{link.label}
						</a>
					{/each}

					{#if $currentUser}
						<!-- User Info -->
						<div class="px-4 py-3 bg-dark-800 rounded-lg border border-dark-700">
							<div class="flex items-center space-x-3 mb-3">
								<div class="w-10 h-10 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 flex items-center justify-center text-white font-semibold text-lg">
									{$currentUser.username?.charAt(0).toUpperCase() || 'U'}
								</div>
								<div>
									<p class="text-sm font-medium text-dark-100">{$currentUser.username}</p>
									<p class="text-xs text-dark-400 truncate">{$currentUser.email}</p>
								</div>
							</div>
							<a
								href={getDashboardLink($currentUser as User)}
								onclick={closeMobileMenu}
								class="block w-full px-4 py-2 bg-primary-600 text-white rounded-lg text-center font-medium hover:bg-primary-500 transition-colors mb-2"
							>
								Dashboard
							</a>
							<button
								onclick={() => { closeMobileMenu(); handleLogout(); }}
								class="block w-full px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-center font-medium hover:bg-red-600 hover:text-white transition-colors"
							>
								Logout
							</button>
						</div>
					{:else}
						<!-- Login Button -->
						<a
							href="/login"
							onclick={closeMobileMenu}
							class="px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-medium text-center hover:from-primary-500 hover:to-accent-500 transition-all duration-200 shadow-lg"
						>
							Sign In
						</a>
					{/if}
				</div>
			</div>
		{/if}
	</nav>
</header>

<!-- Spacer to prevent content from hiding under fixed header -->
<div class="h-20"></div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.2s ease-out;
	}
</style>
