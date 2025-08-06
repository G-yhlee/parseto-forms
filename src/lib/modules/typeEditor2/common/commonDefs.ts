import type { CollectionEntity } from '$lib/domain/entities/Collection';
import type { PocketBaseRecord } from '../types';
import { genRecordServiceDefs } from '../services/RecordService/controller';
import { genCollectionServiceDefs } from '../services/CollectionService/controller';
import { genTypeGenerationServiceDefs } from '../services/TypeGenerationService/controller';

/**
 * 공통으로 사용되는 상태와 액션들 - 새로운 서비스 구조 기반
 */
export const genCommonDefs = () => {
	// 서비스 인스턴스들
	const recordService = genRecordServiceDefs();
	const collectionService = genCollectionServiceDefs();
	const typeGenerationService = genTypeGenerationServiceDefs();

	return {
		// 서비스 인스턴스들
		services: {
			record: recordService,
			collection: collectionService,
			typeGeneration: typeGenerationService
		},

		// 공통 유틸리티들
		utils: {
			formatDate: (dateString: string): string => {
				try {
					return new Date(dateString).toLocaleDateString();
				} catch {
					return dateString;
				}
			},

			getRecordPreview: (record: PocketBaseRecord): string => {
				// data 필드가 있으면 첫 번째 필드 값 사용
				if (record.data && typeof record.data === 'object') {
					const firstKey = Object.keys(record.data)[0];
					if (firstKey) {
						const value = record.data[firstKey];
						if (typeof value === 'string') {
							return value.substring(0, 30);
						}
					}
				}

				// 다른 필드에서 표시할 만한 값 찾기
				for (const [key, value] of Object.entries(record)) {
					if (
						key !== 'id' &&
						key !== 'created' &&
						key !== 'updated' &&
						key !== 'collectionId' &&
						key !== 'collectionName'
					) {
						if (typeof value === 'string') {
							return value.substring(0, 30);
						}
					}
				}

				return `Record ${record.id.substring(0, 8)}...`;
			},

			deepClone: <T>(obj: T): T => {
				return JSON.parse(JSON.stringify(obj));
			}
		},

		// 공통 액션들 - 서비스들을 통해 구현
		actions: {
			loadCollections: async (): Promise<CollectionEntity[]> => {
				return await collectionService.actions.loadCollections();
			},

			loadRecordList: async (collectionId: string): Promise<PocketBaseRecord[]> => {
				return await recordService.actions.loadRecordList(collectionId);
			},

			loadRecord: async (collectionId: string, recordId: string): Promise<PocketBaseRecord | null> => {
				return await recordService.actions.loadRecord({ collection: collectionId, recordId });
			},

			saveRecord: async (collectionId: string, recordId: string, record: PocketBaseRecord) => {
				return await recordService.actions.saveRecord(collectionId, recordId, record);
			},

			generateTypes: (record: PocketBaseRecord) => {
				return typeGenerationService.actions.generateTypesFromRecord(record);
			},

			hasRecordChanged: (original: PocketBaseRecord, current: PocketBaseRecord): boolean => {
				return recordService.actions.hasRecordChanged(original, current);
			}
		}
	};
};