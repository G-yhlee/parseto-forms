<script lang="ts">
	interface Collection {
		id: string;
		name: string;
		type: string;
	}

	interface Props {
		collection: Collection;
		isSelected?: boolean;
		isPinned?: boolean;
		isExpanded?: boolean;
		onSelect?: (collection: Collection) => void;
		onTogglePin?: (collectionId: string) => void;
		onToggleRecords?: (collectionId: string) => void;
	}

	const { 
		collection, 
		isSelected = false, 
		isPinned = false, 
		isExpanded = false,
		onSelect,
		onTogglePin,
		onToggleRecords
	}: Props = $props();

	let hovered = $state(false);
	let pinHovered = $state(false);
	let toggleHovered = $state(false);

	const handleSelect = () => {
		onSelect?.(collection);
	};

	const handleTogglePin = () => {
		onTogglePin?.(collection.id);
	};

	const handleToggleRecords = () => {
		onToggleRecords?.(collection.id);
	};
</script>

<div class="collection-group">
	<!-- Collection Header -->
	<div class="collection-header">
		<button
			class="collection-item"
			class:active={isSelected}
			class:hovered={hovered}
			onclick={handleSelect}
			onmouseenter={() => hovered = true}
			onmouseleave={() => hovered = false}
		>
			<div class="collection-icon">
				📊
			</div>
			<div class="collection-info">
				<div class="collection-name">
					{collection.name}
				</div>
				<div class="collection-meta">
					<span class="collection-type">{collection.type}</span>
				</div>
			</div>
			{#if isSelected}
				<div class="active-indicator"></div>
			{/if}
		</button>

		<!-- Pin Button -->
		<button
			class="pin-btn"
			class:hovered={pinHovered}
			onclick={handleTogglePin}
			onmouseenter={() => pinHovered = true}
			onmouseleave={() => pinHovered = false}
			title={isPinned ? 'Unpin collection' : 'Pin collection'}
		>
			{isPinned ? '📌' : '📍'}
		</button>

		<!-- Toggle Records Button -->
		<button
			class="toggle-records-btn"
			class:hovered={toggleHovered}
			onclick={handleToggleRecords}
			onmouseenter={() => toggleHovered = true}
			onmouseleave={() => toggleHovered = false}
			title={isExpanded ? 'Hide records' : 'Show records'}
		>
			{#if isExpanded}
				⬇️
			{:else}
				➡️
			{/if}
		</button>
	</div>
</div>

<style>
	.collection-group {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 6px;
		overflow: hidden;
	}

	.collection-header {
		display: flex;
		align-items: center;
	}

	.collection-item {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
		position: relative;
		min-width: 0;
	}

	.collection-item:hover,
	.collection-item.hovered {
		background-color: #f1f5f9;
	}

	.collection-item.active {
		background-color: #dbeafe;
		border-left: 3px solid #3b82f6;
	}

	.collection-icon {
		color: #64748b;
		flex-shrink: 0;
		font-size: 16px;
	}

	.collection-info {
		flex: 1;
		min-width: 0;
	}

	.collection-name {
		font-weight: 500;
		color: #1e293b;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.collection-meta {
		font-size: 0.75rem;
		color: #64748b;
		margin-top: 0.125rem;
	}

	.collection-type {
		text-transform: uppercase;
		font-weight: 500;
		letter-spacing: 0.05em;
	}

	.active-indicator {
		position: absolute;
		right: 0.5rem;
		width: 6px;
		height: 6px;
		background: #3b82f6;
		border-radius: 50%;
	}

	.pin-btn, .toggle-records-btn {
		background: none;
		border: none;
		padding: 0.5rem;
		cursor: pointer;
		color: #64748b;
		transition: all 0.2s;
		border-left: 1px solid #e2e8f0;
		font-size: 14px;
	}

	.pin-btn:hover,
	.pin-btn.hovered,
	.toggle-records-btn:hover,
	.toggle-records-btn.hovered {
		background-color: #f1f5f9;
		color: #374151;
	}
</style>