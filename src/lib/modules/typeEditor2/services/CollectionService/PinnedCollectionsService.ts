/**
 * 고정된 컬렉션 관리 서비스
 * localStorage를 사용하여 사용자가 고정한 컬렉션을 관리합니다.
 */

const STORAGE_KEY = 'typeEditor.pinnedCollections';

export class PinnedCollectionsService {
	/**
	 * 브라우저 환경인지 확인
	 */
	private static isBrowser(): boolean {
		return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
	}

	/**
	 * 고정된 컬렉션 ID 목록을 가져옵니다
	 */
	static getPinnedCollections(): Set<string> {
		if (!this.isBrowser()) {
			return new Set();
		}

		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (!stored) return new Set();
			
			const parsed = JSON.parse(stored);
			return new Set(Array.isArray(parsed) ? parsed : []);
		} catch (error) {
			console.error('Failed to load pinned collections:', error);
			return new Set();
		}
	}

	/**
	 * 컬렉션을 고정하거나 고정 해제합니다
	 */
	static togglePin(collectionId: string): boolean {
		if (!this.isBrowser()) {
			return false;
		}

		const pinned = this.getPinnedCollections();
		
		if (pinned.has(collectionId)) {
			pinned.delete(collectionId);
		} else {
			pinned.add(collectionId);
		}
		
		this.savePinnedCollections(pinned);
		return pinned.has(collectionId);
	}

	/**
	 * 특정 컬렉션이 고정되어 있는지 확인합니다
	 */
	static isPinned(collectionId: string): boolean {
		if (!this.isBrowser()) {
			return false;
		}

		const pinned = this.getPinnedCollections();
		return pinned.has(collectionId);
	}

	/**
	 * 고정된 컬렉션 목록을 저장합니다
	 */
	private static savePinnedCollections(pinned: Set<string>): void {
		if (!this.isBrowser()) {
			return;
		}

		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(pinned)));
		} catch (error) {
			console.error('Failed to save pinned collections:', error);
		}
	}

	/**
	 * 모든 고정을 해제합니다
	 */
	static clearAllPins(): void {
		if (!this.isBrowser()) {
			return;
		}

		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch (error) {
			console.error('Failed to clear pinned collections:', error);
		}
	}
}