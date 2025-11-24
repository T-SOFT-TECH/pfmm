<script lang="ts">
	import { onMount } from 'svelte';
	import { siteSettings, loadSiteSettings, type SiteSettings } from '$lib/stores/siteSettings';

	interface Props {
		title: string;
		description: string;
		image?: string;
		url?: string;
		type?: 'website' | 'article' | 'profile';
		author?: string;
		publishedTime?: string;
		keywords?: string[];
		noindex?: boolean;
	}

	let {
		title,
		description,
		image = '/logo.png',
		url = '',
		type = 'website',
		author = 'Aliu Ifeoluwa Philemon',
		publishedTime,
		keywords = [],
		noindex = false
	}: Props = $props();

	let settings = $state<SiteSettings>($siteSettings);

	onMount(async () => {
		await loadSiteSettings();
		settings = $siteSettings;
	});

	// Construct full URL
	const fullUrl = $derived(url || settings.site_url);
	const fullImageUrl = $derived(
		image.startsWith('http') ? image : `${settings.site_url}${image}`
	);

	// Construct full title with site name
	const fullTitle = $derived(
		title.includes(settings.site_name) ? title : `${title} | ${settings.site_name}`
	);
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{fullTitle}</title>
	<meta name="title" content={fullTitle} />
	<meta name="description" content={description} />
	{#if keywords.length > 0}
		<meta name="keywords" content={keywords.join(', ')} />
	{/if}
	<meta name="author" content={author} />
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<meta name="robots" content="index, follow" />
	{/if}

	<!-- Canonical URL -->
	<link rel="canonical" href={fullUrl} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={fullUrl} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={fullImageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:site_name" content={settings.site_name} />
	<meta property="og:locale" content="en_US" />

	{#if type === 'article' && publishedTime}
		<meta property="article:published_time" content={publishedTime} />
		<meta property="article:author" content={author} />
	{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={fullUrl} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={fullImageUrl} />
	<meta name="twitter:creator" content={settings.twitter_handle} />
	<meta name="twitter:site" content={settings.twitter_handle} />

	<!-- Additional Meta Tags -->
	<meta name="theme-color" content="#8B5CF6" />
	<meta name="color-scheme" content="dark light" />

	<!-- Favicon -->
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/site.webmanifest" />
</svelte:head>
