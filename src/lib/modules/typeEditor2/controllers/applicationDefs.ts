import type { CollectionEntity } from '$lib/domain/entities/Collection';
import { genInfrastructureDefs } from './infrastructureDefs';
import { genCollectionSidebarDefs } from '../components/CollectionSidebar/controller';
import { genRecordListDefs } from '../components/RecordList/controller';
import { genJsonEditorDefs } from '../components/JsonEditorWithDefs/controller';

/**
 * 애플리케이션 레이어 - 컴포넌트 조합과 워크플로우 관리
 */
export const genApplicationDefs = () => {
	// Component definitions
	const infrastructure = genInfrastructureDefs();
	const collectionSidebar = genCollectionSidebarDefs();
	const recordList = genRecordListDefs();
	const jsonEditor = genJsonEditorDefs();

	return {
		// Component defs 직접 노출
		components: {
			collectionSidebar,
			recordList,
			jsonEditor,
			infrastructure
		},

		// 통합된 데이터 인터페이스
		datas: {
			// Collections data from CollectionSidebar
			collections: () => collectionSidebar.datas.collections(),
			sortedCollections: () => collectionSidebar.datas.sortedCollections(),
			selectedCollection: () => collectionSidebar.datas.selectedCollection(),
			
			// Records data from RecordList
			recordList: () => recordList.datas.recordList(),
			currentRecord: () => recordList.datas.selectedRecord(),
			recordCount: () => recordList.datas.recordCount(),
			
			// Json Editor data
			jsonEditorData: () => jsonEditor.datas.jsonData(),
			generatedTypes: () => jsonEditor.datas.generatedTypes(),
			highlightedTypes: () => jsonEditor.datas.highlightedTypes(),
			
			// Error data
			error: () => jsonEditor.datas.error()
		},
		
		states: {
			// Loading states
			collectionsLoading: () => collectionSidebar.states.collectionsLoading(),
			recordListLoading: () => recordList.states.recordListLoading(),
			saving: () => jsonEditor.states.saving(),
			
			// UI states
			collectionsExpanded: () => collectionSidebar.states.collectionsExpanded(),
			expandedCollections: () => collectionSidebar.states.expandedCollections(),
			editMode: () => jsonEditor.states.editMode(),
			currentRecordId: () => recordList.datas.currentRecordId(),
			
			// Change states
			hasChanges: () => jsonEditor.states.hasChanges()
		},
		
		actions: {
			// Collection actions
			onCollectionSelect: async (collection: CollectionEntity) => {
				if (collectionSidebar.datas.selectedCollection()?.id === collection.id) {
					console.log('ApplicationDefs: Collection already selected, skipping...', collection.id);
					return;
				}
				console.log('ApplicationDefs: Selecting collection:', collection.id);
				
				// Clear other components
				recordList.actions.clearRecords();
				jsonEditor.actions.clearEditor();
				
				// Select collection (without auto-expand to avoid double loading)
				collectionSidebar.actions.selectCollection(collection);
				// Load records once
				await recordList.actions.loadRecordList(collection.id);
			},
			
			toggleCollections: () => {
				collectionSidebar.actions.toggleCollections();
			},
			
			toggleCollectionRecords: (collection: CollectionEntity) => {
				collectionSidebar.actions.toggleCollectionRecords(collection);
			},
			
			togglePin: (collectionId: string) => {
				collectionSidebar.actions.togglePin(collectionId);
			},
			
			// Record actions
			onRecordSelect: async (recordId: string) => {
				const selectedCollection = collectionSidebar.datas.selectedCollection();
				if (!selectedCollection) return;
				
				try {
					const record = await recordList.actions.selectRecord(selectedCollection.id, recordId);
					if (record) {
						jsonEditor.actions.loadRecord(record);
					}
				} catch (err) {
					const errorMessage = err instanceof Error ? err.message : 'Failed to load record';
					console.error(errorMessage);
				}
			},
			
			// Editor actions
			onJsonUpdate: (newData: any) => {
				jsonEditor.actions.updateJsonData(newData);
				// Update record in list if needed
				const currentRecord = recordList.datas.selectedRecord();
				if (currentRecord) {
					recordList.actions.updateRecord(currentRecord);
				}
			},
			
			toggleEditMode: () => {
				jsonEditor.actions.toggleEditMode();
			},
			
			// Save actions
			onSave: async () => {
				const selectedCollection = collectionSidebar.datas.selectedCollection();
				if (!selectedCollection) {
					return { success: false, error: 'No collection selected' };
				}
				
				const result = await jsonEditor.actions.saveRecord(selectedCollection.id);
				
				// Update record in list if save was successful
				if (result.success) {
					const updatedRecord = recordList.datas.selectedRecord();
					if (updatedRecord) {
						recordList.actions.updateRecord(updatedRecord);
					}
				}
				
				return result;
			},
			
			onRevert: () => {
				jsonEditor.actions.revertChanges();
				// Update record list with reverted data
				const currentRecord = recordList.datas.selectedRecord();
				if (currentRecord) {
					recordList.actions.updateRecord(currentRecord);
				}
			},
			
			// Copy action
			onCopyTypes: async () => {
				return await jsonEditor.actions.copyTypesToClipboard();
			},
			
			// Refresh actions
			refreshCollections: async () => {
				await collectionSidebar.actions.loadCollections();
			},
			
			refreshRecordList: async () => {
				const selectedCollection = collectionSidebar.datas.selectedCollection();
				if (selectedCollection) {
					await recordList.actions.loadRecordList(selectedCollection.id);
				}
			}
		}
	};
};