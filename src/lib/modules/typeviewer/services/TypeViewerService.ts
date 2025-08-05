/**
 * TypeViewer 서비스 레이어
 * 비즈니스 로직과 유틸리티 함수들을 통합 관리
 */

import { TypeGenerator } from '../utils/typeGenerator';
import { createHighlightedCode } from '../utils/syntaxHighlighter';
import type { JsonData, GeneratedInterface, TypeViewerState } from '../types';

export class TypeViewerService {
  /**
   * JSON 문자열을 파싱하고 TypeScript 타입을 생성
   */
  static processJsonInput(jsonInput: string): {
    success: boolean;
    parsedData?: JsonData;
    generatedTypes?: string;
    highlightedTypes?: string;
    error?: string;
  } {
    try {
      const parsedJson = JSON.parse(jsonInput);
      const typeResult = TypeGenerator.analyzeRecord(parsedJson, 'Root');
      const allCode = this.generateAllInterfacesCode(typeResult);
      const highlightedTypes = createHighlightedCode(allCode);

      return {
        success: true,
        parsedData: parsedJson,
        generatedTypes: allCode,
        highlightedTypes
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Invalid JSON'
      };
    }
  }

  /**
   * 모든 인터페이스 코드 생성
   */
  private static generateAllInterfacesCode(mainInterface: GeneratedInterface): string {
    const codes: string[] = [];
    
    // 중첩된 인터페이스들 먼저 추가
    if (mainInterface.nestedInterfaces) {
      mainInterface.nestedInterfaces.forEach((nested: GeneratedInterface) => {
        codes.push(this.generateAllInterfacesCode(nested));
      });
    }
    
    // 메인 인터페이스 추가
    codes.push(mainInterface.code);
    
    return codes.join('\n\n');
  }

  /**
   * JSON 데이터 업데이트 처리
   */
  static updateJsonData(newData: JsonData): {
    jsonInput: string;
    generatedTypes: string;
    highlightedTypes: string;
  } {
    const jsonInput = JSON.stringify(newData, null, 2);
    const result = this.processJsonInput(jsonInput);
    
    return {
      jsonInput,
      generatedTypes: result.generatedTypes || '',
      highlightedTypes: result.highlightedTypes || ''
    };
  }

  /**
   * 클립보드 복사
   */
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  }

  /**
   * JSON 형식 정리
   */
  static formatJson(jsonInput: string): string {
    try {
      return JSON.stringify(JSON.parse(jsonInput), null, 2);
    } catch {
      return jsonInput;
    }
  }
}