<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { genTypeEditorDefs } from '$lib/modules/typeEditor2/genTypeEditorDefs';
	import { TypeEditorService } from '$lib/modules/typeEditor';
	import type { TypeEditorParams } from '$lib/modules/typeEditor';
	import TypeEditorLayout from '$lib/modules/typeEditor2/components/TypeEditorLayout.svelte';
	import JsonEditor from '$lib/modules/typeEditor2/components/JsonEditor.svelte';

	// Generate definitions
	const defs = genTypeEditorDefs();
	const { datas, states, actions } = defs;

	// Local state for page management
	let mounted = false;
	let isEditMode = $state(false);
	let initializing = $state(false);
	let lastProcessedUrl = '';

	// URL 변경 감지 및 처리 - 초기화 완료 후에만 실행
	$effect(() => {
		const currentUrl = $page.url.toString();
		if (mounted && !initializing && currentUrl !== lastProcessedUrl) {
			lastProcessedUrl = currentUrl;
			handleUrlChange();
		}
	});

	async function handleUrlChange() {
		console.log('handleUrlChange: URL changed, current URL:', $page.url.toString());
		const newParams = TypeEditorService.parseUrlParams($page.url.searchParams);
		console.log('handleUrlChange: Parsed params:', newParams);

		if (newParams) {
			console.log('handleUrlChange: Loading data for params:', newParams);
			await loadData(newParams);
		} else {
			const collection = $page.url.searchParams.get('collection');
			console.log('handleUrlChange: Collection param:', collection);
			if (collection) {
				console.log('handleUrlChange: Loading collection only:', collection);
				await loadCollectionOnly(collection);
			}
		}
	}

	// 데이터 로드 함수 - 순차 실행으로 안정성 보장
	async function loadData(params: TypeEditorParams) {
		console.log('loadData: Loading data for params:', params);

		try {
			// 1. 컬렉션 찾기
			const collection = datas.collections().find(
				c => c.id === params.collection || c.name === params.collection
			);
			
			if (!collection) {
				console.error('loadData: Collection not found:', params.collection);
				return;
			}

			// 2. 컬렉션 선택 및 레코드 리스트 로드
			await actions.onCollectionSelect(collection);

			// 3. 특정 레코드 선택
			await actions.onRecordSelect(params.recordId);

			console.log('loadData: Data loading completed successfully');
		} catch (error) {
			console.error('loadData: Error loading data:', error);
		}
	}

	// 컬렉션만 있는 경우
	async function loadCollectionOnly(collectionId: string) {
		console.log('loadCollectionOnly: Loading collection:', collectionId);
		
		const collection = datas.collections().find(
			c => c.id === collectionId || c.name === collectionId
		);
		
		if (!collection) {
			console.error('loadCollectionOnly: Collection not found:', collectionId);
			return;
		}

		await actions.onCollectionSelect(collection);

		// 첫 번째 레코드가 있으면 자동 선택
		const firstRecordId = await TypeEditorService.getFirstRecordId(collectionId);
		console.log('loadCollectionOnly: First record ID:', firstRecordId);
		if (firstRecordId) {
			const newUrl = new URL($page.url);
			newUrl.searchParams.set('recordId', firstRecordId);
			console.log('loadCollectionOnly: Navigating to:', newUrl.toString());
			goto(newUrl.toString(), { replaceState: true });
		}
	}

	onMount(async () => {
		console.log('onMount: Starting...');
		initializing = true;

		try {
			// 1. 컬렉션 로딩 대기
			while (states.collectionsLoading()) {
				await new Promise(resolve => setTimeout(resolve, 100));
			}
			console.log('onMount: Collections loaded, count:', datas.collections().length);

			// 2. URL 파라미터 확인 및 초기 데이터 로드
			const currentUrl = $page.url.toString();
			lastProcessedUrl = currentUrl;

			const urlParams = TypeEditorService.parseUrlParams($page.url.searchParams);
			console.log('onMount: URL params:', urlParams);

			if (urlParams) {
				// URL에 collection과 recordId가 모두 있는 경우
				console.log('onMount: Loading initial data from URL params');
				await loadData(urlParams);
			} else {
				// collection만 있는 경우
				const collectionParam = $page.url.searchParams.get('collection');
				if (collectionParam) {
					console.log('onMount: Loading collection only from URL:', collectionParam);
					await loadCollectionOnly(collectionParam);
				}
			}
		} finally {
			initializing = false;
			mounted = true;
			console.log('onMount: Initialization complete');
		}
	});

	async function handleSave() {
		if (!datas.selectedCollection() || !datas.currentRecord()) {
			return;
		}

		// 모든 input을 강제로 blur해서 편집 완료
		const inputs = document.querySelectorAll('.json-editor input');
		inputs.forEach((input) => (input as HTMLElement).blur());

		// Svelte의 reactivity cycle 완료 대기
		await tick();
		await tick();

		const result = await actions.onSave();

		if (result.success) {
			alert('✓ Record saved successfully!');
		} else {
			alert('⚠️ Failed to save: ' + (result.error || 'Unknown error'));
		}
	}

	function handleRecordSelect(recordId: string) {
		if (!datas.selectedCollection()) return;

		// 현재 선택된 레코드와 같으면 URL 업데이트 생략
		const currentRecordId = $page.url.searchParams.get('recordId');
		if (currentRecordId === recordId) return;

		// URL 업데이트
		const newUrl = new URL($page.url);
		newUrl.searchParams.set('collection', datas.selectedCollection()!.id);
		newUrl.searchParams.set('recordId', recordId);

		// 기존 filter, sort 파라미터 유지
		const currentFilter = $page.url.searchParams.get('filter');
		const currentSort = $page.url.searchParams.get('sort');
		if (currentFilter) newUrl.searchParams.set('filter', currentFilter);
		if (currentSort) newUrl.searchParams.set('sort', currentSort);

		goto(newUrl.toString(), { replaceState: true });

		// 레코드 로드
		actions.onRecordSelect(recordId);
	}

	function handleCollectionSelect(collection: any) {
		// 이미 선택된 컴렉션이면 아무것도 하지 않음
		if (datas.selectedCollection()?.id === collection.id) return;

		// URL에서 현재 컬렉션 확인 - 이미 같으면 URL 업데이트 생략
		const currentCollection = $page.url.searchParams.get('collection');
		if (currentCollection === collection.id) {
			// URL은 같지만 상태가 다를 수 있으므로 선택만 업데이트
			actions.onCollectionSelect(collection);
			return;
		}

		// URL 업데이트 (컬렉션만 변경, 레코드 ID는 제거)
		const newUrl = new URL($page.url);
		newUrl.searchParams.set('collection', collection.id);
		newUrl.searchParams.delete('recordId'); // 컬렉션 변경 시 레코드 ID 제거

		goto(newUrl.toString(), { replaceState: true });

		// 컬렉션 선택
		actions.onCollectionSelect(collection);
	}
</script>

<svelte:head>
	<title>Type Editor - Record Editor</title>
</svelte:head>

<TypeEditorLayout
	collections={datas.collections()}
	collectionsLoading={states.collectionsLoading()}
	selectedCollection={datas.selectedCollection()}
	recordList={datas.recordList()}
	recordListLoading={states.recordListLoading()}
	currentRecordId={states.currentRecordId()}
	onCollectionSelect={handleCollectionSelect}
	onRecordSelect={handleRecordSelect}
>
	{#snippet children()}
		{#if states.recordListLoading() && !datas.currentRecord()}
			<div class="loading-state">
				<div class="spinner"></div>
				<p>Loading record...</p>
			</div>
		{:else if datas.error()}
			<div class="error-state">
				<div class="error-icon">⚠️</div>
				<h2>Error</h2>
				<p>{datas.error()}</p>
				<button class="btn btn-primary" onclick={() => goto('/')}> Go Back </button>
			</div>
		{:else if datas.currentRecord()}
			<div class="editor-container">
				<header class="editor-header">
					<div class="header-info">
						<h1>Record Editor</h1>
						<div class="record-meta">
							<span class="collection"
								>Collection: {datas.selectedCollection()?.name || datas.currentRecord()!.collectionName}</span
							>
							<span class="record-id">ID: {datas.currentRecord()!.id}</span>
						</div>
					</div>
					<div class="header-actions">
						<button class="btn btn-secondary" onclick={() => (isEditMode = !isEditMode)}>
							{isEditMode ? '👁️ Read Mode' : '✏️ Edit Mode'}
						</button>
						{#if isEditMode}
							<button
								class="btn btn-primary"
								onclick={handleSave}
								disabled={!states.hasChanges() || states.saving()}
							>
								{states.saving() ? 'Saving...' : 'Save Changes'}
							</button>
						{/if}
					</div>
				</header>

				<div class="editor-body">
					<!-- Left Panel - Data Editor -->
					<div class="panel data-panel">
						<div class="panel-header">
							<h3>Record Data</h3>
							{#if states.hasChanges()}
								<span class="changes-indicator">● Unsaved changes</span>
							{/if}
						</div>
						<div class="panel-content">
							{#if isEditMode}
								<div class="editor-view">
									{#if !states.saving()}
										<JsonEditor data={datas.currentRecord()} onUpdate={actions.onJsonUpdate} />
									{:else}
										<div class="saving-overlay">
											<div class="spinner"></div>
											<p>Saving changes...</p>
										</div>
									{/if}
								</div>
							{:else}
								<div class="json-view">
									<pre><code>{JSON.stringify(datas.currentRecord(), null, 2)}</code></pre>
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
								onclick={actions.onCopyTypes}
							>
								Copy
							</button>
						</div>
						<div class="panel-content">
							{#if datas.generatedTypes()}
								<div class="typescript-output">
									<pre><code>{@html datas.highlightedTypes()}</code></pre>
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
		{:else if datas.selectedCollection() && datas.recordList().length > 0}
			<div class="select-record-state">
				<div class="placeholder-content">
					<div class="placeholder-icon">📝</div>
					<h2>Select a Record</h2>
					<p>Choose a record from the sidebar to start editing</p>
				</div>
			</div>
		{:else if datas.selectedCollection()}
			<div class="empty-collection-state">
				<div class="placeholder-content">
					<div class="placeholder-icon">📭</div>
					<h2>No Records</h2>
					<p>This collection doesn't have any records yet.</p>
				</div>
			</div>
		{:else}
			<div class="no-collection-state">
				<div class="placeholder-content">
					<div class="placeholder-icon">🗂️</div>
					<h2>Select a Collection</h2>
					<p>Choose a collection from the sidebar to view and edit records</p>
				</div>
			</div>
		{/if}
	{/snippet}
</TypeEditorLayout>

<style>
	.loading-state,
	.error-state,
	.select-record-state,
	.empty-collection-state,
	.no-collection-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		padding: 2rem;
		text-align: center;
		background: white;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f4f6;
		border-top: 4px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.error-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.loading-state p,
	.error-state p {
		color: #6b7280;
		font-size: 1.125rem;
		margin-bottom: 2rem;
		max-width: 400px;
	}

	.error-state h2 {
		color: #1f2937;
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.placeholder-content {
		text-align: center;
		color: #6b7280;
	}

	.placeholder-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.placeholder-content h2 {
		color: #1f2937;
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
	}

	.placeholder-content p {
		font-size: 1.125rem;
		margin: 0;
	}

	/* Editor Styles */
	.editor-container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: white;
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

	.editor-view {
		padding: 1.5rem;
		height: 100%;
		overflow: auto;
	}

	.json-view {
		padding: 1.5rem;
		height: 100%;
		overflow: auto;
	}

	.json-view pre {
		margin: 0;
		font-family:
			'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
		font-size: 0.875rem;
		line-height: 1.6;
		color: #1f2937;
		background: #f9fafb;
		padding: 1rem;
		border-radius: 6px;
	}

	.saving-overlay {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		min-height: 200px;
		color: #6b7280;
	}

	.saving-overlay .spinner {
		width: 32px;
		height: 32px;
		border: 3px solid #f3f4f6;
		border-top: 3px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	.saving-overlay p {
		margin: 0;
		font-size: 0.875rem;
	}

	.typescript-output {
		padding: 1.5rem;
		height: 100%;
		overflow: auto;
	}

	.typescript-output pre {
		margin: 0;
		font-family:
			'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
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
		background: none;
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
