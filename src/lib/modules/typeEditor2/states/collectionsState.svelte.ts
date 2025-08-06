import type { CollectionEntity } from '$lib/domain/entities/Collection';
import { Container } from '$lib/infrastructure/di/Container';
import { PinnedCollectionsService } from '../services/PinnedCollectionsService';

export const createCollectionsState = () => {
	let collections = $state<CollectionEntity[]>([]);
	let collectionsLoading = $state(true);
	let selectedCollection = $state<CollectionEntity | null>(null);
	let collectionsExpanded = $state(true);
	let expandedCollections = $state<Set<string>>(new Set());

	// Derived states
	let sortedCollections = $derived.by(() => {
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

	// Actions
	const loadCollections = async () => {
		try {
			collectionsLoading = true;
			const container = Container.getInstance();
			collections = await container.collectionRepository.findAll();
		} catch (err) {
			console.error('Failed to load collections:', err);
			throw err;
		} finally {
			collectionsLoading = false;
		}
	};

	const setSelectedCollection = (collection: CollectionEntity | null) => {
		selectedCollection = collection;
	};

	const toggleCollections = () => {
		collectionsExpanded = !collectionsExpanded;
	};

	const toggleCollectionRecords = (collection: CollectionEntity) => {
		const newSet = new Set(expandedCollections);
		if (expandedCollections.has(collection.id)) {
			newSet.delete(collection.id);
		} else {
			newSet.add(collection.id);
		}
		expandedCollections = newSet;
	};

	const togglePin = (collectionId: string) => {
		PinnedCollectionsService.togglePin(collectionId);
		// Force re-computation by reassigning
		collections = [...collections];
	};

	// Initialize
	loadCollections();

	return {
		// Data
		get collections() { return collections; },
		get sortedCollections() { return sortedCollections; },
		get selectedCollection() { return selectedCollection; },
		
		// States
		get collectionsLoading() { return collectionsLoading; },
		get collectionsExpanded() { return collectionsExpanded; },
		get expandedCollections() { return expandedCollections; },
		
		// Actions
		loadCollections,
		setSelectedCollection,
		toggleCollections,
		toggleCollectionRecords,
		togglePin
	};
};