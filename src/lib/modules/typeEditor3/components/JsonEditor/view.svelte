<script lang="ts">
	import type { JsonData } from '../../types';
	
	interface Props {
		data: JsonData;
		onUpdate?: (data: JsonData) => void;
		path?: string[];
	}

	const { data, onUpdate, path = [] }: Props = $props();
	
	let editingKey = $state<string | null>(null);
	let editingValue = $state<string | null>(null);
	let editKeyValue = $state('');
	let editValueValue = $state('');

	// Self-import for recursive component
	import JsonEditorView from './view.svelte';
	
	const getType = (value: any): string => {
		if (value === null) return 'null';
		if (Array.isArray(value)) return 'array';
		return typeof value;
	};
	
	const formatValue = (value: any): string => {
		if (typeof value === 'string') return `"${value}"`;
		if (value === null) return 'null';
		if (value === undefined) return 'undefined';
		return String(value);
	};

	const startEditKey = (key: string) => {
		editingKey = key;
		editKeyValue = key;
	};
	
	const finishEditKey = (oldKey: string) => {
		if (editKeyValue && editKeyValue !== oldKey && onUpdate) {
			const newData = { ...data };
			newData[editKeyValue] = newData[oldKey];
			delete newData[oldKey];
			onUpdate(newData);
		}
		editingKey = null;
	};

	const startEditValue = (key: string, value: any) => {
		editingValue = key;
		editValueValue = JSON.stringify(value);
	};
	
	const finishEditValue = (key: string) => {
		try {
			const newValue = JSON.parse(editValueValue);
			if (onUpdate) {
				const newData = { ...data };
				newData[key] = newValue;
				onUpdate(newData);
			}
		} catch (e) {
			// Keep original value if parsing fails
		}
		editingValue = null;
	};

	const updateNestedValue = (key: string, newValue: any) => {
		if (onUpdate) {
			const newData = { ...data };
			newData[key] = newValue;
			onUpdate(newData);
		}
	};

	const updateArrayValue = (index: number, newValue: any) => {
		if (onUpdate) {
			const newData = [...data];
			newData[index] = newValue;
			onUpdate(newData);
		}
	};

	const finishEditArrayValue = (index: number) => {
		try {
			const newValue = JSON.parse(editValueValue);
			if (onUpdate) {
				const newData = [...data];
				newData[index] = newValue;
				onUpdate(newData);
			}
		} catch (e) {
			// Keep original value if parsing fails
		}
		editingValue = null;
	};

	const startEditArrayValue = (index: number, value: any) => {
		editingValue = `array_${index}`;
		editValueValue = JSON.stringify(value);
	};

	const handleKeyPress = (event: KeyboardEvent, type: 'key' | 'value', key: string) => {
		if (event.key === 'Enter') {
			if (type === 'key') {
				finishEditKey(key);
			} else if (key.startsWith('array_')) {
				const index = parseInt(key.replace('array_', ''));
				finishEditArrayValue(index);
			} else {
				finishEditValue(key);
			}
		} else if (event.key === 'Escape') {
			editingKey = null;
			editingValue = null;
		}
	};
</script>

<div class="json-editor">
	{#if getType(data) === 'object'}
		<span class="bracket">{'{'}</span>
		<div class="object-content">
			{#each Object.entries(data) as [key, value], index}
				<div class="property">
					<div class="property-key">
						{#if editingKey === key}
							<input
								type="text"
								bind:value={editKeyValue}
								onblur={() => finishEditKey(key)}
								onkeydown={(e) => handleKeyPress(e, 'key', key)}
								class="inline-input key-input"
							/>
						{:else}
							<span
								class="key-label"
								onclick={() => startEditKey(key)}
								onkeydown={(e) => e.key === 'Enter' && startEditKey(key)}
								role="button"
								tabindex="0"
							>
								"{key}"
							</span>
						{/if}
						<span class="colon">:</span>
					</div>
					
					<span class="property-value">
						{#if getType(value) === 'object' || getType(value) === 'array'}
							<JsonEditorView 
								{...{ data: value, onUpdate: (newValue) => updateNestedValue(key, newValue), path: [...path, key] }}
							/>
						{:else if editingValue === key}
							<input
								type="text"
								bind:value={editValueValue}
								onblur={() => finishEditValue(key)}
								onkeydown={(e) => handleKeyPress(e, 'value', key)}
								class="inline-input value-input"
							/>
						{:else}
							<span
								class="value-label {getType(value)}"
								onclick={() => startEditValue(key, value)}
								onkeydown={(e) => e.key === 'Enter' && startEditValue(key, value)}
								role="button"
								tabindex="0"
							>
								{formatValue(value)}
							</span>
						{/if}
					</span>{#if index < Object.entries(data).length - 1}<span class="comma">,</span>{/if}
				</div>
			{/each}
		</div>
		<span class="bracket">{'}'}</span>
	{:else if getType(data) === 'array'}
		<span class="bracket">[</span>
		<div class="array-content">
			{#each data as item, index}
				<div class="array-item">
					{#if getType(item) === 'object' || getType(item) === 'array'}
						<JsonEditorView 
							{...{ data: item, onUpdate: (newValue) => updateArrayValue(index, newValue), path: [...path, String(index)] }}
						/>
					{:else if editingValue === `array_${index}`}
						<input
							type="text"
							bind:value={editValueValue}
							onblur={() => finishEditArrayValue(index)}
							onkeydown={(e) => handleKeyPress(e, 'value', `array_${index}`)}
							class="inline-input value-input"
						/>
					{:else}
						<span 
							class="value-label {getType(item)}"
							onclick={() => startEditArrayValue(index, item)}
							onkeydown={(e) => e.key === 'Enter' && startEditArrayValue(index, item)}
							role="button"
							tabindex="0"
						>
							{formatValue(item)}
						</span>
					{/if}{#if index < data.length - 1}<span class="comma">,</span>{/if}
				</div>
			{/each}
		</div>
		<span class="bracket">]</span>
	{:else}
		<span class="value-label {getType(data)}">
			{formatValue(data)}
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

	.bracket {
		color: #424242;
		font-weight: bold;
		font-size: 1rem;
		display: block;
	}
</style>