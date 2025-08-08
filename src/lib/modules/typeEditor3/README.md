# TypeEditor3 - UI Only Module

TypeEditor3는 순수한 UI 컴포넌트와 샘플 데이터만 포함하는 모듈입니다.

## 📁 폴더 구조

```
src/lib/modules/typeEditor3/
├── components/                     # 순수 UI 컴포넌트들
│   ├── JsonEditor/
│   │   └── view.svelte            # JSON 편집 UI 컴포넌트
│   ├── CollectionSidebar/
│   │   └── view.svelte            # 컬렉션 사이드바 UI
│   ├── CollectionItem/
│   │   └── view.svelte            # 개별 컬렉션 아이템 UI
│   └── SidebarHeader/
│       └── view.svelte            # 사이드바 헤더 UI
│
├── types/
│   └── index.ts                   # 기본 타입 정의 및 샘플 데이터
├── README.md                      # 이 문서
└── index.ts                       # 모듈 진입점
```

## 🎨 UI 컴포넌트

### JsonEditor
- 재귀적 JSON 편집 UI
- 인라인 편집 기능
- 타입별 색상 구분

### CollectionSidebar
- 컬렉션 목록 표시
- 확장/축소 기능
- CollectionItem 컴포넌트 사용

### CollectionItem  
- 개별 컬렉션 표시
- 선택/핀/확장 상태 표시
- 이모지 아이콘 사용

### SidebarHeader
- 사이드바 제목 표시
- 호버 효과
- 커스터마이저블 아이콘

## 📦 Export

```typescript
// UI 컴포넌트들
import { 
  JsonEditorView,
  CollectionSidebarView, 
  CollectionItemView,
  SidebarHeaderView 
} from '$lib/modules/typeEditor3';

// 타입과 샘플 데이터
import { 
  type JsonData,
  sampleJsonData,
  sampleCollections 
} from '$lib/modules/typeEditor3';
```

## 🎯 사용 예시

```svelte
<script lang="ts">
  import { 
    JsonEditorView, 
    sampleJsonData 
  } from '$lib/modules/typeEditor3';

  let data = $state(sampleJsonData);
  
  const handleUpdate = (newData: any) => {
    data = newData;
    console.log('Updated:', data);
  };
</script>

<JsonEditorView 
  {data} 
  onUpdate={handleUpdate} 
/>
```

## ✨ 특징

- **순수 UI**: 비즈니스 로직 없음
- **Svelte 5**: 최신 runes 사용
- **타입 안전**: TypeScript 지원  
- **샘플 데이터**: 바로 사용 가능한 예제 데이터
- **재사용 가능**: 독립적인 컴포넌트들
- **반응형**: 상태 변화에 따른 UI 업데이트