/**
 * TypeEditor2 모듈 진입점 - 선언적 컨트롤러 패턴
 */

// 컴포넌트
export { default as TypeEditorLayout } from './components/TypeEditorLayout.svelte';
export { default as JsonEditor } from './components/JsonEditor.svelte';

// 서비스
export { TypeEditorService } from './services/TypeEditorService';
export { PinnedCollectionsService } from './services/PinnedCollectionsService';

// 컨트롤러
export { genTypeEditorDefs } from './controller/genTypeEditorDefs';

// 상태 관리
export { createCollectionsState } from './states/collectionsState.svelte';
export { createRecordsState } from './states/recordsState.svelte';
export { createEditorState } from './states/editorState.svelte';

// 타입
export type {
	TypeEditorParams,
	PocketBaseRecord,
	TypeEditorState,
	FieldEdit,
	ValidationError,
	SaveResult
} from './types';

// UI 통합 컴포넌트
export { default as TypeEditorUI } from './view/typeEditorUI.svelte';

// 버전 정보
export const TYPEEDITOR2_VERSION = '2.0.0';
