# Uniform Defs Pattern - AI 협업 가이드

## 개요

typeEditor2 모듈에서 사용하는 선언적 아키텍처 패턴입니다. 일관성 있는 구조로 Svelte 5 애플리케이션을 구축하며, 관심사의 명확한 분리를 제공합니다.

## 🎯 AI 협업을 위한 핵심 명령어

### 새 컴포넌트 생성
```
"[ComponentName] 컴포넌트를 Uniform Defs 패턴으로 생성해줘:
- State: [상태 관리 요구사항]
- Controller: [비즈니스 로직 요구사항]  
- View: [UI 요구사항]
- 3개 파일 구조로 만들고, 뷰에서 모든 데이터 접근은 함수 호출로 해줘"
```

### 서비스 추가
```
"[ServiceName]Service를 만들어줘:
- SvelteMap으로 캐싱 처리
- genXXXServiceDefs 함수로 export
- infrastructure layer와 통합
- 비동기 작업은 에러 처리 포함"
```

### 기존 컴포넌트 수정
```
"[ComponentName]에 [기능] 추가해줘:
- state.svelte.ts에 필요한 상태 추가
- controller.ts에 액션 구현
- view.svelte에서 datas.xxx(), states.xxx(), actions.xxx() 패턴 유지"
```

## 📁 파일 구조 패턴

### 컴포넌트 구조 (3파일 시스템)
```
ComponentName/
├── state.svelte.ts     # 순수 상태 관리
├── controller.ts       # 비즈니스 로직 (genXXXDefs 함수)
└── view.svelte        # 순수 UI 프레젠테이션
```

### 서비스 구조
```
ServiceName/
├── state.svelte.ts     # 서비스 상태 & 캐시
└── controller.ts       # 서비스 로직 (genXXXServiceDefs)
```

### 전체 아키텍처
```
typeEditor2/
├── components/         # UI 컴포넌트들
├── services/          # 비즈니스 서비스들
├── controllers/       # 레이어 오케스트레이션
│   ├── applicationDefs.ts    # 앱 레벨 통합
│   └── infrastructureDefs.ts # 서비스 레벨 통합
├── types/            # 타입 정의
└── index.ts          # 모듈 진입점
```

## 🔧 코드 템플릿

### State 파일 템플릿 (state.svelte.ts)
```typescript
export const create[ComponentName]State = () => {
	// Svelte 5 runes로 상태 선언
	let data = $state<DataType>(initialValue);
	let loading = $state(false);
	let error = $state<string | null>(null);
	
	// 계산된 값
	let computedValue = $derived.by(() => {
		// 복잡한 계산 로직
		return processData(data);
	});
	
	// SvelteMap 사용한 캐시 (필요시)
	let cache = new SvelteMap<string, any>();
	
	return {
		// 읽기 전용 getter들
		get data() { return data; },
		get loading() { return loading; },
		get error() { return error; },
		get computedValue() { return computedValue; },
		get cache() { return cache; },
		
		// 상태 변경 함수들
		setData: (newData: DataType) => { data = newData; },
		setLoading: (isLoading: boolean) => { loading = isLoading; },
		setError: (errorMsg: string | null) => { error = errorMsg; },
		
		// 캐시 조작
		updateCache: (key: string, value: any) => {
			const newCache = new SvelteMap(cache);
			newCache.set(key, value);
			cache = newCache;
		}
	};
};

// Props 인터페이스 정의
export interface ComponentNameProps {
	prop1: string;
	prop2?: number;
	onEvent?: (data: any) => void;
}
```

### Controller 파일 템플릿 (controller.ts)
```typescript
import { create[ComponentName]State, type ComponentNameProps } from './state.svelte';

// 타입 re-export (중요!)
export type { ComponentNameProps } from './state.svelte';

export const gen[ComponentName]Defs = (props: ComponentNameProps = {}) => {
	const state = create[ComponentName]State();
	
	// 기본값 설정
	const defaultProps = {
		prop1: 'default',
		prop2: 0,
		...props
	};
	
	return {
		// 데이터 접근자 (모두 함수!)
		datas: {
			data: () => state.data,
			computedValue: () => state.computedValue,
			prop1: () => defaultProps.prop1,
			prop2: () => defaultProps.prop2
		},
		
		// 상태 확인자
		states: {
			loading: () => state.loading,
			hasError: () => state.error !== null,
			hasData: () => state.data !== null
		},
		
		// 액션 실행자
		actions: {
			loadData: async () => {
				state.setLoading(true);
				state.setError(null);
				try {
					// 비즈니스 로직 구현
					const result = await fetchData();
					state.setData(result);
				} catch (error) {
					state.setError(error.message);
				} finally {
					state.setLoading(false);
				}
			},
			
			handleEvent: (data: any) => {
				if (defaultProps.onEvent) {
					defaultProps.onEvent(data);
				}
			}
		}
	};
};
```

### View 파일 템플릿 (view.svelte)
```svelte
<script lang="ts">
	import { gen[ComponentName]Defs, type ComponentNameProps } from './controller';
	
	// Props 정의
	interface Props extends ComponentNameProps {}
	const props: Props = $props();
	
	// Defs 생성 및 구조분해
	const defs = gen[ComponentName]Defs(props);
	const { datas, states, actions } = defs;
</script>

<!-- 순수 선언적 UI -->
<div class="component-name">
	{#if states.loading()}
		<div class="loading">Loading...</div>
	{:else if states.hasError()}
		<div class="error">Error occurred</div>
	{:else if states.hasData()}
		<div class="content">
			<h2>{datas.prop1()}</h2>
			<p>{datas.computedValue()}</p>
			<button onclick={actions.loadData}>Reload</button>
		</div>
	{:else}
		<div class="empty">No data</div>
	{/if}
</div>

<style>
	.component-name {
		/* 스타일링 */
	}
</style>
```

### 서비스 템플릿
```typescript
// services/ServiceName/controller.ts
export const gen[ServiceName]ServiceDefs = () => {
	const state = create[ServiceName]ServiceState();
	const common = genCommonServiceDefs();
	
	return {
		datas: {
			cachedData: () => Array.from(state.cache.values()),
			loading: () => state.loading
		},
		
		states: {
			hasCache: () => state.cache.size > 0,
			isLoading: () => state.loading
		},
		
		actions: {
			loadData: async (params: LoadParams) => {
				// 캐시 확인
				if (state.cache.has(params.id)) {
					return state.cache.get(params.id);
				}
				
				// API 호출
				state.setLoading(true);
				try {
					const result = await common.infrastructure.api.fetch(params);
					state.updateCache(params.id, result);
					return result;
				} finally {
					state.setLoading(false);
				}
			}
		}
	};
};
```

## 🚫 주의사항 및 안티패턴

### ❌ 하지 말 것
```svelte
<!-- 잘못된 예: 직접 상태 접근 -->
<script>
	const state = createComponentState();  // ❌
	let data = state.data;  // ❌
</script>

<div>{data}</div>  <!-- ❌ -->
```

```typescript
// 잘못된 예: Props 직접 사용
export const genComponentDefs = (props) => {
	return {
		datas: {
			title: props.title  // ❌ 함수가 아님
		}
	};
};
```

### ✅ 올바른 예
```svelte
<!-- 올바른 예: Defs 패턴 사용 -->
<script>
	const defs = genComponentDefs(props);  // ✅
	const { datas, states, actions } = defs;  // ✅
</script>

<div>{datas.data()}</div>  <!-- ✅ 함수 호출 -->
```

```typescript
// 올바른 예: 함수로 반환
export const genComponentDefs = (props) => {
	return {
		datas: {
			title: () => props.title  // ✅ 함수로 반환
		}
	};
};
```

## 📋 체크리스트

새 컴포넌트 작성 시 확인할 것:

- [ ] 3개 파일 구조 (state/controller/view)
- [ ] state.svelte.ts에 Props 인터페이스 정의
- [ ] controller.ts에서 타입 re-export
- [ ] controller에서 genXXXDefs 함수 export
- [ ] view에서 datas(), states(), actions() 함수 호출만 사용
- [ ] $state, $derived 등 Svelte 5 runes 사용
- [ ] SvelteMap/SvelteSet을 반응형 컬렉션으로 사용
- [ ] infrastructure layer 의존성 주입

## 🤖 AI 협업 베스트 프랙티스

### 효과적인 명령 예시
```
"RecordList 컴포넌트를 만들어줘:
- records 배열을 표시하고 선택 기능
- 로딩/에러 상태 관리
- 필터링과 정렬 기능
- selectedRecord를 부모에게 알림
- Uniform Defs 패턴으로 3파일 구조
- SvelteMap으로 성능 최적화"
```

### 수정 요청 시
```
"CollectionSidebar의 actions에 pinCollection 기능 추가해줘:
- state에 pinned collections Set 추가
- localStorage에 영구 저장
- 핀된 항목은 목록 상단에 표시
- 핀 버튼 UI 추가"
```

### 디버깅 요청 시
```
"TypeEditorLayout에서 컬렉션 선택 시 records가 안 펼쳐지는 문제:
- states.isCollectionExpanded() 함수 확인
- toggleCollectionRecords 액션 로직 점검  
- expandedCollections SvelteSet 상태 변화 추적"
```

이 문서를 참고하면 AI와 효과적으로 협업하여 Uniform Defs 패턴을 활용한 컴포넌트를 만들고 수정할 수 있습니다.