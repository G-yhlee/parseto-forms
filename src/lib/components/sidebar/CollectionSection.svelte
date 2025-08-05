<script lang="ts">
  import type { CollectionEntity } from '$lib/domain/entities/Collection';
  import CollectionItem from './CollectionItem.svelte';

  interface Props {
    title: string;
    collections: CollectionEntity[];
    selectedCollection: string;
    onSelect: (collectionName: string) => void;
  }

  const { title, collections, selectedCollection, onSelect }: Props = $props();
</script>

<div class="section">
  <div class="section-title">{title}</div>
  <div class="collection-list">
    {#each collections as collection (collection.id)}
      <CollectionItem
        name={collection.name}
        active={selectedCollection === collection.name}
        onClick={() => onSelect(collection.name)}
      />
    {/each}
  </div>
</div>

<style>
  .section {
    margin-bottom: 1.5rem;
  }

  .section-title {
    padding: 0 1rem;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .collection-list {
    display: flex;
    flex-direction: column;
  }
</style>