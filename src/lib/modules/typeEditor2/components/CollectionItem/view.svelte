<script lang="ts">
	import { genCollectionItemDefs, type CollectionItemProps } from './controller';
	
	interface Props extends CollectionItemProps {}
	
	const props: Props = $props();
	
	// Generate defs
	const defs = genCollectionItemDefs(props);
	const { datas, states, actions } = defs;
</script>

<div class="collection-group">
	<!-- Collection Header -->
	<div class="collection-header">
		<button
			class="collection-item"
			class:active={datas.isSelected()}
			class:hovered={states.hovered()}
			onclick={actions.handleSelect}
			onmouseenter={actions.onMouseEnter}
			onmouseleave={actions.onMouseLeave}
		>
			<div class="collection-icon">
				<svelte:component this={datas.collectionIcon()} size={16} />
			</div>
			<div class="collection-info">
				<div class="collection-name">
					{datas.collection().name}
				</div>
				<div class="collection-meta">
					<span class="collection-type">{datas.collection().type}</span>
				</div>
			</div>
			{#if datas.isSelected()}
				<div class="active-indicator"></div>
			{/if}
		</button>

		<!-- Pin Button -->
		<button
			class="pin-btn"
			class:hovered={states.pinHovered()}
			onclick={actions.handleTogglePin}
			onmouseenter={actions.onPinMouseEnter}
			onmouseleave={actions.onPinMouseLeave}
			title={datas.pinTitle()}
		>
			{datas.pinIcon()}
		</button>

		<!-- Toggle Records Button -->
		<button
			class="toggle-records-btn"
			class:hovered={states.toggleHovered()}
			onclick={actions.handleToggleRecords}
			onmouseenter={actions.onToggleMouseEnter}
			onmouseleave={actions.onToggleMouseLeave}
			title={datas.isExpanded() ? 'Hide records' : 'Show records'}
		>
			{#if datas.isExpanded()}
				<svelte:component this={datas.ChevronDown()} size={14} />
			{:else}
				<svelte:component this={datas.ChevronRight()} size={14} />
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
	}

	.pin-btn:hover,
	.pin-btn.hovered,
	.toggle-records-btn:hover,
	.toggle-records-btn.hovered {
		background-color: #f1f5f9;
		color: #374151;
	}
</style>