# 컨텍스트 엔지니어링 - AI 협업 최적화 가이드

## 🧠 AI 협업을 위한 컨텍스트 설계

### 프로젝트 컨텍스트 초기화

#### 세션 시작 시 필수 컨텍스트
```
"Parseto Forms 프로젝트 작업 시작:

📁 프로젝트 구조:
- Svelte 5 기반 웹 애플리케이션  
- typeEditor2 모듈 = Uniform Defs Pattern 사용
- 선언적 프로그래밍 중심 아키텍처

🏗️ 아키텍처 패턴:
- 3파일 구조: state.svelte.ts / controller.ts / view.svelte
- Defs 패턴: { datas, states, actions } 객체 반환
- 함수 호출 기반 데이터 접근: datas.xxx(), states.xxx()
- SvelteMap/SvelteSet으로 반응형 컬렉션 관리

📋 참고 문서:
- /docs/UNIFORM_DEFS_PATTERN.md
- /docs/AI_COLLABORATION_COMMANDS.md

🎯 작업 원칙:
- 일관성 있는 패턴 유지
- 타입 안정성 확보  
- 반응성 보장
- 관심사 분리"
```

### 작업별 세부 컨텍스트

#### 새 컴포넌트 개발 시
```
"[ComponentName] 컴포넌트 개발 컨텍스트:

🎯 목표: [구체적인 기능 목표]
🔧 기술 요구사항:
- Uniform Defs Pattern 적용
- TypeScript 타입 안정성
- Svelte 5 runes 활용
- [특별한 기술적 요구사항]

📋 체크리스트:
- [ ] state.svelte.ts: Props 인터페이스 정의
- [ ] controller.ts: 타입 re-export, genXXXDefs 함수
- [ ] view.svelte: 함수 호출로만 데이터 접근
- [ ] infrastructure layer 통합
- [ ] 에러 처리 및 로딩 상태

🔗 연관 컴포넌트: [관련 컴포넌트들]
📊 성능 고려사항: [캐싱, 최적화 등]"
```

#### 버그 수정 시
```
"버그 수정 컨텍스트:

🐛 문제 상황:
- 컴포넌트: [ComponentName]
- 현상: [구체적인 문제 설명]
- 재현 방법: [단계별 재현 방법]

🔍 분석 방향:
- Uniform Defs 패턴 관점에서 데이터 흐름 추적
- 상태 변화와 반응성 점검  
- SvelteMap/SvelteSet 사용법 확인
- 타입 에러 및 Props 전달 확인

🎯 해결 기준:
- 패턴 일관성 유지
- 부작용 최소화
- 테스트 가능한 해결책"
```

## 🎨 패턴별 컨텍스트 템플릿

### 리스트 컴포넌트 컨텍스트
```
"리스트 컴포넌트 개발 컨텍스트:

📋 표준 리스트 패턴 적용:
- 데이터: T[] 형태의 아이템 배열
- 상태: loading, error, selectedItems, filteredItems
- 액션: select, filter, sort, load, refresh
- UI: 로딩/에러/빈 상태 처리

🎯 성능 최적화:
- 가상 스크롤링 (항목 1000개 이상)
- $derived.by()로 필터링/정렬 메모이제이션  
- SvelteMap으로 선택 상태 관리

🔧 접근성:
- 키보드 네비게이션 (방향키, Enter, Space)
- ARIA 속성 (role, aria-selected, aria-expanded)
- 스크린 리더 지원"
```

### 폼 컴포넌트 컨텍스트
```
"폼 컴포넌트 개발 컨텍스트:

📝 표준 폼 패턴 적용:
- 필드 상태: values, errors, touched, dirty
- 검증: 실시간 검증, 제출 시 검증
- 액션: setValue, validate, submit, reset

🔍 검증 전략:
- 타입 기반 검증 (TypeScript)
- 비즈니스 룰 검증 (도메인 로직)
- 사용자 경험 검증 (debounce, progressive)

💾 데이터 관리:
- 자동 저장 vs 명시적 저장
- 변경 사항 추적 및 경고
- 옵티미스틱 업데이트"
```

### 서비스 레이어 컨텍스트
```
"서비스 개발 컨텍스트:

🔧 서비스 아키텍처:
- 도메인 로직 캡슐화
- API 호출 추상화
- 캐시 전략 구현
- 에러 처리 표준화

📊 성능 최적화:
- SvelteMap 기반 메모리 캐시
- 중복 요청 방지 (request deduplication)  
- Background refresh
- Optimistic updates

🔐 에러 처리:
- Network 에러 vs Business 에러 구분
- 재시도 로직 (exponential backoff)
- 사용자 친화적 에러 메시지"
```

## 🚀 실전 컨텍스트 예시

### UserProfile 컴포넌트 개발
```
"UserProfile 컴포넌트 개발 시작:

🎯 요구사항:
- 사용자 정보 조회 및 편집
- 인라인 편집 모드 지원
- 프로필 이미지 업로드
- 실시간 검증

🏗️ 아키텍처:
state.svelte.ts:
- user: User | null
- editing: boolean  
- saving: boolean
- errors: ValidationError[]
- uploadProgress: number

controller.ts:
- loadUser(userId): 사용자 정보 로드
- toggleEdit(): 편집 모드 토글
- updateField(field, value): 필드 업데이트
- saveChanges(): 변경사항 저장
- uploadImage(file): 이미지 업로드

view.svelte:
- 읽기 모드 vs 편집 모드 UI
- 인라인 편집 폼 필드들
- 이미지 드래그&드롭 업로드
- 저장 상태 표시

🔗 통합:
- UserService와 연동
- ImageUploadService 활용
- ValidationService 사용"
```

### DataTable 컴포넌트 개발
```
"DataTable 컴포넌트 개발 컨텍스트:

🎯 고성능 데이터 테이블:
- 대용량 데이터 (10K+ rows) 지원
- 가상 스크롤링
- 정렬/필터링/검색
- 컬럼 커스터마이징

🏗️ 아키텍처 설계:
state.svelte.ts:
- data: T[]  
- columns: ColumnDef[]
- sortBy: SortConfig
- filters: FilterMap (SvelteMap)
- selection: SelectionSet (SvelteSet)
- viewport: ViewportState

controller.ts:
- 데이터 변환: $derived.by()로 정렬/필터된 데이터
- 가상 스크롤: viewport 계산
- 대량 선택: batch 연산 최적화

성능 임계점:
- 렌더링: 화면에 보이는 행만 DOM 생성
- 메모리: WeakMap으로 행별 메타데이터 캐시
- 계산: Web Worker로 정렬/필터링 (5K+ rows)"
```

## 🎭 역할별 컨텍스트 설정

### 아키텍트 역할
```
"아키텍처 설계 관점으로 작업:

🏗️ 설계 원칙:
- 확장 가능한 구조
- 재사용 가능한 컴포넌트
- 테스트 용이한 구조
- 성능 최적화 고려

📊 기술적 결정:
- 상태 관리 전략  
- 컴포넌트 경계 설정
- 데이터 흐름 설계
- API 인터페이스 정의

🔍 품질 기준:
- 코드 일관성
- 타입 안정성
- 에러 처리 완성도
- 문서화 수준"
```

### 개발자 역할  
```
"실무 개발자 관점으로 작업:

💻 개발 효율성:
- 빠른 개발을 위한 템플릿 활용
- 자주 사용하는 패턴 라이브러리화
- 디버깅 용이한 코드 작성

🔧 실용적 접근:
- 완벽함보다 동작하는 코드 우선
- 점진적 개선 (iterative improvement)
- 실제 사용자 피드백 반영

⚡ 생산성 도구:
- 코드 생성 자동화
- 반복 작업 스크립트화
- 개발 환경 최적화"
```

### 리뷰어 역할
```
"코드 리뷰 관점으로 검토:

🔍 품질 체크포인트:
- Uniform Defs 패턴 준수
- 타입 안정성 확보
- 에러 처리 완성도
- 성능 최적화 적용

📋 리뷰 기준:
- 코드 가독성
- 테스트 커버리지  
- 문서화 상태
- 보안 고려사항

🎯 개선 제안:
- 더 나은 패턴 적용
- 성능 최적화 기회
- 재사용성 향상 방안
- 유지보수성 개선"
```

## 💡 고급 컨텍스트 활용

### 대화형 디버깅
```
"디버깅 세션 시작:

🐛 문제 분석 프로세스:
1. 현상 재현 및 확인
2. 관련 코드 영역 특정
3. 상태 변화 추적
4. 가설 수립 및 검증
5. 해결책 구현 및 테스트

🔍 분석 도구:
- console.log로 상태 추적
- Svelte DevTools로 반응성 확인  
- 브라우저 DevTools로 성능 분석
- TypeScript 컴파일러로 타입 오류 확인

💡 해결 전략:
- 최소한의 재현 케이스 생성
- 단계별 격리 테스트
- 패턴 일관성 유지하며 수정"
```

### 성능 최적화 세션
```
"성능 최적화 컨텍스트:

⚡ 최적화 대상 식별:
- 렌더링 성능 (FCP, LCP)
- 메모리 사용량  
- 네트워크 요청 효율
- 사용자 인터랙션 응답성

🔧 최적화 기법:
- 컴포넌트 레벨: $derived.by(), SvelteMap 활용
- 데이터 레벨: 캐싱, 페이징, 무한 스크롤
- 네트워크 레벨: 배치 요청, prefetching
- 렌더링 레벨: 가상화, lazy loading

📊 측정 기준:
- Core Web Vitals 지표
- 메모리 사용량 추적
- 번들 사이즈 모니터링
- 사용자 경험 지표"
```

이런 컨텍스트 엔지니어링을 통해 AI와의 협업 효율을 크게 향상시킬 수 있습니다. 명확한 컨텍스트는 더 정확하고 유용한 AI 응답을 이끌어냅니다.