<script lang="ts">
  import Icon from '../ui/Icon.svelte';
  import { IconUtils } from '$lib/utils/icons';
  import type { ComponentType } from 'svelte';

  interface Props {
    name: string;
    active: boolean;
    onClick: () => void;
  }

  const { name, active, onClick }: Props = $props();
  
  // Get appropriate icon for this collection
  const iconComponent = IconUtils.getCollectionIcon(name);
</script>

<button 
  class="collection-item"
  class:active={active}
  onclick={onClick}
>
  <div class="collection-icon">
    <Icon 
      icon={iconComponent} 
      size={16} 
      class={active ? 'text-blue-600' : 'text-gray-500'} 
    />
  </div>
  <span class="collection-name">{name}</span>
</button>

<style>
  .collection-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    border: none;
    background: none;
    color: #374151;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
    border-radius: 0;
  }

  .collection-item:hover {
    background: #f3f4f6;
  }

  .collection-item.active {
    background: #eff6ff;
    color: #1d4ed8;
    border-right: 3px solid #3b82f6;
  }

  .collection-icon {
    width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :global(.text-blue-600) {
    color: #1d4ed8;
  }

  :global(.text-gray-500) {
    color: #6b7280;
  }

  .collection-name {
    font-size: 0.875rem;
    font-weight: 500;
  }
</style>