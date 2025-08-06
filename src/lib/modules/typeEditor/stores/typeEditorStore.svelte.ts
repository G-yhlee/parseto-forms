/**
 * TypeEditor 상태 관리 스토어
 */

import type { TypeEditorState, TypeEditorParams, PocketBaseRecord } from '../types';
import type { CollectionEntity } from '$lib/domain/entities/Collection';
import { TypeEditorService } from '../services/TypeEditorService';
import { Container } from '$lib/infrastructure/di/Container';

export const createTypeEditorStore = () => {
	// 상태 초기화
	let state = $state<TypeEditorState>({
		loading: false,
		error: null,
		record: null,
		originalRecord: null,
		hasChanges: false,
		saving: false,
		generatedTypes: '',
		highlightedTypes: ''
	});

	// 레코드 리스트 상태
	let recordList = $state<PocketBaseRecord[]>([]);
	let listLoading = $state(false);

	// 컬렉션 상태
	let collections = $state<CollectionEntity[]>([]);
	let collectionsLoading = $state(false);
	let selectedCollection = $state<CollectionEntity | null>(null);

	return {
		// 읽기 전용 상태
		get loading() {
			return state.loading;
		},
		get error() {
			return state.error;
		},
		get record() {
			return state.record;
		},
		get originalRecord() {
			return state.originalRecord;
		},
		get hasChanges() {
			return state.hasChanges;
		},
		get saving() {
			return state.saving;
		},
		get generatedTypes() {
			return state.generatedTypes;
		},
		get highlightedTypes() {
			return state.highlightedTypes;
		},
		get recordList() {
			return recordList;
		},
		get listLoading() {
			return listLoading;
		},
		get collections() {
			return collections;
		},
		get collectionsLoading() {
			return collectionsLoading;
		},
		get selectedCollection() {
			return selectedCollection;
		},

		// 액션
		async loadCollections() {
			console.log('Store: Loading collections...');
			collectionsLoading = true;
			try {
				const container = Container.getInstance();
				collections = await container.collectionRepository.findAll();
				console.log('Store: Loaded', collections.length, 'collections');
			} catch (error) {
				console.error('Store: Failed to load collections:', error);
				collections = [];
			} finally {
				collectionsLoading = false;
			}
		},

		selectCollection(collection: CollectionEntity) {
			// 이미 선택된 컴렉션이면 아무것도 하지 않음
			if (selectedCollection?.id === collection.id) {
				return;
			}

			selectedCollection = collection;
			// 다른 컬렉션의 레코드 데이터만 초기화
			recordList = [];
			state.record = null;
			state.originalRecord = null;
			state.hasChanges = false;
			state.generatedTypes = '';
			state.highlightedTypes = '';
			// 새 컬렉션의 레코드 리스트 로드
			this.loadRecordList(collection.id);
		},

		setSelectedCollection(collection: CollectionEntity) {
			selectedCollection = collection;
		},

		async loadRecordList(collection: string) {
			// 중복 로딩 방지
			if (listLoading) {
				console.log('Store: Already loading record list, skipping...');
				return;
			}

			// 중복 체크 제거 - 항상 새로 로드

			console.log('Store: Loading record list for collection:', collection);
			listLoading = true;
			try {
				recordList = await TypeEditorService.loadRecordList(collection);
				console.log('Store: Loaded', recordList.length, 'records');
			} catch (error) {
				console.error('Store: Failed to load record list:', error);
				recordList = [];
			} finally {
				listLoading = false;
			}
		},

		async loadRecord(params: TypeEditorParams) {
			state.loading = true;
			state.error = null;

			try {
				const record = await TypeEditorService.loadRecord(params);

				if (record) {
					state.record = record;
					state.originalRecord = TypeEditorService.deepClone(record);
					this.generateTypes();
				} else {
					state.error = 'Record not found';
				}
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to load record';
			} finally {
				state.loading = false;
			}
		},

		updateRecord(newRecord: PocketBaseRecord) {
			state.record = newRecord;
			this.checkChanges();
			this.generateTypes();
		},

		updateFieldByPath(path: string[], value: any) {
			if (!state.record) return;

			const updatedRecord = TypeEditorService.setValueByPath(state.record, path, value);
			this.updateRecord(updatedRecord);
		},

		async saveRecord(collection: string, recordId: string) {
			if (!state.record) return { success: false, error: 'No record to save' };

			state.saving = true;
			state.error = null;

			try {
				const result = await TypeEditorService.saveRecord(collection, recordId, state.record);

				if (result.success && result.record) {
					// 업데이트된 레코드로 상태 업데이트
					state.record = result.record;
					state.originalRecord = TypeEditorService.deepClone(result.record);
					this.checkChanges();
					this.generateTypes();

					// 레코드 리스트에서 해당 레코드 업데이트 (중복 API 호출 방지)
					const recordIndex = recordList.findIndex((r) => r.id === result.record!.id);
					console.log(
						'Updating recordList - found index:',
						recordIndex,
						'total records:',
						recordList.length
					);
					if (recordIndex !== -1) {
						console.log('Before update:', JSON.stringify(recordList[recordIndex], null, 2));
						recordList[recordIndex] = result.record;
						console.log('After update:', JSON.stringify(recordList[recordIndex], null, 2));
					} else {
						console.warn('Record not found in recordList for update!');
					}
				} else {
					state.error = result.error || 'Failed to save';
				}

				return result;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Failed to save record';
				state.error = errorMessage;
				return { success: false, error: errorMessage };
			} finally {
				state.saving = false;
			}
		},

		revertChanges() {
			if (state.originalRecord) {
				state.record = TypeEditorService.deepClone(state.originalRecord);
				this.checkChanges();
				this.generateTypes();
			}
		},

		generateTypes() {
			if (!state.record) return;

			const { generatedTypes, highlightedTypes } = TypeEditorService.generateTypesFromRecord(
				state.record
			);
			state.generatedTypes = generatedTypes;
			state.highlightedTypes = highlightedTypes;
		},

		checkChanges() {
			if (!state.record || !state.originalRecord) {
				state.hasChanges = false;
				return;
			}

			state.hasChanges = TypeEditorService.hasRecordChanged(state.originalRecord, state.record);
		},

		clearError() {
			state.error = null;
		},

		reset() {
			state.loading = false;
			state.error = null;
			state.record = null;
			state.originalRecord = null;
			state.hasChanges = false;
			state.saving = false;
			state.generatedTypes = '';
			state.highlightedTypes = '';
			recordList = [];
			listLoading = false;
			collections = [];
			collectionsLoading = false;
			selectedCollection = null;
		}
	};
};
