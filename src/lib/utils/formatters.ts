import type { RecordEntity } from '../domain/entities/Record';
import type { CollectionEntity } from '../domain/entities/Collection';

// Legacy interface for backward compatibility
interface LegacyPocketBaseRecord {
  id: string;
  created: string;  
  updated: string;
  [key: string]: unknown;
}

// Data formatting utilities
export class DataFormatters {
  
  // Format cell values for table display
  static formatCellValue(value: unknown, maxLength: number = 50): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      return this.truncateText(JSON.stringify(value), maxLength);
    }
    return this.truncateText(String(value), maxLength);
  }

  // Truncate text with ellipsis
  static truncateText(text: string, maxLength: number = 50): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }

  // Format date for display
  static formatDate(dateString: string): string {
    return new Date(dateString).toISOString().slice(0, 19).replace('T', ' ') + ' UTC';
  }

  // Format boolean values
  static formatBoolean(value: boolean): { text: string; class: string } {
    return {
      text: value ? 'True' : 'False',
      class: value ? 'bool-true' : 'bool-false'
    };
  }

  // Get field type for display
  static getFieldType(key: string): string {
    if (['created', 'updated'].includes(key)) return 'datetime';
    if (key === 'email') return 'email';
    if (['verified', 'emailVisibility', 'emailConsent'].includes(key)) return 'bool';
    return 'text';
  }

  // Get collection icon - moved to IconUtils
  // This method is deprecated, use IconUtils.getCollectionIcon() instead

  // Get display fields for a record (excluding system fields) - Domain entity version
  static getRecordDisplayFields(record: RecordEntity): [string, unknown][] {
    const plainObject = record.toPlainObject();
    return Object.entries(plainObject).filter(([key]) => 
      !['collectionId', 'collectionName'].includes(key)
    );
  }

  // Legacy version for backward compatibility
  static getRecordDisplayFieldsLegacy(record: LegacyPocketBaseRecord): [string, unknown][] {
    return Object.entries(record).filter(([key]) => 
      !['collectionId', 'collectionName'].includes(key)
    );
  }

  // Format record field value using domain entity
  static formatRecordField(record: RecordEntity, fieldName: string): {
    type: string;
    content: string;
    class?: string;
  } {
    const value = record.getValue(fieldName);

    if (record.isDateField(fieldName)) {
      return {
        type: 'date',
        content: this.formatDate(value as string)
      };
    }

    if (record.isBooleanField(fieldName)) {
      const boolFormat = this.formatBoolean(value as boolean);
      return {
        type: 'boolean',
        content: boolFormat.text,
        class: boolFormat.class
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
      content: this.formatCellValue(value)
    };
  }

  // Check if value is JSON
  static isJsonValue(value: unknown): boolean {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return typeof parsed === 'object' && parsed !== null;
      } catch {
        return false;
      }
    }
    return typeof value === 'object' && value !== null;
  }

  // Parse JSON value
  static parseJsonValue(value: unknown): unknown {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  }

  // Format ID for display
  static formatId(id: string): string {
    return id.slice(0, 15);
  }

  // Format collection name for display
  static formatCollectionName(collection: CollectionEntity): string {
    return collection.name.replace(/_/g, ' ').toUpperCase();
  }

  // Get collection field count
  static getCollectionFieldCount(collection: CollectionEntity): number {
    return collection.getFieldNames().length;
  }
}