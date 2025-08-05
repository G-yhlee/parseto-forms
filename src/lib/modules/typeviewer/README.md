# TypeViewer Module

JSON을 TypeScript 인터페이스로 변환하고 인라인 편집 기능을 제공하는 독립적인 모듈입니다.

## 아키텍처

```
typeviewer/
├── components/          # UI 컴포넌트
│   └── JsonEditor.svelte
├── services/           # 비즈니스 로직
│   └── TypeViewerService.ts
├── stores/             # 상태 관리
│   └── typeViewerStore.svelte.ts
├── utils/              # 유틸리티 함수
│   ├── typeGenerator.ts
│   ├── pluralizer.ts
│   └── syntaxHighlighter.ts
├── types/              # 타입 정의
│   └── index.ts
└── index.ts            # 모듈 진입점
```

## 사용법

### 기본 사용

```typescript
import { 
  JsonEditor, 
  TypeViewerService, 
  createTypeViewerStore 
} from '$lib/modules/typeviewer';

// 스토어 생성
const store = createTypeViewerStore();

// JSON 처리
const result = TypeViewerService.processJsonInput(jsonString);
```

### 컴포넌트 사용

```svelte
<script>
  import { JsonEditor } from '$lib/modules/typeviewer';
  
  let data = { name: "example" };
  
  function handleUpdate(newData) {
    data = newData;
  }
</script>

<JsonEditor {data} onUpdate={handleUpdate} />
```

### 유틸리티 사용

```typescript
import { TypeGenerator, Pluralizer } from '$lib/modules/typeviewer';

// 타입 생성
const interface = TypeGenerator.analyzeRecord(data, 'MyInterface');

// 복수형 변환
const singular = Pluralizer.toSingular('books'); // 'book'
```

## 특징

- **독립성**: 다른 모듈과 의존성 없이 동작
- **재사용성**: 다른 프로젝트에서도 쉽게 사용 가능
- **타입 안전성**: 완전한 TypeScript 지원
- **모듈화**: 기능별로 명확히 분리된 구조
- **확장성**: 새로운 기능 추가가 용이

## API 레퍼런스

### TypeViewerService

- `processJsonInput(jsonInput: string)`: JSON을 파싱하고 타입 생성
- `updateJsonData(newData: JsonData)`: JSON 데이터 업데이트
- `copyToClipboard(text: string)`: 클립보드 복사
- `formatJson(jsonInput: string)`: JSON 포맷팅

### TypeGenerator

- `analyzeRecord(record: object, interfaceName: string)`: 단일 레코드 분석
- `analyzeRecords(records: object[], interfaceName: string)`: 다중 레코드 분석

### Pluralizer

- `toSingular(plural: string)`: 복수형을 단수형으로 변환
- `isArrayFieldName(fieldName: string)`: 배열 필드명 확인
- `getTypeNameFromArrayField(fieldName: string)`: 배열 필드에서 타입명 생성