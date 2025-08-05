<script lang="ts">
	import { DataFormatters } from '$lib/utils/formatters';
	import { IconUtils } from '$lib/utils/icons';
	import { Hash } from 'lucide-svelte';

	interface Props {
		columns: string[];
	}

	const { columns }: Props = $props();
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
			<th>
				<div class="th-content">
					<div class="field-header">
						<IconComponent size={12} color="#6b7280" />
						<span>{column}</span>
					</div>
					<span class="field-type">{DataFormatters.getFieldType(column)}</span>
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
</style>
