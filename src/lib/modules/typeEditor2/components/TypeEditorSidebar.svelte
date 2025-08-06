<script lang="ts">
	import { ChevronDown, ChevronRight, Database, FileText, Users } from 'lucide-svelte';
	import type { PocketBaseRecord } from '../types';
	import type { CollectionEntity } from '$lib/domain/entities/Collection';
	import { PinnedCollectionsService } from '../services/PinnedCollectionsService';

	interface Props {
		collections: CollectionEntity[];
		collectionsLoading: boolean;
		selectedCollection: CollectionEntity | null;
		recordList: PocketBaseRecord[];
		recordListLoading: boolean;
		currentRecordId: string | null;
		onCollectionSelect: (collection: CollectionEntity) => void;
		onRecordSelect: (recordId: string) => void;
	}

	const {
		collections,
		collectionsLoading,
		selectedCollection,
		recordList,
		recordListLoading,
		currentRecordId,
		onCollectionSelect,
		onRecordSelect
	}: Props = $props();

	// 디버깅 로그 제거 (무한 렌더링 방지)

	let collectionsExpanded = $state(true);
	let expandedCollections = $state<Set<string>>(new Set());
	let pinUpdateTrigger = $state(0); // 핀 상태 변경을 감지하기 위한 트리거

	// 고정된 컬렉션과 정렬된 컬렉션을 derived로 한번에 계산
	let sortedCollections = $derived.by(() => {
		// pinUpdateTrigger를 참조하여 핀 상태 변경 시 재계산되도록 함
		pinUpdateTrigger;
		
		// 브라우저에서만 pinned 정보 로드
		const pinnedIds = typeof window !== 'undefined' 
			? PinnedCollectionsService.getPinnedCollections() 
			: new Set<string>();
		
		const pinned: CollectionEntity[] = [];
		const unpinned: CollectionEntity[] = [];
		
		collections.forEach(collection => {
			if (pinnedIds.has(collection.id)) {
				pinned.push(collection);
			} else {
				unpinned.push(collection);
			}
		});
		
		// 각 그룹 내에서 알파벳 순으로 정렬
		pinned.sort((a, b) => a.name.localeCompare(b.name));
		unpinned.sort((a, b) => a.name.localeCompare(b.name));
		
		return { collections: [...pinned, ...unpinned], pinnedIds };
	});

	function toggleCollections() {
		collectionsExpanded = !collectionsExpanded;
	}

	function toggleCollectionRecords(collection: CollectionEntity) {
		const collectionId = collection.id;
		
		// 단순하게 토글만
		const newSet = new Set(expandedCollections);
		if (expandedCollections.has(collectionId)) {
			newSet.delete(collectionId);
		} else {
			newSet.add(collectionId);
			// 펼칠 때 컬렉션 선택
			onCollectionSelect(collection);
		}
		expandedCollections = newSet;
	}

	function handleCollectionClick(collection: CollectionEntity) {
		// 컬렉션 선택
		onCollectionSelect(collection);
		
		// 자동 펼치기 (이미 펼쳐져 있으면 그대로 유지)
		if (!expandedCollections.has(collection.id)) {
			const newSet = new Set(expandedCollections);
			newSet.add(collection.id);
			expandedCollections = newSet;
		}
	}

	function handleRecordClick(collection: CollectionEntity, record: PocketBaseRecord) {
		onRecordSelect(record.id);
	}

	// 선택된 컬렉션 자동 펼치기
	$effect(() => {
		if (selectedCollection && !expandedCollections.has(selectedCollection.id)) {
			console.log('Auto-expanding selected collection:', selectedCollection.id);
			const newSet = new Set(expandedCollections);
			newSet.add(selectedCollection.id);
			expandedCollections = newSet;
		}
	});

	// 핀 토글 기능
	function togglePin(event: Event, collectionId: string) {
		event.stopPropagation(); // 컬렉션 클릭 이벤트 방지
		
		PinnedCollectionsService.togglePin(collectionId);
		
		// derived 재계산을 트리거
		pinUpdateTrigger = pinUpdateTrigger + 1;
	}


	function getCollectionIcon(type: string): any {
		switch (type) {
			case 'auth':
				return Users;
			case 'base':
				return Database;
			case 'view':
				return FileText;
			default:
				return Database;
		}
	}

	function formatDate(dateString: string): string {
		try {
			return new Date(dateString).toLocaleDateString();
		} catch {
			return dateString;
		}
	}

	function getRecordPreview(record: PocketBaseRecord): string {
		// data 필드가 있으면 첫 번째 필드 값 사용
		if (record.data && typeof record.data === 'object') {
			const firstKey = Object.keys(record.data)[0];
			if (firstKey) {
				const value = record.data[firstKey];
				if (typeof value === 'string') {
					return value.substring(0, 30);
				}
			}
		}

		// 다른 필드에서 표시할 만한 값 찾기
		for (const [key, value] of Object.entries(record)) {
			if (
				key !== 'id' &&
				key !== 'created' &&
				key !== 'updated' &&
				key !== 'collectionId' &&
				key !== 'collectionName'
			) {
				if (typeof value === 'string') {
					return value.substring(0, 30);
				}
			}
		}

		return `Record ${record.id.substring(0, 8)}...`;
	}
</script>

<div class="type-editor-sidebar">
	<!-- Header -->
	<div class="sidebar-header">
		<div class="header-title">
			<Database size={20} />
			<h2>Type Editor</h2>
		</div>
	</div>

	<!-- Collections Section -->
	<div class="sidebar-section">
		<button class="section-header" onclick={toggleCollections}>
			{#if collectionsExpanded}
				<ChevronDown size={16} />
			{:else}
				<ChevronRight size={16} />
			{/if}
			<span>Collections</span>
			{#if !collectionsLoading}
				<span class="count">{collections.length}</span>
			{/if}
		</button>

		{#if collectionsExpanded}
			<div class="sidebar-content">
				{#if collectionsLoading}
					<div class="loading-state">
						<div class="spinner"></div>
						<p>Loading collections...</p>
					</div>
				{:else if collections.length === 0}
					<div class="empty-state">
						<p>No collections found</p>
					</div>
				{:else}
					<div class="collection-list">
						{#each sortedCollections.collections as collection}
							{@const IconComponent = getCollectionIcon(collection.type)}
							{@const isExpanded = expandedCollections.has(collection.id)}
							{@const isSelectedCollection = selectedCollection?.id === collection.id}
							{@const records = isSelectedCollection ? recordList : []}

							<div class="collection-group">
								<!-- Collection Header -->
								<div class="collection-header">
									<button
										class="collection-item"
										class:active={selectedCollection?.id === collection.id}
										onclick={() => handleCollectionClick(collection)}
									>
										<div class="collection-icon">
											<IconComponent size={16} />
										</div>
										<div class="collection-info">
											<div class="collection-name">
												{collection.name}
											</div>
											<div class="collection-meta">
												<span class="collection-type">{collection.type}</span>
												<!-- <span class="record-count">{collection.recordCount || 0} records</span> -->
											</div>
										</div>
										{#if selectedCollection?.id === collection.id}
											<div class="active-indicator"></div>
										{/if}
									</button>

									<!-- Pin Button -->
									<button
										class="pin-btn"
										onclick={(e) => togglePin(e, collection.id)}
										title={sortedCollections.pinnedIds.has(collection.id) ? 'Unpin collection' : 'Pin collection'}
									>
										{sortedCollections.pinnedIds.has(collection.id) ? '📌' : '📍'}
									</button>

									<!-- Toggle Records Button -->
									<button
										class="toggle-records-btn"
										onclick={() => toggleCollectionRecords(collection)}
										title={isExpanded ? 'Hide records' : 'Show records'}
									>
										{#if isExpanded}
											<ChevronDown size={14} />
										{:else}
											<ChevronRight size={14} />
										{/if}
									</button>
								</div>

								<!-- Collection Records -->
								{#if isExpanded}
									<div class="collection-records">
										{#if isSelectedCollection && recordListLoading}
											<div class="records-loading">
												<div class="mini-spinner"></div>
												<span>Loading...</span>
											</div>
										{:else if records.length === 0}
											<div class="records-empty">
												<span>{isSelectedCollection ? 'No records' : 'Select to view records'}</span
												>
											</div>
										{:else}
											<div class="records-list">
												{#each records.slice(0, 5) as record}
													<button
														class="record-item-mini"
														class:active={record.id === currentRecordId}
														onclick={() => handleRecordClick(collection, record)}
														title={getRecordPreview(record)}
													>
														<div class="record-preview-mini">
															{getRecordPreview(record)}
														</div>
														<div class="record-id-mini">
															{record.id.substring(0, 6)}...
														</div>
														{#if record.id === currentRecordId}
															<div class="mini-active-indicator"></div>
														{/if}
													</button>
												{/each}
												{#if records.length > 5}
													<div class="records-more">
														+{records.length - 5} more records
													</div>
												{/if}
											</div>
										{/if}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.type-editor-sidebar {
		width: 320px;
		background: white;
		border-right: 1px solid #e5e7eb;
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}

	.sidebar-header {
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
		background: #f9fafb;
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.header-title h2 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
	}

	.sidebar-section {
		border-bottom: 1px solid #f3f4f6;
	}

	.section-header {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 1.5rem;
		background: none;
		border: none;
		font-size: 0.875rem;
		font-weight: 600;
		color: #374151;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.section-header:hover {
		background: #f9fafb;
	}

	.count {
		margin-left: auto;
		background: #e5e7eb;
		color: #6b7280;
		padding: 0.125rem 0.375rem;
		border-radius: 10px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.sidebar-content {
		overflow-y: auto;
		flex: 1;
		max-height: calc(100vh - 150px);
	}

	.loading-state,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem 1.5rem;
		text-align: center;
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid #f3f4f6;
		border-top: 2px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 0.5rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.loading-state p,
	.empty-state p {
		color: #6b7280;
		font-size: 0.875rem;
		margin: 0;
	}

	.collection-list {
		padding: 0.5rem;
	}

	.collection-group {
		margin-bottom: 0.25rem;
	}

	.collection-header {
		display: flex;
		align-items: center;
	}

	.collection-item {
		flex: 1;
		text-align: left;
		background: none;
		border: none;
		padding: 0.75rem;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.pin-btn {
		flex-shrink: 0;
		background: none;
		border: none;
		padding: 0.375rem;
		border-radius: 4px;
		cursor: pointer;
		color: #6b7280;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.875rem;
	}

	.pin-btn:hover {
		background: #f3f4f6;
		color: #374151;
		transform: scale(1.1);
	}

	.toggle-records-btn {
		flex-shrink: 0;
		background: none;
		border: none;
		padding: 0.5rem;
		border-radius: 4px;
		cursor: pointer;
		color: #6b7280;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.toggle-records-btn:hover {
		background: #f3f4f6;
		color: #374151;
	}

	.collection-item:hover {
		background: #f3f4f6;
	}

	.collection-item.active {
		background: #eff6ff;
		border: 1px solid #3b82f6;
	}

	.collection-icon {
		color: #6b7280;
		flex-shrink: 0;
	}

	.collection-info {
		flex: 1;
		min-width: 0;
	}

	.collection-name {
		font-size: 0.875rem;
		font-weight: 500;
		color: #1f2937;
		margin-bottom: 0.25rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.pin-indicator {
		font-size: 0.75rem;
		opacity: 0.8;
		flex-shrink: 0;
	}

	.collection-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.collection-type {
		font-size: 0.75rem;
		color: #6b7280;
		background: #f3f4f6;
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		text-transform: uppercase;
		font-weight: 500;
	}

	.record-count {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.record-preview {
		font-size: 0.875rem;
		font-weight: 500;
		color: #1f2937;
		margin-bottom: 0.25rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.record-meta {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.record-id,
	.record-date {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.active-indicator {
		width: 6px;
		height: 6px;
		background: #3b82f6;
		border-radius: 50%;
		flex-shrink: 0;
	}

	/* Collection Records Styles */
	.collection-records {
		margin-left: 1rem;
		border-left: 2px solid #f3f4f6;
		padding-left: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.records-loading,
	.records-empty {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		color: #6b7280;
		font-size: 0.75rem;
	}

	.mini-spinner {
		width: 12px;
		height: 12px;
		border: 1px solid #f3f4f6;
		border-top: 1px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	.records-list {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.record-item-mini {
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		padding: 0.5rem;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.75rem;
	}

	.record-item-mini:hover {
		background: #f9fafb;
	}

	.record-item-mini.active {
		background: #eff6ff;
		border: 1px solid #93c5fd;
	}

	.record-preview-mini {
		flex: 1;
		color: #374151;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 120px;
	}

	.record-id-mini {
		color: #9ca3af;
		font-size: 0.6875rem;
		font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
	}

	.mini-active-indicator {
		width: 4px;
		height: 4px;
		background: #3b82f6;
		border-radius: 50%;
		flex-shrink: 0;
		margin-left: 0.25rem;
	}

	.records-more {
		padding: 0.25rem 0.5rem;
		color: #9ca3af;
		font-size: 0.6875rem;
		text-align: center;
		border-top: 1px solid #f3f4f6;
		margin-top: 0.25rem;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.type-editor-sidebar {
			width: 100%;
			height: auto;
			max-height: 50vh;
		}

		.sidebar-content {
			max-height: 300px;
		}
	}
</style>
