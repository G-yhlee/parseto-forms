<script lang="ts">
	import TypeEditorSidebar from './TypeEditorSidebar.svelte';
	import type { PocketBaseRecord } from '../types';
	import type { CollectionEntity } from '$lib/domain/entities/Collection';
	
	interface Props {
		// Collection data
		collections: CollectionEntity[];
		collectionsLoading: boolean;
		selectedCollection: CollectionEntity | null;
		
		// Record data
		recordList: PocketBaseRecord[];
		recordListLoading: boolean;
		currentRecordId: string | null;
		
		// Event handlers
		onCollectionSelect: (collection: CollectionEntity) => void;
		onRecordSelect: (recordId: string) => void;
		
		// Slot content
		children?: any;
	}

	const { 
		collections,
		collectionsLoading,
		selectedCollection,
		recordList,
		recordListLoading,
		currentRecordId,
		onCollectionSelect,
		onRecordSelect,
		children
	}: Props = $props();
</script>

<div class="type-editor-layout">
	<TypeEditorSidebar 
		{collections}
		collectionsLoading={collectionsLoading}
		{selectedCollection}
		{recordList}
		recordListLoading={recordListLoading}
		{currentRecordId}
		{onCollectionSelect}
		{onRecordSelect}
	/>
	
	<main class="main-content">
		{@render children?.()}
	</main>
</div>

<style>
	.type-editor-layout {
		display: flex;
		height: 100vh;
		background: #fafafa;
	}

	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
		background: white;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.type-editor-layout {
			flex-direction: column;
		}
	}
</style>