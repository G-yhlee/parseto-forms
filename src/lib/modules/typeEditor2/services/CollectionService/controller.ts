import { createCollectionServiceState } from './state.svelte';
import { genCommonServiceDefs } from '../common/serviceDefs';
import type { CollectionEntity } from '$lib/domain/entities/Collection';

export const genCollectionServiceDefs = () => {
	const state = createCollectionServiceState();
	const common = genCommonServiceDefs();

	return {
		datas: {
			// Cache access
			collectionsCache: () => state.collectionsCache,
			collectionByIdCache: () => state.collectionByIdCache,
			collectionByNameCache: () => state.collectionByNameCache,
			lastCacheUpdate: () => state.lastCacheUpdate,
			lastError: () => state.lastError
		},

		states: {
			loadingCollections: () => state.loadingCollections,
			isCacheValid: (maxAgeMs?: number) => state.isCacheValid(maxAgeMs)
		},

		actions: {
			/**
			 * 모든 컬렉션 로드 (캐시 지원)
			 */
			loadCollections: async (useCache: boolean = true, maxCacheAgeMs?: number): Promise<CollectionEntity[]> => {
				try {
					state.setLastError(null);
					
					// 캐시 확인
					if (useCache && state.isCacheValid(maxCacheAgeMs)) {
						const cached = state.getCachedCollections();
						if (cached) {
							return cached;
						}
					}
					
					state.setLoadingCollections(true);
					
					const collections = await common.infrastructure.collectionRepository.findAll();
					
					// 캐시 업데이트
					state.cacheCollections(collections);
					
					return collections;
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Failed to load collections';
					state.setLastError(errorMessage);
					console.error('CollectionService.loadCollections:', error);
					return [];
				} finally {
					state.setLoadingCollections(false);
				}
			},

			/**
			 * ID로 컬렉션 찾기 (캐시 지원)
			 */
			findCollectionById: async (id: string, useCache: boolean = true): Promise<CollectionEntity | null> => {
				try {
					state.setLastError(null);
					
					// 캐시에서 먼저 찾기
					if (useCache) {
						const cached = state.getCachedCollectionById(id);
						if (cached) {
							return cached;
						}
					}
					
					// 캐시에 없으면 직접 로드 (재귀 호출 방지)
					const collections = await common.infrastructure.collectionRepository.findAll();
					state.cacheCollections(collections);
					
					// 다시 캐시에서 찾기
					return state.getCachedCollectionById(id) || null;
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Failed to find collection by ID';
					state.setLastError(errorMessage);
					console.error('CollectionService.findCollectionById:', error);
					return null;
				}
			},

			/**
			 * Name으로 컬렉션 찾기 (캐시 지원)
			 */
			findCollectionByName: async (name: string, useCache: boolean = true): Promise<CollectionEntity | null> => {
				try {
					state.setLastError(null);
					
					// 캐시에서 먼저 찾기
					if (useCache) {
						const cached = state.getCachedCollectionByName(name);
						if (cached) {
							return cached;
						}
					}
					
					// 캐시에 없으면 직접 로드 (재귀 호출 방지)
					const collections = await common.infrastructure.collectionRepository.findAll();
					state.cacheCollections(collections);
					
					// 다시 캐시에서 찾기
					return state.getCachedCollectionByName(name) || null;
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Failed to find collection by name';
					state.setLastError(errorMessage);
					console.error('CollectionService.findCollectionByName:', error);
					return null;
				}
			},

			/**
			 * ID나 Name으로 컬렉션 찾기
			 */
			findCollection: async (idOrName: string, useCache: boolean = true): Promise<CollectionEntity | null> => {
				// ID 형식인지 확인
				if (common.utils.isCollectionId(idOrName)) {
					return await genCollectionServiceDefs().actions.findCollectionById(idOrName, useCache);
				} else {
					return await genCollectionServiceDefs().actions.findCollectionByName(idOrName, useCache);
				}
			},

			/**
			 * Collection ID를 Name으로 변환
			 */
			getCollectionNameById: async (id: string, useCache: boolean = true): Promise<string | null> => {
				const collection = await genCollectionServiceDefs().actions.findCollectionById(id, useCache);
				return collection?.name || null;
			},

			/**
			 * Collection Name을 ID로 변환
			 */
			getCollectionIdByName: async (name: string, useCache: boolean = true): Promise<string | null> => {
				const collection = await genCollectionServiceDefs().actions.findCollectionByName(name, useCache);
				return collection?.id || null;
			},

			/**
			 * 시스템 컬렉션 필터링
			 */
			filterSystemCollections: (collections: CollectionEntity[]): CollectionEntity[] => {
				return collections.filter(collection => !collection.isSystemCollection());
			},

			/**
			 * 컬렉션을 이름순으로 정렬
			 */
			sortCollectionsByName: (collections: CollectionEntity[]): CollectionEntity[] => {
				return [...collections].sort((a, b) => a.name.localeCompare(b.name));
			},

			/**
			 * 컬렉션 메타데이터 가져오기
			 */
			getCollectionMetadata: (collection: CollectionEntity) => {
				return {
					id: collection.id,
					name: collection.name,
					type: collection.type,
					isSystem: collection.isSystemCollection(),
					isPinned: collection.isPinnedCollection(),
					fieldNames: collection.getFieldNames(),
					fieldCount: collection.schema.length,
					created: collection.created,
					updated: collection.updated
				};
			},

			/**
			 * 캐시 관리
			 */
			clearCache: () => {
				state.clearCache();
			},

			refreshCache: async (): Promise<CollectionEntity[]> => {
				state.clearCache();
				// 직접 로드 (재귀 호출 방지)
				const collections = await common.infrastructure.collectionRepository.findAll();
				state.cacheCollections(collections);
				return collections;
			},

			/**
			 * 캐시 상태 정보
			 */
			getCacheInfo: () => {
				return {
					hasCache: !!state.collectionsCache,
					cacheSize: state.collectionsCache?.length || 0,
					lastUpdate: state.lastCacheUpdate,
					isValid: state.isCacheValid(),
					ageMs: state.lastCacheUpdate ? Date.now() - state.lastCacheUpdate : 0
				};
			}
		}
	};
};