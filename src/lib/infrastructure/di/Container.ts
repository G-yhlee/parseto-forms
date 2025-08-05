// DAOs
import { PocketBaseCollectionDAO } from '../database/PocketBaseCollectionDAO';
import { PocketBaseRecordDAO } from '../database/PocketBaseRecordDAO';

// Repositories
import { CollectionRepositoryImpl } from '../repositories/CollectionRepositoryImpl';
import { RecordRepositoryImpl } from '../repositories/RecordRepositoryImpl';

// Use Cases
import { GetCollectionsUseCase } from '../../application/usecases/GetCollectionsUseCase';
import { GetRecordsUseCase } from '../../application/usecases/GetRecordsUseCase';

/**
 * Dependency Injection Container
 */
export class Container {
  private static instance: Container;
  
  // DAOs
  private _collectionDAO: PocketBaseCollectionDAO;
  private _recordDAO: PocketBaseRecordDAO;
  
  // Repositories
  private _collectionRepository: CollectionRepositoryImpl;
  private _recordRepository: RecordRepositoryImpl;
  
  // Use Cases
  private _getCollectionsUseCase: GetCollectionsUseCase;
  private _getRecordsUseCase: GetRecordsUseCase;

  private constructor() {
    // Initialize DAOs
    this._collectionDAO = new PocketBaseCollectionDAO();
    this._recordDAO = new PocketBaseRecordDAO();
    
    // Initialize Repositories
    this._collectionRepository = new CollectionRepositoryImpl(this._collectionDAO);
    this._recordRepository = new RecordRepositoryImpl(this._recordDAO);
    
    // Initialize Use Cases
    this._getCollectionsUseCase = new GetCollectionsUseCase(this._collectionRepository);
    this._getRecordsUseCase = new GetRecordsUseCase(this._recordRepository);
  }

  static getInstance(): Container {
    if (!this.instance) {
      this.instance = new Container();
    }
    return this.instance;
  }

  // DAO Getters
  get collectionDAO() { return this._collectionDAO; }
  get recordDAO() { return this._recordDAO; }
  
  // Repository Getters
  get collectionRepository() { return this._collectionRepository; }
  get recordRepository() { return this._recordRepository; }
  
  // Use Case Getters
  get getCollectionsUseCase() { return this._getCollectionsUseCase; }
  get getRecordsUseCase() { return this._getRecordsUseCase; }

  // Cache management utilities
  clearAllCaches(): void {
    console.log('Container: Clearing all caches');
    // Clear collection service cache
    if (this._collectionRepository instanceof CollectionRepositoryImpl) {
      (this._collectionRepository as any).collectionService.clearCache();
    }
    // Clear record service cache  
    if (this._recordRepository instanceof RecordRepositoryImpl) {
      (this._recordRepository as any).recordService.clearCache();
    }
  }

  clearCollectionCache(collectionName?: string): void {
    console.log(`Container: Clearing cache for collection ${collectionName || 'all'}`);
    if (this._recordRepository instanceof RecordRepositoryImpl) {
      (this._recordRepository as any).recordService.clearCache(collectionName);
    }
  }
}