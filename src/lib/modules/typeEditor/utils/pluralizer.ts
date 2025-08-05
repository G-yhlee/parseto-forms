/**
 * 복수형 ↔ 단수형 변환 유틸리티
 */

export class Pluralizer {
  // 불규칙 복수형 매핑
  private static readonly IRREGULAR_PLURALS: Record<string, string> = {
    'people': 'person',
    'children': 'child',
    'men': 'man',
    'women': 'woman',
    'teeth': 'tooth',
    'feet': 'foot',
    'mice': 'mouse',
    'geese': 'goose',
    'oxen': 'ox',
    'criteria': 'criterion',
    'phenomena': 'phenomenon',
    'data': 'datum',
    'media': 'medium',
    'analyses': 'analysis',
    'theses': 'thesis',
    'crises': 'crisis',
    'diagnoses': 'diagnosis',
    'parentheses': 'parenthesis',
    'emphases': 'emphasis',
    'neuroses': 'neurosis',
    'oases': 'oasis',
    'axes': 'axis',
    'atlases': 'atlas'
  };

  // 복수형 변환 규칙
  private static readonly PLURAL_RULES: Array<[RegExp, string]> = [
    // -ies → -y
    [/ies$/i, 'y'],
    // -ves → -f, -fe
    [/ves$/i, 've'],
    // -oes → -o
    [/oes$/i, 'o'],
    // -sses → -ss
    [/sses$/i, 'ss'],
    // -shes → -sh
    [/shes$/i, 'sh'],
    // -ches → -ch
    [/ches$/i, 'ch'],
    // -xes → -x
    [/xes$/i, 'x'],
    // -ses → -s (일부 경우)
    [/ses$/i, 's'],
    // -s → '' (일반적인 경우)
    [/s$/i, '']
  ];

  /**
   * 복수형을 단수형으로 변환
   */
  static toSingular(plural: string): string {
    if (!plural) return plural;
    
    const lower = plural.toLowerCase();
    
    // 불규칙 복수형 확인
    if (this.IRREGULAR_PLURALS[lower]) {
      // 원래 대소문자 유지
      const singular = this.IRREGULAR_PLURALS[lower];
      return plural[0] === plural[0].toUpperCase() 
        ? singular.charAt(0).toUpperCase() + singular.slice(1)
        : singular;
    }
    
    // 이미 단수형인 경우 (s로 끝나지 않음)
    if (!lower.endsWith('s')) {
      return plural;
    }
    
    // 규칙 기반 변환
    for (const [pattern, replacement] of this.PLURAL_RULES) {
      if (pattern.test(lower)) {
        const result = plural.replace(pattern, replacement);
        // items → item과 같은 일반적인 경우 처리
        if (result === plural.slice(0, -1)) {
          return result;
        }
        return result;
      }
    }
    
    // 기본값: 마지막 s 제거
    return plural.slice(0, -1);
  }

  /**
   * 배열 필드명인지 확인 (복수형 또는 List/Array로 끝남)
   */
  static isArrayFieldName(fieldName: string): boolean {
    const lower = fieldName.toLowerCase();
    
    // List, Array로 끝나는 경우
    if (lower.endsWith('list') || lower.endsWith('array')) {
      return true;
    }
    
    // 복수형 패턴 확인
    // s로 끝나거나 불규칙 복수형인 경우
    return lower.endsWith('s') || !!this.IRREGULAR_PLURALS[lower];
  }

  /**
   * 배열 필드명에서 타입명 생성
   * 예: books → Book, userList → User
   */
  static getTypeNameFromArrayField(fieldName: string): string {
    let typeName = fieldName;
    
    // List, Array 접미사 제거
    if (fieldName.toLowerCase().endsWith('list')) {
      typeName = fieldName.slice(0, -4);
    } else if (fieldName.toLowerCase().endsWith('array')) {
      typeName = fieldName.slice(0, -5);
    }
    
    // 단수형으로 변환
    typeName = this.toSingular(typeName);
    
    // PascalCase로 변환
    return typeName.charAt(0).toUpperCase() + typeName.slice(1);
  }
}