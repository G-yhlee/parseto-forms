import type { PocketBaseRecord, SaveResult } from '../../types';
import { SvelteMap } from 'svelte/reactivity';

export const createRecordServiceState = () => {
	// Loading states
	let loadingRecords = $state(false);
	let loadingRecord = $state(false);
	let savingRecord = $state(false);
	
	// Cache for performance
	let recordListCache = new SvelteMap<string, PocketBaseRecord[]>();
	let recordCache = new SvelteMap<string, PocketBaseRecord>();
	
	// Current operation states
	let lastError = $state<string | null>(null);
	let lastSaveResult = $state<SaveResult | null>(null);
	
	return {
		// Loading states
		get loadingRecords() { return loadingRecords; },
		get loadingRecord() { return loadingRecord; },
		get savingRecord() { return savingRecord; },
		
		// Cache
		get recordListCache() { return recordListCache; },
		get recordCache() { return recordCache; },
		
		// Error/result states
		get lastError() { return lastError; },
		get lastSaveResult() { return lastSaveResult; },
		
		// Setters
		setLoadingRecords: (loading: boolean) => {
			loadingRecords = loading;
		},
		
		setLoadingRecord: (loading: boolean) => {
			loadingRecord = loading;
		},
		
		setSavingRecord: (saving: boolean) => {
			savingRecord = saving;
		},
		
		setLastError: (error: string | null) => {
			lastError = error;
		},
		
		setLastSaveResult: (result: SaveResult | null) => {
			lastSaveResult = result;
		},
		
		// Cache management
		cacheRecordList: (collectionName: string, records: PocketBaseRecord[]) => {
			const newCache = new SvelteMap(recordListCache);
			newCache.set(collectionName, records);
			recordListCache = newCache;
		},
		
		getCachedRecordList: (collectionName: string): PocketBaseRecord[] | undefined => {
			return recordListCache.get(collectionName);
		},
		
		cacheRecord: (recordKey: string, record: PocketBaseRecord) => {
			const newCache = new SvelteMap(recordCache);
			newCache.set(recordKey, record);
			recordCache = newCache;
		},
		
		getCachedRecord: (recordKey: string): PocketBaseRecord | undefined => {
			return recordCache.get(recordKey);
		},
		
		clearCache: () => {
			recordListCache = new SvelteMap();
			recordCache = new SvelteMap();
		},
		
		clearCollectionCache: (collectionName: string) => {
			const newListCache = new SvelteMap(recordListCache);
			newListCache.delete(collectionName);
			recordListCache = newListCache;
			
			// Remove records from this collection from record cache
			const newRecordCache = new SvelteMap(recordCache);
			for (const [key, record] of recordCache) {
				if (record.collectionName === collectionName) {
					newRecordCache.delete(key);
				}
			}
			recordCache = newRecordCache;
		}
	};
};