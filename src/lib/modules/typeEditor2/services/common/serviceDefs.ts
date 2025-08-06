import { Container } from '$lib/infrastructure/di/Container';

/**
 * 서비스 간 공통 기능 정의
 */
export const genCommonServiceDefs = () => {
	const container = Container.getInstance();

	return {
		// 공통 인프라 의존성
		infrastructure: {
			container,
			collectionRepository: container.collectionRepository,
			recordRepository: container.recordRepository,
			collectionDAO: container.collectionDAO,
			recordDAO: container.recordDAO
		},

		// 공통 유틸리티
		utils: {
			/**
			 * Collection ID를 Collection Name으로 변환
			 */
			getCollectionNameById: async (collectionId: string): Promise<string | null> => {
				try {
					// 먼저 collectionRepository에서 찾기
					const collections = await container.collectionRepository.findAll();
					const collection = collections.find(c => c.id === collectionId);
					if (collection) {
						return collection.name;
					}
					
					// fallback: collectionDAO 사용
					const collectionFromDAO = await container.collectionDAO.findById(collectionId);
					return collectionFromDAO?.name || null;
				} catch (error) {
					console.error('Failed to get collection name:', error);
					return null;
				}
			},

			/**
			 * ID 형식인지 확인 (PocketBase ID는 15자 랜덤 문자열)
			 */
			isCollectionId: (value: string): boolean => {
				return value.length === 15 && /^[a-zA-Z0-9]+$/.test(value);
			},

			/**
			 * Collection ID나 Name을 Name으로 정규화
			 */
			normalizeCollectionName: async (collectionIdOrName: string): Promise<string | null> => {
				// ID 형식인지 확인 (PocketBase ID는 15자 랜덤 문자열)
				const isId = collectionIdOrName.length === 15 && /^[a-zA-Z0-9]+$/.test(collectionIdOrName);
				if (!isId) {
					return collectionIdOrName; // 이미 name인 경우
				}
				
				// Collection ID를 Name으로 변환
				try {
					// 먼저 collectionRepository에서 찾기
					const collections = await container.collectionRepository.findAll();
					const collection = collections.find(c => c.id === collectionIdOrName);
					if (collection) {
						return collection.name;
					}
					
					// fallback: collectionDAO 사용
					const collectionFromDAO = await container.collectionDAO.findById(collectionIdOrName);
					return collectionFromDAO?.name || null;
				} catch (error) {
					console.error('Failed to get collection name:', error);
					return null;
				}
			},

			/**
			 * 딥 클론
			 */
			deepClone: <T>(obj: T): T => {
				return JSON.parse(JSON.stringify(obj));
			},

			/**
			 * 레코드 데이터 정리 (시스템 필드 제거)
			 */
			cleanRecordData: (data: any): Record<string, any> => {
				const { id, collectionId, collectionName, created, updated, ...cleanData } = data;
				return cleanData;
			},

			/**
			 * 필드 경로로 값 설정
			 */
			setValueByPath: (obj: any, path: string[], value: any): any => {
				const result = JSON.parse(JSON.stringify(obj)); // 직접 딥 클론
				let current = result;
				
				for (let i = 0; i < path.length - 1; i++) {
					const key = path[i];
					if (!(key in current) || typeof current[key] !== 'object') {
						current[key] = {};
					}
					current = current[key];
				}
				
				current[path[path.length - 1]] = value;
				return result;
			},

			/**
			 * 필드 경로로 값 가져오기
			 */
			getValueByPath: (obj: any, path: string[]): any => {
				let current = obj;
				for (const key of path) {
					if (current == null || typeof current !== 'object') {
						return undefined;
					}
					current = current[key];
				}
				return current;
			}
		},

		// 공통 에러 처리
		errorHandlers: {
			/**
			 * PocketBase 유효성 검사 오류 처리
			 */
			handleValidationError: (error: any): { success: false; error: string; validationErrors?: any[] } => {
				if (error.data?.data) {
					const validationErrors = Object.entries(error.data.data).map(
						([field, message]) => ({
							field,
							message: Array.isArray(message) ? message.join(', ') : String(message)
						})
					);
					
					return {
						success: false,
						error: 'Validation failed',
						validationErrors
					};
				}

				return {
					success: false,
					error: error.message || 'Unknown error occurred'
				};
			}
		}
	};
};