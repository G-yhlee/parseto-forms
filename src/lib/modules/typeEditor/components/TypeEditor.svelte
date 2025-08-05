<script lang="ts">
	import { JsonEditor } from '$lib/modules/typeviewer';
	import RecordSidebar from './RecordSidebar.svelte';
	import type { PocketBaseRecord, TypeEditorParams } from '../types';
	
	interface Props {
		record: PocketBaseRecord;
		recordList: PocketBaseRecord[];
		listLoading: boolean;
		onUpdate: (record: PocketBaseRecord) => void;
		onSave: () => Promise<void>;
		onRecordSelect: (recordId: string) => void;
		hasChanges: boolean;
		saving: boolean;
		generatedTypes: string;
		highlightedTypes: string;
	}

	const { 
		record, 
		recordList,
		listLoading,
		onUpdate, 
		onSave,
		onRecordSelect,
		hasChanges, 
		saving, 
		generatedTypes, 
		highlightedTypes 
	}: Props = $props();

	let editMode = $state(false);

	function handleRecordUpdate(newData: any) {
		onUpdate(newData as PocketBaseRecord);
	}

	async function handleSave() {
		await onSave();
	}

	function toggleEditMode() {
		editMode = !editMode;
	}
</script>

<div class="type-editor">
	<!-- Sidebar -->
	<RecordSidebar 
		recordList={recordList}
		currentRecordId={record.id}
		loading={listLoading}
		onRecordSelect={onRecordSelect}
	/>

	<!-- Main Content -->
	<div class="editor-main">
		<header class="editor-header">
		<div class="header-info">
			<h1>Record Editor</h1>
			<div class="record-meta">
				<span class="collection">Collection: {record.collectionName}</span>
				<span class="record-id">ID: {record.id}</span>
			</div>
		</div>
		<div class="header-actions">
			<button 
				class="btn btn-secondary" 
				onclick={toggleEditMode}
				disabled={saving}
			>
				{editMode ? 'View Mode' : 'Edit Mode'}
			</button>
			<button 
				class="btn btn-primary" 
				onclick={handleSave}
				disabled={!hasChanges || saving}
			>
				{saving ? 'Saving...' : 'Save Changes'}
			</button>
		</div>
	</header>

	<div class="editor-body">
		<!-- Left Panel - Data Editor -->
		<div class="panel data-panel">
			<div class="panel-header">
				<h3>Record Data</h3>
				{#if hasChanges}
					<span class="changes-indicator">● Unsaved changes</span>
				{/if}
			</div>
			<div class="panel-content">
				{#if editMode}
					<div class="json-editor-container">
						<JsonEditor 
							data={record} 
							onUpdate={handleRecordUpdate}
						/>
					</div>
				{:else}
					<div class="json-view">
						<pre><code>{JSON.stringify(record, null, 2)}</code></pre>
					</div>
				{/if}
			</div>
		</div>

		<!-- Right Panel - Generated Types -->
		<div class="panel types-panel">
			<div class="panel-header">
				<h3>Generated TypeScript</h3>
				<button 
					class="btn btn-sm btn-secondary"
					onclick={() => navigator.clipboard.writeText(generatedTypes)}
				>
					Copy
				</button>
			</div>
			<div class="panel-content">
				{#if generatedTypes}
					<div class="typescript-output">
						<pre><code>{@html highlightedTypes}</code></pre>
					</div>
				{:else}
					<div class="empty-state">
						<p>No types generated</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
	</div>
</div>

<style>
	.type-editor {
		height: 100vh;
		display: flex;
		background: #fafafa;
	}

	.editor-main {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.editor-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem 2rem;
		background: white;
		border-bottom: 1px solid #e5e7eb;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.header-info h1 {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: #1f2937;
	}

	.record-meta {
		display: flex;
		gap: 1rem;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.header-actions {
		display: flex;
		gap: 0.75rem;
	}

	.editor-body {
		flex: 1;
		display: flex;
		min-height: 0;
	}

	.panel {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: white;
		border-right: 1px solid #e5e7eb;
	}

	.panel:last-child {
		border-right: none;
	}

	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid #e5e7eb;
		background: #f9fafb;
	}

	.panel-header h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: #1f2937;
	}

	.changes-indicator {
		color: #ef4444;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.panel-content {
		flex: 1;
		overflow: auto;
	}

	.json-editor-container {
		padding: 1.5rem;
		height: 100%;
	}

	.json-view {
		padding: 1.5rem;
		height: 100%;
		overflow: auto;
	}

	.json-view pre {
		margin: 0;
		font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
		font-size: 0.875rem;
		line-height: 1.6;
		color: #1f2937;
		background: #f9fafb;
		padding: 1rem;
		border-radius: 6px;
	}

	.typescript-output {
		padding: 1.5rem;
		height: 100%;
		overflow: auto;
	}

	.typescript-output pre {
		margin: 0;
		font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
		font-size: 0.875rem;
		line-height: 1.6;
		color: #1f2937;
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #9ca3af;
		font-size: 1rem;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: 6px;
		border: 1px solid;
		cursor: pointer;
		transition: all 0.2s;
		text-decoration: none;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-primary {
		background: #3b82f6;
		color: white;
		border-color: #3b82f6;
	}

	.btn-primary:hover:not(:disabled) {
		background: #2563eb;
		border-color: #2563eb;
	}

	.btn-secondary {
		background: white;
		color: #374151;
		border-color: #d1d5db;
	}

	.btn-secondary:hover:not(:disabled) {
		background: #f9fafb;
		border-color: #9ca3af;
	}

	.btn-sm {
		padding: 0.375rem 0.75rem;
		font-size: 0.8125rem;
	}

	/* Syntax Highlighting */
	:global(.syntax-keyword) {
		color: #1976d2;
		font-weight: 600;
	}

	:global(.syntax-type) {
		color: #388e3c;
		font-weight: 500;
	}

	:global(.syntax-string) {
		color: #d32f2f;
	}

	:global(.syntax-comment) {
		color: #757575;
		font-style: italic;
	}

	:global(.syntax-punctuation) {
		color: #424242;
	}

	:global(.syntax-identifier) {
		color: #7b1fa2;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.editor-body {
			flex-direction: column;
		}

		.panel {
			border-right: none;
			border-bottom: 1px solid #e5e7eb;
		}

		.panel:last-child {
			border-bottom: none;
		}

		.editor-header {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}

		.header-actions {
			justify-content: center;
		}
	}
</style>