<script lang="ts">
	import { viewport } from '$lib/actions/viewport';

	let {
		variant = 'fade',
		duration = 1,
		delay = 0,
		children
	}: {
		variant?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale';
		duration?: number;
		delay?: number;
		children?: any;
	} = $props();

	let inView = $state(false);

	function handleEnterViewport() {
		inView = true;
	}

	function handleExitViewport() {
		inView = false;
	}
</script>

<div
	use:viewport
	onenterViewport={handleEnterViewport}
	onexitViewport={handleExitViewport}
	class="animate-wrapper {inView ? `enter-${variant}` : `exit-${variant}`}"
	style="--duration: {duration}s; --delay: {delay}s;"
>
	{@render children?.()}
</div>

<style>
	.animate-wrapper {
		transition: all var(--duration) ease-out var(--delay);
	}

	/* Fade animations */
	.enter-fade {
		opacity: 1;
		transform: none;
	}

	.exit-fade {
		opacity: 0;
	}

	/* Slide up animations */
	.enter-slide-up {
		opacity: 1;
		transform: translateY(0);
	}

	.exit-slide-up {
		opacity: 0;
		transform: translateY(50px);
	}

	/* Slide down animations */
	.enter-slide-down {
		opacity: 1;
		transform: translateY(0);
	}

	.exit-slide-down {
		opacity: 0;
		transform: translateY(-50px);
	}

	/* Slide left animations */
	.enter-slide-left {
		opacity: 1;
		transform: translateX(0);
	}

	.exit-slide-left {
		opacity: 0;
		transform: translateX(50px);
	}

	/* Slide right animations */
	.enter-slide-right {
		opacity: 1;
		transform: translateX(0);
	}

	.exit-slide-right {
		opacity: 0;
		transform: translateX(-50px);
	}

	/* Scale animations */
	.enter-scale {
		opacity: 1;
		transform: scale(1);
	}

	.exit-scale {
		opacity: 0;
		transform: scale(0.8);
	}
</style>
