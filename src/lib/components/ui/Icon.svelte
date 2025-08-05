<script lang="ts">
  import type { ComponentType } from 'svelte';

  interface Props {
    icon: ComponentType;
    size?: number;
    class?: string;
    color?: string;
  }

  const { icon, size = 16, class: className = '', color }: Props = $props();
</script>

<svelte:component 
  this={icon} 
  {size} 
  class="icon {className}" 
  style={color ? `color: ${color}` : ''}
/>

<style>
  :global(.icon) {
    display: inline-block;
    vertical-align: middle;
    flex-shrink: 0;
  }
  
  :global(.icon-sm) {
    width: 14px;
    height: 14px;
  }
  
  :global(.icon-md) {
    width: 16px;
    height: 16px;
  }
  
  :global(.icon-lg) {
    width: 20px;
    height: 20px;
  }
  
  :global(.icon-xl) {
    width: 24px;
    height: 24px;
  }
</style>