import { createRecordListState } from './state.svelte';
import { genInfrastructureDefs } from '../../controllers/infrastructureDefs';
import type { PocketBaseRecord } from '../../types';

export const genRecordListDefs = () => {
	const state = createRecordListState();
	const infrastructure = genInfrastructureDefs();

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
				if (state.recordListLoading) {
					console.log('RecordList: Already loading, skipping...', collectionId);
					return;
				}

				console.log('RecordList: Loading records for collection:', collectionId);
				try {
					state.setRecordListLoading(true);
					const records = await infrastructure.actions.loadRecordList(collectionId);
					state.setRecordList(records);
					console.log('RecordList: Loaded', records.length, 'records');
				} catch (err) {
					console.error('RecordList: Failed to load records:', err);
					state.setRecordList([]);
					// 에러 발생해도 로딩 상태는 false로 설정해야 함
					// throw err; // 에러 던지기 제거
				} finally {
					console.log('RecordList: Entering finally block');
					state.setRecordListLoading(false);
					console.log('RecordList: Loading finished, loading state should be false now:', state.recordListLoading);
				}
			},

			selectRecord: async (collectionId: string, recordId: string) => {
				try {
					const record = await infrastructure.actions.loadRecord(collectionId, recordId);
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
				return infrastructure.utils.getRecordPreview(record);
			},

			formatDate: (dateString: string): string => {
				return infrastructure.utils.formatDate(dateString);
			}
		}
	};
};