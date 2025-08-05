<script lang="ts">
	import type { PocketBaseRecord } from '$lib/pocketbase';
	import DetailHeader from './DetailHeader.svelte';
	import DetailContent from './DetailContent.svelte';

	interface Props {
		record: PocketBaseRecord;
		onClose: () => void;
	}

	const { record, onClose }: Props = $props();

	let panelWidth = $state(40); // percentage
	let isResizing = $state(false);

	function handleMouseDown(e: MouseEvent) {
		isResizing = true;
		e.preventDefault();
		
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		document.body.style.cursor = 'ew-resize';
		document.body.style.userSelect = 'none';
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isResizing) return;
		
		const windowWidth = window.innerWidth;
		const mouseX = e.clientX;
		const newWidth = ((windowWidth - mouseX) / windowWidth) * 100;
		
		// Minimum 20%, Maximum 80%
		panelWidth = Math.max(20, Math.min(80, newWidth));
	}

	function handleMouseUp() {
		isResizing = false;
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
		document.body.style.cursor = '';
		document.body.style.userSelect = '';
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="overlay" onclick={onClose}></div>
<div class="detail-panel" style="width: {panelWidth}%">
	<div class="resize-handle" onmousedown={handleMouseDown}></div>
	<DetailHeader {onClose} />
	<DetailContent {record} />
</div>

<style>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 9999;
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.detail-panel {
		position: fixed;
		top: 0;
		right: 0;
		height: 100vh;
		background: white;
		box-shadow: -4px 0 32px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
		z-index: 10000;
		animation: slideInFromRight 0.3s ease;
	}

	.resize-handle {
		position: absolute;
		left: 0;
		top: 0;
		width: 4px;
		height: 100%;
		cursor: ew-resize;
		background: transparent;
		z-index: 10001;
	}

	.resize-handle:hover {
		background: #3b82f6;
		opacity: 0.3;
	}

	@keyframes slideInFromRight {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}

	@media (max-width: 768px) {
		.detail-panel {
			width: 100%;
		}
	}
</style>
