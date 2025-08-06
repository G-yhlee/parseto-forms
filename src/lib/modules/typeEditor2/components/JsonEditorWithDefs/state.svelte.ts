import type { PocketBaseRecord } from '../../types';

export const createJsonEditorState = () => {
	let jsonData = $state<any>(null);
	let originalRecord = $state<PocketBaseRecord | null>(null);
	let currentRecord = $state<PocketBaseRecord | null>(null);
	let hasChanges = $state(false);
	let editMode = $state(false);
	let saving = $state(false);
	let generatedTypes = $state('');
	let highlightedTypes = $state('');
	let error = $state<string | null>(null);

	// Editing state
	let editingKey = $state<string | null>(null);
	let editingValue = $state<string | null>(null);

	return {
		// Data
		get jsonData() { return jsonData; },
		get originalRecord() { return originalRecord; },
		get currentRecord() { return currentRecord; },
		get generatedTypes() { return generatedTypes; },
		get highlightedTypes() { return highlightedTypes; },
		get error() { return error; },
		
		// States
		get hasChanges() { return hasChanges; },
		get editMode() { return editMode; },
		get saving() { return saving; },
		get editingKey() { return editingKey; },
		get editingValue() { return editingValue; },
		
		// Setters
		setJsonData: (data: any) => {
			jsonData = data;
		},
		setOriginalRecord: (record: PocketBaseRecord | null) => {
			originalRecord = record;
		},
		setCurrentRecord: (record: PocketBaseRecord | null) => {
			currentRecord = record;
		},
		setHasChanges: (changes: boolean) => {
			hasChanges = changes;
		},
		setEditMode: (mode: boolean) => {
			editMode = mode;
		},
		setSaving: (isSaving: boolean) => {
			saving = isSaving;
		},
		setGeneratedTypes: (types: string) => {
			generatedTypes = types;
		},
		setHighlightedTypes: (types: string) => {
			highlightedTypes = types;
		},
		setError: (errorMessage: string | null) => {
			error = errorMessage;
		},
		setEditingKey: (key: string | null) => {
			editingKey = key;
		},
		setEditingValue: (value: string | null) => {
			editingValue = value;
		},
		toggleEditMode: () => {
			editMode = !editMode;
		}
	};
};