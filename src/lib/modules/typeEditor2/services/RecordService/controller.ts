import { createRecordServiceState } from './state.svelte';
import { genCommonServiceDefs } from '../common/serviceDefs';
import type { PocketBaseRecord, SaveResult, TypeEditorParams } from '../../types';

export const genRecordServiceDefs = () => {
	const state = createRecordServiceState();
	const common = genCommonServiceDefs();

	return {
		datas: {
			// Cache access
			recordListCache: () => state.recordListCache,
			recordCache: () => state.recordCache,
			lastSaveResult: () => state.lastSaveResult,
			lastError: () => state.lastError
		},

		states: {
			loadingRecords: () => state.loadingRecords,
			loadingRecord: () => state.loadingRecord,
			savingRecord: () => state.savingRecord
		},

		actions: {
			/**
			 * 컬렉션의 레코드 리스트 로드 (캐시 지원)
			 */
			loadRecordList: async (
				collectionIdOrName: string, 
				filter?: string, 
				sort?: string,
				useCache: boolean = true
			): Promise<PocketBaseRecord[]> => {
				try {
					state.setLastError(null);
					
					// Collection name 정규화
					const collectionName = await common.utils.normalizeCollectionName(collectionIdOrName);
					if (!collectionName) {
						throw new Error('Collection not found for ID: ' + collectionIdOrName);
					}
					
					// 캐시 확인 (필터나 정렬이 없는 경우에만)
					const cacheKey = collectionName;
					if (useCache && !filter && !sort) {
						const cached = state.getCachedRecordList(cacheKey);
						if (cached) {
							return cached;
						}
					}
					
					state.setLoadingRecords(true);
					
					// TODO: 필터와 정렬 옵션 지원 (recordRepository에 추가되면 활성화)
					const records = await common.infrastructure.recordRepository.findByCollection(collectionName);
					const typedRecords = records as PocketBaseRecord[];
					
					// 캐시 저장 (필터나 정렬이 없는 경우에만)
					if (!filter && !sort) {
						state.cacheRecordList(cacheKey, typedRecords);
					}
					
					return typedRecords;
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Failed to load record list';
					state.setLastError(errorMessage);
					console.error('RecordService.loadRecordList:', error);
					return [];
				} finally {
					state.setLoadingRecords(false);
				}
			},

			/**
			 * 특정 레코드 로드 (캐시 지원)
			 */
			loadRecord: async (params: TypeEditorParams, useCache: boolean = true): Promise<PocketBaseRecord | null> => {
				try {
					state.setLastError(null);
					
					// Collection name 정규화
					const collectionName = await common.utils.normalizeCollectionName(params.collection);
					if (!collectionName) {
						throw new Error('Collection not found for ID: ' + params.collection);
					}
					
					// 캐시 확인
					const cacheKey = `${collectionName}:${params.recordId}`;
					if (useCache) {
						const cached = state.getCachedRecord(cacheKey);
						if (cached) {
							return cached;
						}
					}
					
					state.setLoadingRecord(true);
					
					const record = await common.infrastructure.recordRepository.findById(collectionName, params.recordId);
					const typedRecord = record as PocketBaseRecord;
					
					if (typedRecord) {
						// 캐시 저장
						state.cacheRecord(cacheKey, typedRecord);
					}
					
					return typedRecord;
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Failed to load record';
					state.setLastError(errorMessage);
					console.error('RecordService.loadRecord:', error);
					return null;
				} finally {
					state.setLoadingRecord(false);
				}
			},

			/**
			 * 레코드 저장
			 */
			saveRecord: async (
				collectionIdOrName: string, 
				recordId: string, 
				data: Partial<PocketBaseRecord>
			): Promise<SaveResult> => {
				try {
					state.setLastError(null);
					state.setSavingRecord(true);
					
					// Collection name 정규화
					const collectionName = await common.utils.normalizeCollectionName(collectionIdOrName);
					if (!collectionName) {
						const result: SaveResult = {
							success: false,
							error: 'Collection not found for ID: ' + collectionIdOrName
						};
						state.setLastSaveResult(result);
						return result;
					}
					
					// 데이터 정리
					const cleanData = common.utils.cleanRecordData(data);
					
					// RecordDAO를 직접 사용하여 updateInCollection 호출
					const recordDAO = common.infrastructure.recordDAO as any;
					const updatedRecord = await recordDAO.updateInCollection(
						collectionName, 
						recordId, 
						cleanData
					);

					const result: SaveResult = {
						success: true,
						record: updatedRecord as PocketBaseRecord
					};
					
					// 캐시 업데이트
					if (result.record) {
						const cacheKey = `${collectionName}:${recordId}`;
						state.cacheRecord(cacheKey, result.record);
						
						// 리스트 캐시도 업데이트
						const cachedList = state.getCachedRecordList(collectionName);
						if (cachedList) {
							const updatedList = cachedList.map(r => 
								r.id === recordId ? result.record! : r
							);
							state.cacheRecordList(collectionName, updatedList);
						}
					}
					
					state.setLastSaveResult(result);
					return result;
				} catch (error: any) {
					console.error('RecordService.saveRecord:', error);
					
					const result = common.errorHandlers.handleValidationError(error);
					state.setLastError(result.error);
					state.setLastSaveResult(result);
					return result;
				} finally {
					state.setSavingRecord(false);
				}
			},

			/**
			 * 첫 번째 레코드 ID 가져오기
			 */
			getFirstRecordId: async (collectionIdOrName: string): Promise<string | null> => {
				try {
					const records = await genRecordServiceDefs().actions.loadRecordList(collectionIdOrName);
					return records.length > 0 ? records[0].id : null;
				} catch (error) {
					state.setLastError('Failed to get first record');
					console.error('RecordService.getFirstRecordId:', error);
					return null;
				}
			},

			/**
			 * 레코드 변경 감지
			 */
			hasRecordChanged: (original: PocketBaseRecord, current: PocketBaseRecord): boolean => {
				const originalClean = common.utils.cleanRecordData(original);
				const currentClean = common.utils.cleanRecordData(current);
				
				return JSON.stringify(originalClean) !== JSON.stringify(currentClean);
			},

			/**
			 * 캐시 관리
			 */
			clearCache: () => {
				state.clearCache();
			},

			clearCollectionCache: (collectionName: string) => {
				state.clearCollectionCache(collectionName);
			},

			/**
			 * 필드 값 조작
			 */
			setValueByPath: (obj: any, path: string[], value: any): any => {
				return common.utils.setValueByPath(obj, path, value);
			},

			getValueByPath: (obj: any, path: string[]): any => {
				return common.utils.getValueByPath(obj, path);
			}
		}
	};
};