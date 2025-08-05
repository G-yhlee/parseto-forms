import type { CollectionEntity } from '../entities/Collection';

/**
 * Collection repository interface - defines domain operations
 */
export interface CollectionRepository {
  findAll(): Promise<CollectionEntity[]>;
  findByName(name: string): Promise<CollectionEntity | null>;
  findPinned(): Promise<CollectionEntity[]>;
  findFiltered(searchTerm: string): Promise<CollectionEntity[]>;
  findOthers(searchTerm?: string): Promise<CollectionEntity[]>;
  findUserCollections(): Promise<CollectionEntity[]>;
  findSystemCollections(): Promise<CollectionEntity[]>;
}