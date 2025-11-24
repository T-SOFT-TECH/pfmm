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
				<div class="pt-8 border-t border-dark-700">
					<div class="text-dark-400 text-sm mb-4">Follow on social media</div>
					<div class="flex space-x-3">
						{#each ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'] as social}
							<a
								href="#"
								class="w-10 h-10 rounded-lg bg-dark-800 hover:bg-primary-600 text-dark-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
								aria-label={social}
							>
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<circle cx="12" cy="12" r="10" />
								</svg>
							</a>
						{/each}
					</div>
				</div>
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
