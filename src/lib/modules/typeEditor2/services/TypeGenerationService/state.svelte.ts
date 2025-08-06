import type { PocketBaseRecord } from '../../types';

export const createTypeGenerationServiceState = () => {
	// Generation states
	let generatingTypes = $state(false);
	let lastGenerationTime = $state<number>(0);
	
	// Cache for generated types
	let typeCache = $state<Map<string, { generatedTypes: string; highlightedTypes: string }>>(new Map());
	
	// Current generation data
	let lastGeneratedTypes = $state<string>('');
	let lastHighlightedTypes = $state<string>('');
	let lastError = $state<string | null>(null);
	
	// Generation options
	let defaultTypeName = $state<string>('Record');
	let includeSystemFields = $state<boolean>(false);
	let prettifyOutput = $state<boolean>(true);
	
	return {
		// Generation states
		get generatingTypes() { return generatingTypes; },
		get lastGenerationTime() { return lastGenerationTime; },
		
		// Cache
		get typeCache() { return typeCache; },
		
		// Results
		get lastGeneratedTypes() { return lastGeneratedTypes; },
		get lastHighlightedTypes() { return lastHighlightedTypes; },
		get lastError() { return lastError; },
		
		// Options
		get defaultTypeName() { return defaultTypeName; },
		get includeSystemFields() { return includeSystemFields; },
		get prettifyOutput() { return prettifyOutput; },
		
		// Setters
		setGeneratingTypes: (generating: boolean) => {
			generatingTypes = generating;
		},
		
		setLastGenerationTime: (time: number) => {
			lastGenerationTime = time;
		},
		
		setLastGeneratedTypes: (types: string) => {
			lastGeneratedTypes = types;
		},
		
		setLastHighlightedTypes: (types: string) => {
			lastHighlightedTypes = types;
		},
		
		setLastError: (error: string | null) => {
			lastError = error;
		},
		
		setDefaultTypeName: (name: string) => {
			defaultTypeName = name;
		},
		
		setIncludeSystemFields: (include: boolean) => {
			includeSystemFields = include;
		},
		
		setPrettifyOutput: (prettify: boolean) => {
			prettifyOutput = prettify;
		},
		
		// Cache management
		cacheTypes: (recordKey: string, generatedTypes: string, highlightedTypes: string) => {
			const newCache = new Map(typeCache);
			newCache.set(recordKey, { generatedTypes, highlightedTypes });
			typeCache = newCache;
		},
		
		getCachedTypes: (recordKey: string) => {
			return typeCache.get(recordKey);
		},
		
		clearCache: () => {
			typeCache = new Map();
		},
		
		// Utility methods
		generateRecordKey: (record: PocketBaseRecord): string => {
			// Create a hash-like key based on record structure
			const dataString = JSON.stringify(record.data || record);
			const collectionInfo = `${record.collectionName || 'unknown'}:${record.id}`;
			
			// Simple hash function for cache key
			let hash = 0;
			for (let i = 0; i < dataString.length; i++) {
				const char = dataString.charCodeAt(i);
				hash = ((hash << 5) - hash) + char;
				hash = hash & hash; // Convert to 32-bit integer
			}
			
			return `${collectionInfo}:${Math.abs(hash)}`;
		},
		
		getCacheStats: () => {
			return {
				size: typeCache.size,
				keys: Array.from(typeCache.keys()),
				lastGeneration: lastGenerationTime,
				timeSinceLastGeneration: lastGenerationTime ? Date.now() - lastGenerationTime : 0
			};
		}
	};
};