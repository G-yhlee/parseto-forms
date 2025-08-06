import type { CollectionEntity } from '$lib/domain/entities/Collection';
import { createCollectionsState } from '../states/collectionsState.svelte';
import { createRecordsState } from '../states/recordsState.svelte';
import { createEditorState } from '../states/editorState.svelte';

export const genTypeEditorDefs = () => {
	// Create state instances
	const collectionsState = createCollectionsState();
	const recordsState = createRecordsState();
	const editorState = createEditorState();

	return {
		datas: {
			// Collections data
			collections: () => collectionsState.collections,
			sortedCollections: () => collectionsState.sortedCollections,
			selectedCollection: () => collectionsState.selectedCollection,
			
			// Records data
			recordList: () => recordsState.recordList,
			currentRecord: () => recordsState.currentRecord,
			currentRecordData: () => recordsState.currentRecordData,
			jsonEditorData: () => editorState.jsonEditorData,
			
			// Generated data
			generatedTypes: () => editorState.generatedTypes,
			highlightedTypes: () => editorState.highlightedTypes,
			
			// Error data
			error: () => editorState.error
		},
		
		states: {
			// Loading states
			collectionsLoading: () => collectionsState.collectionsLoading,
			recordListLoading: () => recordsState.recordListLoading,
			saving: () => editorState.saving,
			
			// UI states
			collectionsExpanded: () => collectionsState.collectionsExpanded,
			expandedCollections: () => collectionsState.expandedCollections,
			editMode: () => editorState.editMode,
			currentRecordId: () => recordsState.currentRecordId,
			
			// Change states
			hasChanges: () => recordsState.hasChanges
		},
		
		actions: {
			// Collection actions
			onCollectionSelect: async (collection: CollectionEntity) => {
				if (collectionsState.selectedCollection?.id === collection.id) return;
				
				collectionsState.setSelectedCollection(collection);
				recordsState.clearRecords();
				editorState.clearEditor();
				
				await recordsState.loadRecordList(collection.id);
			},
			
			toggleCollections: () => {
				collectionsState.toggleCollections();
			},
			
			toggleCollectionRecords: (collection: CollectionEntity) => {
				collectionsState.toggleCollectionRecords(collection);
			},
			
			togglePin: (collectionId: string) => {
				collectionsState.togglePin(collectionId);
			},
			
			// Record actions
			onRecordSelect: async (recordId: string) => {
				if (!collectionsState.selectedCollection) return;
				
				try {
					editorState.setError(null);
					const record = await recordsState.loadRecord(collectionsState.selectedCollection.id, recordId);
					
					if (record) {
						editorState.updateJsonEditorData(record.data || record);
						editorState.generateTypes(record);
					}
				} catch (err) {
					const errorMessage = err instanceof Error ? err.message : 'Failed to load record';
					editorState.setError(errorMessage);
				}
			},
			
			// Editor actions
			onJsonUpdate: (newData: any) => {
				if (!recordsState.currentRecord) return;
				
				const updatedRecord = { ...recordsState.currentRecord, data: newData };
				recordsState.updateRecord(updatedRecord);
				editorState.updateJsonEditorData(newData);
				editorState.generateTypes(updatedRecord);
			},
			
			toggleEditMode: () => {
				editorState.toggleEditMode();
			},
			
			// Save actions
			onSave: async () => {
				if (!collectionsState.selectedCollection || !recordsState.currentRecord) {
					return { success: false, error: 'No record to save' };
				}
				
				try {
					editorState.setSaving(true);
					editorState.setError(null);
					
					const result = await recordsState.saveRecord(collectionsState.selectedCollection.id);
					
					if (result.success && recordsState.currentRecord) {
						editorState.updateJsonEditorData(recordsState.currentRecord.data || recordsState.currentRecord);
						editorState.generateTypes(recordsState.currentRecord);
					} else {
						editorState.setError(result.error || 'Failed to save');
					}
					
					return result;
				} catch (err) {
					const errorMessage = err instanceof Error ? err.message : 'Failed to save record';
					editorState.setError(errorMessage);
					return { success: false, error: errorMessage };
				} finally {
					editorState.setSaving(false);
				}
			},
			
			onRevert: () => {
				recordsState.revertChanges();
				if (recordsState.currentRecord) {
					editorState.updateJsonEditorData(recordsState.currentRecord.data || recordsState.currentRecord);
					editorState.generateTypes(recordsState.currentRecord);
				}
			},
			
			// Copy action
			onCopyTypes: async () => {
				return await editorState.copyTypesToClipboard();
			},
			
			// Refresh actions
			refreshCollections: async () => {
				await collectionsState.loadCollections();
			},
			
			refreshRecordList: async () => {
				if (collectionsState.selectedCollection) {
					await recordsState.loadRecordList(collectionsState.selectedCollection.id);
				}
			}
		}
	};
};