import type { PocketBaseRecord } from '../types';
import { TypeEditorService } from '../services/TypeEditorService';

export const createRecordsState = () => {
	let recordList = $state<PocketBaseRecord[]>([]);
	let recordListLoading = $state(false);
	let currentRecordId = $state<string | null>(null);
	let currentRecord = $state<PocketBaseRecord | null>(null);
	let originalRecord = $state<PocketBaseRecord | null>(null);
	let hasChanges = $state(false);

	// Derived states
	let currentRecordData = $derived(() => {
		if (!currentRecord) return null;
		return currentRecord.data || currentRecord;
	});

	// Actions
	const loadRecordList = async (collectionId: string) => {
		if (recordListLoading) return;
		
		try {
			recordListLoading = true;
			recordList = await TypeEditorService.loadRecordList(collectionId);
		} catch (err) {
			console.error('Failed to load records:', err);
			recordList = [];
			throw err;
		} finally {
			recordListLoading = false;
		}
	};

	const loadRecord = async (collectionId: string, recordId: string) => {
		try {
			const record = await TypeEditorService.loadRecord({ collection: collectionId, recordId });
			
			if (record) {
				currentRecord = record;
				originalRecord = TypeEditorService.deepClone(record);
				currentRecordId = recordId;
				checkChanges();
			} else {
				throw new Error('Record not found');
			}
			
			return record;
		} catch (err) {
			console.error('Failed to load record:', err);
			throw err;
		}
	};

	const updateRecord = (newRecord: PocketBaseRecord) => {
		currentRecord = newRecord;
		checkChanges();
	};

	const saveRecord = async (collectionId: string) => {
		if (!currentRecord) return { success: false, error: 'No record to save' };
		
		try {
			const result = await TypeEditorService.saveRecord(collectionId, currentRecord.id, currentRecord);
			
			if (result.success && result.record) {
				currentRecord = result.record;
				originalRecord = TypeEditorService.deepClone(result.record);
				checkChanges();
				
				// Update record in list
				const recordIndex = recordList.findIndex(r => r.id === result.record!.id);
				if (recordIndex !== -1) {
					recordList[recordIndex] = result.record;
				}
			}
			
			return result;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to save record';
			return { success: false, error: errorMessage };
		}
	};

	const revertChanges = () => {
		if (originalRecord) {
			currentRecord = TypeEditorService.deepClone(originalRecord);
			checkChanges();
		}
	};

	const checkChanges = () => {
		if (!currentRecord || !originalRecord) {
			hasChanges = false;
			return;
		}
		
		hasChanges = TypeEditorService.hasRecordChanged(originalRecord, currentRecord);
	};

	const clearRecords = () => {
		recordList = [];
		currentRecord = null;
		originalRecord = null;
		currentRecordId = null;
		hasChanges = false;
	};

	return {
		// Data
		get recordList() { return recordList; },
		get currentRecord() { return currentRecord; },
		get originalRecord() { return originalRecord; },
		get currentRecordData() { return currentRecordData; },
		get currentRecordId() { return currentRecordId; },
		
		// States
		get recordListLoading() { return recordListLoading; },
		get hasChanges() { return hasChanges; },
		
		// Actions
		loadRecordList,
		loadRecord,
		updateRecord,
		saveRecord,
		revertChanges,
		clearRecords
	};
};