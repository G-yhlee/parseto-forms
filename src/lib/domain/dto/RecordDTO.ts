/**
 * Record Data Transfer Object
 */
export interface RecordDTO {
  id: string;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
  [key: string]: any;
}

/**
 * Record list response DTO
 */
export interface RecordListDTO {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: RecordDTO[];
}

/**
 * Record creation request DTO
 */
export interface CreateRecordDTO {
  [key: string]: any;
}

/**
 * Record update request DTO
 */
export interface UpdateRecordDTO {
  [key: string]: any;
}

/**
 * Record query parameters DTO
 */
export interface RecordQueryDTO {
  page?: number;
  perPage?: number;
  sort?: string;
  filter?: string;
  expand?: string;
}