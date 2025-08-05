import { PocketBaseConfig } from '../infrastructure/config/PocketBaseConfig';
import { Container } from '../infrastructure/di/Container';
import { appState } from '../stores/app.svelte';

// Get dependencies from container
const container = Container.getInstance();
const getCollectionsUseCase = container.getCollectionsUseCase;
const getRecordsUseCase = container.getRecordsUseCase;

// Load records for a specific collection
async function loadRecords(collectionName: string) {
  console.log('loadRecords called for:', collectionName);
  appState.setRecordsLoading(true);
  appState.setError(null);
  appState.closeDetailPanel();
  
  try {
    console.log('Fetching records using GetRecordsUseCase...');
    const result = await getRecordsUseCase.execute(collectionName);
    console.log('Records fetched:', result.records.length);
    appState.setRecords(result.records);
  } catch (err) {
    console.error('Error loading records:', err);
    const errorMessage = err instanceof Error 
      ? err.message 
      : `Error loading ${collectionName}: Unknown error`;
    appState.setError(errorMessage);
    appState.setRecordsLoading(false);
  }
}

// Load initial data after authentication
async function loadInitialData() {
  try {
    appState.setCollectionsLoading(true);
    
    console.log('Loading collections using GetCollectionsUseCase...');
    const result = await getCollectionsUseCase.execute();
    console.log('Collections loaded:', result.all.length);
    
    appState.setCollections(result.all);
    
    // Load records from default collection
    if (appState.selectedCollection) {
      await loadRecords(appState.selectedCollection);
    }
  } catch (err) {
    console.error('Error loading initial data:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    appState.setError(errorMessage);
    appState.setCollectionsLoading(false);
  }
}

// Data loading actions using new architecture
export const dataActions = {
  // Initialize app data
  async initialize() {
    appState.setAuthenticated(PocketBaseConfig.isAuthenticated());
    
    if (appState.authenticated) {
      await loadInitialData();
    } else {
      appState.setRecordsLoading(false);
      appState.setCollectionsLoading(false);
    }
  },

  // Refresh current collection data
  async refreshData() {
    if (appState.selectedCollection) {
      await loadRecords(appState.selectedCollection);
    }
  },

  // Handle collection selection
  async selectCollection(collectionName: string) {
    appState.selectCollection(collectionName);
    await loadRecords(collectionName);
  },

  // Handle login success
  async handleLoginSuccess() {
    appState.setAuthenticated(true);
    appState.setRecordsLoading(true);
    appState.setCollectionsLoading(true);
    appState.setError(null);
    await loadInitialData();
  },

  // Handle logout
  handleLogout() {
    PocketBaseConfig.getInstance().authStore.clear();
    appState.reset();
  }
};