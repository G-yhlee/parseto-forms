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