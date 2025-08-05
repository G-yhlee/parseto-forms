<script lang="ts">
  import { Code, Hash, Type, Calendar, ToggleLeft, FileText, Database } from 'lucide-svelte';
  import type { PocketBaseRecord } from '$lib/pocketbase';
  import { DataFormatters } from '$lib/utils/formatters';

  interface Props {
    record: PocketBaseRecord;
  }

  const { record }: Props = $props();

  interface FieldType {
    name: string;
    type: string;
    value: any;
    icon: any;
  }

  let fields = $derived.by((): FieldType[] => {
    return Object.entries(record).map(([key, value]) => {
      const type = DataFormatters.getFieldType(key, value);
      let icon;
      
      switch (type.toLowerCase()) {
        case 'datetime':
        case 'date':
          icon = Calendar;
          break;
        case 'number':
        case 'int':
          icon = Hash;
          break;
        case 'text':
        case 'string':
          icon = Type;
          break;
        case 'bool':
        case 'boolean':
          icon = ToggleLeft;
          break;
        case 'json':
        case 'object':
          icon = Code;
          break;
        default:
          icon = FileText;
      }

      return {
        name: key,
        type,
        value,
        icon
      };
    });
  });

  function getTypeColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'string':
      case 'text':
        return '#10b981'; // green
      case 'number':
      case 'int':
        return '#3b82f6'; // blue
      case 'boolean':
      case 'bool':
        return '#f59e0b'; // amber
      case 'datetime':
      case 'date':
        return '#8b5cf6'; // purple
      case 'json':
      case 'object':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  }

  function getValuePreview(value: any, maxLength: number = 50): string {
    if (value === null || value === undefined) {
      return 'null';
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value).substring(0, maxLength) + (JSON.stringify(value).length > maxLength ? '...' : '');
    }
    
    const str = String(value);
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  }
</script>

<div class="type-viewer">
  <div class="type-header">
    <div class="type-title">
      <Database size={16} color="#374151" />
      <span>Data Structure</span>
    </div>
    <div class="field-count">
      {fields.length} fields
    </div>
  </div>

  <div class="type-content">
    <div class="type-definition">
      <div class="type-name">Record</div>
      <div class="type-body">
        {#each fields as field}
          <div class="field-row">
            <div class="field-info">
              <div class="field-header">
                <svelte:component this={field.icon} size={14} color={getTypeColor(field.type)} />
                <span class="field-name">{field.name}</span>
                <span class="field-type" style="color: {getTypeColor(field.type)}">{field.type}</span>
              </div>
              <div class="field-value">
                <span class="value-preview">{getValuePreview(field.value)}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .type-viewer {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fafafa;
  }

  .type-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background: white;
  }

  .type-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: #374151;
  }

  .field-count {
    font-size: 0.875rem;
    color: #6b7280;
    background: #f3f4f6;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
  }

  .type-content {
    flex: 1;
    overflow: auto;
    padding: 1.5rem;
  }

  .type-definition {
    background: white;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    overflow: hidden;
  }

  .type-name {
    padding: 1rem 1.5rem;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    font-family: monospace;
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
  }

  .type-body {
    padding: 0;
  }

  .field-row {
    border-bottom: 1px solid #f3f4f6;
  }

  .field-row:last-child {
    border-bottom: none;
  }

  .field-info {
    padding: 1rem 1.5rem;
  }

  .field-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .field-name {
    font-family: monospace;
    font-weight: 600;
    color: #1f2937;
  }

  .field-type {
    font-family: monospace;
    font-size: 0.875rem;
    font-weight: 500;
    background: rgba(59, 130, 246, 0.1);
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
    margin-left: auto;
  }

  .field-value {
    margin-left: 2.125rem;
  }

  .value-preview {
    font-family: monospace;
    font-size: 0.875rem;
    color: #6b7280;
    background: #f9fafb;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #e5e7eb;
    display: block;
    word-break: break-all;
  }
</style>