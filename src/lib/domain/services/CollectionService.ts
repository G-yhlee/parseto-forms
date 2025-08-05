import type { CollectionDAO } from '../dao/CollectionDAO';
import type { CollectionDTO } from '../dto/CollectionDTO';
import { CollectionEntity } from '../entities/Collection';

/**
 * Collection domain service
 */
export class CollectionService {
  private cachedCollections: CollectionEntity[] | null = null;
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 30000; // 30 seconds

  constructor(private collectionDAO: CollectionDAO) {}

  async getAllCollections(): Promise<CollectionEntity[]> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.cachedCollections && (now - this.lastFetchTime) < this.CACHE_DURATION) {
      console.log('Using cached collections');
      return this.cachedCollections;
    }
    
    console.log('Fetching fresh collections from API');
    const dtos = await this.collectionDAO.findAll();
    this.cachedCollections = dtos.map(dto => this.mapToEntity(dto));
    this.lastFetchTime = now;
    
    return this.cachedCollections;
  }

  async getCollectionByName(name: string): Promise<CollectionEntity | null> {
    const dto = await this.collectionDAO.findByName(name);
    return dto ? this.mapToEntity(dto) : null;
  }

  async getPinnedCollections(): Promise<CollectionEntity[]> {
    const collections = await this.getAllCollections();
    return collections.filter(collection => collection.isPinnedCollection());
  }

  async getFilteredCollections(searchTerm: string): Promise<CollectionEntity[]> {
    const collections = await this.getAllCollections();
    
    if (!searchTerm) {
      return collections;
    }

    return collections.filter(collection =>
      collection.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  async getOtherCollections(searchTerm: string = ''): Promise<CollectionEntity[]> {
    const collections = await this.getFilteredCollections(searchTerm);
    const pinnedCollections = await this.getPinnedCollections();
    const pinnedNames = pinnedCollections.map(c => c.name);
    
    return collections.filter(collection => 
      !pinnedNames.includes(collection.name)
    );
  }

  async getUserCollections(): Promise<CollectionEntity[]> {
    const dtos = await this.collectionDAO.findUserCollections();
    return dtos.map(dto => this.mapToEntity(dto));
  }

  async getSystemCollections(): Promise<CollectionEntity[]> {
    const dtos = await this.collectionDAO.findSystemCollections();
    return dtos.map(dto => this.mapToEntity(dto));
  }

  // Cache management methods
  clearCache(): void {
    console.log('Clearing collections cache');
    this.cachedCollections = null;
    this.lastFetchTime = 0;
  }

  isCacheValid(): boolean {
    const now = Date.now();
    return this.cachedCollections !== null && (now - this.lastFetchTime) < this.CACHE_DURATION;
  }

  private mapToEntity(dto: CollectionDTO): CollectionEntity {
    return new CollectionEntity(
      dto.id,
      dto.created,
      dto.updated,
      dto.name,
      dto.type,
      dto.schema || [],
      dto.system || false
    );
  }
}