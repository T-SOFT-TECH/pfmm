<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import Animate from '$lib/components/Animate.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { siteSettings, loadSiteSettings, type SiteSettings } from '$lib/stores/siteSettings';

	let formData = $state({
		name: '',
		email: '',
		subject: '',
		message: ''
	});

	let formStatus = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');
	let statusMessage = $state('');
	let settings = $state<SiteSettings>($siteSettings);

	onMount(async () => {
		await loadSiteSettings();
		settings = $siteSettings;
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		formStatus = 'submitting';
		statusMessage = '';

		try {
			// Submit to PocketBase contact_messages collection
			await pb.collection('contact_messages').create({
				name: formData.name,
				email: formData.email,
				subject: formData.subject,
				message: formData.message,
				status: 'new'
			});

			formStatus = 'success';
			statusMessage = 'Thank you for your message! I will get back to you soon.';

			// Reset form after 3 seconds
			setTimeout(() => {
				formData = { name: '', email: '', subject: '', message: '' };
				formStatus = 'idle';
				statusMessage = '';
			}, 3000);
		} catch (err: any) {
			formStatus = 'error';
			statusMessage = 'Failed to send message. Please try again or contact me directly via email.';
			console.error('Form submission error:', err);
		}
	}

	// Dynamic contact info from database
	const contactInfo = $derived(() => {
		const info = [];
		if (settings.contact_email) {
			info.push({
				icon: 'email',
				title: 'Email',
				value: settings.contact_email,
				link: `mailto:${settings.contact_email}`
			});
		}
		if (settings.contact_phone) {
			info.push({
				icon: 'phone',
				title: 'Phone',
				value: settings.contact_phone,
				link: `tel:${settings.contact_phone}`
			});
		}
		if (settings.address) {
			info.push({
				icon: 'location',
				title: 'Location',
				value: settings.address,
				link: null
			});
		}
		return info;
	});

	const reasons = [
		{ title: 'Creative Collaboration', description: 'Looking for professional audio, video, or media production services' },
		{ title: 'Training Opportunities', description: 'Interested in workshops and creative skill development programs' },
		{ title: 'Media Consultancy', description: 'Need technical setup, installation, or media strategy advice' },
		{ title: 'Speaking Engagements', description: 'Inviting for talks on creativity, media, and community empowerment' }
	];

	// Dynamic social media links from database (same as Footer)
	const socialLinks = $derived(() => {
		const links = [];
		if (settings.facebook_url) {
			links.push({ href: settings.facebook_url, label: 'Facebook', icon: 'facebook' });
		}
		if (settings.twitter_handle) {
			const twitterUrl = settings.twitter_handle.startsWith('@')
				? `https://twitter.com/${settings.twitter_handle.slice(1)}`
				: settings.twitter_handle.startsWith('http')
				? settings.twitter_handle
				: `https://twitter.com/${settings.twitter_handle}`;
			links.push({ href: twitterUrl, label: 'Twitter', icon: 'twitter' });
		}
		if (settings.instagram_url) {
			links.push({ href: settings.instagram_url, label: 'Instagram', icon: 'instagram' });
		}
		if (settings.linkedin_url) {
			links.push({ href: settings.linkedin_url, label: 'LinkedIn', icon: 'linkedin' });
		}
		if (settings.youtube_url) {
			links.push({ href: settings.youtube_url, label: 'YouTube', icon: 'youtube' });
		}
		return links;
	});
</script>

<SEO
	title="Contact - Get in Touch"
	description="Get in touch for music ministry services, media production inquiries, training programs, or technical installations. Contact Aliu Ifeoluwa Philemon for professional creative services and collaborations."
	image="/logo.png"
	url="https://pfmm.com/contact"
	keywords={['contact', 'get in touch', 'inquiries', 'hire music producer', 'booking', 'consultation', 'media services contact']}
/>

<!-- Hero Section -->
<section class="relative pt-32 pb-20 overflow-hidden">
	<!-- Background Image -->
	<div class="absolute inset-0">
		<img
			src="/hero/contact-hero.jpg"
			alt="Contact"
			class="w-full h-full object-cover"
		/>
		<!-- Gradient Overlays -->
		<div class="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/70 to-dark-900/90"></div>
		<div class="absolute inset-0 bg-gradient-to-r from-dark-900/60 via-transparent to-dark-900/60"></div>
	</div>

	<!-- Content -->
	<div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-5xl mx-auto text-center">
			<div class="text-6xl mb-6 animate-bounce-slow">📩</div>
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-100 mb-6">
				<span class="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
					Let's Build Something Meaningful Together
				</span>
			</h1>
			<p class="text-xl text-dark-300 max-w-3xl mx-auto leading-relaxed">
				Whether you're looking for creative collaboration, training opportunities, or media consultancy, I'm always open to meaningful partnerships that inspire change.
			</p>
		</div>
	</div>
</section>

<!-- Reasons to Connect -->
<section class="py-20 bg-dark-900">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-5xl mx-auto">
			<Animate variant="slide-up" duration={0.8}>
				<h2 class="text-3xl md:text-4xl font-bold text-dark-100 mb-12 text-center">
					Why Reach Out?
				</h2>
			</Animate>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				{#each reasons as reason, i}
					<Animate variant="slide-up" duration={0.6} delay={i * 0.1}>
						<div class="p-6 bg-dark-800 border border-primary-600/30 rounded-xl hover:border-primary-600 transition-all">
						<h3 class="text-lg font-bold text-primary-400 mb-2">
							{reason.title}
						</h3>
						<p class="text-dark-400 text-sm">
							{reason.description}
						</p>
						</div>
					</Animate>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- Contact Form & Info -->
<section class="py-20 bg-dark-800/30">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
			<!-- Contact Information -->
			<div class="lg:col-span-1 space-y-8">
				<div>
					<h2 class="text-2xl md:text-3xl font-bold text-dark-100 mb-6">
						Get in Touch
					</h2>
					<p class="text-dark-300 leading-relaxed mb-8">
						Feel free to reach out through any of these channels. I typically respond within 24-48 hours.
					</p>
				</div>

				{#each contactInfo() as info}
					<div class="flex items-start space-x-4">
						<div class="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center flex-shrink-0">
							{#if info.icon === 'email'}
								<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
								</svg>
							{:else if info.icon === 'phone'}
								<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
								</svg>
							{:else if info.icon === 'location'}
								<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
								</svg>
							{/if}
						</div>
						<div>
							<div class="text-dark-400 text-sm mb-1">{info.title}</div>
							{#if info.link}
								<a href={info.link} class="text-dark-100 font-medium hover:text-primary-400 transition-colors">
									{info.value}
								</a>
							{:else}
								<div class="text-dark-100 font-medium">{info.value}</div>
							{/if}
						</div>
					</div>
				{/each}

				<!-- Social Links -->
				{#if socialLinks().length > 0}
					<div class="pt-8 border-t border-dark-700">
						<div class="text-dark-400 text-sm mb-4">Follow on social media</div>
						<div class="flex space-x-3">
							{#each socialLinks() as social}
								<a
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									class="w-10 h-10 rounded-lg bg-dark-800 hover:bg-primary-600 text-dark-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
									aria-label={social.label}
								>
									{#if social.icon === 'facebook'}
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
											<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
										</svg>
									{:else if social.icon === 'twitter'}
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
											<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
										</svg>
									{:else if social.icon === 'instagram'}
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
											<path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
										</svg>
									{:else if social.icon === 'linkedin'}
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
											<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
										</svg>
									{:else if social.icon === 'youtube'}
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
											<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
										</svg>
									{/if}
								</a>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- Contact Form -->
			<div class="lg:col-span-2">
				<div class="bg-dark-800 border border-primary-600/30 rounded-2xl p-8">
					<h3 class="text-2xl font-bold text-dark-100 mb-6">
						Send a Message
					</h3>

					{#if formStatus === 'success'}
						<div class="mb-6 p-4 bg-green-900/20 border border-green-600 rounded-lg text-green-400">
							{statusMessage}
						</div>
					{/if}

					{#if formStatus === 'error'}
						<div class="mb-6 p-4 bg-red-900/20 border border-red-600 rounded-lg text-red-400">
							{statusMessage}
						</div>
					{/if}

					<form onsubmit={handleSubmit} class="space-y-6">
						<!-- Name -->
						<div>
							<label for="name" class="block text-dark-200 font-medium mb-2">
								Name *
							</label>
							<input
								type="text"
								id="name"
								bind:value={formData.name}
								required
								class="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-600 transition-colors"
								placeholder="Your full name"
							/>
						</div>

						<!-- Email -->
						<div>
							<label for="email" class="block text-dark-200 font-medium mb-2">
								Email *
							</label>
							<input
								type="email"
								id="email"
								bind:value={formData.email}
								required
								class="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-600 transition-colors"
								placeholder="your.email@example.com"
							/>
						</div>

						<!-- Subject -->
						<div>
							<label for="subject" class="block text-dark-200 font-medium mb-2">
								Subject *
							</label>
							<input
								type="text"
								id="subject"
								bind:value={formData.subject}
								required
								class="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-600 transition-colors"
								placeholder="What would you like to discuss?"
							/>
						</div>

						<!-- Message -->
						<div>
							<label for="message" class="block text-dark-200 font-medium mb-2">
								Message *
							</label>
							<textarea
								id="message"
								bind:value={formData.message}
								required
								rows="6"
								class="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-600 transition-colors resize-none"
								placeholder="Tell me more about your project or inquiry..."
							></textarea>
						</div>

						<!-- Submit Button -->
						<button
							type="submit"
							disabled={formStatus === 'submitting'}
							class="w-full px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:from-primary-500 hover:to-accent-500 transition-all duration-300 shadow-lg hover:shadow-primary-600/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
						>
							{#if formStatus === 'submitting'}
								<svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								<span>Sending...</span>
							{:else}
								<span>Send Message</span>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
								</svg>
							{/if}
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	@keyframes bounce-slow {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-20px);
		}
	}

	.animate-bounce-slow {
		animation: bounce-slow 3s ease-in-out infinite;
	}
</style>
