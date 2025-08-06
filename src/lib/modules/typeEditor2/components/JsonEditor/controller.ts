import { createJsonEditorState, type JsonEditorProps } from './state.svelte';

export const genJsonEditorDefs = (initialData: any = {}, onUpdate?: (data: any) => void, path: string[] = []) => {
	const state = createJsonEditorState(initialData, path);
	
	// Helper functions
	const getType = (value: any): string => {
		if (value === null) return 'null';
		if (Array.isArray(value)) return 'array';
		return typeof value;
	};
	
	const formatValue = (value: any): string => {
		if (typeof value === 'string') return `"${value}"`;
		if (value === null) return 'null';
		if (value === undefined) return 'undefined';
		return String(value);
	};
	
	const parseEditValue = (editValue: string): any => {
		try {
			return JSON.parse(editValue);
		} catch (e) {
			// If parsing fails, return as string
			return editValue;
		}
	};

	const updateData = (newData: any) => {
		state.setData(newData);
		if (onUpdate) {
			onUpdate(newData);
		}
	};

	return {
		datas: {
			data: () => state.data,
			currentPath: () => state.currentPath,
			dataType: () => state.dataType,
			editingKey: () => state.editingKey,
			editingValue: () => state.editingValue,
			editKeyValue: () => state.editKeyValue,
			editValueValue: () => state.editValueValue,
			expandedObjects: () => state.expandedObjects,
			expandedArrays: () => state.expandedArrays
		},

		states: {
			isEditing: () => state.isEditing
		},

		actions: {
			// Data management
			updateData,
			
			setData: (newData: any) => {
				state.setData(newData);
			},
			
			// Key editing
			startEditKey: (key: string) => {
				state.setEditingKey(key);
			},
			
			finishEditKey: (oldKey: string) => {
				const newKey = state.editKeyValue;
				if (newKey && newKey !== oldKey) {
					const newData = { ...state.data };
					newData[newKey] = newData[oldKey];
					delete newData[oldKey];
					updateData(newData);
				}
				state.setEditingKey(null);
			},
			
			// Value editing
			startEditValue: (key: string, value: any) => {
				state.setEditingValue(key);
				state.setEditValueValue(JSON.stringify(value));
			},
			
			finishEditValue: (key: string) => {
				const newValue = parseEditValue(state.editValueValue);
				const newData = { ...state.data };
				newData[key] = newValue;
				updateData(newData);
				state.setEditingValue(null);
			},
			
			// Array editing
			startEditArrayValue: (index: number, value: any) => {
				state.setEditingValue(`array_${index}`);
				state.setEditValueValue(JSON.stringify(value));
			},
			
			finishEditArrayValue: (index: number) => {
				const newValue = parseEditValue(state.editValueValue);
				const newData = [...state.data];
				newData[index] = newValue;
				updateData(newData);
				state.setEditingValue(null);
			},
			
			// Keyboard handling
			handleKeyPress: (event: KeyboardEvent, type: 'key' | 'value', key: string) => {
				if (event.key === 'Enter') {
					if (type === 'key') {
						genJsonEditorDefs(initialData, onUpdate, path).actions.finishEditKey(key);
					} else if (key.startsWith('array_')) {
						const index = parseInt(key.replace('array_', ''));
						genJsonEditorDefs(initialData, onUpdate, path).actions.finishEditArrayValue(index);
					} else {
						genJsonEditorDefs(initialData, onUpdate, path).actions.finishEditValue(key);
					}
				} else if (event.key === 'Escape') {
					state.clearEditing();
				}
			},
			
			// Nested data updates
			updateNestedValue: (key: string, newValue: any) => {
				const newData = { ...state.data };
				newData[key] = newValue;
				updateData(newData);
			},
			
			updateArrayValue: (index: number, newValue: any) => {
				const newData = [...state.data];
				newData[index] = newValue;
				updateData(newData);
			},
			
			// UI interactions
			toggleObjectExpansion: (key: string) => {
				state.toggleObjectExpansion(key);
			},
			
			toggleArrayExpansion: (key: string) => {
				state.toggleArrayExpansion(key);
			},
			
			// Utility functions
			getType,
			formatValue,
			
			// Clear editing
			clearEditing: () => {
				state.clearEditing();
			},
			
			// Update input values
			updateEditKeyValue: (value: string) => {
				state.setEditKeyValue(value);
			},
			
			updateEditValueValue: (value: string) => {
				state.setEditValueValue(value);
			}
		}
	};
};