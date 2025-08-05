<script lang="ts">
  import type { PocketBaseRecord } from '$lib/pocketbase';
  import { DataFormatters } from '$lib/utils/formatters';
  import TableHeader from './table/TableHeader.svelte';
  import TableRow from './table/TableRow.svelte';

  interface Props {
    records: PocketBaseRecord[];
    onRecordSelect: (record: PocketBaseRecord) => void;
  }

  const { records, onRecordSelect }: Props = $props();

  // Get table columns from first record
  let columns = $derived(
    records.length > 0 
      ? Object.keys(records[0]).filter(key => !['collectionId', 'collectionName'].includes(key))
      : []
  );

  // Debug logging
  $effect(() => {
    console.log('DataTable - records:', records);
    console.log('DataTable - columns:', columns);
    if (records.length > 0) {
      console.log('DataTable - first record:', records[0]);
    }
  });
</script>

<div class="data-table-container">
  <table class="data-table">
    <TableHeader columns={columns} />
    <tbody>
      {#each records as record (record.id)}
        <TableRow 
          record={record}
          columns={columns}
          onSelect={() => onRecordSelect(record)}
        />
      {/each}
    </tbody>
  </table>
  
  <div class="table-footer">
    <div class="total-count">Total found: {records.length}</div>
  </div>
</div>

<style>
  .data-table-container {
    flex: 1;
    overflow: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  .table-footer {
    padding: 0.75rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    background: #f9fafb;
  }

  .total-count {
    font-size: 0.875rem;
    color: #6b7280;
  }
</style>