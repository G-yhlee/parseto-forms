/**
 * TypeEditor 모듈 타입 정의
 */

export interface TypeEditorParams {
  collection: string;
  recordId: string;
  filter?: string;
  sort?: string;
}

export interface PocketBaseRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  [key: string]: any;
}

export interface TypeEditorState {
  loading: boolean;
  error: string | null;
  record: PocketBaseRecord | null;
  originalRecord: PocketBaseRecord | null;
  hasChanges: boolean;
  saving: boolean;
  generatedTypes: string;
  highlightedTypes: string;
}

export interface FieldEdit {
  path: string[];
  value: any;
  originalValue: any;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface SaveResult {
  success: boolean;
  record?: PocketBaseRecord;
  error?: string;
  validationErrors?: ValidationError[];
}

// Type generation related types
export interface GeneratedInterface {
  name: string;
  fields: TypeAnalysis[];
  code: string;
  nestedInterfaces?: GeneratedInterface[];
}

export interface TypeAnalysis {
  name: string;
  type: string;
  optional: boolean;
  description?: string;
}

// JSON data type
export type JsonData = Record<string, any>;

// TypeViewer state
export interface TypeViewerState {
  jsonInput: string;
  jsonError: string;
  parsedData: JsonData | null;
  generatedTypes: string;
  highlightedTypes: string;
  copySuccess: boolean;
  editMode: boolean;
}