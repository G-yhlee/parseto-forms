<script lang="ts">
	import { genRecordsListDefs, type RecordsListProps } from './controller';
	
	interface Props extends RecordsListProps {}
	
	const props: Props = $props();
	
	// Generate defs
	const defs = genRecordsListDefs(props);
	const { datas, states, actions } = defs;
</script>

<div class="collection-records">
	{#if datas.loading()}
		<div class="records-loading">
			<div class="mini-spinner"></div>
			<span>{datas.loadingText()}</span>
		</div>
	{:else if !states.hasRecords()}
		<div class="records-empty">
			<span>{datas.emptyText()}</span>
		</div>
	{:else}
		<div class="records-list">
			{#each datas.visibleRecords() as record}
				<button
					class="record-item-mini"
					class:active={states.isCurrentRecord(record.id)}
					onclick={() => actions.handleRecordSelect(record.id)}
					title={actions.getRecordPreview(record)}
				>
					<div class="record-preview-mini">
						{actions.getRecordPreview(record)}
					</div>
					<div class="record-id-mini">
						{record.id.substring(0, 6)}...
					</div>
					{#if states.isCurrentRecord(record.id)}
						<div class="mini-active-indicator"></div>
					{/if}
				</button>
			{/each}
			
			{#if states.hasMoreRecords() && !states.showAll()}
				<button class="records-more" onclick={actions.toggleShowAll}>
					+{datas.hiddenCount()} more records
				</button>
			{:else if states.showAll() && states.hasMoreRecords()}
				<button class="records-less" onclick={actions.toggleShowAll}>
					Show less
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.collection-records {
		background: #f8fafc;
		border-top: 1px solid #e2e8f0;
		padding: 0.5rem;
	}

	.records-loading, .records-empty {
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

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
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

	.records-more, .records-less {
		padding: 0.5rem;
		text-align: center;
		color: #64748b;
		font-size: 0.75rem;
		font-style: italic;
		border: none;
		background: none;
		cursor: pointer;
		border-top: 1px solid #e2e8f0;
		margin-top: 0.25rem;
		transition: color 0.2s;
	}

	.records-more:hover, .records-less:hover {
		color: #374151;
	}
</style>