import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

// Initialize PocketBase client
export const pb = new PocketBase(PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Store for current user
export const currentUser = writable(pb.authStore.model);

// Update user store when auth state changes
pb.authStore.onChange((auth) => {
	currentUser.set(pb.authStore.model);
});

// TypeScript types
export interface User {
	id: string;
	username: string;
	email: string;
	role: 'user' | 'admin';
	avatar?: string;
	verified: boolean;
	created: string;
	updated: string;
}

// Authentication functions
export async function login(email: string, password: string) {
	try {
		const authData = await pb.collection('users').authWithPassword(email, password);
		return { success: true, user: authData.record };
	} catch (error: any) {
		return { success: false, error: error.message || 'Login failed' };
	}
}

export async function register(
	email: string,
	password: string,
	passwordConfirm: string,
	username: string,
	role: 'user' | 'admin' = 'user'
) {
	try {
		const data = {
			email,
			password,
			passwordConfirm,
			username,
			role,
			verified: false
		};
		const record = await pb.collection('users').create(data);
		// Auto login after registration
		await login(email, password);
		return { success: true, user: record };
	} catch (error: any) {
		return { success: false, error: error.message || 'Registration failed' };
	}
}

export function logout() {
	pb.authStore.clear();
}

export function isAuthenticated(): boolean {
	return pb.authStore.isValid;
}

export function isAdmin(): boolean {
	const user = pb.authStore.model as User;
	return user?.role === 'admin';
}

export function getCurrentUser(): User | null {
	return pb.authStore.model as User;
}

// Get file URL helper
export function getFileUrl(record: any, filename: string): string {
	return pb.files.getUrl(record, filename);
}
