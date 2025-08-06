import type { CollectionEntity } from '$lib/domain/entities/Collection';
import type { PocketBaseRecord } from '../types';
import { Container } from '$lib/infrastructure/di/Container';
import { TypeEditorService } from '../services/TypeEditorService';

/**
 * 공통으로 사용되는 상태와 액션들
 */
export const genCommonDefs = () => {
	return {
		// 공통 서비스들
		services: {
			TypeEditorService,
			Container: Container.getInstance()
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
				return TypeEditorService.deepClone(obj);
			}
		},

		// 공통 액션들
		actions: {
			loadCollections: async (): Promise<CollectionEntity[]> => {
				const container = Container.getInstance();
				return await container.collectionRepository.findAll();
			},

			loadRecordList: async (collectionId: string): Promise<PocketBaseRecord[]> => {
				return await TypeEditorService.loadRecordList(collectionId);
			},

			loadRecord: async (collectionId: string, recordId: string): Promise<PocketBaseRecord | null> => {
				return await TypeEditorService.loadRecord({ collection: collectionId, recordId });
			},

			saveRecord: async (collectionId: string, recordId: string, record: PocketBaseRecord) => {
				return await TypeEditorService.saveRecord(collectionId, recordId, record);
			},

			generateTypes: (record: PocketBaseRecord) => {
				return TypeEditorService.generateTypesFromRecord(record);
			},

			hasRecordChanged: (original: PocketBaseRecord, current: PocketBaseRecord): boolean => {
				return TypeEditorService.hasRecordChanged(original, current);
			}
		}
	};
};