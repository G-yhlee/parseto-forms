<script lang="ts">
	import { genTypeEditorLayoutDefs, type TypeEditorLayoutProps } from './controller';
	import SidebarHeaderView from '../SidebarHeader/view.svelte';
	import CollectionItemView from '../CollectionItem/view.svelte';
	import RecordsListView from '../RecordsList/view.svelte';

	interface Props extends TypeEditorLayoutProps {}

	const props: Props = $props();

	// Generate defs
	const defs = genTypeEditorLayoutDefs(props);
	const { datas, states, actions } = defs;

	// Auto expand selected collection effect
	$effect(() => {
		actions.autoExpandSelectedCollection();
	});
</script>

<div class="type-editor-layout">
	<!-- TypeEditorSidebar with sub-components -->
	<div class="type-editor-sidebar">
		<!-- Header Component -->
		<SidebarHeaderView title="Type Editor" />

		<!-- Collections Section -->
		<div class="sidebar-section">
			<button class="section-header" onclick={() => actions.toggleCollections()}>
				{#if states.collectionsExpanded()}
					<svelte:component this={datas.ChevronDown()} size={16} />
				{:else}
					<svelte:component this={datas.ChevronRight()} size={16} />
				{/if}
				<span>Collections</span>
				{#if !datas.collectionsLoading()}
					<span class="count">{datas.collections().length}</span>
				{/if}
			</button>

			{#if states.collectionsExpanded()}
				<div class="sidebar-content">
					{#if datas.collectionsLoading()}
						<div class="loading-state">
							<div class="spinner"></div>
							<p>Loading collections...</p>
						</div>
					{:else if datas.collections().length === 0}
						<div class="empty-state">
							<p>No collections found</p>
						</div>
					{:else}
						<div class="collection-list">
							{#each datas.sortedCollections() as collection}
								{@const isExpanded = states.isCollectionExpanded(collection.id)}
								{@const isSelectedCollection = states.isSelected(collection)}
								{@const records = isSelectedCollection ? datas.recordList() : []}

								<!-- Collection Item Component -->
								<CollectionItemView
									{collection}
									isSelected={states.isSelected(collection)}
									isPinned={states.isPinned(collection.id)}
									isExpanded={states.isCollectionExpanded(collection.id)}
									onSelect={actions.handleCollectionClick}
									onTogglePin={actions.togglePin}
									onToggleRecords={actions.toggleCollectionRecords}
								/>

								<!-- Records List Component -->
								{#if isExpanded}
									{#key `${collection.id}-${records.length}-${isSelectedCollection}`}
										<RecordsListView
											{records}
											loading={isSelectedCollection && datas.recordListLoading()}
											currentRecordId={datas.currentRecordId()}
											emptyText={isSelectedCollection ? 'No records' : 'Select to view records'}
											onRecordSelect={actions.handleRecordClick}
										/>
									{/key}
								{/if}
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<main class="main-content">
		{@render props.children?.()}
	</main>
</div>

<style>
	.type-editor-layout {
		display: flex;
		height: 100vh;
		background: #f8fafc;
	}

	.type-editor-sidebar {
		width: 300px;
		background: white;
		border-right: 1px solid #e2e8f0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.sidebar-header {
		padding: 1rem;
		border-bottom: 1px solid #e2e8f0;
		background: #f8fafc;
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #1e293b;
	}

	.header-title h2 {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0;
	}

	.sidebar-section {
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: white;
		border: none;
		border-bottom: 1px solid #e2e8f0;
		cursor: pointer;
		font-weight: 500;
		color: #374151;
		transition: background-color 0.2s;
	}

	.section-header:hover {
		background-color: #f9fafb;
	}

	.count {
		background: #e2e8f0;
		color: #64748b;
		padding: 0.125rem 0.375rem;
		border-radius: 0.75rem;
		font-size: 0.75rem;
		font-weight: 500;
		margin-left: auto;
	}

	.sidebar-content {
		flex: 1;
		overflow-y: auto;
		padding: 0.5rem;
	}

	.loading-state,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		text-align: center;
		color: #64748b;
	}

	.spinner {
		width: 24px;
		height: 24px;
		border: 2px solid #e2e8f0;
		border-top: 2px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 0.5rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.collection-list {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.collection-group {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 6px;
		overflow: hidden;
	}

	.collection-header {
		display: flex;
		align-items: center;
	}

	.collection-item {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
		position: relative;
		min-width: 0;
	}

	.collection-item:hover {
		background-color: #f1f5f9;
	}

	.collection-item.active {
		background-color: #dbeafe;
		border-left: 3px solid #3b82f6;
	}

	.collection-icon {
		color: #64748b;
		flex-shrink: 0;
	}

	.collection-info {
		flex: 1;
		min-width: 0;
	}

	.collection-name {
		font-weight: 500;
		color: #1e293b;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.collection-meta {
		font-size: 0.75rem;
		color: #64748b;
		margin-top: 0.125rem;
	}

	.collection-type {
		text-transform: uppercase;
		font-weight: 500;
		letter-spacing: 0.05em;
	}

	.active-indicator {
		position: absolute;
		right: 0.5rem;
		width: 6px;
		height: 6px;
		background: #3b82f6;
		border-radius: 50%;
	}

	.pin-btn,
	.toggle-records-btn {
		background: none;
		border: none;
		padding: 0.5rem;
		cursor: pointer;
		color: #64748b;
		transition: all 0.2s;
		border-left: 1px solid #e2e8f0;
	}

	.pin-btn:hover,
	.toggle-records-btn:hover {
		background-color: #f1f5f9;
		color: #374151;
	}

	.collection-records {
		background: #f8fafc;
		border-top: 1px solid #e2e8f0;
		padding: 0.5rem;
	}

	.records-loading,
	.records-empty {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		color: #64748b;
		font-size: 0.875rem;
		justify-content: center;
	}

	.mini-spinner {
		width: 12px;
		height: 12px;
		border: 1px solid #e2e8f0;
		border-top: 1px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	.records-list {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.record-item-mini {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 4px;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
		position: relative;
		font-size: 0.8125rem;
	}

	.record-item-mini:hover {
		background-color: #f1f5f9;
		border-color: #cbd5e1;
	}

	.record-item-mini.active {
		background-color: #dbeafe;
		border-color: #3b82f6;
	}

	.record-preview-mini {
		flex: 1;
		color: #374151;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 120px;
	}

	.record-id-mini {
		color: #64748b;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.75rem;
		flex-shrink: 0;
	}

	.mini-active-indicator {
		position: absolute;
		right: 0.25rem;
		width: 4px;
		height: 4px;
		background: #3b82f6;
		border-radius: 50%;
	}

	.records-more {
		padding: 0.5rem;
		text-align: center;
		color: #64748b;
		font-size: 0.75rem;
		font-style: italic;
		border-top: 1px solid #e2e8f0;
		margin-top: 0.25rem;
	}

	.main-content {
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
</style>
