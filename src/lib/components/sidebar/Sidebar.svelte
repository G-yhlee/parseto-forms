<script lang="ts">
  import { appState } from '$lib/stores/app.svelte';
  import { dataActions } from '$lib/actions/data.svelte';
  import SidebarHeader from './SidebarHeader.svelte';
  import SidebarSearch from './SidebarSearch.svelte';
  import CollectionSection from './CollectionSection.svelte';
</script>

<div class="sidebar">
  <SidebarHeader onLogout={dataActions.handleLogout} />
  
  <SidebarSearch 
    bind:searchTerm={appState.searchTerm}
  />

  <div class="sidebar-content">
    <CollectionSection 
      title="Pinned"
      collections={appState.pinnedCollections}
      selectedCollection={appState.selectedCollection}
      onSelect={dataActions.selectCollection}
    />

    <CollectionSection 
      title="Others"
      collections={appState.filteredOtherCollections}
      selectedCollection={appState.selectedCollection}
      onSelect={dataActions.selectCollection}
    />
  </div>
</div>

<style>
  .sidebar {
    width: 280px;
    background: #ffffff;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
  }

  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0;
  }
</style>