import { createRecordListState } from './state.svelte';
import { genCommonDefs } from '../../common/commonDefs';
import type { PocketBaseRecord } from '../../types';

export const genRecordListDefs = () => {
	const state = createRecordListState();
	const common = genCommonDefs();

	return {
		datas: {
			recordList: () => state.recordList,
			selectedRecord: () => state.selectedRecord,
			currentRecordId: () => state.currentRecordId,
			recordCount: () => state.recordCount,
			hasRecords: () => state.hasRecords
		},

		states: {
			recordListLoading: () => state.recordListLoading
		},

		actions: {
			loadRecordList: async (collectionId: string) => {
				if (state.recordListLoading) return;

				try {
					state.setRecordListLoading(true);
					const records = await common.actions.loadRecordList(collectionId);
					state.setRecordList(records);
				} catch (err) {
					console.error('Failed to load records:', err);
					state.setRecordList([]);
					throw err;
				} finally {
					state.setRecordListLoading(false);
				}
			},

			selectRecord: async (collectionId: string, recordId: string) => {
				try {
					const record = await common.actions.loadRecord(collectionId, recordId);
					if (record) {
						state.setSelectedRecord(record);
						state.setCurrentRecordId(recordId);
					}
					return record;
				} catch (err) {
					console.error('Failed to load record:', err);
					throw err;
				}
			},

			updateRecord: (updatedRecord: PocketBaseRecord) => {
				state.setSelectedRecord(updatedRecord);
				state.updateRecordInList(updatedRecord);
			},

			clearRecords: () => {
				state.clearRecords();
			},

			// 유틸리티 액션
			getRecordPreview: (record: PocketBaseRecord): string => {
				return common.utils.getRecordPreview(record);
			},

			formatDate: (dateString: string): string => {
				return common.utils.formatDate(dateString);
			}
		}
	};
};