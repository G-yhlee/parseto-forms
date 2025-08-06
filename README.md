# Parseto Forms

## TypeEditor2 Module Structure

TypeEditor2는 Uniform Defs Pattern을 사용하여 구조화된 모듈입니다.

### Folder Structure

```
src/lib/modules/typeEditor2/
├── controllers/                    # 컨트롤러 레이어
│   ├── applicationDefs.ts          # 애플리케이션 레이어 - 컴포넌트 조합과 워크플로우 관리
│   └── infrastructureDefs.ts       # 인프라스트럭처 레이어 - 서비스들과 공통 유틸리티 관리
│
├── components/                     # UI 컴포넌트들 (Uniform Defs Pattern)
│   ├── CollectionSidebar/
│   │   ├── state.svelte.ts         # 상태 관리 ($state, $derived)
│   │   ├── controller.ts           # 비즈니스 로직 (genDefs 함수)
│   │   └── view.svelte            # UI 컴포넌트
│   │
│   ├── JsonEditor/                 # 간단한 JSON 에디터
│   ├── JsonEditorWithDefs/         # Defs 패턴을 사용한 JSON 에디터
│   ├── RecordList/                 # 레코드 목록 관리
│   ├── TypeEditorLayout/           # 메인 레이아웃
│   │
│   └── Sub-Components/             # 하위 컴포넌트들
│       ├── SidebarHeader/          # 사이드바 헤더
│       ├── CollectionItem/         # 개별 컬렉션 아이템
│       └── RecordsList/            # 레코드 리스트
│
├── services/                       # 서비스 레이어 (Uniform Defs Pattern)
│   ├── RecordService/
│   │   ├── state.svelte.ts         # 레코드 관련 상태 관리
│   │   └── controller.ts           # 레코드 서비스 로직
│   │
│   ├── CollectionService/
│   │   ├── state.svelte.ts         # 컬렉션 관련 상태 관리
│   │   ├── controller.ts           # 컬렉션 서비스 로직
│   │   └── PinnedCollectionsService.ts  # 핀된 컬렉션 관리
│   │
│   └── TypeGenerationService/
│       ├── state.svelte.ts         # 타입 생성 관련 상태
│       └── controller.ts           # 타입 생성 서비스
│
├── types.ts                        # 공통 타입 정의
└── index.ts                        # 모듈 진입점
```

### Architecture Pattern - Uniform Defs Pattern

각 컴포넌트와 서비스는 일관된 구조를 따릅니다:

#### 1. State Layer (`state.svelte.ts`)
- Svelte 5 runes 사용 (`$state`, `$derived`, `$effect`)
- 순수한 상태 관리만 담당
- 상태 변경 액션들 제공

#### 2. Controller Layer (`controller.ts`)
- `genXXXDefs()` 함수로 defs 패턴 구현
- 비즈니스 로직과 상태 조합
- `{ datas, states, actions }` 객체 반환

#### 3. View Layer (`view.svelte`)
- 순수한 UI 컴포넌트
- Props로 데이터 받고 이벤트 emit
- 컨트롤러에서 생성된 defs 사용

### Controller Layers

#### Infrastructure Layer (`infrastructureDefs.ts`)
- **역할**: 서비스들과 공통 유틸리티 관리
- **제공**: 
  - 서비스 인스턴스들 (RecordService, CollectionService, TypeGenerationService)
  - 공통 유틸리티 (formatDate, getRecordPreview, deepClone)
  - 서비스 액션 래핑

#### Application Layer (`applicationDefs.ts`)
- **역할**: 컴포넌트 조합과 워크플로우 관리
- **제공**:
  - 컴포넌트 defs 통합
  - 통합된 데이터 인터페이스
  - 전체 애플리케이션 워크플로우 관리

### Usage Example

```typescript
// 애플리케이션 진입점
import { genApplicationDefs } from '$lib/modules/typeEditor2';

const defs = genApplicationDefs();
const { datas, states, actions } = defs;

// 컬렉션 선택 → 레코드 로드 → 편집의 전체 워크플로우
await actions.onCollectionSelect(collection);
await actions.onRecordSelect(recordId);
actions.onJsonUpdate(newData);
```

### Key Features

- **일관된 패턴**: 모든 컴포넌트가 동일한 state/controller/view 구조
- **선언적 접근**: genDefs 함수로 상태와 액션을 미리 정의
- **관심사 분리**: 상태, 로직, UI가 명확히 분리
- **타입 안전성**: TypeScript로 전체 인터페이스 타입 정의
- **재사용성**: 컴포넌트와 서비스의 독립적 사용 가능

### ref

- https://github.com/ritz078/transform/
