<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';

	let { children } = $props();
	let sidebarOpen = $state(true);

	onMount(() => {
		// Check if user is authenticated
		if (!pb.authStore.isValid) {
			goto('/login');
			return;
		}

		// Check if user has admin role
		const user = pb.authStore.model as any;
		if (user && user.role !== 'admin') {
			// Redirect non-admin users to user dashboard
			goto('/user');
		}
	});

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}
</script>

<svelte:head>
	<title>Admin Panel - Preaching Fingers</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 flex">
	<!-- Sidebar -->
	<AdminSidebar bind:sidebarOpen />

	<!-- Main Content -->
	<div class="flex-1 lg:ml-64">
		<!-- Header -->
		<AdminHeader {toggleSidebar} />

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
