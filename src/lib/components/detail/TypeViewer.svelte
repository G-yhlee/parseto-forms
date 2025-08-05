<script lang="ts">
  import {
    Code,
    Hash,
    Type,
    Calendar,
    ToggleLeft,
    FileText,
    Database,
    Copy,
    Check
  } from 'lucide-svelte';
  import type { PocketBaseRecord } from '$lib/pocketbase';
  import { DataFormatters } from '$lib/utils/formatters';
  import { TypeGenerator, createHighlightedCode } from '$lib/modules/typeviewer';

  interface Props {
    record: PocketBaseRecord;
  }

  const { record }: Props = $props();

  let showGenerated = $state(false);
  let copied = $state(false);

  // 자동 생성된 타입 정보
  let generatedType = $derived.by(() => {
    return TypeGenerator.analyzeRecord(record, 'GeneratedRecord');
  });

  // 하이라이트된 코드 (모든 인터페이스 포함)
  let highlightedCode = $derived.by(() => {
    const allCode = generateAllInterfacesCode(generatedType);
    return createHighlightedCode(allCode);
  });

  // 모든 인터페이스 코드 생성
  function generateAllInterfacesCode(mainInterface: any): string {
    const codes: string[] = [];
    
    // 중첩된 인터페이스들 먼저 추가
    if (mainInterface.nestedInterfaces) {
      mainInterface.nestedInterfaces.forEach((nested: any) => {
        codes.push(generateAllInterfacesCode(nested));
      });
    }
    
    // 메인 인터페이스 추가
    codes.push(mainInterface.code);
    
    return codes.join('\n\n');
  }

  interface FieldType {
    name: string;
    type: string;
    value: any;
    icon: any;
  }

  let fields = $derived.by((): FieldType[] => {
    const allFields: FieldType[] = [];
    
    Object.entries(record).forEach(([key, value]) => {
      // 시스템 필드 제외
      if (['collectionId', 'collectionName'].includes(key)) {
        return;
      }
      
      // data 필드인 경우 내부 필드들을 개별적으로 추가
      if (key === 'data' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          const type = DataFormatters.getFieldType(dataKey, dataValue);
          let icon = getFieldIcon(type);
          
          allFields.push({
            name: dataKey,
            type,
            value: dataValue,
            icon
          });
        });
        return;
      }
      
      // 일반 필드 처리
      const type = DataFormatters.getFieldType(key, value);
      let icon = getFieldIcon(type);
      
      allFields.push({
        name: key,
        type,
        value,
        icon
      });
    });
    
    return allFields;
  });

  function getFieldIcon(type: string) {
    switch (type.toLowerCase()) {
      case 'datetime':
      case 'date':
        return Calendar;
      case 'number':
      case 'int':
        return Hash;
      case 'text':
      case 'string':
        return Type;
      case 'bool':
      case 'boolean':
        return ToggleLeft;
      case 'json':
      case 'object':
        return Code;
      default:
        return FileText;
    }
  }

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

  async function copyToClipboard() {
    try {
      const allCode = generateAllInterfacesCode(generatedType);
      await navigator.clipboard.writeText(allCode);
      copied = true;
      setTimeout(() => copied = false, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }
</script>

<div class="type-viewer">
  <div class="type-header">
    <div class="type-title">
      <Database size={16} color="#374151" />
      <span>Data Structure</span>
    </div>
    <div class="header-actions">
      <button 
        class="view-toggle"
        class:active={showGenerated}
        onclick={() => showGenerated = !showGenerated}
      >
        <Code size={14} />
        {showGenerated ? 'Fields' : 'Generated'}
      </button>
      <div class="field-count">
        {fields.length} fields
      </div>
    </div>
  </div>

  <div class="type-content">
    {#if showGenerated}
      <!-- Generated TypeScript Interface -->
      <div class="generated-type">
        <div class="generated-header">
          <div class="generated-title">
            <Code size={16} color="#3b82f6" />
            <span>Generated TypeScript Interface</span>
          </div>
          <button class="copy-btn" onclick={copyToClipboard}>
            {#if copied}
              <Check size={14} color="#10b981" />
              Copied!
            {:else}
              <Copy size={14} />
              Copy
            {/if}
          </button>
        </div>
        <div class="code-block">
          <pre><code>{@html highlightedCode}</code></pre>
        </div>
        <div class="type-analysis">
          <h4>Interface Analysis:</h4>
          
          <!-- 메인 인터페이스 -->
          <div class="interface-section">
            <h5>{generatedType.name}</h5>
            <div class="analysis-grid">
              {#each generatedType.fields as field}
                <div class="analysis-item">
                  <span class="analysis-field">{field.name}</span>
                  <span class="analysis-type">{field.type}</span>
                  {#if field.optional}
                    <span class="analysis-optional">optional</span>
                  {/if}
                  {#if field.description}
                    <span class="analysis-desc">{field.description}</span>
                  {/if}
                </div>
              {/each}
            </div>
          </div>

          <!-- 중첩된 인터페이스들 -->
          {#if generatedType.nestedInterfaces && generatedType.nestedInterfaces.length > 0}
            {#each generatedType.nestedInterfaces as nestedInterface}
              <div class="interface-section nested">
                <h5>{nestedInterface.name}</h5>
                <div class="analysis-grid">
                  {#each nestedInterface.fields as field}
                    <div class="analysis-item">
                      <span class="analysis-field">{field.name}</span>
                      <span class="analysis-type">{field.type}</span>
                      {#if field.optional}
                        <span class="analysis-optional">optional</span>
                      {/if}
                      {#if field.description}
                        <span class="analysis-desc">{field.description}</span>
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>
            {/each}
          {/if}
        </div>
      </div>
    {:else}
      <!-- Original Field View -->
      <div class="type-definition">
        <div class="type-name">Record Fields</div>
        <div class="type-body">
          {#each fields as field}
            {@const IconComponent = field.icon}
            <div class="field-row">
              <div class="field-info">
                <div class="field-header">
                  <IconComponent size={14} color={getTypeColor(field.type)} />
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
    {/if}
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

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .view-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
  }

  .view-toggle:hover {
    background: #e5e7eb;
    color: #374151;
  }

  .view-toggle.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
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

  /* Generated Type Styles */
  .generated-type {
    background: white;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    overflow: hidden;
  }

  .generated-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }

  .generated-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: #1f2937;
  }

  .copy-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s;
  }

  .copy-btn:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }

  .code-block {
    padding: 1.5rem;
    background: #1f2937;
    overflow-x: auto;
  }

  .code-block pre {
    margin: 0;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    color: #e5e7eb;
  }

  .code-block code {
    color: #e5e7eb;
  }

  /* Syntax Highlighting Styles */
  :global(.syntax-keyword) {
    color: #c678dd; /* Purple for keywords like interface, export */
    font-weight: 600;
  }

  :global(.syntax-type) {
    color: #61afef; /* Blue for types like string, number */
    font-weight: 500;
  }

  :global(.syntax-string) {
    color: #98c379; /* Green for strings */
  }

  :global(.syntax-comment) {
    color: #5c6370; /* Gray for comments */
    font-style: italic;
  }

  :global(.syntax-punctuation) {
    color: #abb2bf; /* Light gray for punctuation */
  }

  :global(.syntax-identifier) {
    color: #e06c75; /* Red for identifiers/property names */
  }

  :global(.syntax-text) {
    color: #abb2bf; /* Default text color */
  }

  .type-analysis {
    padding: 1.5rem;
  }

  .type-analysis h4 {
    margin: 0 0 1rem 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .analysis-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .analysis-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
  }

  .analysis-field {
    font-family: monospace;
    font-weight: 600;
    color: #1f2937;
    min-width: 100px;
  }

  .analysis-type {
    font-family: monospace;
    font-size: 0.875rem;
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
  }

  .analysis-optional {
    font-size: 0.75rem;
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.1);
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    font-weight: 500;
  }

  .analysis-desc {
    font-size: 0.875rem;
    color: #6b7280;
    font-style: italic;
    margin-left: auto;
  }

  .interface-section {
    margin-bottom: 1.5rem;
  }

  .interface-section h5 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    padding: 0.5rem 0.75rem;
    background: #f3f4f6;
    border-radius: 6px;
    border-left: 4px solid #3b82f6;
  }

  .interface-section.nested h5 {
    border-left-color: #10b981;
    background: #f0fdf4;
  }
</style>