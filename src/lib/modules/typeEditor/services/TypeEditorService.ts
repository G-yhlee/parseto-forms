/**
 * TypeEditor 서비스 - PocketBase 레코드 편집 비즈니스 로직
 */

import { Container } from '$lib/infrastructure/di/Container';
import { TypeGenerator } from '$lib/modules/typeviewer';
import { createHighlightedCode } from '$lib/modules/typeviewer';
import type { 
  TypeEditorParams, 
  PocketBaseRecord, 
  SaveResult, 
  ValidationError 
} from '../types';

export class TypeEditorService {
  private static container = Container.getInstance();

  /**
   * Collection ID를 Collection Name으로 변환
   */
  private static async getCollectionNameById(collectionId: string): Promise<string | null> {
    try {
      // 먼저 collectionRepository에서 찾기
      const collections = await this.container.collectionRepository.findAll();
      const collection = collections.find(c => c.id === collectionId);
      if (collection) {
        return collection.name;
      }
      
      // fallback: collectionDAO 사용
      const collectionFromDAO = await this.container.collectionDAO.findById(collectionId);
      return collectionFromDAO?.name || null;
    } catch (error) {
      console.error('Failed to get collection name:', error);
      return null;
    }
  }

  /**
   * URL 파라미터 파싱
   */
  static parseUrlParams(searchParams: URLSearchParams): TypeEditorParams | null {
    const collection = searchParams.get('collection');
    const recordId = searchParams.get('recordId');

    if (!collection || !recordId) {
      return null;
    }

    return {
      collection,
      recordId,
      filter: searchParams.get('filter') || undefined,
      sort: searchParams.get('sort') || undefined
    };
  }

  /**
   * 컬렉션의 레코드 리스트 로드
   */
  static async loadRecordList(collectionIdOrName: string): Promise<PocketBaseRecord[]> {
    try {
      // Collection ID인지 Name인지 확인하고 Name으로 변환
      let collectionName = collectionIdOrName;
      
      // ID 형식인지 확인 (PocketBase ID는 15자 랜덤 문자열)
      if (collectionIdOrName.length === 15 && /^[a-zA-Z0-9]+$/.test(collectionIdOrName)) {
        const name = await this.getCollectionNameById(collectionIdOrName);
        if (!name) {
          console.error('Collection not found for ID:', collectionIdOrName);
          return [];
        }
        collectionName = name;
      }
      
      const records = await this.container.recordRepository.findByCollection(collectionName);
      return records as PocketBaseRecord[];
    } catch (error) {
      console.error('Failed to load record list:', error);
      return [];
    }
  }

  /**
   * 레코드 로드
   */
  static async loadRecord(params: TypeEditorParams): Promise<PocketBaseRecord | null> {
    try {
      // Collection ID인지 Name인지 확인하고 Name으로 변환
      let collectionName = params.collection;
      
      // ID 형식인지 확인 (PocketBase ID는 15자 랜덤 문자열)
      if (params.collection.length === 15 && /^[a-zA-Z0-9]+$/.test(params.collection)) {
        const name = await this.getCollectionNameById(params.collection);
        if (!name) {
          console.error('Collection not found for ID:', params.collection);
          return null;
        }
        collectionName = name;
      }
      
      const record = await this.container.recordRepository.findById(collectionName, params.recordId);
      return record as PocketBaseRecord;
    } catch (error) {
      console.error('Failed to load record:', error);
      return null;
    }
  }

  /**
   * 첫 번째 레코드 ID 가져오기
   */
  static async getFirstRecordId(collectionIdOrName: string): Promise<string | null> {
    try {
      const records = await this.loadRecordList(collectionIdOrName);
      return records.length > 0 ? records[0].id : null;
    } catch (error) {
      console.error('Failed to get first record:', error);
      return null;
    }
  }

  /**
   * 레코드 저장
   */
  static async saveRecord(
    collectionIdOrName: string, 
    recordId: string, 
    data: Partial<PocketBaseRecord>
  ): Promise<SaveResult> {
    try {
      // Collection ID인지 Name인지 확인하고 Name으로 변환
      let collectionName = collectionIdOrName;
      
      // ID 형식인지 확인 (PocketBase ID는 15자 랜덤 문자열)
      if (collectionIdOrName.length === 15 && /^[a-zA-Z0-9]+$/.test(collectionIdOrName)) {
        const name = await this.getCollectionNameById(collectionIdOrName);
        if (!name) {
          return {
            success: false,
            error: 'Collection not found for ID: ' + collectionIdOrName
          };
        }
        collectionName = name;
      }
      
      // 시스템 필드 제거
      const cleanData = this.cleanRecordData(data);
      
      // RecordDAO를 직접 사용하여 updateInCollection 호출
      const recordDAO = this.container.recordDAO as any;
      const updatedRecord = await recordDAO.updateInCollection(
        collectionName, 
        recordId, 
        cleanData
      );

      return {
        success: true,
        record: updatedRecord as PocketBaseRecord
      };
    } catch (error: any) {
      console.error('Failed to save record:', error);
      
      // PocketBase 유효성 검사 오류 처리
      if (error.data?.data) {
        const validationErrors: ValidationError[] = Object.entries(error.data.data).map(
          ([field, message]) => ({
            field,
            message: Array.isArray(message) ? message.join(', ') : String(message)
          })
        );
        
        return {
          success: false,
          error: 'Validation failed',
          validationErrors
        };
      }

      return {
        success: false,
        error: error.message || 'Failed to save record'
      };
    }
  }

  /**
   * 레코드에서 TypeScript 타입 생성
   */
  static generateTypesFromRecord(record: PocketBaseRecord): {
    generatedTypes: string;
    highlightedTypes: string;
  } {
    try {
      const typeResult = TypeGenerator.analyzeRecord(record, 'Record');
      const allCode = this.generateAllInterfacesCode(typeResult);
      const highlightedTypes = createHighlightedCode(allCode);

      return {
        generatedTypes: allCode,
        highlightedTypes
      };
    } catch (error) {
      console.error('Failed to generate types:', error);
      return {
        generatedTypes: '',
        highlightedTypes: ''
      };
    }
  }

  /**
   * 레코드 데이터 변경 감지
   */
  static hasRecordChanged(original: PocketBaseRecord, current: PocketBaseRecord): boolean {
    const originalClean = this.cleanRecordData(original);
    const currentClean = this.cleanRecordData(current);
    
    return JSON.stringify(originalClean) !== JSON.stringify(currentClean);
  }

  /**
   * 레코드 데이터 정리 (시스템 필드 제거)
   */
  private static cleanRecordData(data: Partial<PocketBaseRecord>): Record<string, any> {
    const { id, collectionId, collectionName, created, updated, ...cleanData } = data;
    return cleanData;
  }

  /**
   * 모든 인터페이스 코드 생성
   */
  private static generateAllInterfacesCode(mainInterface: any): string {
    const codes: string[] = [];
    
    if (mainInterface.nestedInterfaces) {
      mainInterface.nestedInterfaces.forEach((nested: any) => {
        codes.push(this.generateAllInterfacesCode(nested));
      });
    }
    
    codes.push(mainInterface.code);
    
    return codes.join('\n\n');
  }

  /**
   * 딥 클론
   */
  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * 필드 경로로 값 설정
   */
  static setValueByPath(obj: any, path: string[], value: any): any {
    const result = this.deepClone(obj);
    let current = result;
    
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[path[path.length - 1]] = value;
    return result;
  }

  /**
   * 필드 경로로 값 가져오기
   */
  static getValueByPath(obj: any, path: string[]): any {
    let current = obj;
    for (const key of path) {
      if (current == null || typeof current !== 'object') {
        return undefined;
      }
      current = current[key];
    }
    return current;
  }
}