import { BaseEntity } from './BaseEntity';

/**
 * Collection domain entity
 */
export class CollectionEntity extends BaseEntity {
  constructor(
    id: string,
    created: string,
    updated: string,
    public readonly name: string,
    public readonly type: string,
    public readonly schema: Record<string, any>[] = [],
    public readonly system: boolean = false
  ) {
    super(id, created, updated);
  }

  isSystemCollection(): boolean {
    return this.system;
  }

  getFieldNames(): string[] {
    return this.schema.map(field => field.name);
  }

  getFieldType(fieldName: string): string {
    const field = this.schema.find(f => f.name === fieldName);
    return field?.type || 'text';
  }

  isPinnedCollection(): boolean {
    const pinnedCollections = ['ebos_carinfo', 'ebos_customerinfo', 'ebos_passenger', 'ebos_r1s', 'ebos_r2s'];
    return pinnedCollections.includes(this.name);
  }
}