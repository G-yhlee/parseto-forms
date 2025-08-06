/**
 * TypeEditor2 모듈 진입점 - Uniform Defs Pattern
 */

// 메인 컨트롤러 (통합 접점)
export { genTypeEditorDefs } from './genTypeEditorDefs';

// 컴포넌트 defs
export { genCollectionSidebarDefs } from './components/CollectionSidebar/controller';
export { genRecordListDefs } from './components/RecordList/controller';
export { genJsonEditorDefs } from './components/JsonEditorWithDefs/controller';
export { genJsonEditorDefs as genJsonEditorSimpleDefs } from './components/JsonEditor/controller';
export { genTypeEditorLayoutDefs } from './components/TypeEditorLayout/controller';

// Sub-component defs
export { genSidebarHeaderDefs } from './components/SidebarHeader/controller';
export { genCollectionItemDefs } from './components/CollectionItem/controller';
export { genRecordsListDefs } from './components/RecordsList/controller';

// 서비스 defs
export { genRecordServiceDefs } from './services/RecordService/controller';
export { genCollectionServiceDefs } from './services/CollectionService/controller';
export { genTypeGenerationServiceDefs } from './services/TypeGenerationService/controller';

// 공통 defs
export { genCommonDefs } from './common/commonDefs';

// 컴포넌트들 (Uniform Defs Pattern)
export { default as TypeEditorLayoutView } from './components/TypeEditorLayout/view.svelte';
export { default as JsonEditorView } from './components/JsonEditor/view.svelte';

// Sub-컴포넌트들
export { default as SidebarHeaderView } from './components/SidebarHeader/view.svelte';
export { default as CollectionItemView } from './components/CollectionItem/view.svelte';
export { default as RecordsListView } from './components/RecordsList/view.svelte';

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
