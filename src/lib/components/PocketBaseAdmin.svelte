<script lang="ts">
	import { onMount } from 'svelte';
	import { appState } from '$lib/stores/app.svelte';
	import { dataActions } from '$lib/actions/data.svelte';
	import LoginForm from './LoginForm.svelte';
	import Sidebar from './sidebar/Sidebar.svelte';
	import MainContent from './main/MainContent.svelte';
	import DetailPanel from './detail/DetailPanel.svelte';

	onMount(() => {
		dataActions.initialize();
	});

	// Debug reactive statement
	$effect(() => {
		console.log('PocketBaseAdmin - showDetailPanel:', appState.showDetailPanel);
		console.log('PocketBaseAdmin - selectedRecord:', appState.selectedRecord);
		console.log('PocketBaseAdmin - condition result:', appState.showDetailPanel && appState.selectedRecord);
	});
</script>

{#if !appState.authenticated}
	<LoginForm onLoginSuccess={dataActions.handleLoginSuccess} />
{:else}
	<div class="pb-admin-container">
		<Sidebar />
		<MainContent />
	</div>

	{#if appState.showDetailPanel && appState.selectedRecord}
		<DetailPanel record={appState.selectedRecord} onClose={appState.closeDetailPanel} />
	{/if}
{/if}

<style>
	.pb-admin-container {
		display: flex;
		height: 100vh;
		background: #f8f9fa;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	@media (max-width: 768px) {
		.pb-admin-container {
			flex-direction: column;
		}
	}
</style>
