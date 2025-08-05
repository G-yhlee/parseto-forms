<script lang="ts">
  import { Search } from 'lucide-svelte';

  interface Props {
    searchTerm: string;
  }

  let { searchTerm = $bindable() }: Props = $props();
</script>

<div class="sidebar-search">
  <div class="search-container">
    <div class="search-icon">
      <Search size={14} color="#9ca3af" />
    </div>
    <input 
      type="text" 
      placeholder="Search collections..." 
      bind:value={searchTerm}
      class="search-input"
    />
  </div>
</div>

<style>
  .sidebar-search {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .search-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    pointer-events: none;
    z-index: 1;
  }

  .search-input {
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 2.25rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
    background: #f9fafb;
  }

  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
  }
</style>