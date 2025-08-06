/**
 * TypeEditor 모듈 진입점
 */

// 컴포넌트
export { default as TypeEditor } from './components/TypeEditor.svelte';
export { default as RecordSidebar } from './components/RecordSidebar.svelte';
export { default as CollectionSelector } from './components/CollectionSelector.svelte';
export { default as TypeEditorLayout } from './components/TypeEditorLayout.svelte';
export { default as TypeEditorSidebar } from './components/TypeEditorSidebar.svelte';

// 서비스
export { TypeEditorService } from './services/TypeEditorService';

// 스토어
export { createTypeEditorStore } from './stores/typeEditorStore.svelte';

// 타입
export type {
	TypeEditorParams,
	PocketBaseRecord,
	TypeEditorState,
	FieldEdit,
	ValidationError,
	SaveResult
} from './types';

// 버전 정보
export const TYPEEDITOR_VERSION = '1.0.0';
