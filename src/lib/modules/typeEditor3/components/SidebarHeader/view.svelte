<script lang="ts">
	interface Props {
		title?: string;
		subtitle?: string;
		icon?: string;
	}

	const { title = "Type Editor", subtitle, icon = "⚙️" }: Props = $props();

	let hovered = $state(false);
</script>

<div 
	class="sidebar-header"
	class:hovered={hovered}
	onmouseenter={() => hovered = true}
	onmouseleave={() => hovered = false}
	role="banner"
>
	<div class="header-title">
		<span class="icon">{icon}</span>
		<div class="title-text">
			<h2>{title}</h2>
			{#if subtitle}
				<span class="subtitle">{subtitle}</span>
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

	.icon {
		font-size: 18px;
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