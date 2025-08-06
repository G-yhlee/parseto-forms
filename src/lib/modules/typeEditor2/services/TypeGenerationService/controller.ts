import { createTypeGenerationServiceState } from './state.svelte';
import { TypeGenerator } from '$lib/modules/typeviewer';
import { createHighlightedCode } from '$lib/modules/typeviewer';
import type { PocketBaseRecord } from '../../types';

export const genTypeGenerationServiceDefs = () => {
	const state = createTypeGenerationServiceState();

	// Helper functions
	const cleanRecordForGeneration = (record: PocketBaseRecord): any => {
		if (!state.includeSystemFields) {
			const { id, collectionId, collectionName, created, updated, ...cleanData } = record;
			return cleanData.data || cleanData;
		}
		return record.data || record;
	};

	const generateAllInterfacesCode = (mainInterface: any): string => {
		const codes: string[] = [];
		
		if (mainInterface.nestedInterfaces) {
			mainInterface.nestedInterfaces.forEach((nested: any) => {
				codes.push(generateAllInterfacesCode(nested));
			});
		}
		
		codes.push(mainInterface.code);
		
		return codes.join('\n\n');
	};

	return {
		datas: {
			// Cache access
			typeCache: () => state.typeCache,
			lastGeneratedTypes: () => state.lastGeneratedTypes,
			lastHighlightedTypes: () => state.lastHighlightedTypes,
			lastError: () => state.lastError,
			
			// Options
			defaultTypeName: () => state.defaultTypeName,
			includeSystemFields: () => state.includeSystemFields,
			prettifyOutput: () => state.prettifyOutput,
			
			// Stats
			cacheStats: () => state.getCacheStats()
		},

		states: {
			generatingTypes: () => state.generatingTypes,
			lastGenerationTime: () => state.lastGenerationTime
		},

		actions: {
			/**
			 * 레코드에서 TypeScript 타입 생성 (캐시 지원)
			 */
			generateTypesFromRecord: (
				record: PocketBaseRecord, 
				typeName?: string, 
				useCache: boolean = true
			): { generatedTypes: string; highlightedTypes: string } => {
				try {
					state.setLastError(null);
					
					const recordKey = state.generateRecordKey(record);
					const actualTypeName = typeName || state.defaultTypeName;
					
					// 캐시 확인
					if (useCache) {
						const cached = state.getCachedTypes(recordKey);
						if (cached) {
							state.setLastGeneratedTypes(cached.generatedTypes);
							state.setLastHighlightedTypes(cached.highlightedTypes);
							return cached;
						}
					}
					
					state.setGeneratingTypes(true);
					
					// 레코드 데이터 정리
					const cleanedRecord = cleanRecordForGeneration(record);
					
					// TypeGenerator를 사용하여 타입 생성
					const typeResult = TypeGenerator.analyzeRecord({ 
						...record, 
						data: cleanedRecord 
					}, actualTypeName);
					
					let generatedTypes = generateAllInterfacesCode(typeResult);
					
					// Prettify if enabled
					if (state.prettifyOutput) {
						// Add some basic formatting improvements
						generatedTypes = generatedTypes
							.replace(/;(\w)/g, ';\n  $1') // Add newlines after semicolons before properties
							.replace(/\{\s*(\w)/g, '{\n  $1') // Add newlines after opening braces
							.replace(/(\w)\s*\}/g, '$1\n}'); // Add newlines before closing braces
					}
					
					// 구문 강조 적용
					const highlightedTypes = createHighlightedCode(generatedTypes);
					
					const result = {
						generatedTypes,
						highlightedTypes
					};
					
					// 캐시 저장
					state.cacheTypes(recordKey, generatedTypes, highlightedTypes);
					
					// 상태 업데이트
					state.setLastGeneratedTypes(generatedTypes);
					state.setLastHighlightedTypes(highlightedTypes);
					state.setLastGenerationTime(Date.now());
					
					return result;
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Failed to generate types';
					state.setLastError(errorMessage);
					console.error('TypeGenerationService.generateTypesFromRecord:', error);
					
					const errorResult = {
						generatedTypes: `// Error generating types: ${errorMessage}`,
						highlightedTypes: `<span class="error">// Error generating types: ${errorMessage}</span>`
					};
					
					state.setLastGeneratedTypes(errorResult.generatedTypes);
					state.setLastHighlightedTypes(errorResult.highlightedTypes);
					
					return errorResult;
				} finally {
					state.setGeneratingTypes(false);
				}
			},

			/**
			 * 여러 레코드에서 통합 타입 생성
			 */
			generateTypesFromRecords: (
				records: PocketBaseRecord[], 
				baseTypeName: string = 'Record'
			): { generatedTypes: string; highlightedTypes: string } => {
				try {
					if (records.length === 0) {
						return { generatedTypes: '', highlightedTypes: '' };
					}
					
					state.setGeneratingTypes(true);
					
					// 첫 번째 레코드를 기준으로 기본 구조 생성
					const baseResult = genTypeGenerationServiceDefs().actions.generateTypesFromRecord(
						records[0], 
						baseTypeName, 
						false // 캐시 사용 안 함 (여러 레코드 합성이므로)
					);
					
					// TODO: 여러 레코드의 스키마를 병합하는 로직 구현
					// 현재는 첫 번째 레코드만 사용하지만, 향후 모든 레코드의 필드를 분석하여 
					// 통합된 인터페이스를 생성하도록 확장 가능
					
					return baseResult;
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Failed to generate types from records';
					state.setLastError(errorMessage);
					console.error('TypeGenerationService.generateTypesFromRecords:', error);
					
					return {
						generatedTypes: `// Error: ${errorMessage}`,
						highlightedTypes: `<span class="error">// Error: ${errorMessage}</span>`
					};
				} finally {
					state.setGeneratingTypes(false);
				}
			},

			/**
			 * 설정 관리
			 */
			setOptions: (options: {
				defaultTypeName?: string;
				includeSystemFields?: boolean;
				prettifyOutput?: boolean;
			}) => {
				if (options.defaultTypeName !== undefined) {
					state.setDefaultTypeName(options.defaultTypeName);
				}
				if (options.includeSystemFields !== undefined) {
					state.setIncludeSystemFields(options.includeSystemFields);
				}
				if (options.prettifyOutput !== undefined) {
					state.setPrettifyOutput(options.prettifyOutput);
				}
			},

			getOptions: () => ({
				defaultTypeName: state.defaultTypeName,
				includeSystemFields: state.includeSystemFields,
				prettifyOutput: state.prettifyOutput
			}),

			/**
			 * 캐시 관리
			 */
			clearCache: () => {
				state.clearCache();
			},

			/**
			 * 클립보드에 복사
			 */
			copyTypesToClipboard: async (types?: string): Promise<boolean> => {
				try {
					const textToCopy = types || state.lastGeneratedTypes;
					if (!textToCopy) {
						return false;
					}
					
					await navigator.clipboard.writeText(textToCopy);
					return true;
				} catch (error) {
					console.error('Failed to copy types to clipboard:', error);
					return false;
				}
			},

			/**
			 * 타입 내보내기 (다운로드)
			 */
			exportTypes: (types?: string, filename: string = 'generated-types.ts') => {
				try {
					const textToExport = types || state.lastGeneratedTypes;
					if (!textToExport) {
						return false;
					}
					
					const blob = new Blob([textToExport], { type: 'text/typescript' });
					const url = URL.createObjectURL(blob);
					
					const a = document.createElement('a');
					a.href = url;
					a.download = filename;
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					
					URL.revokeObjectURL(url);
					return true;
				} catch (error) {
					console.error('Failed to export types:', error);
					return false;
				}
			}
		}
	};
};