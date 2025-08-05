<script lang="ts">
  import type { PocketBaseRecord } from '$lib/pocketbase';
  import { DataFormatters } from '$lib/utils/formatters';
  import JsonViewer from '../JsonViewer.svelte';
  import BasicInfoSection from './BasicInfoSection.svelte';
  import FieldsSection from './FieldsSection.svelte';

  interface Props {
    record: PocketBaseRecord;
  }

  const { record }: Props = $props();
</script>

<div class="detail-content">
  <BasicInfoSection record={record} />
  <FieldsSection record={record} />
</div>

<style>
  .detail-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
  }
</style>