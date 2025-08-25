<script lang="ts">
	import { 
		JsonEditorView, 
		CollectionSidebarView, 
		SidebarHeaderView,
		sampleJsonData, 
		sampleCollections,
		collectionStore,
		pocketbaseService,
		type JsonData,
		type Collection 
	} from '$lib/modules/typeEditor3';

	// 페이지 상태
	let selectedCollectionId = $state<string | null>(null);
	let selectedCollection = $derived(() => 
		currentCollections.find(c => c.id === selectedCollectionId) || null
	);
	let pinnedCollectionIds = $state(new Set(['users'])); // users 컬렉션을 기본으로 핀
	let expandedCollectionIds = $state(new Set<string>());
	
	// 데이터 소스 선택 (샘플 데이터 vs PB 실제 데이터)
	let useRealData = $state(false);
	let connectionStatus = $state<{ connected: boolean; url: string; error?: string } | null>(null);
	
	// 현재 사용할 컬렉션 목록
	let currentCollections = $derived(() => {
		const result = useRealData && collectionStore.hasData ? collectionStore.userCollections : sampleCollections;
		console.log('currentCollections derived:', {
			useRealData,
			hasData: collectionStore.hasData,
			userCollections: collectionStore.userCollections.length,
			sampleCollections: sampleCollections.length,
			result: result.length
		});
		return result;
	});

	// JSON 에디터 데이터
	let jsonData = $state<JsonData>(sampleJsonData);
	let showJsonEditor = $state(true);

	// 핸들러들
	const handleCollectionSelect = (collection: any) => {
		selectedCollectionId = collection.id;
		console.log('Selected collection:', collection);
	};

	const handleTogglePin = (collectionId: string) => {
		if (pinnedCollectionIds.has(collectionId)) {
			pinnedCollectionIds.delete(collectionId);
		} else {
			pinnedCollectionIds.add(collectionId);
		}
		// Set을 새로 만들어서 reactivity 트리거
		pinnedCollectionIds = new Set(pinnedCollectionIds);
		console.log('Pinned collections:', Array.from(pinnedCollectionIds));
	};

	const handleToggleRecords = (collectionId: string) => {
		if (expandedCollectionIds.has(collectionId)) {
			expandedCollectionIds.delete(collectionId);
		} else {
			expandedCollectionIds.add(collectionId);
		}
		// Set을 새로 만들어서 reactivity 트리거
		expandedCollectionIds = new Set(expandedCollectionIds);
		console.log('Expanded collections:', Array.from(expandedCollectionIds));
	};

	const handleJsonUpdate = (newData: JsonData) => {
		jsonData = newData;
		console.log('JSON updated:', newData);
	};

	const resetData = () => {
		jsonData = structuredClone(sampleJsonData);
	};

	const exportJson = () => {
		const dataStr = JSON.stringify(jsonData, null, 2);
		const dataBlob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'exported-data.json';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	// PB 연결 관련 핸들러들
	const checkConnection = async () => {
		console.log('Checking PB connection...');
		connectionStatus = await collectionStore.checkConnection();
		console.log('Connection status:', connectionStatus);
	};

	const loadCollections = async () => {
		console.log('Loading collections from PB...');
		await collectionStore.fetchCollections();
	};

	const refreshCollections = async () => {
		console.log('Refreshing collections from PB...');
		await collectionStore.refreshCollections();
	};

	const toggleDataSource = async () => {
		console.log('toggleDataSource: Current state:', { useRealData, hasData: collectionStore.hasData });
		
		if (!useRealData) {
			// 실제 데이터로 전환하기 전에 연결 확인
			console.log('toggleDataSource: Switching to real data...');
			await checkConnection();
			
			if (connectionStatus?.connected) {
				await loadCollections();
				useRealData = true;
				selectedCollectionId = null; // 선택 초기화
				console.log('toggleDataSource: Switched to real data, collections:', collectionStore.collections.length);
			} else {
				console.error('toggleDataSource: Connection failed:', connectionStatus?.error);
				alert(`PocketBase 연결 실패: ${connectionStatus?.error || 'Unknown error'}`);
			}
		} else {
			// 샘플 데이터로 전환
			console.log('toggleDataSource: Switching to sample data...');
			useRealData = false;
			selectedCollectionId = null; // 선택 초기화
		}
	};
</script>

<svelte:head>
	<title>TypeEditor3 - UI Only Demo</title>
</svelte:head>

<div class="type-editor3-demo">
	<!-- 상단 헤더 -->
	<header class="demo-header">
		<div class="header-content">
			<h1>TypeEditor3 Demo</h1>
			<p>순수 UI 컴포넌트와 샘플 데이터를 사용한 데모 페이지입니다</p>
		</div>
		<div class="header-actions">
			<button class="btn btn-secondary" onclick={() => showJsonEditor = !showJsonEditor}>
				{showJsonEditor ? '👁️ Hide Editor' : '✏️ Show Editor'}
			</button>
			<button class="btn btn-primary" onclick={resetData}>
				🔄 Reset Data
			</button>
			<button class="btn btn-success" onclick={exportJson}>
				📁 Export JSON
			</button>
			<button 
				class="btn {useRealData ? 'btn-warning' : 'btn-info'}" 
				onclick={toggleDataSource}
				disabled={collectionStore.loading}
			>
				{#if collectionStore.loading}
					⏳ Loading...
				{:else if useRealData}
					📦 Sample Data
				{:else}
					🔗 PocketBase
				{/if}
			</button>
		</div>
	</header>

	<div class="demo-content">
		<!-- 왼쪽 사이드바 -->
		<aside class="demo-sidebar">
			<SidebarHeaderView 
				title="TypeEditor3" 
				subtitle="Pure UI Components"
				icon="🎨"
			/>
			
			<!-- 데이터 소스 상태 -->
			<div class="data-source-status">
				<div class="status-header">
					<h4>Data Source</h4>
					<span class="status-badge {useRealData ? 'real' : 'sample'}">
						{useRealData ? 'PocketBase' : 'Sample'}
					</span>
				</div>
				
				{#if useRealData}
					<div class="pb-info">
						<p><strong>URL:</strong> {connectionStatus?.url || 'Unknown'}</p>
						<p><strong>Status:</strong> 
							<span class="connection-status {connectionStatus?.connected ? 'connected' : 'disconnected'}">
								{connectionStatus?.connected ? '🟢 Connected' : '🔴 Disconnected'}
							</span>
						</p>
						{#if connectionStatus?.error}
							<p class="error-text"><strong>Error:</strong> {connectionStatus.error}</p>
						{/if}
						<p><strong>Collections:</strong> {collectionStore.userCollections.length} user / {collectionStore.systemCollections.length} system</p>
						<p><strong>Total Collections:</strong> {collectionStore.collections.length}</p>
						<p><strong>Current Collections:</strong> {currentCollections.length}</p>
						<p><strong>Loading:</strong> {collectionStore.loading ? 'Yes' : 'No'}</p>
						{#if collectionStore.lastFetch}
							<p><strong>Last Update:</strong> {new Date(collectionStore.lastFetch).toLocaleTimeString()}</p>
						{/if}
						
						<!-- 디버그: 컬렉션 목록 -->
						{#if currentCollections.length > 0}
							<details>
								<summary>Debug: Collection List</summary>
								<pre class="debug-collections">{JSON.stringify(currentCollections, null, 2)}</pre>
							</details>
						{/if}
					</div>
					
					{#if collectionStore.error}
						<div class="error-banner">
							<strong>Error:</strong> {collectionStore.error}
							<button class="btn btn-sm btn-secondary" onclick={refreshCollections}>
								🔄 Retry
							</button>
						</div>
					{/if}
				{:else}
					<p class="sample-info">Using static sample collections for demo</p>
				{/if}
			</div>
			
			<CollectionSidebarView
				collections={currentCollections}
				{selectedCollectionId}
				{pinnedCollectionIds}
				{expandedCollectionIds}
				onCollectionSelect={handleCollectionSelect}
				onTogglePin={handleTogglePin}
				onToggleRecords={handleToggleRecords}
			/>

			<!-- 선택된 컬렉션 정보 -->
			{#if selectedCollection}
				<div class="selected-info">
					<h3>Selected Collection</h3>
					<div class="collection-details">
						<p><strong>ID:</strong> {selectedCollection.id}</p>
						<p><strong>Name:</strong> {selectedCollection.name}</p>
						<p><strong>Type:</strong> {selectedCollection.type}</p>
						<p><strong>Pinned:</strong> {pinnedCollectionIds.has(selectedCollection.id) ? 'Yes' : 'No'}</p>
						<p><strong>Expanded:</strong> {expandedCollectionIds.has(selectedCollection.id) ? 'Yes' : 'No'}</p>
					</div>
				</div>
			{/if}
		</aside>

		<!-- 메인 콘텐츠 영역 -->
		<main class="demo-main">
			{#if showJsonEditor}
				<div class="json-editor-section">
					<div class="section-header">
						<h2>JSON Editor</h2>
						<p>인라인 편집이 가능한 JSON 에디터 컴포넌트입니다</p>
					</div>
					
					<div class="editor-container">
						<JsonEditorView 
							data={jsonData}
							onUpdate={handleJsonUpdate}
						/>
					</div>
				</div>
			{:else}
				<div class="json-preview-section">
					<div class="section-header">
						<h2>JSON Preview</h2>
						<p>현재 JSON 데이터의 읽기 전용 미리보기입니다</p>
					</div>
					
					<div class="preview-container">
						<pre><code>{JSON.stringify(jsonData, null, 2)}</code></pre>
					</div>
				</div>
			{/if}

			<!-- 컴포넌트 정보 -->
			<div class="components-info">
				<h2>포함된 UI 컴포넌트들</h2>
				<div class="components-grid">
					<div class="component-card">
						<h3>🧩 JsonEditor</h3>
						<p>재귀적 JSON 편집, 인라인 편집, 타입별 색상 구분</p>
					</div>
					<div class="component-card">
						<h3>📋 CollectionSidebar</h3>
						<p>컬렉션 목록, 확장/축소, CollectionItem 사용</p>
					</div>
					<div class="component-card">
						<h3>📄 CollectionItem</h3>
						<p>개별 컬렉션 표시, 선택/핀/확장 상태</p>
					</div>
					<div class="component-card">
						<h3>📝 SidebarHeader</h3>
						<p>사이드바 제목, 호버 효과, 커스터마이저블 아이콘</p>
					</div>
				</div>
			</div>
		</main>
	</div>
</div>

<style>
	.type-editor3-demo {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: #f8fafc;
	}

	/* 헤더 스타일 */
	.demo-header {
		background: white;
		border-bottom: 1px solid #e2e8f0;
		padding: 1.5rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.header-content h1 {
		margin: 0 0 0.5rem 0;
		font-size: 1.875rem;
		font-weight: 700;
		color: #1e293b;
	}

	.header-content p {
		margin: 0;
		color: #64748b;
		font-size: 1rem;
	}

	.header-actions {
		display: flex;
		gap: 0.75rem;
	}

	/* 콘텐츠 영역 */
	.demo-content {
		flex: 1;
		display: flex;
		min-height: 0;
	}

	.demo-sidebar {
		width: 320px;
		background: white;
		border-right: 1px solid #e2e8f0;
		display: flex;
		flex-direction: column;
		overflow: auto;
	}

	.demo-main {
		flex: 1;
		padding: 2rem;
		overflow: auto;
	}

	/* 사이드바 선택된 컬렉션 정보 */
	.selected-info {
		padding: 1rem;
		margin: 1rem;
		background: #f1f5f9;
		border-radius: 8px;
		border-left: 4px solid #3b82f6;
	}

	.selected-info h3 {
		margin: 0 0 0.75rem 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: #1e293b;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.collection-details p {
		margin: 0.25rem 0;
		font-size: 0.75rem;
		color: #475569;
	}

	.collection-details strong {
		color: #1e293b;
	}

	/* JSON 에디터 섹션 */
	.json-editor-section,
	.json-preview-section {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	}

	.section-header {
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e2e8f0;
	}

	.section-header h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: #1e293b;
	}

	.section-header p {
		margin: 0;
		color: #64748b;
		font-size: 0.875rem;
	}

	.editor-container {
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		padding: 1.5rem;
		background: #fafafa;
		max-height: 500px;
		overflow: auto;
	}

	.preview-container {
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		overflow: hidden;
	}

	.preview-container pre {
		margin: 0;
		padding: 1.5rem;
		background: #fafafa;
		font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
		font-size: 0.875rem;
		line-height: 1.6;
		color: #1f2937;
		max-height: 500px;
		overflow: auto;
	}

	/* 컴포넌트 정보 */
	.components-info {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.components-info h2 {
		margin: 0 0 1.5rem 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: #1e293b;
	}

	.components-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}

	.component-card {
		padding: 1rem;
		background: #f8fafc;
		border-radius: 8px;
		border-left: 4px solid #3b82f6;
	}

	.component-card h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: #1e293b;
	}

	.component-card p {
		margin: 0;
		font-size: 0.875rem;
		color: #64748b;
		line-height: 1.5;
	}

	/* 버튼 스타일 */
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
		white-space: nowrap;
	}

	.btn-primary {
		background: #3b82f6;
		color: white;
		border-color: #3b82f6;
	}

	.btn-primary:hover {
		background: #2563eb;
		border-color: #2563eb;
	}

	.btn-secondary {
		background: white;
		color: #374151;
		border-color: #d1d5db;
	}

	.btn-secondary:hover {
		background: #f9fafb;
		border-color: #9ca3af;
	}

	.btn-success {
		background: #10b981;
		color: white;
		border-color: #10b981;
	}

	.btn-success:hover {
		background: #059669;
		border-color: #059669;
	}

	.btn-info {
		background: #0ea5e9;
		color: white;
		border-color: #0ea5e9;
	}

	.btn-info:hover:not(:disabled) {
		background: #0284c7;
		border-color: #0284c7;
	}

	.btn-warning {
		background: #f59e0b;
		color: white;
		border-color: #f59e0b;
	}

	.btn-warning:hover:not(:disabled) {
		background: #d97706;
		border-color: #d97706;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* 데이터 소스 상태 */
	.data-source-status {
		margin: 1rem;
		padding: 1rem;
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		font-size: 0.875rem;
	}

	.status-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.status-header h4 {
		margin: 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: #1e293b;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.status-badge {
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.status-badge.sample {
		background: #e0e7ff;
		color: #3730a3;
	}

	.status-badge.real {
		background: #dcfce7;
		color: #166534;
	}

	.pb-info p, .sample-info {
		margin: 0.5rem 0;
		font-size: 0.75rem;
		color: #475569;
	}

	.connection-status.connected {
		color: #059669;
	}

	.connection-status.disconnected {
		color: #dc2626;
	}

	.error-text {
		color: #dc2626 !important;
	}

	.error-banner {
		background: #fef2f2;
		border: 1px solid #fecaca;
		border-radius: 4px;
		padding: 0.75rem;
		margin-top: 0.75rem;
		color: #991b1b;
		font-size: 0.75rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}

	.sample-info {
		font-style: italic;
		color: #64748b;
	}

	.debug-collections {
		background: #1e1e1e;
		color: #d4d4d4;
		padding: 0.75rem;
		border-radius: 4px;
		font-size: 0.65rem;
		max-height: 200px;
		overflow: auto;
		margin-top: 0.5rem;
	}

	/* 반응형 */
	@media (max-width: 1024px) {
		.demo-content {
			flex-direction: column;
		}

		.demo-sidebar {
			width: 100%;
			min-height: 300px;
			border-right: none;
			border-bottom: 1px solid #e2e8f0;
		}

		.components-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.demo-header {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}

		.header-actions {
			justify-content: center;
			flex-wrap: wrap;
		}

		.demo-main {
			padding: 1rem;
		}

		.btn {
			font-size: 0.75rem;
			padding: 0.375rem 0.75rem;
		}
	}
</style>