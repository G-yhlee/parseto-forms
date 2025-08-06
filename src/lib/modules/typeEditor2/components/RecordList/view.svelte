<script lang="ts">
	import { genRecordListDefs } from './controller';
	
	const defs = genRecordListDefs();
	const { datas, states, actions } = defs;
	
	export let onRecordSelect: (recordId: string) => void = () => {};
</script>

<div class="record-list">
	<div class="record-header">
		<h4>Records ({datas.recordCount()})</h4>
	</div>

	<div class="record-content">
		{#if states.recordListLoading()}
			<div class="loading">Loading records...</div>
		{:else if !datas.hasRecords()}
			<div class="empty">No records found</div>
		{:else}
			<div class="record-items">
				{#each datas.recordList() as record (record.id)}
					<button
						class="record-item"
						class:selected={datas.currentRecordId() === record.id}
						onclick={() => onRecordSelect(record.id)}
					>
						<div class="record-preview">
							{actions.getRecordPreview(record)}
						</div>
						<div class="record-meta">
							<span class="record-id">{record.id}</span>
							<span class="record-date">
								{actions.formatDate(record.created)}
							</span>
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.record-list {
		background: var(--color-surface);
		border-right: 1px solid var(--color-border);
		padding: 1rem;
		width: 300px;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.record-header {
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	.record-header h4 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.record-content {
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.loading, .empty {
		text-align: center;
		color: var(--color-text-secondary);
		padding: 2rem 1rem;
		font-size: 0.9rem;
	}

	.record-items {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.record-item {
		width: 100%;
		background: none;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		padding: 0.75rem;
		text-align: left;
		cursor: pointer;
		transition: all 0.2s;
		color: var(--color-text);
	}

	.record-item:hover {
		background-color: var(--color-hover);
		border-color: var(--color-primary-light);
	}

	.record-item.selected {
		background-color: var(--color-primary-light);
		border-color: var(--color-primary);
	}

	.record-preview {
		font-size: 0.9rem;
		line-height: 1.4;
		margin-bottom: 0.5rem;
		color: var(--color-text);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.record-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		gap: 0.5rem;
	}

	.record-id {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		background-color: var(--color-surface-variant);
		padding: 0.125rem 0.25rem;
		border-radius: 3px;
		flex-shrink: 0;
	}

	.record-date {
		flex-shrink: 0;
	}
</style>