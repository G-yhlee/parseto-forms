/**
 * Base Data Access Object interface
 */
export interface BaseDAO<T, CreateDTO, UpdateDTO> {
	findById(id: string): Promise<T | null>;
	findAll(): Promise<T[]>;
	create(data: CreateDTO): Promise<T>;
	update(id: string, data: UpdateDTO): Promise<T>;
	delete(id: string): Promise<boolean>;
}

/**
 * Query parameters for paginated results
 */
export interface QueryParams {
	page?: number;
	perPage?: number;
	sort?: string;
	filter?: string;
	expand?: string;
}

/**
 * Paginated result interface
 */
export interface PaginatedResult<T> {
	page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
	items: T[];
}
