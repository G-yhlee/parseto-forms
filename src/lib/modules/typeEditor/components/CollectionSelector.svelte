<script lang="ts">
	import { goto } from '$app/navigation';
	import { Container } from '$lib/infrastructure/di/Container';
	import type { CollectionEntity } from '$lib/domain/entities/Collection';

	interface Props {
		onCollectionSelect?: (collection: string) => void;
	}

	const { onCollectionSelect }: Props = $props();

	let collections = $state<CollectionEntity[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// 컬렉션 로드
	async function loadCollections() {
		try {
			loading = true;
			error = null;
			const container = Container.getInstance();
			collections = await container.collectionRepository.findAll();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load collections';
			console.error('Failed to load collections:', err);
		} finally {
			loading = false;
		}
	}

	// 컬렉션 선택 핸들러
	function handleCollectionSelect(collection: CollectionEntity) {
		if (onCollectionSelect) {
			onCollectionSelect(collection.id);
		} else {
			// 기본적으로 해당 컬렉션의 첫 번째 레코드로 이동
			goto(`/typeEditor?collection=${collection.id}`);
		}
	}

	// 레코드 개수 표시용 포맷팅
	function formatRecordCount(count: number): string {
		if (count === 0) return 'No records';
		if (count === 1) return '1 record';
		return `${count.toLocaleString()} records`;
	}

	// 컬렉션 타입 아이콘
	function getCollectionIcon(type: string): string {
		switch (type) {
			case 'auth':
				return '👤';
			case 'base':
				return '📁';
			case 'view':
				return '👁️';
			default:
				return '📄';
		}
	}

	// 초기 로드
	loadCollections();
</script>

<div class="collection-selector">
	<div class="selector-header">
		<h1>Select Collection</h1>
		<p>Choose a collection to edit records and generate TypeScript types</p>
	</div>

	<div class="selector-content">
		{#if loading}
			<div class="loading-state">
				<div class="spinner"></div>
				<p>Loading collections...</p>
			</div>
		{:else if error}
			<div class="error-state">
				<div class="error-icon">⚠️</div>
				<h3>Error</h3>
				<p>{error}</p>
				<button class="btn btn-primary" onclick={loadCollections}> Retry </button>
			</div>
		{:else if collections.length === 0}
			<div class="empty-state">
				<div class="empty-icon">📭</div>
				<h3>No Collections Found</h3>
				<p>No collections are available in your PocketBase instance.</p>
			</div>
		{:else}
			<div class="collection-grid">
				{#each collections as collection}
					<button class="collection-card" onclick={() => handleCollectionSelect(collection)}>
						<div class="card-header">
							<div class="collection-icon">
								{getCollectionIcon(collection.type)}
							</div>
							<div class="collection-info">
								<h3 class="collection-name">{collection.name}</h3>
								<p class="collection-id">ID: {collection.id}</p>
							</div>
						</div>

						<div class="card-body">
							<div class="collection-meta">
								<span class="collection-type">{collection.type}</span>
								<span class="record-count">
									<!-- {formatRecordCount(collection.recordCount || 0)} -->
								</span>
							</div>

							{#if collection.schema && collection.schema.length > 0}
								<div class="schema-preview">
									<p class="schema-label">Fields:</p>
									<div class="field-tags">
										{#each collection.schema.slice(0, 3) as field}
											<span class="field-tag">{field.name}</span>
										{/each}
										{#if collection.schema.length > 3}
											<span class="field-tag more">+{collection.schema.length - 3}</span>
										{/if}
									</div>
								</div>
							{/if}
						</div>

						<div class="card-footer">
							<span class="select-text">Click to edit records →</span>
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.collection-selector {
		min-height: 100vh;
		padding: 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		display: flex;
		flex-direction: column;
	}

	.selector-header {
		text-align: center;
		margin-bottom: 3rem;
		color: white;
	}

	.selector-header h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.selector-header p {
		font-size: 1.125rem;
		opacity: 0.9;
		margin: 0;
		max-width: 600px;
		margin: 0 auto;
	}

	.selector-content {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}

	.loading-state,
	.error-state,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		background: white;
		padding: 3rem;
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		max-width: 400px;
		width: 100%;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f4f6;
		border-top: 4px solid #667eea;
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

	.error-icon,
	.empty-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.error-state h3,
	.empty-state h3 {
		color: #1f2937;
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
	}

	.error-state p,
	.empty-state p,
	.loading-state p {
		color: #6b7280;
		margin: 0 0 2rem 0;
	}

	.collection-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 1.5rem;
		width: 100%;
		max-width: 1200px;
	}

	.collection-card {
		background: white;
		border: none;
		border-radius: 12px;
		padding: 1.5rem;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.collection-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.collection-icon {
		font-size: 2rem;
		width: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #667eea, #764ba2);
		border-radius: 12px;
		color: white;
	}

	.collection-info {
		flex: 1;
	}

	.collection-name {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0 0 0.25rem 0;
	}

	.collection-id {
		font-size: 0.875rem;
		color: #6b7280;
		margin: 0;
		font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
	}

	.card-body {
		flex: 1;
	}

	.collection-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.collection-type {
		background: #e5e7eb;
		color: #374151;
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: uppercase;
	}

	.record-count {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.schema-preview {
		margin-top: 1rem;
	}

	.schema-label {
		font-size: 0.875rem;
		color: #6b7280;
		margin: 0 0 0.5rem 0;
	}

	.field-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.field-tag {
		background: #f3f4f6;
		color: #374151;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.field-tag.more {
		background: #667eea;
		color: white;
	}

	.card-footer {
		border-top: 1px solid #f3f4f6;
		padding-top: 1rem;
		margin-top: 1rem;
	}

	.select-text {
		color: #667eea;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: 500;
		border-radius: 8px;
		border: 1px solid;
		cursor: pointer;
		transition: all 0.2s;
		text-decoration: none;
	}

	.btn-primary {
		background: #667eea;
		color: white;
		border-color: #667eea;
	}

	.btn-primary:hover {
		background: #5a67d8;
		border-color: #5a67d8;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.collection-selector {
			padding: 1rem;
		}

		.selector-header h1 {
			font-size: 2rem;
		}

		.collection-grid {
			grid-template-columns: 1fr;
		}

		.collection-card {
			padding: 1rem;
		}
	}
</style>
