import { createCollectionSidebarState } from './state.svelte';
import { genInfrastructureDefs } from '../../controllers/infrastructureDefs';
import type { CollectionEntity } from '$lib/domain/entities/Collection';

export const genCollectionSidebarDefs = () => {
	const state = createCollectionSidebarState();
	const infrastructure = genInfrastructureDefs();
	
	// Auto-load collections on initialization
	const loadCollectionsAction = async () => {
		try {
			state.setCollectionsLoading(true);
			const collections = await infrastructure.actions.loadCollections();
			state.setCollections(collections);
		} catch (err) {
			console.error('Failed to load collections:', err);
			throw err;
		} finally {
			state.setCollectionsLoading(false);
		}
	};

	// Collections will be loaded manually via actions.loadCollections()

	return {
		datas: {
			collections: () => state.collections,
			sortedCollections: () => state.sortedCollections.collections,
			pinnedCollections: () => state.sortedCollections.pinnedIds,
			selectedCollection: () => state.selectedCollection
		},

		states: {
			collectionsLoading: () => state.collectionsLoading,
			collectionsExpanded: () => state.collectionsExpanded,
			expandedCollections: () => state.expandedCollections
		},

		actions: {
			loadCollections: async () => {
				try {
					state.setCollectionsLoading(true);
					const collections = await infrastructure.actions.loadCollections();
					state.setCollections(collections);
				} catch (err) {
					console.error('Failed to load collections:', err);
					throw err;
				} finally {
					state.setCollectionsLoading(false);
				}
			},

			selectCollection: (collection: CollectionEntity) => {
				state.setSelectedCollection(collection);
				// 자동 펼치기 (UI 상태만 변경, records 로딩은 상위에서 처리)
				if (!state.expandedCollections.has(collection.id)) {
					state.setExpandedCollection(collection.id, true);
				}
			},

			toggleCollections: () => {
				state.toggleCollections();
			},

			toggleCollectionRecords: (collection: CollectionEntity) => {
				state.toggleCollectionRecords(collection);
			},

			togglePin: (collectionId: string) => {
				state.togglePin(collectionId);
			},

			// Effect for auto-expanding selected collection
			autoExpandSelected: () => {
				state.autoExpandSelected();
			}
		}
	};
};