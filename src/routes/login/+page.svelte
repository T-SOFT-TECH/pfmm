<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { pb, login } from '$lib/pocketbase';

	let email = $state('');
	let password = $state('');
	let rememberMe = $state(false);
	let isLoading = $state(false);
	let error = $state('');
	let checkingAuth = $state(true);

	// Check if already logged in
	onMount(() => {
		if (pb.authStore.isValid) {
			const user = pb.authStore.model as any;
			const role = user?.role || 'user';

			if (role === 'admin') {
				goto('/admin', { replaceState: true });
			} else {
				goto('/user', { replaceState: true });
			}
		} else {
			checkingAuth = false;
		}
	});

	async function handleLogin(e: Event) {
		e.preventDefault();

		if (!email || !password) {
			error = 'Please fill in all fields';
			return;
		}

		isLoading = true;
		error = '';

		const result = await login(email, password);

		if (result.success) {
			// Get user role from backend
			const user = result.user as any;
			const role = user?.role || 'user';

			// Redirect based on role
			if (role === 'admin') {
				window.location.href = '/admin';
			} else {
				window.location.href = '/user';
			}
		} else {
			error = result.error || 'Login failed. Please check your credentials.';
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Login - Preaching Fingers</title>
</svelte:head>

<div class="min-h-screen bg-dark-950 flex items-center justify-center p-4">
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-5">
		<div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgb(var(--color-primary-400) / 0.3) 1px, transparent 0); background-size: 40px 40px;"></div>
	</div>

	{#if checkingAuth}
		<!-- Checking authentication -->
		<div class="text-center">
			<div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
			<p class="text-dark-400 mt-4">Checking authentication...</p>
		</div>
	{:else}
	<!-- Login Card -->
	<div class="relative w-full max-w-md">
		<div class="bg-dark-900 border border-dark-800 rounded-2xl p-8 shadow-2xl">
			<!-- Logo and Title -->
			<div class="text-center mb-8">
				<img src="/logo.png" alt="Logo" class="h-16 w-16 mx-auto mb-4 object-contain" />
				<h1 class="text-2xl font-bold text-dark-100 mb-2">Welcome Back</h1>
				<p class="text-dark-400">Sign in to continue to your account</p>
			</div>

			<!-- Login Form -->
			<form onsubmit={handleLogin} class="space-y-5">
				{#if error}
					<div class="p-3 bg-red-600/20 border border-red-600/50 rounded-lg text-red-400 text-sm">
						{error}
					</div>
				{/if}

				<!-- Email Field -->
				<div>
					<label for="email" class="block text-sm font-medium text-dark-300 mb-2">
						Email Address
					</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						placeholder="your@email.com"
						class="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-600 transition-colors"
						required
						disabled={isLoading}
					/>
				</div>

				<!-- Password Field -->
				<div>
					<label for="password" class="block text-sm font-medium text-dark-300 mb-2">
						Password
					</label>
					<input
						type="password"
						id="password"
						bind:value={password}
						placeholder="••••••••"
						class="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-600 transition-colors"
						required
						disabled={isLoading}
					/>
				</div>

				<!-- Remember Me & Forgot Password -->
				<div class="flex items-center justify-between">
					<label class="flex items-center space-x-2 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={rememberMe}
							class="w-4 h-4 rounded bg-dark-800 border-dark-700 text-primary-600 focus:ring-primary-600"
							disabled={isLoading}
						/>
						<span class="text-sm text-dark-400">Remember me</span>
					</label>
					<a href="/forgot-password" class="text-sm text-primary-400 hover:text-primary-300">
						Forgot password?
					</a>
				</div>

				<!-- Login Button -->
				<button
					type="submit"
					disabled={isLoading}
					class="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold hover:from-primary-500 hover:to-accent-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
				>
					{#if isLoading}
						<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						<span>Signing in...</span>
					{:else}
						<span>Sign In</span>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					{/if}
				</button>
			</form>

			<!-- Divider -->
			<div class="relative my-6">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-dark-800"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="px-2 bg-dark-900 text-dark-500">Don't have an account?</span>
				</div>
			</div>

			<!-- Sign Up Link -->
			<div class="text-center">
				<a href="/register" class="text-primary-400 hover:text-primary-300 font-medium">
					Create an account
				</a>
			</div>
		</div>

		<!-- Back to Home -->
		<div class="text-center mt-6">
			<a href="/" class="text-dark-400 hover:text-dark-200 text-sm flex items-center justify-center space-x-2">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				<span>Back to Home</span>
			</a>
		</div>
	</div>
	{/if}
</div>
