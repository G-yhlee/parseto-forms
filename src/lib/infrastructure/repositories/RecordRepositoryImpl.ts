import type { RecordRepository } from '../../domain/repositories/RecordRepository';
import type { RecordEntity } from '../../domain/entities/Record';
import type { RecordQueryDTO } from '../../domain/dto/RecordDTO';
import type { PaginatedResult } from '../../domain/dao/BaseDAO';
import { RecordService } from '../../domain/services/RecordService';
import type { RecordDAO } from '../../domain/dao/RecordDAO';

/**
 * Implementation of RecordRepository using RecordService
 */
export class RecordRepositoryImpl implements RecordRepository {
  private recordService: RecordService;

  constructor(recordDAO: RecordDAO) {
    this.recordService = new RecordService(recordDAO);
  }

  async findByCollection(collectionName: string): Promise<RecordEntity[]> {
    return await this.recordService.getRecordsByCollection(collectionName);
  }

  async findPaginated(collectionName: string, query?: RecordQueryDTO): Promise<PaginatedResult<RecordEntity>> {
    return await this.recordService.getPaginatedRecords(collectionName, query);
  }

  async findById(collectionName: string, id: string): Promise<RecordEntity | null> {
    return await this.recordService.getRecordById(collectionName, id);
  }

  async search(collectionName: string, filter: string, query?: RecordQueryDTO): Promise<PaginatedResult<RecordEntity>> {
    return await this.recordService.searchRecords(collectionName, filter, query);
  }

  async count(collectionName: string): Promise<number> {
    return await this.recordService.getRecordCount(collectionName);
  }
}