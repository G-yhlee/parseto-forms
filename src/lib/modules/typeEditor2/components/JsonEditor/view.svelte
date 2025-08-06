<script lang="ts">
	import { genJsonEditorDefs } from './controller';
	import type { JsonEditorProps } from './state.svelte';
	
	// Self-import for recursive component
	import JsonEditorView from './view.svelte';
	
	interface Props extends JsonEditorProps {}
	
	const { data, onUpdate, path = [] }: Props = $props();
	
	// Generate defs with current props
	const defs = genJsonEditorDefs(data, onUpdate, path);
	const { datas, states, actions } = defs;
	
	// Update internal state when props change
	$effect(() => {
		actions.setData(data);
	});
</script>

<div class="json-editor">
	{#if actions.getType(data) === 'object'}
		<span class="bracket">{'{'}</span>
		<div class="object-content">
			{#each Object.entries(data) as [key, value], index}
				<div class="property">
					<div class="property-key">
						{#if datas.editingKey() === key}
							<input
								type="text"
								value={datas.editKeyValue()}
								oninput={(e) => actions.updateEditKeyValue(e.target.value)}
								onblur={() => actions.finishEditKey(key)}
								onkeydown={(e) => actions.handleKeyPress(e, 'key', key)}
								class="inline-input key-input"
								autofocus
							/>
						{:else}
							<span
								class="key-label"
								onclick={() => actions.startEditKey(key)}
								role="button"
								tabindex="0"
							>
								"{key}"
							</span>
						{/if}
						<span class="colon">:</span>
					</div>
					
					<span class="property-value">
						{#if actions.getType(value) === 'object' || actions.getType(value) === 'array'}
							<JsonEditorView 
								data={value} 
								onUpdate={(newValue) => actions.updateNestedValue(key, newValue)}
								path={[...path, key]}
							/>
						{:else if datas.editingValue() === key}
							<input
								type="text"
								value={datas.editValueValue()}
								oninput={(e) => actions.updateEditValueValue(e.target.value)}
								onblur={() => actions.finishEditValue(key)}
								onkeydown={(e) => actions.handleKeyPress(e, 'value', key)}
								class="inline-input value-input"
								autofocus
							/>
						{:else}
							<span
								class="value-label {actions.getType(value)}"
								onclick={() => actions.startEditValue(key, value)}
								role="button"
								tabindex="0"
							>
								{actions.formatValue(value)}
							</span>
						{/if}
					</span>{#if index < Object.entries(data).length - 1}<span class="comma">,</span>{/if}
				</div>
			{/each}
		</div>
		<span class="bracket">{'}'}</span>
	{:else if actions.getType(data) === 'array'}
		<span class="bracket">[</span>
		<div class="array-content">
			{#each data as item, index}
				<div class="array-item">
					{#if actions.getType(item) === 'object' || actions.getType(item) === 'array'}
						<JsonEditorView 
							data={item} 
							onUpdate={(newValue) => actions.updateArrayValue(index, newValue)}
							path={[...path, String(index)]}
						/>
					{:else if datas.editingValue() === `array_${index}`}
						<input
							type="text"
							value={datas.editValueValue()}
							oninput={(e) => actions.updateEditValueValue(e.target.value)}
							onblur={() => actions.finishEditArrayValue(index)}
							onkeydown={(e) => actions.handleKeyPress(e, 'value', `array_${index}`)}
							class="inline-input value-input"
							autofocus
						/>
					{:else}
						<span 
							class="value-label {actions.getType(item)}"
							onclick={() => actions.startEditArrayValue(index, item)}
							role="button"
							tabindex="0"
						>
							{actions.formatValue(item)}
						</span>
					{/if}{#if index < data.length - 1}<span class="comma">,</span>{/if}
				</div>
			{/each}
		</div>
		<span class="bracket">]</span>
	{:else}
		<span class="value-label {actions.getType(data)}">
			{actions.formatValue(data)}
		</span>
	{/if}
</div>

<style>
	.json-editor {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
		font-size: 0.875rem;
		line-height: 1.5;
		display: block;
	}

	.object-content {
		padding-left: 1.5rem;
		position: relative;
		display: block;
	}

	.array-content {
		padding-left: 1.5rem;
		position: relative;
		display: block;
	}

	.property {
		display: block;
		position: relative;
	}

	.property-key {
		display: inline;
	}

	.key-label {
		color: #7b1fa2;
		cursor: pointer;
		padding: 0.125rem 0.25rem;
		border-radius: 3px;
		transition: background-color 0.2s;
	}

	.key-label:hover {
		background-color: rgba(123, 31, 162, 0.1);
	}

	.colon {
		color: #424242;
		margin-left: 0.25rem;
	}

	.value-label {
		cursor: pointer;
		padding: 0.125rem 0.25rem;
		border-radius: 3px;
		transition: background-color 0.2s;
	}

	.value-label:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.value-label.string {
		color: #d32f2f;
	}

	.value-label.number {
		color: #1976d2;
	}

	.value-label.boolean {
		color: #f57c00;
	}

	.value-label.null {
		color: #757575;
	}

	.comma {
		color: #424242;
		display: inline;
	}

	.inline-input {
		font-family: inherit;
		font-size: inherit;
		line-height: inherit;
		border: 1px solid #1976d2;
		border-radius: 3px;
		padding: 0.125rem 0.25rem;
		outline: none;
		background: white;
		min-width: 100px;
	}

	.key-input {
		color: #7b1fa2;
	}

	.value-input {
		color: #1976d2;
	}

	.array-item {
		display: block;
	}

	.loading {
		color: #757575;
		font-style: italic;
	}

	/* 중첩 구조 시각화 */
	.bracket {
		color: #424242;
		font-weight: bold;
		font-size: 1rem;
		display: block;
	}
</style>