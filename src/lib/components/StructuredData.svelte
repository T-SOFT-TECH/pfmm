<script lang="ts">
	import { onMount } from 'svelte';
	import { siteSettings, loadSiteSettings, getSocialMediaUrls, type SiteSettings } from '$lib/stores/siteSettings';

	interface Props {
		type?: 'Organization' | 'Person' | 'LocalBusiness';
	}

	let { type = 'Organization' }: Props = $props();
	let settings = $state<SiteSettings>($siteSettings);

	onMount(async () => {
		await loadSiteSettings();
		settings = $siteSettings;
	});

	const structuredData = $derived(() => {
		const socialUrls = getSocialMediaUrls(settings);

		if (type === 'Person') {
			return {
				'@context': 'https://schema.org',
				'@type': 'Person',
				name: 'Aliu Ifeoluwa Philemon',
				jobTitle: 'Creative Media Producer & Empowerment Advocate',
				url: settings.site_url,
				image: `${settings.site_url}${settings.logo_url}`,
				description: 'Music producer, sound engineer, video producer, and creative mentor with over 10 years of experience in music ministry and media production.',
				knowsAbout: [
					'Music Production',
					'Sound Engineering',
					'Video Production',
					'Media Training',
					'Church Installations',
					'Creative Empowerment',
					'Ministry Leadership'
				],
				sameAs: socialUrls
			};
		}

		return {
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: settings.site_name,
			alternateName: 'PFMM',
			url: settings.site_url,
			logo: `${settings.site_url}${settings.logo_url}`,
			description: settings.site_description,
			founder: {
				'@type': 'Person',
				name: 'Aliu Ifeoluwa Philemon',
				jobTitle: 'Creative Media Producer & Empowerment Advocate',
				description: 'Music producer, sound engineer, video producer, and creative mentor with over 10 years of experience in music ministry and media production.'
			},
			address: {
				'@type': 'PostalAddress',
				...(settings.address && { streetAddress: settings.address }),
				addressCountry: 'Nigeria'
			},
			contactPoint: {
				'@type': 'ContactPoint',
				contactType: 'customer service',
				...(settings.contact_email && { email: settings.contact_email }),
				...(settings.contact_phone && { telephone: settings.contact_phone }),
				availableLanguage: ['English']
			},
			sameAs: socialUrls,
			offers: [
				{
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Service',
						name: 'Music Production & Sound Engineering',
						description: 'Studio recordings, live sound setups, mixing and mastering services'
					}
				},
				{
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Service',
						name: 'Video Production',
						description: 'Music videos, documentaries, promotional content, and video editing'
					}
				},
				{
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Service',
						name: 'Training & Empowerment',
						description: 'Creative skill workshops, audio production training, and youth empowerment programs'
					}
				},
				{
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Service',
						name: 'Technical Consultancy',
						description: 'Church media setup, live streaming systems, and technical support'
					}
				}
			]
		};
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData())}</script>`}
</svelte:head>
