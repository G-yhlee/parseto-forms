import type { PocketBaseRecord } from '../../types';

export interface RecordsListProps {
	records: PocketBaseRecord[];
	loading?: boolean;
	currentRecordId?: string | null;
	maxVisible?: number;
	showMoreText?: string;
	emptyText?: string;
	loadingText?: string;
	onRecordSelect?: (recordId: string) => void;
}

export const createRecordsListState = () => {
	// UI states
	let showAll = $state(false);
	
	return {
		// States
		get showAll() { return showAll; },
		
		// Actions
		toggleShowAll: () => {
			showAll = !showAll;
		},
		
		setShowAll: (show: boolean) => {
			showAll = show;
		}
	};
};