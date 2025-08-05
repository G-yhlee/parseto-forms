import type { CollectionDAO } from '../../domain/dao/CollectionDAO';
import type { CollectionDTO, CreateCollectionDTO, UpdateCollectionDTO } from '../../domain/dto/CollectionDTO';
import type { PaginatedResult } from '../../domain/dao/BaseDAO';
import { PocketBaseConfig } from '../config/PocketBaseConfig';

/**
 * PocketBase implementation of CollectionDAO
 */
export class PocketBaseCollectionDAO implements CollectionDAO {
  private client = PocketBaseConfig.getInstance();

  async findById(id: string): Promise<CollectionDTO | null> {
    try {
      const collection = await this.client.collections.getOne(id);
      return this.mapToDTO(collection);
    } catch (error) {
      console.error('Error finding collection by ID:', error);
      return null;
    }
  }

  async findAll(): Promise<CollectionDTO[]> {
    try {
      const collections = await this.client.collections.getFullList();
      return collections.map(collection => this.mapToDTO(collection));
    } catch (error) {
      console.error('Error finding all collections:', error);
      return [];
    }
  }

  async findByName(name: string): Promise<CollectionDTO | null> {
    try {
      const collections = await this.client.collections.getFullList();
      const collection = collections.find(c => c.name === name);
      return collection ? this.mapToDTO(collection) : null;
    } catch (error) {
      console.error('Error finding collection by name:', error);
      return null;
    }
  }

  async findSystemCollections(): Promise<CollectionDTO[]> {
    try {
      const collections = await this.client.collections.getFullList();
      return collections
        .filter(c => c.system)
        .map(collection => this.mapToDTO(collection));
    } catch (error) {
      console.error('Error finding system collections:', error);
      return [];
    }
  }

  async findUserCollections(): Promise<CollectionDTO[]> {
    try {
      const collections = await this.client.collections.getFullList();
      return collections
        .filter(c => !c.system)
        .map(collection => this.mapToDTO(collection));
    } catch (error) {
      console.error('Error finding user collections:', error);
      return [];
    }
  }

  async findPaginatedCollections(params?: { page?: number; perPage?: number }): Promise<PaginatedResult<CollectionDTO>> {
    try {
      const result = await this.client.collections.getList(
        params?.page || 1,
        params?.perPage || 50
      );
      
      return {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items.map(collection => this.mapToDTO(collection))
      };
    } catch (error) {
      console.error('Error finding paginated collections:', error);
      return {
        page: 1,
        perPage: 50,
        totalItems: 0,
        totalPages: 0,
        items: []
      };
    }
  }

  async create(data: CreateCollectionDTO): Promise<CollectionDTO> {
    try {
      const collection = await this.client.collections.create(data);
      return this.mapToDTO(collection);
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateCollectionDTO): Promise<CollectionDTO> {
    try {
      const collection = await this.client.collections.update(id, data);
      return this.mapToDTO(collection);
    } catch (error) {
      console.error('Error updating collection:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.client.collections.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting collection:', error);
      return false;
    }
  }

  private mapToDTO(collection: any): CollectionDTO {
    return {
      id: collection.id,
      created: collection.created,
      updated: collection.updated,
      name: collection.name,
      type: collection.type,
      schema: collection.schema || [],
      system: collection.system || false
    };
  }
}