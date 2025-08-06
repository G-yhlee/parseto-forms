import type { CollectionEntity } from '$lib/domain/entities/Collection';

export const createCollectionServiceState = () => {
	// Loading states
	let loadingCollections = $state(false);
	
	// Cache for performance
	let collectionsCache = $state<CollectionEntity[] | null>(null);
	let collectionByIdCache = $state<Map<string, CollectionEntity>>(new Map());
	let collectionByNameCache = $state<Map<string, CollectionEntity>>(new Map());
	
	// Metadata
	let lastCacheUpdate = $state<number>(0);
	let lastError = $state<string | null>(null);
	
	return {
		// Loading states
		get loadingCollections() { return loadingCollections; },
		
		// Cache
		get collectionsCache() { return collectionsCache; },
		get collectionByIdCache() { return collectionByIdCache; },
		get collectionByNameCache() { return collectionByNameCache; },
		get lastCacheUpdate() { return lastCacheUpdate; },
		get lastError() { return lastError; },
		
		// Setters
		setLoadingCollections: (loading: boolean) => {
			loadingCollections = loading;
		},
		
		setLastError: (error: string | null) => {
			lastError = error;
		},
		
		// Cache management
		cacheCollections: (collections: CollectionEntity[]) => {
			collectionsCache = collections;
			lastCacheUpdate = Date.now();
			
			// Update lookup caches
			const idCache = new Map<string, CollectionEntity>();
			const nameCache = new Map<string, CollectionEntity>();
			
			collections.forEach(collection => {
				idCache.set(collection.id, collection);
				nameCache.set(collection.name, collection);
			});
			
			collectionByIdCache = idCache;
			collectionByNameCache = nameCache;
		},
		
		getCachedCollections: (): CollectionEntity[] | null => {
			return collectionsCache;
		},
		
		getCachedCollectionById: (id: string): CollectionEntity | undefined => {
			return collectionByIdCache.get(id);
		},
		
		getCachedCollectionByName: (name: string): CollectionEntity | undefined => {
			return collectionByNameCache.get(name);
		},
		
		clearCache: () => {
			collectionsCache = null;
			collectionByIdCache = new Map();
			collectionByNameCache = new Map();
			lastCacheUpdate = 0;
		},
		
		isCacheValid: (maxAgeMs: number = 5 * 60 * 1000): boolean => { // 5 minutes default
			if (!collectionsCache || lastCacheUpdate === 0) {
				return false;
			}
			
			return (Date.now() - lastCacheUpdate) < maxAgeMs;
		}
	};
};