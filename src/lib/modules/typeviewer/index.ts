/**
 * TypeViewer 모듈 진입점
 * 외부에서 사용할 수 있는 모든 요소들을 export
 */

// 컴포넌트
export { default as JsonEditor } from './components/JsonEditor.svelte';

// 서비스
export { TypeViewerService } from './services/TypeViewerService';

// 유틸리티
export { TypeGenerator } from './utils/typeGenerator';
export { Pluralizer } from './utils/pluralizer';
export { SyntaxHighlighter, createHighlightedCode } from './utils/syntaxHighlighter';

// 스토어
export { createTypeViewerStore } from './stores/typeViewerStore.svelte';

// 타입
export type {
  JsonData,
  TypeAnalysis,
  GeneratedInterface,
  JsonEditorProps,
  TypeViewerState,
  HighlightToken
} from './types';

// 버전 정보
export const TYPEVIEWER_VERSION = '1.0.0';