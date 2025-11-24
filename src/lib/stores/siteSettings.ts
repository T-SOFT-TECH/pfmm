import { writable } from 'svelte/store';
import { pb } from '$lib/pocketbase';

export interface SiteSettings {
	id?: string;
	site_name: string;
	site_url: string;
	site_description: string;
	logo_url: string;
	og_image_url: string;
	twitter_handle: string;
	facebook_url?: string;
	instagram_url?: string;
	youtube_url?: string;
	linkedin_url?: string;
	contact_email?: string;
	contact_phone?: string;
	address?: string;
}

// Default settings (fallback)
const defaultSettings: SiteSettings = {
	site_name: 'Preaching Fingers Music Ministry',
	site_url: 'https://pfmm.com',
	site_description: 'Professional music ministry, media production, and creative empowerment services',
	logo_url: '/logo.png',
	og_image_url: '/logo.png',
	twitter_handle: '@pfmm'
};

// Create writable store
export const siteSettings = writable<SiteSettings>(defaultSettings);

// Flag to track if settings have been loaded
let settingsLoaded = false;

// Function to load site settings from database
export async function loadSiteSettings(forceReload: boolean = false): Promise<SiteSettings> {
	if (settingsLoaded && !forceReload) {
		// Return current store value if already loaded
		let currentSettings: SiteSettings = defaultSettings;
		siteSettings.subscribe(value => currentSettings = value)();
		return currentSettings;
	}

	try {
		// Fetch the first (and should be only) settings record
		const records = await pb.collection('site_settings').getFullList({
			sort: '-created'
		});

		if (records.length > 0) {
			const settings = records[0] as any;
			const loadedSettings: SiteSettings = {
				id: settings.id,
				site_name: settings.site_name || defaultSettings.site_name,
				site_url: settings.site_url || defaultSettings.site_url,
				site_description: settings.site_description || defaultSettings.site_description,
				logo_url: settings.logo_url || defaultSettings.logo_url,
				og_image_url: settings.og_image_url || defaultSettings.og_image_url,
				twitter_handle: settings.twitter_handle || defaultSettings.twitter_handle,
				facebook_url: settings.facebook_url,
				instagram_url: settings.instagram_url,
				youtube_url: settings.youtube_url,
				linkedin_url: settings.linkedin_url,
				contact_email: settings.contact_email,
				contact_phone: settings.contact_phone,
				address: settings.address
			};

			siteSettings.set(loadedSettings);
			settingsLoaded = true;
			return loadedSettings;
		}
	} catch (error) {
		console.error('Error loading site settings:', error);
	}

	// Return default settings if fetch fails
	return defaultSettings;
}

// Function to get social media URLs as array (for structured data)
export function getSocialMediaUrls(settings: SiteSettings): string[] {
	const urls: string[] = [];
	if (settings.facebook_url) urls.push(settings.facebook_url);
	if (settings.twitter_handle && settings.twitter_handle !== '@pfmm') {
		urls.push(`https://twitter.com/${settings.twitter_handle.replace('@', '')}`);
	}
	if (settings.instagram_url) urls.push(settings.instagram_url);
	if (settings.youtube_url) urls.push(settings.youtube_url);
	if (settings.linkedin_url) urls.push(settings.linkedin_url);
	return urls;
}

// Function to clear settings cache and force reload
export function clearSettingsCache() {
	settingsLoaded = false;
}

// Function to reload settings (convenience function)
export async function reloadSiteSettings(): Promise<SiteSettings> {
	return loadSiteSettings(true);
}
