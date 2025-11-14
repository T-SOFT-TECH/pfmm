<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
	import UserSidebar from '$lib/components/user/UserSidebar.svelte';
	import UserHeader from '$lib/components/user/UserHeader.svelte';

	let { children } = $props();
	let sidebarOpen = $state(true);

	onMount(() => {
		// Check if user is authenticated
		if (!pb.authStore.isValid) {
			goto('/login');
			return;
		}

		// Check if user has user role or admin role (admins can access user area)
		const user = pb.authStore.model as any;
		if (user && user.role !== 'user' && user.role !== 'admin') {
			// Invalid role, redirect to login
			goto('/login');
		}
	});

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}
</script>

<svelte:head>
	<title>User Portal - Preaching Fingers</title>
</svelte:head>

<div class="min-h-screen bg-dark-950 flex">
	<!-- Sidebar -->
	<UserSidebar bind:sidebarOpen />

	<!-- Main Content -->
	<div class="flex-1 lg:ml-64">
		<!-- Header -->
		<UserHeader {toggleSidebar} />

		<!-- Page Content -->
		<main class="p-6">
			{@render children()}
		</main>
	</div>
</div>

<!-- Mobile Overlay -->
{#if sidebarOpen}
	<button
		onclick={toggleSidebar}
		class="lg:hidden fixed inset-0 bg-black/50 z-20"
		aria-label="Close sidebar"
	></button>
{/if}
