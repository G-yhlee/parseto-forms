import { createCollectionSidebarState } from './state.svelte';
import { genCommonDefs } from '../../common/commonDefs';
import type { CollectionEntity } from '$lib/domain/entities/Collection';

export const genCollectionSidebarDefs = () => {
	const state = createCollectionSidebarState();
	const common = genCommonDefs();
	
	// Auto-load collections on initialization
	const loadCollectionsAction = async () => {
		try {
			state.setCollectionsLoading(true);
			const collections = await common.actions.loadCollections();
			state.setCollections(collections);
		} catch (err) {
			console.error('Failed to load collections:', err);
			throw err;
		} finally {
			state.setCollectionsLoading(false);
		}
	};

	// Initialize collections if not already loaded
	if (state.collections.length === 0 && !state.collectionsLoading) {
		loadCollectionsAction();
	}

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
					const collections = await common.actions.loadCollections();
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
				// 자동 펼치기
				if (!state.expandedCollections.has(collection.id)) {
					state.toggleCollectionRecords(collection);
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