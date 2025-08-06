import { createJsonEditorState } from './state.svelte';
import { genInfrastructureDefs } from '../../controllers/infrastructureDefs';
import type { PocketBaseRecord } from '../../types';

export const genJsonEditorDefs = () => {
	const state = createJsonEditorState();
	const infrastructure = genInfrastructureDefs();

	// Define helper functions first
	const generateTypes = () => {
		if (!state.currentRecord) {
			state.setGeneratedTypes('');
			state.setHighlightedTypes('');
			return;
		}
		
		const { generatedTypes, highlightedTypes } = infrastructure.actions.generateTypes(state.currentRecord);
		state.setGeneratedTypes(generatedTypes);
		state.setHighlightedTypes(highlightedTypes);
	};

	const checkChanges = () => {
		if (!state.currentRecord || !state.originalRecord) {
			state.setHasChanges(false);
			return;
		}
		
		const hasChanged = infrastructure.actions.hasRecordChanged(state.originalRecord, state.currentRecord);
		state.setHasChanges(hasChanged);
	};

	return {
		datas: {
			jsonData: () => state.jsonData,
			originalRecord: () => state.originalRecord,
			currentRecord: () => state.currentRecord,
			generatedTypes: () => state.generatedTypes,
			highlightedTypes: () => state.highlightedTypes,
			error: () => state.error
		},

		states: {
			hasChanges: () => state.hasChanges,
			editMode: () => state.editMode,
			saving: () => state.saving,
			editingKey: () => state.editingKey,
			editingValue: () => state.editingValue
		},

		actions: {
			loadRecord: (record: PocketBaseRecord) => {
				state.setCurrentRecord(record);
				state.setOriginalRecord(infrastructure.utils.deepClone(record));
				state.setJsonData(record.data || record);
				state.setHasChanges(false);
				generateTypes();
			},

			updateJsonData: (newData: any) => {
				if (!state.currentRecord) return;
				
				const updatedRecord = { ...state.currentRecord, data: newData };
				state.setCurrentRecord(updatedRecord);
				state.setJsonData(newData);
				checkChanges();
				generateTypes();
			},

			generateTypes,
			checkChanges,

			saveRecord: async (collectionId: string) => {
				if (!state.currentRecord) return { success: false, error: 'No record to save' };
				
				try {
					state.setSaving(true);
					state.setError(null);
					
					const result = await infrastructure.actions.saveRecord(collectionId, state.currentRecord.id, state.currentRecord);
					
					if (result.success && result.record) {
						state.setCurrentRecord(result.record);
						state.setOriginalRecord(infrastructure.utils.deepClone(result.record));
						state.setJsonData(result.record.data || result.record);
						checkChanges();
						generateTypes();
					} else {
						state.setError(result.error || 'Failed to save');
					}
					
					return result;
				} catch (err) {
					const errorMessage = err instanceof Error ? err.message : 'Failed to save record';
					state.setError(errorMessage);
					return { success: false, error: errorMessage };
				} finally {
					state.setSaving(false);
				}
			},

			revertChanges: () => {
				if (state.originalRecord) {
					state.setCurrentRecord(infrastructure.utils.deepClone(state.originalRecord));
					state.setJsonData(state.originalRecord.data || state.originalRecord);
					checkChanges();
					generateTypes();
				}
			},

			copyTypesToClipboard: async () => {
				if (state.generatedTypes) {
					await navigator.clipboard.writeText(state.generatedTypes);
					return true;
				}
				return false;
			},

			toggleEditMode: () => {
				state.toggleEditMode();
			},

			// 편집 상태 관리
			startEditingKey: (key: string) => {
				state.setEditingKey(key);
			},

			startEditingValue: (key: string) => {
				state.setEditingValue(key);
			},

			finishEditing: () => {
				state.setEditingKey(null);
				state.setEditingValue(null);
			},

			clearEditor: () => {
				state.setJsonData(null);
				state.setCurrentRecord(null);
				state.setOriginalRecord(null);
				state.setHasChanges(false);
				state.setGeneratedTypes('');
				state.setHighlightedTypes('');
				state.setError(null);
			}
		}
	};
};