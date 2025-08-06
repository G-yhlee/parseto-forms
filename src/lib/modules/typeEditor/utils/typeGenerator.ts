/**
 * TypeScript 타입 자동 생성 유틸리티
 * 실제 데이터를 분석하여 TypeScript 인터페이스를 생성합니다
 */

import { Pluralizer } from './pluralizer';
import type { TypeAnalysis, GeneratedInterface } from '../types';

export class TypeGenerator {
  
  /**
   * 단일 레코드에서 타입 분석
   */
  static analyzeRecord(record: Record<string, any>, interfaceName: string = 'Record'): GeneratedInterface {
    const result = this.analyzeObjectWithNested(record, interfaceName);
    return result;
  }
  
  /**
   * 여러 레코드를 분석하여 더 정확한 타입 추론
   */
  static analyzeRecords(records: Record<string, any>[], interfaceName: string = 'Record'): GeneratedInterface {
    if (records.length === 0) {
      return {
        name: interfaceName,
        fields: [],
        code: `interface ${interfaceName} {}`
      };
    }
    
    // 모든 필드 수집 (data 필드 내부 포함)
    const allFields = new Set<string>();
    records.forEach(record => {
      Object.keys(record).forEach(key => {
        // 시스템 필드 제외
        if (['collectionId', 'collectionName'].includes(key)) {
          return;
        }
        
        // data 필드인 경우 내부 필드들 추가
        if (key === 'data' && typeof record[key] === 'object' && record[key] !== null) {
          Object.keys(record[key]).forEach(dataKey => allFields.add(dataKey));
        } else {
          allFields.add(key);
        }
      });
    });
    
    // 각 필드 분석
    const fields: TypeAnalysis[] = [];
    
    for (const fieldName of allFields) {
      const analysis = this.analyzeFieldAcrossRecords(fieldName, records);
      fields.push(analysis);
    }
    
    const code = this.generateInterfaceCode(interfaceName, fields);
    
    return {
      name: interfaceName,
      fields,
      code
    };
  }
  
  /**
   * 객체를 중첩 인터페이스와 함께 분석
   */
  private static analyzeObjectWithNested(obj: Record<string, any>, interfaceName: string): GeneratedInterface {
    const fields: TypeAnalysis[] = [];
    const nestedInterfaces: GeneratedInterface[] = [];
    
    Object.entries(obj).forEach(([key, value]) => {
      // 시스템 필드 제외
      if (['collectionId', 'collectionName'].includes(key)) {
        return;
      }
      
      // data 필드인 경우 내부 필드들을 개별적으로 분석
      if (key === 'data' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          if (Array.isArray(dataValue) && dataValue.length > 0) {
            // 배열인 경우
            const firstItem = dataValue[0];
            if (typeof firstItem === 'object' && firstItem !== null) {
              // 객체 배열인 경우 별도 인터페이스 생성
              const itemTypeName = Pluralizer.getTypeNameFromArrayField(dataKey);
              const itemInterface = this.analyzeObjectWithNested(firstItem, itemTypeName);
              nestedInterfaces.push(itemInterface);
              
              fields.push({
                name: dataKey,
                type: `${itemTypeName}[]`,
                optional: false,
                description: this.generateFieldDescription(dataKey, dataValue)
              });
            } else {
              // 기본 타입 배열
              fields.push({
                name: dataKey,
                type: this.inferType(dataValue),
                optional: false,
                description: this.generateFieldDescription(dataKey, dataValue)
              });
            }
          } else if (typeof dataValue === 'object' && dataValue !== null && !Array.isArray(dataValue)) {
            // 중첩 객체인 경우 별도 인터페이스 생성
            const nestedInterfaceName = this.generateInterfaceName(dataKey);
            const nestedInterface = this.analyzeObjectWithNested(dataValue, nestedInterfaceName);
            nestedInterfaces.push(nestedInterface);
            
            fields.push({
              name: dataKey,
              type: nestedInterfaceName,
              optional: false,
              description: this.generateFieldDescription(dataKey, dataValue)
            });
          } else {
            fields.push({
              name: dataKey,
              type: this.inferType(dataValue),
              optional: false,
              description: this.generateFieldDescription(dataKey, dataValue)
            });
          }
        });
        return;
      }
      
      // 일반 필드 처리
      if (Array.isArray(value) && value.length > 0) {
        // 배열인 경우
        const firstItem = value[0];
        if (typeof firstItem === 'object' && firstItem !== null) {
          // 객체 배열인 경우 별도 인터페이스 생성
          const itemTypeName = Pluralizer.getTypeNameFromArrayField(key);
          const itemInterface = this.analyzeObjectWithNested(firstItem, itemTypeName);
          nestedInterfaces.push(itemInterface);
          
          fields.push({
            name: key,
            type: `${itemTypeName}[]`,
            optional: false,
            description: this.generateFieldDescription(key, value)
          });
        } else {
          // 기본 타입 배열
          fields.push({
            name: key,
            type: this.inferType(value),
            optional: false,
            description: this.generateFieldDescription(key, value)
          });
        }
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // 중첩 객체인 경우 별도 인터페이스 생성
        const nestedInterfaceName = this.generateInterfaceName(key);
        const nestedInterface = this.analyzeObjectWithNested(value, nestedInterfaceName);
        nestedInterfaces.push(nestedInterface);
        
        fields.push({
          name: key,
          type: nestedInterfaceName,
          optional: false,
          description: this.generateFieldDescription(key, value)
        });
      } else {
        fields.push({
          name: key,
          type: this.inferType(value),
          optional: false,
          description: this.generateFieldDescription(key, value)
        });
      }
    });
    
    const code = this.generateInterfaceCode(interfaceName, fields);
    
    return {
      name: interfaceName,
      fields,
      code,
      nestedInterfaces
    };
  }

  /**
   * 객체의 각 속성 분석 (기존 호환성 유지)
   */
  private static analyzeObject(obj: Record<string, any>): TypeAnalysis[] {
    const fields: TypeAnalysis[] = [];
    
    Object.entries(obj).forEach(([key, value]) => {
      // 시스템 필드 제외
      if (['collectionId', 'collectionName'].includes(key)) {
        return;
      }
      
      // data 필드인 경우 내부 필드들을 개별적으로 분석
      if (key === 'data' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          fields.push({
            name: dataKey,
            type: this.inferType(dataValue),
            optional: false,
            description: this.generateFieldDescription(dataKey, dataValue)
          });
        });
        return;
      }
      
      // 일반 필드 처리
      fields.push({
        name: key,
        type: this.inferType(value),
        optional: false,
        description: this.generateFieldDescription(key, value)
      });
    });
    
    return fields;
  }
  
  /**
   * 여러 레코드에서 특정 필드 분석
   */
  private static analyzeFieldAcrossRecords(fieldName: string, records: Record<string, any>[]): TypeAnalysis {
    // data 필드 내부의 값들을 가져오기
    const values = records.map(record => {
      // data 필드 내부에서 찾기
      if (record.data && typeof record.data === 'object' && fieldName in record.data) {
        return record.data[fieldName];
      }
      // 일반 필드에서 찾기
      return record[fieldName];
    });
    
    const nonNullValues = values.filter(v => v !== null && v !== undefined);
    
    // Optional 여부 판단
    const optional = values.some(v => v === null || v === undefined);
    
    // 타입 추론
    let type: string;
    
    if (nonNullValues.length === 0) {
      type = 'unknown';
    } else {
      const types = new Set(nonNullValues.map(v => this.inferType(v)));
      
      if (types.size === 1) {
        type = Array.from(types)[0];
      } else {
        // Union type 생성
        type = Array.from(types).join(' | ');
      }
    }
    
    return {
      name: fieldName,
      type,
      optional,
      description: this.generateFieldDescription(fieldName, nonNullValues[0])
    };
  }
  
  /**
   * 값에서 TypeScript 타입 추론
   */
  private static inferType(value: any, depth: number = 0): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    
    const jsType = typeof value;
    
    switch (jsType) {
      case 'string':
        // Date string 감지
        if (this.isDateString(value)) {
          return 'string'; // ISO date string
        }
        return 'string';
        
      case 'number':
        return 'number';
        
      case 'boolean':
        return 'boolean';
        
      case 'object':
        if (Array.isArray(value)) {
          return this.inferArrayType(value, depth);
        }
        return this.inferObjectType(value, depth);
        
      default:
        return 'unknown';
    }
  }
  
  /**
   * 배열 타입 추론
   */
  private static inferArrayType(arr: any[], depth: number = 0): string {
    if (arr.length === 0) return 'any[]';
    
    const elementTypes = new Set(arr.map(item => this.inferType(item, depth)));
    
    if (elementTypes.size === 1) {
      const elementType = Array.from(elementTypes)[0];
      // 복잡한 객체 타입의 경우 괄호로 감싸기
      if (elementType.includes('{') || elementType.includes('|')) {
        return `(${elementType})[]`;
      }
      return `${elementType}[]`;
    } else {
      const unionType = Array.from(elementTypes).join(' | ');
      return `(${unionType})[]`;
    }
  }
  
  /**
   * 객체 타입 추론 - 중첩된 인터페이스 생성
   */
  private static inferObjectType(obj: Record<string, any>, depth: number = 0): string {
    const keys = Object.keys(obj);
    
    if (keys.length === 0) {
      return 'Record<string, any>';
    }
    
    // 깊이 제한 (무한 중첩 방지)
    if (depth > 3) {
      return 'Record<string, any>';
    }
    
    // 간단한 key-value 객체인지 확인
    const allString = keys.every(key => typeof obj[key] === 'string');
    const allNumber = keys.every(key => typeof obj[key] === 'number');
    const allBoolean = keys.every(key => typeof obj[key] === 'boolean');
    
    if (allString) return 'Record<string, string>';
    if (allNumber) return 'Record<string, number>';
    if (allBoolean) return 'Record<string, boolean>';
    
    // 복잡한 객체는 인라인 인터페이스로 생성
    const fieldTypes: string[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const fieldType = this.inferType(value, depth + 1);
      const optional = value === null || value === undefined ? '?' : '';
      const comment = this.generateFieldDescription(key, value);
      const commentStr = comment ? ` // ${comment}` : '';
      
      fieldTypes.push(`  ${key}${optional}: ${fieldType};${commentStr}`);
    }
    
    return `{\n${fieldTypes.join('\n')}\n}`;
  }
  
  /**
   * Date string 감지
   */
  private static isDateString(value: string): boolean {
    // ISO 8601 형식 감지
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    // 한국 형식 날짜 (2025-07-10 18:47:15)
    const koreanDateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    
    return isoRegex.test(value) || dateRegex.test(value) || koreanDateRegex.test(value);
  }
  
  /**
   * 인터페이스 이름 생성
   */
  private static generateInterfaceName(fieldName: string): string {
    // camelCase를 PascalCase로 변환
    const pascalCase = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    
    // 특별한 케이스들 처리
    const specialCases: Record<string, string> = {
      'forminfo': 'FormInfo',
      'formInfo': 'FormInfo',
      'reserveinfo': 'ReserveInfo', 
      'reserveInfo': 'ReserveInfo',
      'estimateinfos': 'EstimateInfos',
      'estimateInfos': 'EstimateInfos',
      'userinfo': 'UserInfo',
      'userInfo': 'UserInfo',
      'companyinfo': 'CompanyInfo',
      'companyInfo': 'CompanyInfo',
      'carinfo': 'CarInfo',
      'carInfo': 'CarInfo'
    };
    
    return specialCases[fieldName] || pascalCase;
  }

  /**
   * 필드 설명 생성
   */
  private static generateFieldDescription(fieldName: string, value: any): string {
    const name = fieldName.toLowerCase();
    
    if (name.includes('id')) return 'Unique identifier';
    if (name === 'created' || name === 'createdtime') return 'Creation timestamp';
    if (name === 'updated' || name === 'updatedtime') return 'Last update timestamp';
    if (name.includes('email')) return 'Email address';
    if (name.includes('name')) return 'Name field';
    if (name.includes('phone')) return 'Phone number';
    if (name.includes('fax')) return 'Fax number';
    if (name.includes('company')) return 'Company information';
    if (name.includes('time')) return 'Timestamp';
    if (name.includes('state')) return 'State information';
    if (name.includes('count')) return 'Count value';
    if (name.includes('info')) return 'Information object';
    
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return `Array of ${value.length} items`;
      }
      return 'Nested object';
    }
    
    return '';
  }
  
  /**
   * TypeScript 인터페이스 코드 생성
   */
  private static generateInterfaceCode(interfaceName: string, fields: TypeAnalysis[]): string {
    const lines = [`interface ${interfaceName} {`];
    
    fields.forEach(field => {
      const optional = field.optional ? '?' : '';
      lines.push(`  ${field.name}${optional}: ${field.type};`);
    });
    
    lines.push('}');
    
    return lines.join('\n');
  }
  
  /**
   * JSON Schema 스타일 타입 정보 생성
   */
  static generateJsonSchema(record: Record<string, any>): any {
    const properties: Record<string, any> = {};
    const required: string[] = [];
    
    Object.entries(record).forEach(([key, value]) => {
      properties[key] = this.valueToJsonSchemaType(value);
      if (value !== null && value !== undefined) {
        required.push(key);
      }
    });
    
    return {
      type: 'object',
      properties,
      required
    };
  }
  
  /**
   * 값을 JSON Schema 타입으로 변환
   */
  private static valueToJsonSchemaType(value: any): any {
    if (value === null) return { type: 'null' };
    
    const jsType = typeof value;
    
    switch (jsType) {
      case 'string':
        if (this.isDateString(value)) {
          return { type: 'string', format: 'date-time' };
        }
        return { type: 'string' };
        
      case 'number':
        return { type: 'number' };
        
      case 'boolean':
        return { type: 'boolean' };
        
      case 'object':
        if (Array.isArray(value)) {
          return {
            type: 'array',
            items: value.length > 0 ? this.valueToJsonSchemaType(value[0]) : { type: 'any' }
          };
        }
        return { type: 'object' };
        
      default:
        return { type: 'any' };
    }
  }
}