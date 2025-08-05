<script lang="ts">
  import type { PocketBaseRecord } from '$lib/pocketbase';

  interface Props {
    record: PocketBaseRecord;
  }

  const { record }: Props = $props();
</script>

<div class="detail-section">
  <h4>Basic Info</h4>
  <div class="info-grid">
    <div class="info-item">
      <span class="info-label">ID:</span>
      <span class="info-value">{record.id}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Created:</span>
      <span class="info-value">{new Date(record.created).toLocaleString()}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Updated:</span>
      <span class="info-value">{new Date(record.updated).toLocaleString()}</span>
    </div>
  </div>
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

  .info-grid {
    display: grid;
    gap: 0.75rem;
  }

  .info-item {
    display: flex;
    gap: 0.5rem;
  }

  .info-label {
    font-weight: 500;
    color: #6b7280;
    min-width: 80px;
    font-size: 0.875rem;
  }

  .info-value {
    font-family: 'Monaco', 'Menlo', monospace;
    color: #1f2937;
    word-break: break-all;
    font-size: 0.875rem;
  }
</style>