<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

	// Check if on admin, user, or login routes (routes that don't need header/footer)
	const isAppRoute = $derived(
		$page.url.pathname.startsWith('/admin') ||
		$page.url.pathname.startsWith('/user') ||
		$page.url.pathname.startsWith('/login')
	);

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href="/logo.png" />
	<meta name="description" content="Aliu Ifeoluwa Philemon - Creative media producer, educator, and empowerment advocate at Preaching Fingers Music and Multimedia" />
</svelte:head>

{#if isAppRoute}
	<!-- App routes (admin/user/login) - no header/footer -->
	{@render children()}
{:else}
	<!-- Public pages - with header/footer -->
	<div class="min-h-screen flex flex-col">
		<Header />
		<main class="flex-1" style="view-transition-name: main-content;">
			{@render children()}
		</main>
		<Footer />
	</div>
{/if}
