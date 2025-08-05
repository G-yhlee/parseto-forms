import type { RecordRepository } from '../../domain/repositories/RecordRepository';
import type { RecordEntity } from '../../domain/entities/Record';

/**
 * Use case for getting records from a collection
 */
export class GetRecordsUseCase {
  constructor(private recordRepository: RecordRepository) {}

  async execute(collectionName: string): Promise<{
    records: RecordEntity[];
    count: number;
    columns: string[];
  }> {
    console.log(`GetRecordsUseCase: Fetching records for ${collectionName}`);
    
    // Single API call to get records, derive count from array length
    const records = await this.recordRepository.findByCollection(collectionName);
    
    // Extract column names from records
    const columns = records.length > 0 
      ? records[0].getFieldNames().filter(key => !['collectionId', 'collectionName'].includes(key))
      : [];

    console.log(`GetRecordsUseCase: Processed ${records.length} records with ${columns.length} columns`);

    return {
      records,
      count: records.length, // Use array length instead of separate API call
      columns
    };
  }
}