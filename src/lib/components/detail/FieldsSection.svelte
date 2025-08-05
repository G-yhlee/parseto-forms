<script lang="ts">
  import type { PocketBaseRecord } from '$lib/pocketbase';
  import { DataFormatters } from '$lib/utils/formatters';
  import JsonViewer from '../JsonViewer.svelte';

  interface Props {
    record: PocketBaseRecord;
  }

  const { record }: Props = $props();

  let displayFields = $derived(
    DataFormatters.getRecordDisplayFields(record).filter(([key]) => 
      !['id', 'created', 'updated'].includes(key)
    )
  );
</script>

<div class="detail-section">
  <h4>Fields</h4>
  {#each displayFields as [key, value]}
    <div class="field">
      <div class="field-label"><strong>{key}:</strong></div>
      <div class="field-value">
        {#if DataFormatters.isJsonValue(value)}
          <JsonViewer data={DataFormatters.parseJsonValue(value)} expanded={true} />
        {:else}
          <span class="simple-value">{String(value)}</span>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .detail-section {
    margin-bottom: 2rem;
  }

  .detail-section h4 {
    margin: 0 0 1rem 0;
    color: #374151;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }

  .field {
    margin: 1rem 0;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 6px;
    border-left: 4px solid #3b82f6;
  }

  .field-label {
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: #374151;
    font-weight: 500;
  }

  .field-value {
    font-size: 0.875rem;
  }

  .simple-value {
    font-family: 'Monaco', 'Menlo', monospace;
    background: white;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    color: #1f2937;
    border: 1px solid #e5e7eb;
    display: block;
    word-break: break-all;
  }
</style>