<script lang="ts">
	import { genSidebarHeaderDefs, type SidebarHeaderProps } from './controller';
	
	interface Props extends SidebarHeaderProps {}
	
	const props: Props = $props();
	
	// Generate defs
	const defs = genSidebarHeaderDefs(props);
	const { datas, states, actions } = defs;
</script>

<div 
	class="sidebar-header"
	class:hovered={states.hovered()}
	onmouseenter={actions.onMouseEnter}
	onmouseleave={actions.onMouseLeave}
>
	<div class="header-title">
		<svelte:component this={datas.icon()} size={datas.iconSize()} />
		<div class="title-text">
			<h2>{datas.title()}</h2>
			{#if datas.subtitle()}
				<span class="subtitle">{datas.subtitle()}</span>
			{/if}
		</div>
	</div>
</div>

<style>
	.sidebar-header {
		padding: 1rem;
		border-bottom: 1px solid #e2e8f0;
		background: #f8fafc;
		transition: background-color 0.2s;
	}

	.sidebar-header.hovered {
		background: #f1f5f9;
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: #1e293b;
	}

	.title-text {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.title-text h2 {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0;
		line-height: 1.2;
	}

	.subtitle {
		font-size: 0.75rem;
		color: #64748b;
		font-weight: 400;
		line-height: 1;
	}
</style>