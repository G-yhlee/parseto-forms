# TypeEditor Module

PocketBase 컬렉션의 레코드를 직접 편집하고 TypeScript 타입을 실시간으로 생성하는 모듈입니다.

## 아키텍처

```
typeeditor/
├── components/          # UI 컴포넌트
│   └── TypeEditor.svelte
├── services/           # 비즈니스 로직
│   └── TypeEditorService.ts
├── stores/             # 상태 관리
│   └── typeEditorStore.svelte.ts
├── types/              # 타입 정의
│   └── index.ts
└── index.ts            # 모듈 진입점
```

## 기능

- **레코드 로드**: PocketBase에서 특정 레코드 가져오기
- **실시간 편집**: JsonEditor를 통한 인라인 데이터 편집
- **타입 생성**: 편집된 데이터에서 TypeScript 인터페이스 자동 생성
- **변경 감지**: 원본 데이터와 비교하여 변경사항 추적
- **저장 기능**: PocketBase에 변경사항 저장
- **에러 처리**: 유효성 검사 및 네트워크 오류 처리

## URL 형식

```
/typeeditor?collection=컬렉션ID&recordId=레코드ID&filter=필터&sort=정렬
```

### 예시
```
/typeeditor?collection=pbc_117015758&recordId=009268273c6045089f840e1899fdab9e&filter=&sort=-%40rowid
```

## 사용법

### 기본 사용

```typescript
import { 
  TypeEditor, 
  TypeEditorService, 
  createTypeEditorStore 
} from '$lib/modules/typeeditor';

// URL 파라미터 파싱
const params = TypeEditorService.parseUrlParams(searchParams);

// 스토어 생성
const store = createTypeEditorStore();

// 레코드 로드
await store.loadRecord(params);
```

### 컴포넌트 사용

```svelte
<script>
  import { TypeEditor } from '$lib/modules/typeeditor';
  
  function handleRecordUpdate(newRecord) {
    // 레코드 업데이트 처리
  }
  
  async function handleSave() {
    // 저장 처리
  }
</script>

<TypeEditor 
  record={record}
  onUpdate={handleRecordUpdate}
  onSave={handleSave}
  hasChanges={hasChanges}
  saving={saving}
  generatedTypes={generatedTypes}
  highlightedTypes={highlightedTypes}
/>
```

## 특징

- **PocketBase 통합**: 기존 PocketBase 서비스와 완전 통합
- **실시간 타입 생성**: 데이터 변경 시 즉시 TypeScript 타입 업데이트
- **변경사항 추적**: 원본과 현재 데이터 비교로 정확한 변경 감지
- **에러 처리**: PocketBase 유효성 검사 오류 처리
- **반응형 UI**: 모바일에서도 사용 가능한 반응형 디자인

## API 레퍼런스

### TypeEditorService

- `parseUrlParams(searchParams)`: URL 파라미터 파싱
- `loadRecord(params)`: 레코드 로드
- `saveRecord(collection, recordId, data)`: 레코드 저장
- `generateTypesFromRecord(record)`: 타입 생성
- `hasRecordChanged(original, current)`: 변경사항 감지

### TypeEditorStore

- `loadRecord(params)`: 레코드 로드
- `updateRecord(newRecord)`: 레코드 업데이트
- `updateFieldByPath(path, value)`: 특정 필드 업데이트
- `saveRecord(collection, recordId)`: 레코드 저장
- `revertChanges()`: 변경사항 되돌리기
- `checkChanges()`: 변경사항 확인

## 컴포넌트 구조

```
TypeEditor
├── Header (제목, 메타정보, 액션 버튼)
├── Left Panel (데이터 편집기)
│   ├── View Mode (JSON 보기)
│   └── Edit Mode (JsonEditor)
└── Right Panel (생성된 TypeScript 타입)
```

## 에러 처리

- **네트워크 오류**: 연결 실패 시 재시도 안내
- **유효성 검사**: PocketBase 규칙 위반 시 상세 메시지
- **권한 오류**: 접근 권한 없을 시 안내
- **데이터 오류**: 잘못된 JSON 형식 등 데이터 문제

## 의존성

- TypeViewer 모듈 (타입 생성 및 JsonEditor)
- PocketBase 서비스 (레코드 CRUD)
- Svelte 5 (반응형 상태 관리)