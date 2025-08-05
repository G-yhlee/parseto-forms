<script lang="ts">
	import type { PocketBaseRecord } from '../types';
	
	interface Props {
		recordList: PocketBaseRecord[];
		currentRecordId: string | null;
		loading: boolean;
		onRecordSelect: (recordId: string) => void;
	}

	const { recordList, currentRecordId, loading, onRecordSelect }: Props = $props();

	function formatDate(dateString: string): string {
		try {
			return new Date(dateString).toLocaleDateString();
		} catch {
			return dateString;
		}
	}

	function getRecordPreview(record: PocketBaseRecord): string {
		// data 필드가 있으면 첫 번째 필드 값 사용
		if (record.data && typeof record.data === 'object') {
			const firstKey = Object.keys(record.data)[0];
			if (firstKey) {
				const value = record.data[firstKey];
				if (typeof value === 'string') {
					return value.substring(0, 30);
				}
			}
		}
		
		// 다른 필드에서 표시할 만한 값 찾기
		for (const [key, value] of Object.entries(record)) {
			if (key !== 'id' && key !== 'created' && key !== 'updated' && 
				key !== 'collectionId' && key !== 'collectionName') {
				if (typeof value === 'string') {
					return value.substring(0, 30);
				}
			}
		}
		
		return `Record ${record.id.substring(0, 8)}...`;
	}
</script>

<div class="record-sidebar">
	<div class="sidebar-header">
		<h3>Records</h3>
		{#if !loading}
			<span class="record-count">{recordList.length} items</span>
		{/if}
	</div>

	<div class="sidebar-content">
		{#if loading}
			<div class="loading-state">
				<div class="spinner"></div>
				<p>Loading records...</p>
			</div>
		{:else if recordList.length === 0}
			<div class="empty-state">
				<p>No records found</p>
			</div>
		{:else}
			<div class="record-list">
				{#each recordList as record}
					<button
						class="record-item"
						class:active={record.id === currentRecordId}
						onclick={() => onRecordSelect(record.id)}
					>
						<div class="record-info">
							<div class="record-preview">
								{getRecordPreview(record)}
							</div>
							<div class="record-meta">
								<span class="record-id">ID: {record.id.substring(0, 8)}...</span>
								<span class="record-date">{formatDate(record.updated)}</span>
							</div>
						</div>
						{#if record.id === currentRecordId}
							<div class="active-indicator"></div>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.record-sidebar {
		width: 300px;
		height: 100vh;
		background: white;
		border-right: 1px solid #e5e7eb;
		display: flex;
		flex-direction: column;
	}

	.sidebar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
		background: #f9fafb;
	}

	.sidebar-header h3 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
	}

	.record-count {
		font-size: 0.875rem;
		color: #6b7280;
		background: #e5e7eb;
		padding: 0.25rem 0.5rem;
		border-radius: 12px;
	}

	.sidebar-content {
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.loading-state,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 2rem;
		text-align: center;
	}

	.spinner {
		width: 24px;
		height: 24px;
		border: 2px solid #f3f4f6;
		border-top: 2px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 0.5rem;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.loading-state p,
	.empty-state p {
		color: #6b7280;
		font-size: 0.875rem;
		margin: 0;
	}

	.record-list {
		flex: 1;
		overflow-y: auto;
		padding: 0.5rem;
	}

	.record-item {
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		padding: 0.75rem;
		margin-bottom: 0.25rem;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.record-item:hover {
		background: #f3f4f6;
	}

	.record-item.active {
		background: #eff6ff;
		border: 1px solid #3b82f6;
	}

	.record-info {
		flex: 1;
		min-width: 0;
	}

	.record-preview {
		font-size: 0.875rem;
		font-weight: 500;
		color: #1f2937;
		margin-bottom: 0.25rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.record-meta {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.record-id,
	.record-date {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.active-indicator {
		width: 8px;
		height: 8px;
		background: #3b82f6;
		border-radius: 50%;
		flex-shrink: 0;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.record-sidebar {
			width: 100%;
			height: auto;
			max-height: 300px;
		}
	}
</style>