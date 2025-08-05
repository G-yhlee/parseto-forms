<script lang="ts">
  import type { PocketBaseRecord } from '$lib/pocketbase';
  import { DataFormatters } from '$lib/utils/formatters';
  import { ColumnExtractor } from '$lib/utils/columnExtractor';
  import TableCell from './TableCell.svelte';

  interface Props {
    record: PocketBaseRecord;
    columns: string[];
    onSelect: () => void;
  }

  const { record, columns, onSelect }: Props = $props();

  function handleRowClick(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Row clicked:', record);
    console.log('onSelect function:', onSelect);
    onSelect();
  }
</script>

<tr class="data-row" onclick={handleRowClick}>
  <td class="checkbox-cell">
    <input type="checkbox" />
  </td>
  <td class="id-cell">
    <span class="id-value">{DataFormatters.formatId(record.id)}</span>
  </td>
  {#each columns.filter(col => col !== 'id') as column}
    <TableCell 
      key={column}
      value={ColumnExtractor.getNestedValue(record, column)}
    />
  {/each}
  <td class="actions-cell">
    <button class="action-btn" onclick={handleRowClick}>→</button>
  </td>
</tr>

<style>
  .data-row {
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .data-row:hover {
    background: #f9fafb;
  }

  .data-row td {
    padding: 0.75rem;
    vertical-align: top;
  }

  .checkbox-cell {
    text-align: center;
  }

  .id-value {
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.75rem;
    color: #6b7280;
    background: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }

  .action-btn {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .action-btn:hover {
    background: #f3f4f6;
    color: #374151;
  }
</style>