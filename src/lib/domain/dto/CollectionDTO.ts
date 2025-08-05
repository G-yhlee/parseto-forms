/**
 * Collection Data Transfer Object
 */
export interface CollectionDTO {
  id: string;
  created: string;
  updated: string;
  name: string;
  type: string;
  schema?: Record<string, any>[];
  system?: boolean;
}

/**
 * Collection list response DTO
 */
export interface CollectionListDTO {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: CollectionDTO[];
}

/**
 * Collection creation request DTO
 */
export interface CreateCollectionDTO {
  name: string;
  type: string;
  schema?: Record<string, any>[];
}

/**
 * Collection update request DTO
 */
export interface UpdateCollectionDTO {
  name?: string;
  schema?: Record<string, any>[];
}