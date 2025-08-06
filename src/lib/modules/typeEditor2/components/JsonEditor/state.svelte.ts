export interface JsonEditorProps {
	data: any;
	onUpdate: (newData: any) => void;
	path?: string[];
}

export const createJsonEditorState = (initialData: any = {}, path: string[] = []) => {
	// Current data state
	let data = $state(initialData);
	let currentPath = $state(path);
	
	// Editing states
	let editingKey = $state<string | null>(null);
	let editingValue = $state<string | null>(null);
	let editKeyValue = $state('');
	let editValueValue = $state('');
	
	// UI states
	let expandedObjects = $state<Set<string>>(new Set());
	let expandedArrays = $state<Set<string>>(new Set());
	
	// Derived states
	let dataType = $derived(() => {
		if (data === null) return 'null';
		if (Array.isArray(data)) return 'array';
		return typeof data;
	});
	
	let isEditing = $derived(() => editingKey !== null || editingValue !== null);
	
	return {
		// Data
		get data() { return data; },
		get currentPath() { return currentPath; },
		get dataType() { return dataType; },
		
		// Editing states
		get editingKey() { return editingKey; },
		get editingValue() { return editingValue; },
		get editKeyValue() { return editKeyValue; },
		get editValueValue() { return editValueValue; },
		get isEditing() { return isEditing; },
		
		// UI states
		get expandedObjects() { return expandedObjects; },
		get expandedArrays() { return expandedArrays; },
		
		// Setters
		setData: (newData: any) => {
			data = newData;
		},
		
		setPath: (newPath: string[]) => {
			currentPath = newPath;
		},
		
		setEditingKey: (key: string | null) => {
			editingKey = key;
			if (key) {
				editKeyValue = key;
			}
		},
		
		setEditingValue: (key: string | null) => {
			editingValue = key;
		},
		
		setEditKeyValue: (value: string) => {
			editKeyValue = value;
		},
		
		setEditValueValue: (value: string) => {
			editValueValue = value;
		},
		
		// Expansion management
		toggleObjectExpansion: (key: string) => {
			const newSet = new Set(expandedObjects);
			if (expandedObjects.has(key)) {
				newSet.delete(key);
			} else {
				newSet.add(key);
			}
			expandedObjects = newSet;
		},
		
		toggleArrayExpansion: (key: string) => {
			const newSet = new Set(expandedArrays);
			if (expandedArrays.has(key)) {
				newSet.delete(key);
			} else {
				newSet.add(key);
			}
			expandedArrays = newSet;
		},
		
		// Clear editing states
		clearEditing: () => {
			editingKey = null;
			editingValue = null;
			editKeyValue = '';
			editValueValue = '';
		}
	};
};