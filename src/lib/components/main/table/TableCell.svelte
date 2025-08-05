<script lang="ts">
	import { DataFormatters } from '$lib/utils/formatters';

	interface Props {
		key: string;
		value: unknown;
	}

	const { key, value }: Props = $props();

	let formattedValue = $derived.by(() => {
		if (key === 'created' || key === 'updated') {
			return {
				type: 'date',
				content: DataFormatters.formatDate(value as string)
			};
		}

		if (key === 'verified' || key === 'emailVisibility' || key === 'emailConsent') {
			const boolFormat = DataFormatters.formatBoolean(value as boolean);
			return {
				type: 'boolean',
				content: boolFormat.text,
				class: boolFormat.class
			};
		}

		return {
			type: 'text',
			content: DataFormatters.formatCellValue(value)
		};
	});
</script>

<td class="data-cell">
	{#if formattedValue.type === 'date'}
		<span class="date-value">{formattedValue.content}</span>
	{:else if formattedValue.type === 'boolean'}
		<span class="bool-value {formattedValue.class}">{formattedValue.content}</span>
	{:else}
		<span class="text-value">{formattedValue.content}</span>
	{/if}
</td>

<style>
	.date-value {
		font-family: 'Monaco', 'Menlo', monospace;
		font-size: 0.75rem;
		color: #374151;
	}

	.bool-value {
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.bool-true {
		background: #d1fae5;
		color: #065f46;
	}

	.bool-false {
		background: #fee2e2;
		color: #991b1b;
	}

	.text-value {
		color: #374151;
	}
</style>
