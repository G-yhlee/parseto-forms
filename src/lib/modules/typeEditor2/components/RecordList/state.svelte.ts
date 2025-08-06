import type { PocketBaseRecord } from '../../types';

export const createRecordListState = () => {
	let recordList = $state<PocketBaseRecord[]>([]);
	let recordListLoading = $state(false);
	let currentRecordId = $state<string | null>(null);
	let selectedRecord = $state<PocketBaseRecord | null>(null);

	// Derived states
	let recordCount = $derived(() => recordList.length);
	let hasRecords = $derived(() => recordList.length > 0);

	return {
		// Data
		get recordList() { return recordList; },
		get selectedRecord() { return selectedRecord; },
		get currentRecordId() { return currentRecordId; },
		
		// Computed
		get recordCount() { return recordCount; },
		get hasRecords() { return hasRecords; },
		
		// States
		get recordListLoading() { return recordListLoading; },
		
		// Setters
		setRecordList: (records: PocketBaseRecord[]) => {
			recordList = records;
		},
		setRecordListLoading: (loading: boolean) => {
			console.log('RecordListState: Setting recordListLoading to:', loading);
			recordListLoading = loading;
		},
		setCurrentRecordId: (id: string | null) => {
			currentRecordId = id;
		},
		setSelectedRecord: (record: PocketBaseRecord | null) => {
			selectedRecord = record;
		},
		updateRecordInList: (updatedRecord: PocketBaseRecord) => {
			const index = recordList.findIndex(r => r.id === updatedRecord.id);
			if (index !== -1) {
				recordList[index] = updatedRecord;
			}
		},
		clearRecords: () => {
			recordList = [];
			selectedRecord = null;
			currentRecordId = null;
		}
	};
};