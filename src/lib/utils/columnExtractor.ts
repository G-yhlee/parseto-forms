/**
 * PocketBase 레코드에서 테이블 컬럼을 추출하는 유틸리티
 */

import type { PocketBaseRecord } from '$lib/pocketbase';

export interface ColumnInfo {
  key: string;
  name: string;
  type: string;
  nested?: boolean;
  parentKey?: string;
}

export class ColumnExtractor {
  
  /**
   * 레코드 배열에서 모든 가능한 컬럼을 추출
   */
  static extractColumns(records: PocketBaseRecord[]): string[] {
    if (records.length === 0) return [];
    
    const allColumns = new Set<string>();
    
    // 모든 레코드를 검사하여 컬럼 수집
    records.forEach(record => {
      const columns = this.extractColumnsFromRecord(record);
      columns.forEach(col => allColumns.add(col));
    });
    
    // 기본 시스템 필드 순서 유지
    const systemFields = ['id', 'created', 'updated'];
    const userFields = Array.from(allColumns).filter(col => !systemFields.includes(col));
    
    return [...systemFields.filter(field => allColumns.has(field)), ...userFields];
  }
  
  /**
   * 단일 레코드에서 모든 컬럼 추출 (중첩 객체 포함)
   */
  private static extractColumnsFromRecord(record: PocketBaseRecord, prefix = ''): string[] {
    const columns: string[] = [];
    
    Object.entries(record).forEach(([key, value]) => {
      // 시스템 필드 제외
      if (['collectionId', 'collectionName'].includes(key)) {
        return;
      }
      
      // data 필드는 건너뛰고 내부 필드만 추출
      if (key === 'data' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const nestedColumns = Object.keys(value);
        columns.push(...nestedColumns);
        return;
      }
      
      // 일반 필드는 포함
      if (!prefix) {
        columns.push(key);
      }
      
      // 다른 객체인 경우 중첩 필드도 추출 (1단계만)
      if (typeof value === 'object' && value !== null && !Array.isArray(value) && key !== 'data') {
        const nestedColumns = Object.keys(value).map(nestedKey => `${key}.${nestedKey}`);
        columns.push(...nestedColumns);
      }
    });
    
    return columns;
  }
  
  /**
   * 컬럼 정보 상세 분석
   */
  static analyzeColumns(records: PocketBaseRecord[]): ColumnInfo[] {
    if (records.length === 0) return [];
    
    const columns = this.extractColumns(records);
    
    return columns.map(colKey => {
      const isNested = colKey.includes('.');
      const [parentKey, childKey] = isNested ? colKey.split('.') : [colKey, ''];
      
      // 샘플 값으로 타입 추정
      const sampleValue = this.getSampleValue(records, colKey);
      const type = this.inferColumnType(sampleValue);
      
      return {
        key: colKey,
        name: isNested ? childKey : colKey,
        type,
        nested: isNested,
        parentKey: isNested ? parentKey : undefined
      };
    });
  }
  
  /**
   * 컬럼의 샘플 값 가져오기
   */
  private static getSampleValue(records: PocketBaseRecord[], columnKey: string): any {
    for (const record of records) {
      // data 필드의 직접 자식인지 먼저 확인
      if (record.data && typeof record.data === 'object' && columnKey in record.data) {
        const value = record.data[columnKey];
        if (value !== null && value !== undefined) {
          return value;
        }
      }
      
      // 일반적인 중첩 값 확인
      const value = this.getNestedValue(record, columnKey);
      if (value !== null && value !== undefined) {
        return value;
      }
    }
    return null;
  }
  
  /**
   * 중첩된 키로 값 가져오기
   */
  static getNestedValue(record: PocketBaseRecord, key: string): any {
    // data 필드의 직접 자식인 경우
    if (record.data && typeof record.data === 'object' && key in record.data) {
      return record.data[key];
    }
    
    // 일반 필드인 경우
    if (!key.includes('.')) {
      return record[key];
    }
    
    const [parentKey, ...childKeys] = key.split('.');
    let value = record[parentKey];
    
    for (const childKey of childKeys) {
      if (value && typeof value === 'object') {
        value = value[childKey];
      } else {
        return null;
      }
    }
    
    return value;
  }
  
  /**
   * 컬럼 타입 추정
   */
  private static inferColumnType(value: any): string {
    if (value === null || value === undefined) return 'unknown';
    
    const type = typeof value;
    
    switch (type) {
      case 'string':
        // 날짜 문자열 감지
        if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
          return 'datetime';
        }
        return 'string';
      case 'number':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'object':
        if (Array.isArray(value)) {
          return 'array';
        }
        return 'object';
      default:
        return 'unknown';
    }
  }
  
  /**
   * 컬럼명 표시용 포맷팅
   */
  static formatColumnName(columnKey: string): string {
    if (!columnKey.includes('.')) {
      return columnKey;
    }
    
    const [parentKey, childKey] = columnKey.split('.');
    return `${parentKey}.${childKey}`;
  }
  
  /**
   * 컬럼 그룹화 (중첩 필드들을 부모별로 그룹화)
   */
  static groupColumns(columns: string[]): { [parentKey: string]: string[] } {
    const groups: { [parentKey: string]: string[] } = {};
    
    columns.forEach(col => {
      if (col.includes('.')) {
        const [parentKey] = col.split('.');
        if (!groups[parentKey]) {
          groups[parentKey] = [];
        }
        groups[parentKey].push(col);
      } else {
        if (!groups['_root']) {
          groups['_root'] = [];
        }
        groups['_root'].push(col);
      }
    });
    
    return groups;
  }
}