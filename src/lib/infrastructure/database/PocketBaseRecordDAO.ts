import type { RecordDAO } from '../../domain/dao/RecordDAO';
import type { RecordDTO, CreateRecordDTO, UpdateRecordDTO } from '../../domain/dto/RecordDTO';
import type { PaginatedResult, QueryParams } from '../../domain/dao/BaseDAO';
import { PocketBaseConfig } from '../config/PocketBaseConfig';

/**
 * PocketBase implementation of RecordDAO
 */
export class PocketBaseRecordDAO implements RecordDAO {
  private client = PocketBaseConfig.getInstance();

  async findById(id: string): Promise<RecordDTO | null> {
    // Note: PocketBase requires collection name to find record by ID
    // This method would need collection name parameter in real implementation
    throw new Error('findById requires collection name. Use findByIdInCollection instead.');
  }

  async findByIdInCollection(collectionName: string, id: string): Promise<RecordDTO | null> {
    try {
      const record = await this.client.collection(collectionName).getOne(id);
      return this.mapToDTO(record, collectionName);
    } catch (error) {
      console.error('Error finding record by ID:', error);
      return null;
    }
  }

  async findAll(): Promise<RecordDTO[]> {
    // Note: PocketBase requires collection name to find all records
    throw new Error('findAll requires collection name. Use findByCollectionSimple instead.');
  }

  async findByCollection(collectionName: string, params?: QueryParams): Promise<PaginatedResult<RecordDTO>> {
    try {
      const result = await this.client.collection(collectionName).getList(
        params?.page || 1,
        params?.perPage || 50,
        {
          sort: params?.sort,
          filter: params?.filter,
          expand: params?.expand
        }
      );

      return {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items.map(record => this.mapToDTO(record, collectionName))
      };
    } catch (error) {
      console.error('Error finding records by collection:', error);
      return {
        page: 1,
        perPage: 50,
        totalItems: 0,
        totalPages: 0,
        items: []
      };
    }
  }

  async findByCollectionSimple(collectionName: string): Promise<RecordDTO[]> {
    try {
      const records = await this.client.collection(collectionName).getFullList();
      return records.map(record => this.mapToDTO(record, collectionName));
    } catch (error) {
      console.error('Error finding records by collection (simple):', error);
      return [];
    }
  }

  async findByFilter(collectionName: string, filter: string, params?: QueryParams): Promise<PaginatedResult<RecordDTO>> {
    const queryParams = { ...params, filter };
    return this.findByCollection(collectionName, queryParams);
  }

  async countByCollection(collectionName: string): Promise<number> {
    try {
      const result = await this.client.collection(collectionName).getList(1, 1);
      return result.totalItems;
    } catch (error) {
      console.error('Error counting records by collection:', error);
      return 0;
    }
  }

  async create(data: CreateRecordDTO): Promise<RecordDTO> {
    // Note: PocketBase requires collection name to create record
    throw new Error('create requires collection name. Use createInCollection instead.');
  }

  async createInCollection(collectionName: string, data: CreateRecordDTO): Promise<RecordDTO> {
    try {
      const record = await this.client.collection(collectionName).create(data);
      return this.mapToDTO(record, collectionName);
    } catch (error) {
      console.error('Error creating record:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateRecordDTO): Promise<RecordDTO> {
    // Note: PocketBase requires collection name to update record
    throw new Error('update requires collection name. Use updateInCollection instead.');
  }

  async updateInCollection(collectionName: string, id: string, data: UpdateRecordDTO): Promise<RecordDTO> {
    try {
      const record = await this.client.collection(collectionName).update(id, data);
      return this.mapToDTO(record, collectionName);
    } catch (error) {
      console.error('Error updating record:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    // Note: PocketBase requires collection name to delete record
    throw new Error('delete requires collection name. Use deleteInCollection instead.');
  }

  async deleteInCollection(collectionName: string, id: string): Promise<boolean> {
    try {
      await this.client.collection(collectionName).delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting record:', error);
      return false;
    }
  }

  async deleteByCollection(collectionName: string): Promise<boolean> {
    try {
      const records = await this.client.collection(collectionName).getFullList();
      await Promise.all(
        records.map(record => this.client.collection(collectionName).delete(record.id))
      );
      return true;
    } catch (error) {
      console.error('Error deleting all records by collection:', error);
      return false;
    }
  }

  private mapToDTO(record: any, collectionName: string): RecordDTO {
    const { id, created, updated, collectionId, ...data } = record;
    return {
      id,
      created,
      updated,
      collectionId: collectionId || '',
      collectionName,
      ...data
    };
  }
}