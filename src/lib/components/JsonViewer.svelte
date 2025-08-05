<script lang="ts">
  interface Props {
    data: unknown;
    expanded?: boolean;
    depth?: number;
  }

  const { data, expanded = false, depth = 0 }: Props = $props();

  let isExpanded = $state(expanded);

  function isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
  }

  function isPrimitive(value: unknown): boolean {
    return value === null || 
           value === undefined || 
           typeof value === 'string' || 
           typeof value === 'number' || 
           typeof value === 'boolean';
  }

  function getValueType(value: unknown): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (isArray(value)) return 'array';
    if (isObject(value)) return 'object';
    return 'unknown';
  }

  function formatPrimitiveValue(value: unknown): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    return String(value);
  }

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  function getIndentation(level: number): string {
    return '  '.repeat(level);
  }
</script>

<div class="json-viewer" style="margin-left: {depth * 16}px">
  {#if isPrimitive(data)}
    <span class="value {getValueType(data)}">
      {formatPrimitiveValue(data)}
    </span>
  {:else if isArray(data)}
    <div class="expandable">
      <button 
        class="toggle-btn" 
        onclick={toggleExpanded}
        aria-expanded={isExpanded}
      >
        <span class="toggle-icon {isExpanded ? 'expanded' : ''}">{isExpanded ? '▼' : '▶'}</span>
        <span class="bracket">[</span>
        {#if !isExpanded}
          <span class="preview">...{data.length} items</span>
          <span class="bracket">]</span>
        {/if}
      </button>
      
      {#if isExpanded}
        <div class="content">
          {#each data as item, index}
            <div class="array-item">
              <span class="index">{index}:</span>
              <svelte:self data={item} expanded={false} depth={depth + 1} />
              {#if index < data.length - 1}<span class="comma">,</span>{/if}
            </div>
          {/each}
          <div class="closing-bracket">]</div>
        </div>
      {/if}
    </div>
  {:else if isObject(data)}
    <div class="expandable">
      <button 
        class="toggle-btn" 
        onclick={toggleExpanded}
        aria-expanded={isExpanded}
      >
        <span class="toggle-icon {isExpanded ? 'expanded' : ''}">{isExpanded ? '▼' : '▶'}</span>
        <span class="bracket">{'{'}</span>
        {#if !isExpanded}
          <span class="preview">...{Object.keys(data).length} keys</span>
          <span class="bracket">{'}'}</span>
        {/if}
      </button>
      
      {#if isExpanded}
        <div class="content">
          {#each Object.entries(data) as [key, value], index}
            <div class="object-item">
              <span class="key">"{key}"</span>
              <span class="colon">:</span>
              <svelte:self data={value} expanded={false} depth={depth + 1} />
              {#if index < Object.entries(data).length - 1}<span class="comma">,</span>{/if}
            </div>
          {/each}
          <div class="closing-bracket">{'}'}</div>
        </div>
      {/if}
    </div>
  {:else}
    <span class="value unknown">{String(data)}</span>
  {/if}
</div>

<style>
  .json-viewer {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    line-height: 1.4;
  }

  .toggle-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font: inherit;
    color: inherit;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  .toggle-btn:hover {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 2px;
  }

  .toggle-icon {
    color: #666;
    font-size: 0.75rem;
    width: 12px;
    display: inline-block;
    transition: transform 0.2s ease;
  }

  .toggle-icon.expanded {
    transform: rotate(0deg);
  }

  .content {
    margin-left: 16px;
  }

  .array-item, .object-item {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin: 0.125rem 0;
  }

  .index {
    color: #666;
    min-width: 2rem;
  }

  .key {
    color: #0066cc;
    font-weight: 500;
  }

  .colon {
    color: #666;
  }

  .comma {
    color: #666;
  }

  .bracket {
    color: #666;
    font-weight: 500;
  }

  .closing-bracket {
    color: #666;
    font-weight: 500;
    margin-left: -16px;
  }

  .preview {
    color: #888;
    font-style: italic;
    margin: 0 0.25rem;
  }

  .value {
    font-weight: 500;
  }

  .value.string {
    color: #22863a;
  }

  .value.number {
    color: #005cc5;
  }

  .value.boolean {
    color: #e36209;
  }

  .value.null {
    color: #6f42c1;
  }

  .value.undefined {
    color: #6f42c1;
  }

  .value.unknown {
    color: #d73a49;
  }

  .expandable {
    display: flex;
    flex-direction: column;
  }
</style>