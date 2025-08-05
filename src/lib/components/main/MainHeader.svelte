<script lang="ts">
  import { RefreshCw, Plus, Code, ChevronRight } from 'lucide-svelte';

  interface Props {
    selectedCollection: string;
    loading: boolean;
    onRefresh: () => void;
  }

  const { selectedCollection, loading, onRefresh }: Props = $props();
</script>

<div class="main-header">
  <div class="breadcrumb">
    <span class="breadcrumb-item">Collections</span>
    <ChevronRight size={14} color="#9ca3af" />
    <span class="breadcrumb-item active">{selectedCollection}</span>
  </div>
  <div class="header-actions">
    <button class="btn btn-secondary" disabled>
      <Code size={16} />
      API Preview
    </button>
    <button class="btn btn-primary" onclick={onRefresh} disabled={loading}>
      {#if loading}
        <RefreshCw size={16} class="spin" />
      {:else}
        <Plus size={16} />
      {/if}
      {loading ? 'Loading...' : 'New record'}
    </button>
  </div>
</div>

<style>
  .main-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
  }

  .breadcrumb-item {
    color: #6b7280;
  }

  .breadcrumb-item.active {
    color: #1f2937;
    font-weight: 600;
  }

  .breadcrumb-separator {
    color: #9ca3af;
  }

  .header-actions {
    display: flex;
    gap: 0.75rem;
  }

  .btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 6px;
    border: 1px solid;
    cursor: pointer;
    transition: all 0.2s;
  }

  :global(.spin) {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .btn-primary {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .btn-primary:hover:not(:disabled) {
    background: #2563eb;
  }

  .btn-secondary {
    background: white;
    color: #374151;
    border-color: #d1d5db;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #f9fafb;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>