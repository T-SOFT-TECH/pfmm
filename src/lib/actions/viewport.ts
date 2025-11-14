/**
 * Viewport action using Intersection Observer
 * Dispatches custom events when element enters/exits viewport
 */
export function viewport(element: HTMLElement, options?: IntersectionObserverInit) {
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			const event = entry.isIntersecting ? 'enterViewport' : 'exitViewport';
			entry.target.dispatchEvent(new CustomEvent(event));
		});
	}, options);

	observer.observe(element);

	return {
		destroy() {
			observer.unobserve(element);
		}
	};
}
