<script lang="ts">
	import { genCollectionSidebarDefs } from './controller';
	
	const defs = genCollectionSidebarDefs();
	const { datas, states, actions } = defs;
</script>

<div class="collection-sidebar">
	<div class="collection-header">
		<h3>Collections</h3>
		<button
			class="toggle-btn"
			onclick={() => actions.toggleCollections()}
		>
			{states.collectionsExpanded() ? '▲' : '▼'}
		</button>
	</div>

	{#if states.collectionsExpanded()}
		<div class="collections-list">
			{#if states.collectionsLoading()}
				<div class="loading">Loading collections...</div>
			{:else if datas.sortedCollections().length === 0}
				<div class="empty">No collections found</div>
			{:else}
				{#each datas.sortedCollections() as collection (collection.id)}
					<div class="collection-item">
						<div class="collection-name">
							<button
								class="collection-button"
								class:selected={datas.selectedCollection()?.id === collection.id}
								onclick={() => actions.selectCollection(collection)}
							>
								{collection.name}
							</button>
							<button
								class="pin-btn"
								class:pinned={datas.pinnedCollections().has(collection.id)}
								onclick={() => actions.togglePin(collection.id)}
							>
								📌
							</button>
						</div>
						{#if states.expandedCollections().has(collection.id)}
							<div class="collection-records">
								<!-- Records content will be handled by RecordList component -->
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>

<style>
	.collection-sidebar {
		background: var(--color-surface);
		border-right: 1px solid var(--color-border);
		padding: 1rem;
		width: 250px;
		flex-shrink: 0;
	}

	.collection-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.collection-header h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
	}

	.toggle-btn {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	.toggle-btn:hover {
		background-color: var(--color-hover);
	}

	.collections-list {
		max-height: 400px;
		overflow-y: auto;
	}

	.loading, .empty {
		text-align: center;
		color: var(--color-text-secondary);
		padding: 1rem;
		font-size: 0.9rem;
	}

	.collection-item {
		margin-bottom: 0.5rem;
	}

	.collection-name {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.collection-button {
		flex: 1;
		background: none;
		border: 1px solid var(--color-border);
		padding: 0.5rem;
		text-align: left;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
		color: var(--color-text);
		font-size: 0.9rem;
	}

	.collection-button:hover {
		background-color: var(--color-hover);
		border-color: var(--color-primary);
	}

	.collection-button.selected {
		background-color: var(--color-primary-light);
		border-color: var(--color-primary);
		color: var(--color-primary-dark);
		font-weight: 500;
	}

	.pin-btn {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem;
		border-radius: 4px;
		opacity: 0.6;
		transition: opacity 0.2s;
	}

	.pin-btn:hover {
		opacity: 1;
	}

	.pin-btn.pinned {
		opacity: 1;
		background-color: var(--color-warning-light);
	}

	.collection-records {
		margin-top: 0.5rem;
		margin-left: 1rem;
		padding-left: 0.5rem;
		border-left: 1px solid var(--color-border);
	}
</style>