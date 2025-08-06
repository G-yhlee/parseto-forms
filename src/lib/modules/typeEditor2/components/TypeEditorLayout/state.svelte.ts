import type { CollectionEntity } from '$lib/domain/entities/Collection';
import type { PocketBaseRecord } from '../../types';
import { PinnedCollectionsService } from '../../services/CollectionService/PinnedCollectionsService';
import { SvelteSet } from 'svelte/reactivity';

export interface TypeEditorLayoutProps {
	// Collection data
	collections: CollectionEntity[];
	collectionsLoading: boolean;
	selectedCollection: CollectionEntity | null;
	
	// Record data
	recordList: PocketBaseRecord[];
	recordListLoading: boolean;
	currentRecordId: string | null;
	
	// Event handlers
	onCollectionSelect: (collection: CollectionEntity) => void;
	onRecordSelect: (recordId: string) => void;
	
	// Slot content
	children?: any;
}

export const createTypeEditorLayoutState = () => {
	// UI states for sidebar
	let collectionsExpanded = $state(true);
	let expandedCollections = $state(new Set<string>());
	let pinUpdateTrigger = $state(0);
	
	// Derived states
	let sortedCollections = $derived.by(() => {
		// pinUpdateTrigger를 참조하여 핀 상태 변경 시 재계산되도록 함
		pinUpdateTrigger;
		
		// 브라우저에서만 pinned 정보 로드
		const pinnedIds = typeof window !== 'undefined' 
			? new SvelteSet(PinnedCollectionsService.getPinnedCollections())
			: new SvelteSet<string>();
		
		return { pinnedIds };
	});
	
	return {
		// UI states
		get collectionsExpanded() { return collectionsExpanded; },
		get expandedCollections() { return expandedCollections; },
		get pinUpdateTrigger() { return pinUpdateTrigger; },
		get sortedCollections() { return sortedCollections; },
		
		// Setters
		setCollectionsExpanded: (expanded: boolean) => {
			collectionsExpanded = expanded;
		},
		
		setExpandedCollections: (collections: Set<string>) => {
			expandedCollections = collections;
		},
		
		setPinUpdateTrigger: (trigger: number) => {
			pinUpdateTrigger = trigger;
		},
		
		// Collection management
		toggleCollections: () => {
			collectionsExpanded = !collectionsExpanded;
		},
		
		toggleCollectionRecords: (collectionId: string) => {
			const wasExpanded = expandedCollections.has(collectionId);
			const newSet = new Set(expandedCollections);
			if (wasExpanded) {
				newSet.delete(collectionId);
			} else {
				newSet.add(collectionId);
			}
			expandedCollections = newSet;
			return !wasExpanded; // 반환값: 새로 펼쳐졌는지 여부
		},
		
		addExpandedCollection: (collectionId: string) => {
			if (!expandedCollections.has(collectionId)) {
				const newSet = new Set(expandedCollections);
				newSet.add(collectionId);
				expandedCollections = newSet;
			}
		},
		
		// Pin management
		togglePin: (collectionId: string) => {
			PinnedCollectionsService.togglePin(collectionId);
			pinUpdateTrigger = pinUpdateTrigger + 1;
			return PinnedCollectionsService.isPinned(collectionId);
		},
		
		isPinned: (collectionId: string) => {
			return sortedCollections.pinnedIds.has(collectionId);
		},
		
		// Collection sorting with pins
		getSortedCollections: (collections: CollectionEntity[]) => {
			const pinnedIds = sortedCollections.pinnedIds;
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
			
			return [...pinned, ...unpinned];
		}
	};
};