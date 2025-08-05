import type { CollectionEntity } from '../domain/entities/Collection';
import type { RecordEntity } from '../domain/entities/Record';

// Authentication state
let authenticated = $state(false);

// Collections state
let collections = $state<CollectionEntity[]>([]);
let collectionsLoading = $state(true);

// Current selection
let selectedCollection = $state<string>('ebos_r1s');

// Records state
let records = $state<RecordEntity[]>([]);
let recordsLoading = $state(false);

// UI state
let searchTerm = $state('');
let error = $state<string | null>(null);

// Detail panel state
let selectedRecord = $state<RecordEntity | null>(null);
let showDetailPanel = $state(false);

// Derived states
let pinnedCollections = $derived(
  collections.filter(col => col.isPinnedCollection())
);

let filteredOtherCollections = $derived(
  collections
    .filter(col => !pinnedCollections.some(p => p.name === col.name))
    .filter(col => 
      searchTerm === '' || 
      col.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
);

// Export state and actions
export const appState = {
  // State getters
  get authenticated() { return authenticated; },
  get collections() { return collections; },
  get collectionsLoading() { return collectionsLoading; },
  get selectedCollection() { return selectedCollection; },
  get records() { return records; },
  get recordsLoading() { return recordsLoading; },
  get searchTerm() { return searchTerm; },
  get error() { return error; },
  get selectedRecord() { return selectedRecord; },
  get showDetailPanel() { return showDetailPanel; },
  get pinnedCollections() { return pinnedCollections; },
  get filteredOtherCollections() { return filteredOtherCollections; },

  // Actions
  setAuthenticated(value: boolean) {
    authenticated = value;
  },

  setCollections(newCollections: CollectionEntity[]) {
    collections = newCollections;
    collectionsLoading = false;
  },

  setCollectionsLoading(loading: boolean) {
    collectionsLoading = loading;
  },

  selectCollection(collectionName: string) {
    selectedCollection = collectionName;
    selectedRecord = null;
    showDetailPanel = false;
  },

  setRecords(newRecords: RecordEntity[]) {
    records = newRecords;
    recordsLoading = false;
  },

  setRecordsLoading(loading: boolean) {
    recordsLoading = loading;
  },

  setError(newError: string | null) {
    error = newError;
  },

  selectRecord(record: RecordEntity) {
    console.log('selectRecord called:', record);
    console.log('showDetailPanel before:', showDetailPanel);
    selectedRecord = record;
    showDetailPanel = true;
    console.log('showDetailPanel after:', showDetailPanel);
  },

  closeDetailPanel() {
    showDetailPanel = false;
    selectedRecord = null;
  },

  setSearchTerm(term: string) {
    searchTerm = term;
  },

  reset() {
    authenticated = false;
    collections = [];
    collectionsLoading = true;
    records = [];
    recordsLoading = false;
    searchTerm = '';
    error = null;
    selectedRecord = null;
    showDetailPanel = false;
  }
};