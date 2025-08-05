import { BaseEntity } from './BaseEntity';

/**
 * Record domain entity
 */
export class RecordEntity extends BaseEntity {
  constructor(
    id: string,
    created: string,
    updated: string,
    public readonly collectionId: string,
    public readonly collectionName: string,
    public readonly data: Record<string, any> = {}
  ) {
    super(id, created, updated);
  }

  getValue(fieldName: string): any {
    return this.data[fieldName];
  }

  hasField(fieldName: string): boolean {
    return fieldName in this.data;
  }

  getFieldNames(): string[] {
    return Object.keys(this.data);
  }

  isJsonField(fieldName: string): boolean {
    const value = this.getValue(fieldName);
    return typeof value === 'object' && value !== null;
  }

  isDateField(fieldName: string): boolean {
    return ['created', 'updated'].includes(fieldName);
  }

  isBooleanField(fieldName: string): boolean {
    const booleanFields = ['verified', 'emailVisibility', 'emailConsent'];
    return booleanFields.includes(fieldName);
  }

  toPlainObject(): Record<string, any> {
    return {
      id: this.id,
      created: this.created,
      updated: this.updated,
      collectionId: this.collectionId,
      collectionName: this.collectionName,
      ...this.data
    };
  }
}