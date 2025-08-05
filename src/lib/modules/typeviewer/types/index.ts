/**
 * TypeViewer 모듈 타입 정의
 */

export interface JsonData {
  [key: string]: any;
}

export interface TypeAnalysis {
  name: string;
  type: string;
  optional: boolean;
  description?: string;
}

export interface GeneratedInterface {
  name: string;
  fields: TypeAnalysis[];
  code: string;
  nestedInterfaces?: GeneratedInterface[];
}

export interface JsonEditorProps {
  data: JsonData;
  onUpdate: (newData: JsonData) => void;
  path?: string[];
}

export interface TypeViewerState {
  jsonInput: string;
  jsonError: string;
  generatedTypes: string;
  highlightedTypes: string;
  copySuccess: boolean;
  editMode: boolean;
  parsedData: JsonData | null;
}

export interface HighlightToken {
  type: 'keyword' | 'type' | 'string' | 'comment' | 'punctuation' | 'identifier' | 'text';
  value: string;
}