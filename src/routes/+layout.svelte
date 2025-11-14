<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

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

<div class="min-h-screen flex flex-col">
	<Header />
	<main class="flex-1" style="view-transition-name: main-content;">
		{@render children()}
	</main>
	<Footer />
</div>
