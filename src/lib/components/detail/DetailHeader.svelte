<script lang="ts">
  import { X, FileText } from 'lucide-svelte';

  interface Props {
    onClose: () => void;
  }

  const { onClose }: Props = $props();
</script>

<div class="detail-header">
  <div class="header-title">
    <FileText size={18} color="#374151" />
    <h3>Record Details</h3>
  </div>
  <button class="close-btn" onclick={onClose}>
    <X size={18} />
  </button>
</div>

<style>
  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .detail-header h3 {
    margin: 0;
    color: #1f2937;
    font-size: 1.125rem;
    font-weight: 600;
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
</style>