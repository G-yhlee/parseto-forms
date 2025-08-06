import { createTypeEditorLayoutState, type TypeEditorLayoutProps } from './state.svelte';

export type { TypeEditorLayoutProps };
import { ChevronDown, ChevronRight, Database, FileText, Users } from 'lucide-svelte';
import type { CollectionEntity } from '$lib/domain/entities/Collection';
import type { PocketBaseRecord } from '../../types';

export const genTypeEditorLayoutDefs = (props: TypeEditorLayoutProps) => {
	const state = createTypeEditorLayoutState();
	
	// Helper functions
	const getCollectionIcon = (type: string) => {
		switch (type) {
			case 'auth':
				return Users;
			case 'base':
				return Database;
			case 'view':
				return FileText;
			default:
				return Database;
		}
	};
	
	const formatDate = (dateString: string): string => {
		try {
			return new Date(dateString).toLocaleDateString();
		} catch {
			return dateString;
		}
	};
	
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
			// Props data
			collections: () => props.collections,
			collectionsLoading: () => props.collectionsLoading,
			selectedCollection: () => props.selectedCollection,
			recordList: () => props.recordList,
			recordListLoading: () => props.recordListLoading,
			currentRecordId: () => props.currentRecordId,
			
			// Computed data
			sortedCollections: () => state.getSortedCollections(props.collections),
			pinnedIds: () => state.sortedCollections.pinnedIds,
			
			// Icons
			ChevronDown: () => ChevronDown,
			ChevronRight: () => ChevronRight
		},

		states: {
			collectionsExpanded: () => state.collectionsExpanded,
			expandedCollections: () => state.expandedCollections,
			isPinned: (collectionId: string) => state.isPinned(collectionId),
			isCollectionExpanded: (collectionId: string) => state.expandedCollections.has(collectionId),
			isSelected: (collection: CollectionEntity) => props.selectedCollection?.id === collection.id,
			isCurrentRecord: (recordId: string) => props.currentRecordId === recordId
		},

		actions: {
			// Collection actions
			toggleCollections: () => {
				state.toggleCollections();
			},
			
			toggleCollectionRecords: (collection: CollectionEntity) => {
				const wasExpanded = state.toggleCollectionRecords(collection.id);
				if (wasExpanded) {
					// 펼칠 때 컬렉션 선택
					props.onCollectionSelect(collection);
				}
			},
			
			handleCollectionClick: (collection: CollectionEntity) => {
				// 컬렉션 선택
				props.onCollectionSelect(collection);
				
				// 자동 펼치기 (이미 펼쳐져 있으면 그대로 유지)
				state.addExpandedCollection(collection.id);
			},
			
			// Pin actions
			togglePin: (event: Event, collectionId: string) => {
				event.stopPropagation(); // 컬렉션 클릭 이벤트 방지
				return state.togglePin(collectionId);
			},
			
			// Record actions
			handleRecordClick: (recordId: string) => {
				props.onRecordSelect(recordId);
			},
			
			// Auto expand selected collection
			autoExpandSelectedCollection: () => {
				if (props.selectedCollection) {
					state.addExpandedCollection(props.selectedCollection.id);
				}
			},
			
			// Utility functions
			getCollectionIcon,
			formatDate,
			getRecordPreview,
			
			// Event handlers (pass through to props)
			onCollectionSelect: props.onCollectionSelect,
			onRecordSelect: props.onRecordSelect
		}
	};
};