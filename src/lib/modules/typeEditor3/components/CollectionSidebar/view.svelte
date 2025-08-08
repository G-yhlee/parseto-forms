<script lang="ts">
	import CollectionItem from '../CollectionItem/view.svelte';

	interface Collection {
		id: string;
		name: string;
		type: string;
	}

	interface Props {
		collections?: Collection[];
		selectedCollectionId?: string;
		pinnedCollectionIds?: Set<string>;
		expandedCollectionIds?: Set<string>;
		onCollectionSelect?: (collection: Collection) => void;
		onTogglePin?: (collectionId: string) => void;
		onToggleRecords?: (collectionId: string) => void;
	}

	const { 
		collections = [],
		selectedCollectionId,
		pinnedCollectionIds = new Set(),
		expandedCollectionIds = new Set(),
		onCollectionSelect,
		onTogglePin,
		onToggleRecords
	}: Props = $props();

	let collectionsExpanded = $state(true);
</script>

<div class="collection-sidebar">
	<div class="sidebar-header">
		<button
			class="header-toggle"
			onclick={() => collectionsExpanded = !collectionsExpanded}
		>
			<span class="toggle-icon">
				{collectionsExpanded ? '⬇️' : '➡️'}
			</span>
			Collections
		</button>
	</div>

	{#if collectionsExpanded}
		<div class="collections-list">
			{#each collections as collection (collection.id)}
				<CollectionItem
					{collection}
					isSelected={selectedCollectionId === collection.id}
					isPinned={pinnedCollectionIds.has(collection.id)}
					isExpanded={expandedCollectionIds.has(collection.id)}
					onSelect={onCollectionSelect}
					{onTogglePin}
					{onToggleRecords}
				/>
			{/each}
			
			{#if collections.length === 0}
				<div class="empty-state">
					No collections available
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.collection-sidebar {
		width: 100%;
		background: #f8fafc;
		border-right: 1px solid #e2e8f0;
	}

	.sidebar-header {
		padding: 0.5rem;
		border-bottom: 1px solid #e2e8f0;
		background: white;
	}

	.header-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.5rem;
		background: none;
		border: none;
		cursor: pointer;
		font-weight: 500;
		color: #374151;
		text-align: left;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	.header-toggle:hover {
		background-color: #f1f5f9;
	}

	.toggle-icon {
		font-size: 12px;
	}

	.collections-list {
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.empty-state {
		padding: 2rem 1rem;
		text-align: center;
		color: #64748b;
		font-style: italic;
	}
</style>