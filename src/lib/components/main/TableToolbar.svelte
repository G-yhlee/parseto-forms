<script lang="ts">
  let filterTerm = $state('');
</script>

<div class="table-toolbar">
  <div class="search-filter">
    <input 
      type="text" 
      placeholder="Search term or filter like created > '2022-01-01'..."
      class="filter-input"
      bind:value={filterTerm}
    />
  </div>
</div>

<style>
  .table-toolbar {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }

  .filter-input {
    width: 100%;
    max-width: 400px;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
  }

  .filter-input:focus {
    outline: none;
    border-color: #3b82f6;
  }
</style>