/**
 * TypeEditor2 모듈 진입점 - Uniform Defs Pattern
 */

// 메인 컨트롤러 (통합 접점)
export { genTypeEditorDefs } from './genTypeEditorDefs';

// 컴포넌트 defs
export { genCollectionSidebarDefs } from './components/CollectionSidebar/controller';
export { genRecordListDefs } from './components/RecordList/controller';
export { genJsonEditorDefs } from './components/JsonEditorWithDefs/controller';

// 서비스 defs
export { genRecordServiceDefs } from './services/RecordService/controller';
export { genCollectionServiceDefs } from './services/CollectionService/controller';
export { genTypeGenerationServiceDefs } from './services/TypeGenerationService/controller';

// 공통 defs
export { genCommonDefs } from './common/commonDefs';

// 레거시 컴포넌트 (호환성)
export { default as TypeEditorLayout } from './components/TypeEditorLayout.svelte';
export { default as JsonEditor } from './components/JsonEditor.svelte';

// 서비스 유틸리티
export { PinnedCollectionsService } from './services/CollectionService/PinnedCollectionsService';

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
export const TYPEEDITOR2_VERSION = '2.1.0'; // Uniform Defs Pattern
