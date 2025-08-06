import { createRecordsListState, type RecordsListProps } from './state.svelte';
import type { PocketBaseRecord } from '../../types';

export type { RecordsListProps } from './state.svelte';

export const genRecordsListDefs = (props: RecordsListProps) => {
	const state = createRecordsListState();
	
	// Default values
	const defaultProps = {
		maxVisible: 5,
		showMoreText: 'Show more',
		emptyText: 'No records',
		loadingText: 'Loading...',
		...props
	};
	
	// Helper functions
	const getRecordPreview = (record: PocketBaseRecord): string => {
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
	};

	return {
		datas: {
			// Record data
			records: () => defaultProps.records,
			visibleRecords: () => {
				const records = defaultProps.records;
				if (state.showAll || records.length <= defaultProps.maxVisible) {
					return records;
				}
				return records.slice(0, defaultProps.maxVisible);
			},
			hiddenCount: () => {
				const total = defaultProps.records.length;
				return total > defaultProps.maxVisible ? total - defaultProps.maxVisible : 0;
			},
			
			// Props
			loading: () => defaultProps.loading || false,
			currentRecordId: () => defaultProps.currentRecordId,
			maxVisible: () => defaultProps.maxVisible,
			
			// Text content
			showMoreText: () => defaultProps.showMoreText,
			emptyText: () => defaultProps.emptyText,
			loadingText: () => defaultProps.loadingText
		},

		states: {
			showAll: () => state.showAll,
			hasRecords: () => defaultProps.records.length > 0,
			hasMoreRecords: () => defaultProps.records.length > defaultProps.maxVisible,
			isCurrentRecord: (recordId: string) => defaultProps.currentRecordId === recordId
		},

		actions: {
			// Record selection
			handleRecordSelect: (recordId: string) => {
				if (defaultProps.onRecordSelect) {
					defaultProps.onRecordSelect(recordId);
				}
			},
			
			// Show/hide actions
			toggleShowAll: () => {
				state.toggleShowAll();
			},
			
			// Utility
			getRecordPreview
		}
	};
};