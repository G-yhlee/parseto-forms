# AI 협업 명령어 가이드 - Uniform Defs Pattern

## 🎯 목적별 명령어 템플릿

### 1. 새 컴포넌트 생성

#### 기본 템플릿
```
"[ComponentName] 컴포넌트를 Uniform Defs 패턴으로 생성:
- 기능: [구체적인 기능 설명]
- Props: [필요한 props 나열]
- State: [관리할 상태들]
- Actions: [구현할 액션들]
- 3파일 구조(state/controller/view)로 생성"
```

#### 실제 사용 예시
```
"UserProfile 컴포넌트를 Uniform Defs 패턴으로 생성:
- 기능: 사용자 정보 표시 및 인라인 편집
- Props: userId, editable?, onSave?
- State: user 정보, editing 모드, loading, validation errors  
- Actions: loadUser, toggleEdit, saveChanges, validateField
- 3파일 구조로 생성하고 infrastructure layer와 통합"
```

### 2. 서비스 생성

#### 기본 템플릿
```
"[ServiceName]Service를 생성:
- 담당 도메인: [도메인 설명]
- 캐싱 전략: SvelteMap으로 [캐시할 데이터] 캐싱
- API 연동: [연동할 API들]
- 에러 처리: [에러 처리 방식]
- genXXXServiceDefs 함수로 export"
```

#### 실제 사용 예시
```
"UserService를 생성:
- 담당 도메인: 사용자 관리 (CRUD, 인증)
- 캐싱 전략: SvelteMap으로 사용자 정보와 권한 캐싱
- API 연동: /api/users, /api/auth 엔드포인트  
- 에러 처리: validation 에러와 network 에러 분리
- localStorage 연동으로 로그인 상태 유지"
```

### 3. 기존 컴포넌트 수정

#### 기능 추가
```
"[ComponentName]에 [기능명] 기능 추가:
- state.svelte.ts: [추가할 상태]
- controller.ts: [추가할 액션/로직]  
- view.svelte: [UI 변경사항]
- 기존 패턴 유지하며 확장"
```

#### 실제 사용 예시
```
"CollectionSidebar에 즐겨찾기 기능 추가:
- state.svelte.ts: favoriteCollections SvelteSet 추가
- controller.ts: toggleFavorite, loadFavorites 액션 추가
- view.svelte: 별표 아이콘과 클릭 이벤트 추가  
- localStorage에 즐겨찾기 상태 저장"
```

### 4. 버그 수정

#### 디버깅 요청
```
"[ComponentName]에서 [문제 현상] 이슈 해결:
- 예상 동작: [정상 동작]
- 실제 현상: [버그 현상] 
- 관련 코드: [의심되는 부분]
- Uniform Defs 패턴 관점에서 상태/액션 흐름 점검"
```

#### 실제 사용 예시
```
"TypeEditorLayout에서 컬렉션 클릭 시 records 안 펼쳐지는 이슈:
- 예상 동작: chevron 버튼 클릭 시 records 목록 펼쳐짐
- 실제 현상: 클릭해도 expandedCollections 상태 안 변함
- 관련 코드: toggleCollectionRecords 액션, isCollectionExpanded 상태
- SvelteSet 반응성과 토글 로직 점검"
```

## 🔧 상황별 세부 명령어

### 상태 관리 관련

#### 새로운 상태 추가
```
"[ComponentName] state에 [상태명] 추가:
- 타입: [데이터 타입]
- 초기값: [초기값]
- getter/setter 함수 추가
- $derived로 연관 계산값이 있다면 함께"
```

#### 캐시 로직 추가
```
"[ServiceName]에 SvelteMap 캐싱 추가:
- 캐시 키: [키 생성 전략]
- TTL: [캐시 만료 시간]
- 무효화 조건: [캐시 초기화 조건들]
- 메모리 최적화 고려"
```

### UI 패턴 관련

#### 리스트 컴포넌트
```
"[ListComponentName] 생성 - 표준 리스트 패턴 적용:
- 데이터: [아이템 타입] 배열
- 기능: 선택, 필터링, 정렬, 페이징
- 로딩/빈 상태 처리
- 가상화 스크롤링 (성능 최적화)
- 키보드 네비게이션 지원"
```

#### 폼 컴포넌트  
```
"[FormComponentName] 생성 - 표준 폼 패턴 적용:
- 필드: [필드 목록과 타입들]
- 검증: [검증 규칙들]  
- 상태: editing, validating, saving
- 자동 저장 또는 명시적 저장
- 변경 사항 추적 및 경고"
```

### 성능 최적화 관련

#### 메모이제이션 추가
```
"[ComponentName]의 [연산명] 성능 최적화:
- $derived.by() 사용한 메모이제이션
- 의존성 최소화
- 불필요한 재계산 방지
- 성능 측정 가능한 로깅 추가"
```

#### 번들 최적화
```
"[ModuleName] 코드 스플리팅 최적화:
- 동적 import로 지연 로딩
- 공통 의존성 분리
- Tree-shaking 최적화
- 번들 사이즈 분석"
```

## 📝 컨텍스트 설정 명령어

### 프로젝트 컨텍스트 로딩
```
"Parseto Forms의 typeEditor2 모듈 작업 시작:
- Uniform Defs Pattern 사용
- Svelte 5 runes 활용  
- 3파일 구조 (state/controller/view)
- infrastructure/application layer 구조
- /docs/UNIFORM_DEFS_PATTERN.md 참고"
```

### 기존 컴포넌트 분석
```
"[ComponentPath] 컴포넌트 구조 분석:
- 현재 state/props/actions 파악
- Uniform Defs 패턴 적용 상태 점검
- 개선점이나 리팩토링 필요 부분 식별
- 의존성과 데이터 흐름 매핑"
```

### 아키텍처 일관성 체크
```
"typeEditor2 모듈 전체 일관성 검토:
- 모든 컴포넌트가 Uniform Defs 패턴 따르는지
- 타입 export/import 올바른지  
- SvelteMap/SvelteSet 반응성 제대로 사용하는지
- infrastructure layer 의존성 올바른지"
```

## 🚨 문제 해결 명령어

### 타입 에러 해결
```
"TypeScript 에러 '[에러 메시지]' 해결:
- 파일: [파일 경로]
- 에러 위치: [라인/컬럼] 
- Uniform Defs 패턴 타입 규칙 적용
- Props 인터페이스 및 re-export 확인"
```

### 반응성 이슈 해결  
```
"[ComponentName] 반응성 문제 해결:
- 증상: [반응하지 않는 상황]
- 관련 상태: [문제 상태들]
- SvelteMap/SvelteSet 사용법 검토  
- $derived 의존성 체인 점검"
```

### 성능 문제 해결
```
"[ComponentName] 성능 이슈 진단 및 해결:
- 문제: [느린 부분/메모리 누수 등]
- 프로파일링 결과: [성능 데이터]
- 최적화 전략: [캐싱/메모이제이션/가상화]
- 측정 가능한 개선 방안 제시"
```

## 💡 고급 활용 명령어

### 패턴 적용 및 마이그레이션
```
"[기존 컴포넌트]를 Uniform Defs 패턴으로 마이그레이션:
- 현재 구조 분석
- 단계별 마이그레이션 계획  
- 기능 보전하며 패턴 적용
- 테스트 케이스 유지"
```

### 복잡한 상태 흐름 설계
```
"[WorkflowName] 복잡한 워크플로우 구현:
- 상태 기계 패턴 적용 검토
- 여러 컴포넌트 간 상태 동기화
- 에러 경계와 복구 로직
- 사용자 경험 최적화"
```

### 테스트 코드 생성
```
"[ComponentName] 컴포넌트 테스트 코드 생성:
- Unit 테스트: state/controller 개별 테스트
- Integration 테스트: defs 전체 흐름 테스트
- UI 테스트: view 컴포넌트 렌더링 테스트
- Mock 및 fixture 데이터 포함"
```

이 명령어 가이드를 사용하면 AI와 더 효과적으로 소통하여 Uniform Defs 패턴을 활용한 개발을 할 수 있습니다.