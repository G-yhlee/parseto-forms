import type { RecordEntity } from '../entities/Record';
import type { RecordQueryDTO } from '../dto/RecordDTO';
import type { PaginatedResult } from '../dao/BaseDAO';

/**
 * Record repository interface - defines domain operations
 */
export interface RecordRepository {
  findByCollection(collectionName: string): Promise<RecordEntity[]>;
  findPaginated(collectionName: string, query?: RecordQueryDTO): Promise<PaginatedResult<RecordEntity>>;
  findById(collectionName: string, id: string): Promise<RecordEntity | null>;
  search(collectionName: string, filter: string, query?: RecordQueryDTO): Promise<PaginatedResult<RecordEntity>>;
  count(collectionName: string): Promise<number>;
}