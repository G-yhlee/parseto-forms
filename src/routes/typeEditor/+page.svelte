<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { 
		TypeEditor, 
		TypeEditorLayout,
		TypeEditorService, 
		createTypeEditorStore,
		type TypeEditorParams 
	} from '$lib/modules/typeEditor';
	import JsonEditor from '$lib/modules/typeEditor/components/JsonEditor.svelte';
	import type { CollectionEntity } from '$lib/domain/entities/Collection';

	// 스토어 생성
	const store = createTypeEditorStore();

	let params: TypeEditorParams | null = null;
	let mounted = false;
	let isEditMode = $state(false);

	// 초기 URL 파라미터 처리만 하고 이후 URL 변경은 무시
	let initialLoad = true;
	$effect(() => {
		const url = $page.url;
		if (mounted && initialLoad) {
			initialLoad = false;
			handleUrlChange();
		}
	});

	async function handleUrlChange() {
		console.log('handleUrlChange: URL changed, current URL:', $page.url.toString());
		const newParams = TypeEditorService.parseUrlParams($page.url.searchParams);
		console.log('handleUrlChange: Parsed params:', newParams);
		
		if (newParams) {
			console.log('handleUrlChange: Loading data for params:', newParams);
			params = newParams;
			await loadData(newParams);
		} else {
			const collection = $page.url.searchParams.get('collection');
			console.log('handleUrlChange: Collection param:', collection);
			if (collection) {
				console.log('handleUrlChange: Loading collection only:', collection);
				await loadCollectionOnly(collection);
			} else {
				console.log('handleUrlChange: No params, resetting store');
				store.reset();
			}
		}
	}

	// 데이터 로드 함수
	async function loadData(params: TypeEditorParams) {
		console.log('loadData: Loading data for params:', params);
		
		// 레코드 리스트와 현재 레코드를 병렬로 로드
		await Promise.all([
			store.loadRecordList(params.collection),
			store.loadRecord(params)
		]);
		
		// 선택된 컬렉션 설정
		await updateSelectedCollection(params.collection);
		console.log('loadData: Data loading completed');
	}

	// 컬렉션만 있는 경우
	async function loadCollectionOnly(collectionId: string) {
		console.log('loadCollectionOnly: Loading collection:', collectionId);
		await store.loadRecordList(collectionId);
		await updateSelectedCollection(collectionId);
		
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

	// 선택된 컬렉션 업데이트
	async function updateSelectedCollection(collectionId: string) {
		if (store.collections.length === 0) {
			await store.loadCollections();
		}
		const collection = store.collections.find(c => c.id === collectionId);
		if (collection && (!store.selectedCollection || store.selectedCollection.id !== collection.id)) {
			store.setSelectedCollection(collection);
		}
	}

	onMount(async () => {
		console.log('onMount: Starting...');
		await store.loadCollections();
		console.log('onMount: Collections loaded, setting mounted = true');
		mounted = true;
	});

	async function handleSave() {
		if (!store.selectedCollection || !store.record) {
			console.error('No collection or record selected');
			return;
		}
		
		console.log('=== SAVE START ===');
		console.log('Before save - record data:', JSON.stringify(store.record, null, 2));
		console.log('Saving to collection:', store.selectedCollection.name);
		
		const result = await store.saveRecord(store.selectedCollection.name, store.record.id);
		
		if (result.success) {
			console.log('=== SAVE SUCCESS ===');
			console.log('After save - record data:', JSON.stringify(result.record, null, 2));
			alert('✓ Record saved successfully!');
		} else {
			console.error('=== SAVE FAILED ===');
			console.error('Error:', result.error);
			alert('⚠️ Failed to save: ' + (result.error || 'Unknown error'));
		}
	}

	function handleRecordUpdate(newRecord: any) {
		store.updateRecord(newRecord);
	}

	function handleRecordSelect(recordId: string) {
		if (!store.selectedCollection) return;
		
		// 직접 레코드 로드 - collection name 사용
		const params = {
			collection: store.selectedCollection!.name,
			recordId: recordId
		};
		store.loadRecord(params);
	}

	function handleCollectionSelect(collection: CollectionEntity) {
		// 이미 선택된 컴렉션이면 아무것도 하지 않음
		if (store.selectedCollection?.id === collection.id) return;
		
		// 직접 스토어 업데이트만 - URL 변경 없이
		store.setSelectedCollection(collection);
		store.loadRecordList(collection.name); // ID 대신 Name 사용
	}
</script>

<svelte:head>
	<title>Type Editor - Record Editor</title>
</svelte:head>

<TypeEditorLayout 
	collections={store.collections}
	collectionsLoading={store.collectionsLoading}
	selectedCollection={store.selectedCollection}
	recordList={store.recordList}
	recordListLoading={store.listLoading}
	currentRecordId={store.record?.id || null}
	onCollectionSelect={handleCollectionSelect}
	onRecordSelect={handleRecordSelect}
>
	{#snippet children()}
		{#if store.loading}
			<div class="loading-state">
				<div class="spinner"></div>
				<p>Loading record...</p>
			</div>
		{:else if store.error}
			<div class="error-state">
				<div class="error-icon">⚠️</div>
				<h2>Error</h2>
				<p>{store.error}</p>
				<button class="btn btn-primary" onclick={() => goto('/')}>
					Go Back
				</button>
			</div>
		{:else if store.record}
			<div class="editor-container">
				<header class="editor-header">
					<div class="header-info">
						<h1>Record Editor</h1>
						<div class="record-meta">
							<span class="collection">Collection: {store.selectedCollection?.name || store.record.collectionName}</span>
							<span class="record-id">ID: {store.record.id}</span>
						</div>
					</div>
					<div class="header-actions">
						<button 
							class="btn btn-secondary" 
							onclick={() => isEditMode = !isEditMode}
						>
							{isEditMode ? '👁️ Read Mode' : '✏️ Edit Mode'}
						</button>
						{#if isEditMode}
							<button 
								class="btn btn-primary" 
								onclick={handleSave}
								disabled={!store.hasChanges || store.saving}
							>
								{store.saving ? 'Saving...' : 'Save Changes'}
							</button>
						{/if}
					</div>
				</header>

				<div class="editor-body">
					<!-- Left Panel - Data Editor -->
					<div class="panel data-panel">
						<div class="panel-header">
							<h3>Record Data</h3>
							{#if store.hasChanges}
								<span class="changes-indicator">● Unsaved changes</span>
							{/if}
						</div>
						<div class="panel-content">
							{#if isEditMode}
								<div class="editor-view">
									{#if !store.saving}
										<JsonEditor
											data={store.record}
											onUpdate={handleRecordUpdate}
										/>
									{:else}
										<div class="saving-overlay">
											<div class="spinner"></div>
											<p>Saving changes...</p>
										</div>
									{/if}
								</div>
							{:else}
								<div class="json-view">
									<pre><code>{JSON.stringify(store.record, null, 2)}</code></pre>
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
								onclick={() => navigator.clipboard.writeText(store.generatedTypes)}
							>
								Copy
							</button>
						</div>
						<div class="panel-content">
							{#if store.generatedTypes}
								<div class="typescript-output">
									<pre><code>{@html store.highlightedTypes}</code></pre>
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
		{:else if store.selectedCollection && store.recordList.length > 0}
			<div class="select-record-state">
				<div class="placeholder-content">
					<div class="placeholder-icon">📝</div>
					<h2>Select a Record</h2>
					<p>Choose a record from the sidebar to start editing</p>
				</div>
			</div>
		{:else if store.selectedCollection}
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
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
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
		font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
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