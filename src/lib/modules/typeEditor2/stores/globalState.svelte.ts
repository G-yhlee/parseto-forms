/**
 * Global state store for typeEditor2 components
 * Manages shared state between typeEditor2 components using Svelte 5 runes
 */

import type { CollectionEntity } from '$lib/domain/entities/Collection';

/**
 * Global state interface for typeEditor2 module
 */
export interface TypeEditor2GlobalState {
  selectedCollection: CollectionEntity | null;
  selectedRecordId: string | null;
  hasUnsavedChanges: boolean;
}

// State runes for reactive global state
let selectedCollection = $state<CollectionEntity | null>(null);
let selectedRecordId = $state<string | null>(null);
let hasUnsavedChanges = $state(false);

/**
 * Global state store for typeEditor2 components
 * Provides centralized state management with Svelte 5 runes
 */
export const typeEditor2GlobalState = {
  // State getters
  get selectedCollection() { 
    return selectedCollection; 
  },
  
  get selectedRecordId() { 
    return selectedRecordId; 
  },
  
  get hasUnsavedChanges() { 
    return hasUnsavedChanges; 
  },

  // Actions for updating state
  setSelectedCollection(collection: CollectionEntity | null) {
    selectedCollection = collection;
    // Clear record selection when collection changes
    if (selectedRecordId !== null) {
      selectedRecordId = null;
    }
  },

  setSelectedRecordId(recordId: string | null) {
    selectedRecordId = recordId;
  },

  setHasUnsavedChanges(hasChanges: boolean) {
    hasUnsavedChanges = hasChanges;
  },

  // Convenience methods
  clearSelection() {
    selectedCollection = null;
    selectedRecordId = null;
    hasUnsavedChanges = false;
  },

  selectCollectionAndRecord(collection: CollectionEntity, recordId: string) {
    selectedCollection = collection;
    selectedRecordId = recordId;
  },

  // Utility methods
  hasSelection(): boolean {
    return selectedCollection !== null;
  },

  hasRecordSelection(): boolean {
    return selectedRecordId !== null;
  },

  getState(): TypeEditor2GlobalState {
    return {
      selectedCollection,
      selectedRecordId,
      hasUnsavedChanges
    };
  },

  // Reset state to initial values
  reset() {
    selectedCollection = null;
    selectedRecordId = null;
    hasUnsavedChanges = false;
  }
};