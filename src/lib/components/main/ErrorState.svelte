<script lang="ts">
  interface Props {
    error: string;
  }

  const { error }: Props = $props();
</script>

<div class="error">Error: {error}</div>

<style>
  .error {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: #dc2626;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 6px;
    margin: 1rem;
    font-size: 0.875rem;
  }
</style>