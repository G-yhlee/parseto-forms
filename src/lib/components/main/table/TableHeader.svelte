<script lang="ts">
	import { DataFormatters } from '$lib/utils/formatters';
	import { IconUtils } from '$lib/utils/icons';
	import { ColumnExtractor } from '$lib/utils/columnExtractor';
	import { Hash } from 'lucide-svelte';

	interface Props {
		columns: string[];
	}

	const { columns }: Props = $props();

	// 컬럼명 표시용 포맷팅
	function getDisplayName(column: string): string {
		if (column.includes('.')) {
			const parts = column.split('.');
			return parts[parts.length - 1]; // 마지막 부분만 표시
		}
		return column;
	}

	// 컬럼 전체 경로 표시 (툴팁용)
	function getFullPath(column: string): string {
		return ColumnExtractor.formatColumnName(column);
	}
</script>

<thead>
	<tr>
		<th class="checkbox-col">
			<input type="checkbox" />
		</th>
		<th class="id-col">
			<div class="th-content">
				<div class="field-header">
					<Hash size={12} color="#6b7280" />
					<span>id</span>
				</div>
			</div>
		</th>
		{#each columns.filter((col) => col !== 'id') as column}
			{@const IconComponent = IconUtils.getFieldTypeIcon(DataFormatters.getFieldType(column))}
			<th title={getFullPath(column)}>
				<div class="th-content">
					<div class="field-header">
						<IconComponent size={12} color="#6b7280" />
						<span class="column-name">{getDisplayName(column)}</span>
						{#if column.includes('.')}
							<span class="nested-indicator">•</span>
						{/if}
					</div>
					<span class="field-type">{DataFormatters.getFieldType(column)}</span>
					{#if column.includes('.')}
						<span class="full-path">{getFullPath(column)}</span>
					{/if}
				</div>
			</th>
		{/each}
		<th class="actions-col"></th>
	</tr>
</thead>

<style>
	thead th {
		background: #f9fafb;
		border-bottom: 1px solid #e5e7eb;
		padding: 0.75rem;
		text-align: left;
		font-weight: 500;
		color: #374151;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.th-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.field-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.field-type {
		font-size: 0.75rem;
		color: #6b7280;
		font-weight: 400;
	}

	.checkbox-col {
		width: 40px;
	}

	.id-col {
		width: 120px;
	}

	.actions-col {
		width: 50px;
	}

	.column-name {
		font-weight: 500;
	}

	.nested-indicator {
		color: #3b82f6;
		font-weight: bold;
		margin-left: 0.25rem;
	}

	.full-path {
		font-size: 0.625rem;
		color: #9ca3af;
		font-weight: 400;
		font-family: monospace;
	}
</style>
