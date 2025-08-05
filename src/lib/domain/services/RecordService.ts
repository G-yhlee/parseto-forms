import type { RecordDAO } from '../dao/RecordDAO';
import type { RecordDTO, RecordQueryDTO } from '../dto/RecordDTO';
import type { PaginatedResult } from '../dao/BaseDAO';
import { RecordEntity } from '../entities/Record';

/**
 * Record domain service
 */
export class RecordService {
  private recordCache = new Map<string, RecordEntity[]>();
  private cacheTimestamps = new Map<string, number>();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  constructor(private recordDAO: RecordDAO) {}

  async getRecordsByCollection(collectionName: string): Promise<RecordEntity[]> {
    const now = Date.now();
    const cacheKey = collectionName;
    
    // Check cache first
    const lastFetchTime = this.cacheTimestamps.get(cacheKey) || 0;
    if (this.recordCache.has(cacheKey) && (now - lastFetchTime) < this.CACHE_DURATION) {
      console.log(`Using cached records for ${collectionName}`);
      return this.recordCache.get(cacheKey)!;
    }
    
    console.log(`Fetching fresh records for ${collectionName} from API`);
    const dtos = await this.recordDAO.findByCollectionSimple(collectionName);
    const records = dtos.map(dto => this.mapToEntity(dto));
    
    // Update cache
    this.recordCache.set(cacheKey, records);
    this.cacheTimestamps.set(cacheKey, now);
    
    return records;
  }

  async getPaginatedRecords(
    collectionName: string, 
    query?: RecordQueryDTO
  ): Promise<PaginatedResult<RecordEntity>> {
    const result = await this.recordDAO.findByCollection(collectionName, query);
    
    return {
      ...result,
      items: result.items.map(dto => this.mapToEntity(dto))
    };
  }

  async searchRecords(
    collectionName: string,
    filter: string,
    query?: RecordQueryDTO
  ): Promise<PaginatedResult<RecordEntity>> {
    const result = await this.recordDAO.findByFilter(collectionName, filter, query);
    
    return {
      ...result,
      items: result.items.map(dto => this.mapToEntity(dto))
    };
  }

  async getRecordCount(collectionName: string): Promise<number> {
    return await this.recordDAO.countByCollection(collectionName);
  }

  async getRecordById(collectionName: string, id: string): Promise<RecordEntity | null> {
    // Note: This would require extending the DAO interface
    // For now, we'll get all records and filter (not efficient for large datasets)
    const records = await this.getRecordsByCollection(collectionName);
    return records.find(record => record.id === id) || null;
  }

  formatRecordValue(record: RecordEntity, fieldName: string): {
    type: string;
    content: string;
    class?: string;
  } {
    const value = record.getValue(fieldName);

    if (record.isDateField(fieldName)) {
      return {
        type: 'date',
        content: this.formatDate(value)
      };
    }

    if (record.isBooleanField(fieldName)) {
      return {
        type: 'boolean',
        content: value ? 'True' : 'False',
        class: value ? 'bool-true' : 'bool-false'
      };
    }

    if (record.isJsonField(fieldName)) {
      return {
        type: 'json',
        content: JSON.stringify(value, null, 2)
      };
    }

    return {
      type: 'text',
      content: String(value || '')
    };
  }

  // Cache management methods
  clearCache(collectionName?: string): void {
    if (collectionName) {
      console.log(`Clearing records cache for ${collectionName}`);
      this.recordCache.delete(collectionName);
      this.cacheTimestamps.delete(collectionName);
    } else {
      console.log('Clearing all records cache');
      this.recordCache.clear();
      this.cacheTimestamps.clear();
    }
  }

  isCacheValid(collectionName: string): boolean {
    const now = Date.now();
    const lastFetchTime = this.cacheTimestamps.get(collectionName) || 0;
    return this.recordCache.has(collectionName) && (now - lastFetchTime) < this.CACHE_DURATION;
  }

  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  }

  private mapToEntity(dto: RecordDTO): RecordEntity {
    const { id, created, updated, collectionId, collectionName, ...data } = dto;
    return new RecordEntity(
      id,
      created,
      updated,
      collectionId,
      collectionName,
      data
    );
  }
}