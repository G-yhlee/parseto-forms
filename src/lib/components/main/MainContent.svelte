<script lang="ts">
  import { appState } from '$lib/stores/app.svelte';
  import { dataActions } from '$lib/actions/data.svelte';
  import MainHeader from './MainHeader.svelte';
  import TableToolbar from './TableToolbar.svelte';
  import DataTable from './DataTable.svelte';
  import LoadingState from './LoadingState.svelte';
  import ErrorState from './ErrorState.svelte';
  import EmptyState from './EmptyState.svelte';
</script>

<div class="main-content">
  <MainHeader 
    selectedCollection={appState.selectedCollection}
    loading={appState.recordsLoading}
    onRefresh={dataActions.refreshData}
  />

  <TableToolbar />

  {#if appState.recordsLoading}
    <LoadingState />
  {:else if appState.error}
    <ErrorState error={appState.error} />
  {:else if appState.records.length === 0}
    <EmptyState />
  {:else}
    <DataTable 
      records={appState.records}
      onRecordSelect={(record) => appState.selectRecord(record)}
    />
  {/if}
</div>

<style>
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: white;
    overflow: hidden;
  }
</style>