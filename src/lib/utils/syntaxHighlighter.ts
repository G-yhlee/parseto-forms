/**
 * TypeScript 코드 구문 강조 유틸리티
 * 간단한 정규식 기반 하이라이터
 */

export interface HighlightToken {
  type: 'keyword' | 'type' | 'string' | 'comment' | 'punctuation' | 'identifier' | 'text';
  value: string;
}

export class SyntaxHighlighter {
  
  private static readonly KEYWORDS = [
    'interface', 'type', 'export', 'import', 'const', 'let', 'var', 
    'function', 'class', 'extends', 'implements', 'public', 'private', 
    'protected', 'readonly', 'static', 'abstract', 'async', 'await'
  ];
  
  private static readonly TYPES = [
    'string', 'number', 'boolean', 'object', 'any', 'unknown', 'void', 
    'null', 'undefined', 'never', 'Record', 'Array', 'Promise'
  ];
  
  /**
   * TypeScript 코드를 토큰으로 분리하고 하이라이트
   */
  static highlightTypeScript(code: string): HighlightToken[] {
    const tokens: HighlightToken[] = [];
    let remaining = code;
    let lineStart = true;
    
    while (remaining.length > 0) {
      let matched = false;
      
      // 주석 처리 (// 형태)
      if (remaining.startsWith('//')) {
        const match = remaining.match(/^\/\/.*$/m);
        if (match) {
          tokens.push({ type: 'comment', value: match[0] });
          remaining = remaining.slice(match[0].length);
          matched = true;
        }
      }
      
      // 문자열 처리 (작은따옴표, 큰따옴표)
      if (!matched && (remaining.startsWith('"') || remaining.startsWith("'"))) {
        const quote = remaining[0];
        const match = remaining.match(new RegExp(`^${quote}([^${quote}\\\\]|\\\\.)*${quote}`));
        if (match) {
          tokens.push({ type: 'string', value: match[0] });
          remaining = remaining.slice(match[0].length);
          matched = true;
        }
      }
      
      // 키워드 처리
      if (!matched) {
        for (const keyword of this.KEYWORDS) {
          const regex = new RegExp(`^${keyword}\\b`);
          if (regex.test(remaining)) {
            tokens.push({ type: 'keyword', value: keyword });
            remaining = remaining.slice(keyword.length);
            matched = true;
            break;
          }
        }
      }
      
      // 타입 처리
      if (!matched) {
        for (const type of this.TYPES) {
          const regex = new RegExp(`^${type}\\b`);
          if (regex.test(remaining)) {
            tokens.push({ type: 'type', value: type });
            remaining = remaining.slice(type.length);
            matched = true;
            break;
          }
        }
      }
      
      // 구두점 및 연산자 처리
      if (!matched) {
        const punctuation = remaining.match(/^[{}();:,\[\]<>|&?!+=\-*/\.]/);
        if (punctuation) {
          tokens.push({ type: 'punctuation', value: punctuation[0] });
          remaining = remaining.slice(1);
          matched = true;
        }
      }
      
      // 식별자 처리 (변수명, 함수명 등)
      if (!matched) {
        const identifier = remaining.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
        if (identifier) {
          tokens.push({ type: 'identifier', value: identifier[0] });
          remaining = remaining.slice(identifier[0].length);
          matched = true;
        }
      }
      
      // 공백 및 기타 문자 처리
      if (!matched) {
        const whitespace = remaining.match(/^\s+/);
        if (whitespace) {
          tokens.push({ type: 'text', value: whitespace[0] });
          remaining = remaining.slice(whitespace[0].length);
          matched = true;
        }
      }
      
      // 매칭되지 않은 문자 처리
      if (!matched) {
        tokens.push({ type: 'text', value: remaining[0] });
        remaining = remaining.slice(1);
      }
    }
    
    return tokens;
  }
  
  /**
   * 토큰을 HTML로 변환
   */
  static tokensToHtml(tokens: HighlightToken[]): string {
    return tokens.map(token => {
      const className = `syntax-${token.type}`;
      const escapedValue = this.escapeHtml(token.value);
      return `<span class="${className}">${escapedValue}</span>`;
    }).join('');
  }
  
  /**
   * HTML 이스케이프
   */
  private static escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  /**
   * 간단한 하이라이트 함수 (토큰화 없이)
   */
  static simpleHighlight(code: string): string {
    // 먼저 HTML 이스케이프
    let highlighted = this.escapeHtml(code);
    
    // 주석 하이라이트 (가장 먼저 처리)
    highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="syntax-comment">$&</span>');
    
    // 문자열 하이라이트
    highlighted = highlighted.replace(/"([^"\\]|\\.)*"/g, '<span class="syntax-string">$&</span>');
    highlighted = highlighted.replace(/'([^'\\]|\\.)*'/g, '<span class="syntax-string">$&</span>');
    
    // 키워드 하이라이트 (단어 경계에서만)
    this.KEYWORDS.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b(?![^<]*>)`, 'g');
      highlighted = highlighted.replace(regex, '<span class="syntax-keyword">$1</span>');
    });
    
    // 타입 하이라이트 (단어 경계에서만, HTML 태그 내부 제외)
    this.TYPES.forEach(type => {
      const regex = new RegExp(`\\b(${type})\\b(?![^<]*>)`, 'g');
      highlighted = highlighted.replace(regex, '<span class="syntax-type">$1</span>');
    });
    
    return highlighted;
  }
}

/**
 * Svelte 컴포넌트용 하이라이트 스토어
 */
export function createHighlightedCode(code: string): string {
  const tokens = SyntaxHighlighter.highlightTypeScript(code);
  return SyntaxHighlighter.tokensToHtml(tokens);
}