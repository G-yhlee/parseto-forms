<script lang="ts">
  import { X, FileText, Code, Database } from 'lucide-svelte';
  import type { PocketBaseRecord } from '$lib/pocketbase';

  interface Props {
    record: PocketBaseRecord;
    selectedTab: 'data' | 'type';
    onClose: () => void;
    onTabChange: (tab: 'data' | 'type') => void;
  }

  const { record, selectedTab, onClose, onTabChange }: Props = $props();
</script>

<div class="detail-header">
  <div class="header-main">
    <div class="header-title">
      <Database size={18} color="#374151" />
      <div class="title-info">
        <h3>Record Details</h3>
        <span class="record-id">ID: {record.id}</span>
      </div>
    </div>
    <button class="close-btn" onclick={onClose}>
      <X size={18} />
    </button>
  </div>
  <div class="header-tabs">
    <button 
      class="tab-btn" 
      class:active={selectedTab === 'data'}
      onclick={() => onTabChange('data')}
    >
      <FileText size={16} />
      Data
    </button>
    <button 
      class="tab-btn" 
      class:active={selectedTab === 'type'}
      onclick={() => onTabChange('type')}
    >
      <Code size={16} />
      Type
    </button>
  </div>
</div>

<style>
  .detail-header {
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }

  .header-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 1.5rem 1rem;
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .title-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .detail-header h3 {
    margin: 0;
    color: #1f2937;
    font-size: 1.125rem;
    font-weight: 600;
  }

  .record-id {
    font-size: 0.75rem;
    color: #6b7280;
    font-family: monospace;
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    padding: 0.5rem;
    line-height: 1;
    border-radius: 4px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover {
    color: #374151;
    background: #e5e7eb;
  }

  .header-tabs {
    display: flex;
    padding: 0 1.5rem;
    gap: 0.5rem;
  }

  .tab-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: none;
    background: none;
    color: #6b7280;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    border-radius: 6px 6px 0 0;
    transition: all 0.2s;
    border-bottom: 2px solid transparent;
  }

  .tab-btn:hover {
    color: #374151;
    background: #f3f4f6;
  }

  .tab-btn.active {
    color: #3b82f6;
    background: white;
    border-bottom-color: #3b82f6;
  }
</style>