<script lang="ts">
	import { genJsonEditorDefs } from './controller';
	
	const defs = genJsonEditorDefs();
	const { datas, states, actions } = defs;
	
	export let onSave: () => Promise<any> = async () => {};
	export let onRevert: () => void = () => {};
	export let onCopyTypes: () => Promise<boolean> = async () => false;
	
	let jsonEditorElement: HTMLDivElement;
	
	const handleJsonChange = (event: Event) => {
		const target = event.target as HTMLTextAreaElement;
		try {
			const newData = JSON.parse(target.value);
			actions.updateJsonData(newData);
		} catch (err) {
			// Invalid JSON, but still update for editing
			actions.updateJsonData(target.value);
		}
	};
</script>

<div class="json-editor-container">
	{#if !datas.currentRecord()}
		<div class="empty-state">
			<div class="empty-icon">📄</div>
			<h3>No Record Selected</h3>
			<p>Select a record from the list to start editing</p>
		</div>
	{:else}
		<div class="editor-header">
			<div class="record-info">
				<span class="record-id">ID: {datas.currentRecord()?.id}</span>
				{#if states.hasChanges()}
					<span class="changes-indicator">● Unsaved Changes</span>
				{/if}
			</div>
			
			<div class="editor-actions">
				<button
					class="toggle-mode-btn"
					onclick={() => actions.toggleEditMode()}
					class:active={states.editMode()}
				>
					{states.editMode() ? '📖 View' : '✏️ Edit'}
				</button>
				
				{#if states.hasChanges()}
					<button
						class="revert-btn"
						onclick={() => onRevert()}
						disabled={states.saving()}
					>
						↶ Revert
					</button>
					
					<button
						class="save-btn"
						onclick={() => onSave()}
						disabled={states.saving()}
					>
						{states.saving() ? 'Saving...' : '💾 Save'}
					</button>
				{/if}
				
				<button
					class="copy-types-btn"
					onclick={() => onCopyTypes()}
				>
					📋 Copy Types
				</button>
			</div>
		</div>

		<div class="editor-content">
			<div class="json-panel">
				<div class="panel-header">
					<h4>JSON Data</h4>
				</div>
				<div class="json-editor" bind:this={jsonEditorElement}>
					{#if states.editMode()}
						<textarea
							class="json-textarea"
							value={JSON.stringify(datas.jsonData(), null, 2)}
							oninput={handleJsonChange}
							placeholder="Enter JSON data..."
						></textarea>
					{:else}
						<pre class="json-display">{JSON.stringify(datas.jsonData(), null, 2)}</pre>
					{/if}
				</div>
			</div>

			<div class="types-panel">
				<div class="panel-header">
					<h4>Generated Types</h4>
				</div>
				<div class="types-content">
					{#if datas.generatedTypes()}
						<pre class="types-display">{@html datas.highlightedTypes() || datas.generatedTypes()}</pre>
					{:else}
						<div class="no-types">No types generated</div>
					{/if}
				</div>
			</div>
		</div>

		{#if datas.error()}
			<div class="error-message">
				<span class="error-icon">⚠️</span>
				{datas.error()}
			</div>
		{/if}
	{/if}
</div>

<style>
	.json-editor-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		height: 100%;
		background: var(--color-background);
	}

	.empty-state {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: var(--color-text-secondary);
		padding: 2rem;
	}

	.empty-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
		opacity: 0.5;
	}

	.empty-state h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
		color: var(--color-text);
	}

	.empty-state p {
		margin: 0;
		font-size: 0.9rem;
	}

	.editor-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
		gap: 1rem;
	}

	.record-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.record-id {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		background-color: var(--color-surface-variant);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.8rem;
		color: var(--color-text-secondary);
	}

	.changes-indicator {
		color: var(--color-warning);
		font-size: 0.9rem;
		font-weight: 500;
	}

	.editor-actions {
		display: flex;
		gap: 0.5rem;
	}

	.toggle-mode-btn,
	.revert-btn,
	.save-btn,
	.copy-types-btn {
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		background: var(--color-surface);
		color: var(--color-text);
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.2s;
	}

	.toggle-mode-btn:hover,
	.revert-btn:hover,
	.copy-types-btn:hover {
		background: var(--color-hover);
		border-color: var(--color-primary-light);
	}

	.toggle-mode-btn.active {
		background: var(--color-primary-light);
		border-color: var(--color-primary);
		color: var(--color-primary-dark);
	}

	.save-btn {
		background: var(--color-success);
		border-color: var(--color-success);
		color: white;
	}

	.save-btn:hover:not(:disabled) {
		background: var(--color-success-dark);
	}

	.save-btn:disabled,
	.revert-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.editor-content {
		flex: 1;
		display: flex;
		gap: 1px;
		min-height: 0;
	}

	.json-panel,
	.types-panel {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: var(--color-surface);
		min-height: 0;
	}

	.panel-header {
		padding: 0.75rem 1rem;
		background: var(--color-surface-variant);
		border-bottom: 1px solid var(--color-border);
	}

	.panel-header h4 {
		margin: 0;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.json-editor,
	.types-content {
		flex: 1;
		overflow: auto;
		padding: 1rem;
	}

	.json-textarea {
		width: 100%;
		height: 100%;
		border: none;
		outline: none;
		background: transparent;
		color: var(--color-text);
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.9rem;
		line-height: 1.5;
		resize: none;
	}

	.json-display,
	.types-display {
		margin: 0;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--color-text);
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	.no-types {
		color: var(--color-text-secondary);
		font-style: italic;
		text-align: center;
		padding: 2rem;
	}

	.error-message {
		background: var(--color-error-light);
		border: 1px solid var(--color-error);
		color: var(--color-error-dark);
		padding: 0.75rem 1rem;
		margin: 1rem;
		border-radius: 6px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
	}

	.error-icon {
		flex-shrink: 0;
	}
</style>