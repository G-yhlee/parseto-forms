import type { CollectionRepository } from '../../domain/repositories/CollectionRepository';
import type { CollectionEntity } from '../../domain/entities/Collection';
import { CollectionService } from '../../domain/services/CollectionService';
import type { CollectionDAO } from '../../domain/dao/CollectionDAO';

/**
 * Implementation of CollectionRepository using CollectionService
 */
export class CollectionRepositoryImpl implements CollectionRepository {
  private collectionService: CollectionService;

  constructor(collectionDAO: CollectionDAO) {
    this.collectionService = new CollectionService(collectionDAO);
  }

  async findAll(): Promise<CollectionEntity[]> {
    return await this.collectionService.getAllCollections();
  }

  async findByName(name: string): Promise<CollectionEntity | null> {
    return await this.collectionService.getCollectionByName(name);
  }

  async findPinned(): Promise<CollectionEntity[]> {
    return await this.collectionService.getPinnedCollections();
  }

  async findFiltered(searchTerm: string): Promise<CollectionEntity[]> {
    return await this.collectionService.getFilteredCollections(searchTerm);
  }

  async findOthers(searchTerm: string = ''): Promise<CollectionEntity[]> {
    return await this.collectionService.getOtherCollections(searchTerm);
  }

  async findUserCollections(): Promise<CollectionEntity[]> {
    return await this.collectionService.getUserCollections();
  }

  async findSystemCollections(): Promise<CollectionEntity[]> {
    return await this.collectionService.getSystemCollections();
  }
}