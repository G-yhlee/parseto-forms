import type { CollectionEntity } from '$lib/domain/entities/Collection';
import { PinnedCollectionsService } from '../../services/CollectionService/PinnedCollectionsService';

export const createCollectionSidebarState = () => {
	let collections = $state<CollectionEntity[]>([]);
	let collectionsLoading = $state(false);
	let selectedCollection = $state<CollectionEntity | null>(null);
	let collectionsExpanded = $state(true);
	let expandedCollections = $state<Set<string>>(new Set());
	let pinUpdateTrigger = $state(0);

	// Derived states
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
		
		pinned.sort((a, b) => a.name.localeCompare(b.name));
		unpinned.sort((a, b) => a.name.localeCompare(b.name));
		
		return { collections: [...pinned, ...unpinned], pinnedIds };
	});

	return {
		// Data
		get collections() { return collections; },
		get sortedCollections() { return sortedCollections; },
		get selectedCollection() { return selectedCollection; },
		
		// States
		get collectionsLoading() { return collectionsLoading; },
		get collectionsExpanded() { return collectionsExpanded; },
		get expandedCollections() { return expandedCollections; },
		
		// Setters (for external control)
		setCollections: (newCollections: CollectionEntity[]) => {
			collections = newCollections;
		},
		setCollectionsLoading: (loading: boolean) => {
			collectionsLoading = loading;
		},
		setSelectedCollection: (collection: CollectionEntity | null) => {
			selectedCollection = collection;
		},
		toggleCollections: () => {
			collectionsExpanded = !collectionsExpanded;
		},
		toggleCollectionRecords: (collection: CollectionEntity) => {
			const newSet = new Set(expandedCollections);
			if (expandedCollections.has(collection.id)) {
				newSet.delete(collection.id);
			} else {
				newSet.add(collection.id);
			}
			expandedCollections = newSet;
		},
		togglePin: (collectionId: string) => {
			PinnedCollectionsService.togglePin(collectionId);
			pinUpdateTrigger = pinUpdateTrigger + 1;
		},
		autoExpandSelected: () => {
			if (selectedCollection && !expandedCollections.has(selectedCollection.id)) {
				const newSet = new Set(expandedCollections);
				newSet.add(selectedCollection.id);
				expandedCollections = newSet;
			}
		}
	};
};