import { TypeEditorService } from '../services/TypeEditorService';
import type { PocketBaseRecord } from '../types';

export const createEditorState = () => {
	let jsonEditorData = $state<any>(null);
	let generatedTypes = $state('');
	let highlightedTypes = $state('');
	let editMode = $state(false);
	let saving = $state(false);
	let error = $state<string | null>(null);

	// Actions
	const updateJsonEditorData = (data: any) => {
		jsonEditorData = data;
	};

	const generateTypes = (record: PocketBaseRecord) => {
		if (!record) {
			generatedTypes = '';
			highlightedTypes = '';
			return;
		}
		
		const { generatedTypes: generated, highlightedTypes: highlighted } = 
			TypeEditorService.generateTypesFromRecord(record);
		generatedTypes = generated;
		highlightedTypes = highlighted;
	};

	const toggleEditMode = () => {
		editMode = !editMode;
	};

	const setSaving = (value: boolean) => {
		saving = value;
	};

	const setError = (errorMessage: string | null) => {
		error = errorMessage;
	};

	const copyTypesToClipboard = async () => {
		if (generatedTypes) {
			await navigator.clipboard.writeText(generatedTypes);
			return true;
		}
		return false;
	};

	const clearEditor = () => {
		jsonEditorData = null;
		generatedTypes = '';
		highlightedTypes = '';
		error = null;
	};

	return {
		// Data
		get jsonEditorData() { return jsonEditorData; },
		get generatedTypes() { return generatedTypes; },
		get highlightedTypes() { return highlightedTypes; },
		get error() { return error; },
		
		// States
		get editMode() { return editMode; },
		get saving() { return saving; },
		
		// Actions
		updateJsonEditorData,
		generateTypes,
		toggleEditMode,
		setSaving,
		setError,
		copyTypesToClipboard,
		clearEditor
	};
};