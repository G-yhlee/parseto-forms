<script lang="ts">
	// Self-import for recursive component
	import JsonEditor from './JsonEditor.svelte';

	interface Props {
		data: any;
		onUpdate: (newData: any) => void;
		path?: string[];
	}

	const { data, onUpdate, path = [] }: Props = $props();

	// 편집 상태 관리
	let editingKey = $state<string | null>(null);
	let editingValue = $state<string | null>(null);
	let editKeyValue = $state('');
	let editValueValue = $state('');

	// 데이터 타입 확인
	function getType(value: any): string {
		if (value === null) return 'null';
		if (Array.isArray(value)) return 'array';
		return typeof value;
	}

	// 키 편집 시작
	function startEditKey(key: string) {
		editingKey = key;
		editKeyValue = key;
	}

	// 값 편집 시작
	function startEditValue(key: string, value: any) {
		editingValue = key;
		editValueValue = JSON.stringify(value);
	}

	// 키 편집 완료
	function finishEditKey(oldKey: string) {
		if (editKeyValue && editKeyValue !== oldKey) {
			const newData = { ...data };
			newData[editKeyValue] = newData[oldKey];
			delete newData[oldKey];
			onUpdate(newData);
		}
		editingKey = null;
	}

	// 값 편집 완료
	function finishEditValue(key: string) {
		try {
			const newValue = JSON.parse(editValueValue);
			const newData = { ...data };
			newData[key] = newValue;
			onUpdate(newData);
		} catch (e) {
			// 파싱 실패 시 문자열로 저장
			const newData = { ...data };
			newData[key] = editValueValue;
			onUpdate(newData);
		}
		editingValue = null;
	}

	// 배열 값 편집 시작
	function startEditArrayValue(index: number, value: any) {
		editingValue = `array_${index}`;
		editValueValue = JSON.stringify(value);
	}

	// 배열 값 편집 완료
	function finishEditArrayValue(index: number) {
		try {
			const newValue = JSON.parse(editValueValue);
			const newData = [...data];
			newData[index] = newValue;
			onUpdate(newData);
		} catch (e) {
			// 파싱 실패 시 문자열로 저장
			const newData = [...data];
			newData[index] = editValueValue;
			onUpdate(newData);
		}
		editingValue = null;
	}

	// 엔터키 처리
	function handleKeyPress(event: KeyboardEvent, type: 'key' | 'value', key: string) {
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
	}

	// 값을 표시용 문자열로 변환
	function formatValue(value: any): string {
		if (typeof value === 'string') return `"${value}"`;
		if (value === null) return 'null';
		if (value === undefined) return 'undefined';
		return String(value);
	}
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
								autofocus
							/>
						{:else}
							<span class="key-label" onclick={() => startEditKey(key)} role="button" tabindex="0">
								"{key}"
							</span>
						{/if}
						<span class="colon">:</span>
					</div>

					<span class="property-value">
						{#if getType(value) === 'object' || getType(value) === 'array'}
							<JsonEditor
								data={value}
								onUpdate={(newValue) => {
									const newData = { ...data };
									newData[key] = newValue;
									onUpdate(newData);
								}}
								path={[...path, key]}
							/>
						{:else if editingValue === key}
							<input
								type="text"
								bind:value={editValueValue}
								onblur={() => finishEditValue(key)}
								onkeydown={(e) => handleKeyPress(e, 'value', key)}
								class="inline-input value-input"
								autofocus
							/>
						{:else}
							<span
								class="value-label {getType(value)}"
								onclick={() => startEditValue(key, value)}
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
						<JsonEditor
							data={item}
							onUpdate={(newValue) => {
								const newData = [...data];
								newData[index] = newValue;
								onUpdate(newData);
							}}
							path={[...path, String(index)]}
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
		font-family:
			'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
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
