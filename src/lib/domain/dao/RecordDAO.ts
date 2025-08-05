import type { BaseDAO, PaginatedResult, QueryParams } from './BaseDAO';
import type { RecordDTO, CreateRecordDTO, UpdateRecordDTO } from '../dto/RecordDTO';

/**
 * Record Data Access Object interface
 */
export interface RecordDAO extends BaseDAO<RecordDTO, CreateRecordDTO, UpdateRecordDTO> {
  findByCollection(collectionName: string, params?: QueryParams): Promise<PaginatedResult<RecordDTO>>;
  findByCollectionSimple(collectionName: string): Promise<RecordDTO[]>;
  findByFilter(collectionName: string, filter: string, params?: QueryParams): Promise<PaginatedResult<RecordDTO>>;
  countByCollection(collectionName: string): Promise<number>;
  deleteByCollection(collectionName: string): Promise<boolean>;
}