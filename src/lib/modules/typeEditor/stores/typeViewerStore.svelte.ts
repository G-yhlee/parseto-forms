/**
 * TypeViewer 상태 관리 스토어
 */

import type { TypeViewerState, JsonData } from '../types';
import { TypeViewerService } from '../services/TypeViewerService';

export function createTypeViewerStore() {
	// 기본 샘플 데이터
	const defaultJsonInput = `{
  "bookstore": {
    "name": "City Reads",
    "location": "Downtown",
    "books": [
      {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "details": {
          "genre": "Classic",
          "pages": 180,
          "published_year": 1925
        }
      },
      {
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "details": {
          "genre": "Fiction",
          "pages": 281,
          "published_year": 1960
        }
      }
    ],
    "staff": [
      {
        "name": "Alice Smith",
        "role": "Manager"
      },
      {
        "name": "Bob Johnson",
        "role": "Sales Associate"
      }
    ]
  }
}`;

	// 상태 초기화
	let state = $state<TypeViewerState>({
		jsonInput: defaultJsonInput,
		jsonError: '',
		generatedTypes: '',
		highlightedTypes: '',
		copySuccess: false,
		editMode: false,
		parsedData: null
	});

	// 초기 타입 생성
	const initialResult = TypeViewerService.processJsonInput(defaultJsonInput);
	if (initialResult.success) {
		state.parsedData = initialResult.parsedData!;
		state.generatedTypes = initialResult.generatedTypes!;
		state.highlightedTypes = initialResult.highlightedTypes!;
	}

	return {
		// 읽기 전용 상태
		get jsonInput() {
			return state.jsonInput;
		},
		get jsonError() {
			return state.jsonError;
		},
		get generatedTypes() {
			return state.generatedTypes;
		},
		get highlightedTypes() {
			return state.highlightedTypes;
		},
		get copySuccess() {
			return state.copySuccess;
		},
		get editMode() {
			return state.editMode;
		},
		get parsedData() {
			return state.parsedData;
		},

		// 액션
		generateTypes() {
			const result = TypeViewerService.processJsonInput(state.jsonInput);

			if (result.success) {
				state.jsonError = '';
				state.parsedData = result.parsedData!;
				state.generatedTypes = result.generatedTypes!;
				state.highlightedTypes = result.highlightedTypes!;
			} else {
				state.jsonError = result.error!;
				state.generatedTypes = '';
				state.highlightedTypes = '';
				state.parsedData = null;
			}
		},

		updateJsonInput(newInput: string) {
			state.jsonInput = newInput;
			this.generateTypes();
		},

		updateJsonData(newData: JsonData) {
			const result = TypeViewerService.updateJsonData(newData);
			state.parsedData = newData;
			state.jsonInput = result.jsonInput;
			state.generatedTypes = result.generatedTypes;
			state.highlightedTypes = result.highlightedTypes;
		},

		async copyToClipboard() {
			const success = await TypeViewerService.copyToClipboard(state.generatedTypes);
			state.copySuccess = success;
			if (success) {
				setTimeout(() => (state.copySuccess = false), 2000);
			}
		},

		toggleEditMode() {
			state.editMode = !state.editMode;
		},

		clearInput() {
			state.jsonInput = '';
			this.generateTypes();
		},

		formatJson() {
			state.jsonInput = TypeViewerService.formatJson(state.jsonInput);
			this.generateTypes();
		}
	};
}
