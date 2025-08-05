import type { BaseDAO, PaginatedResult } from './BaseDAO';
import type { CollectionDTO, CreateCollectionDTO, UpdateCollectionDTO } from '../dto/CollectionDTO';

/**
 * Collection Data Access Object interface
 */
export interface CollectionDAO extends BaseDAO<CollectionDTO, CreateCollectionDTO, UpdateCollectionDTO> {
  findByName(name: string): Promise<CollectionDTO | null>;
  findSystemCollections(): Promise<CollectionDTO[]>;
  findUserCollections(): Promise<CollectionDTO[]>;
  findPaginatedCollections(params?: { page?: number; perPage?: number }): Promise<PaginatedResult<CollectionDTO>>;
}