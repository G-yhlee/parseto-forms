import type { CollectionEntity } from '$lib/domain/entities/Collection';

export interface CollectionItemProps {
	collection: CollectionEntity;
	isSelected?: boolean;
	isPinned?: boolean;
	isExpanded?: boolean;
	onSelect?: (collection: CollectionEntity) => void;
	onTogglePin?: (event: Event, collectionId: string) => void;
	onToggleRecords?: (collection: CollectionEntity) => void;
}

export const createCollectionItemState = () => {
	// Interaction states
	let hovered = $state(false);
	let pinHovered = $state(false);
	let toggleHovered = $state(false);
	
	return {
		// States
		get hovered() { return hovered; },
		get pinHovered() { return pinHovered; },
		get toggleHovered() { return toggleHovered; },
		
		// Actions
		setHovered: (hover: boolean) => {
			hovered = hover;
		},
		
		setPinHovered: (hover: boolean) => {
			pinHovered = hover;
		},
		
		setToggleHovered: (hover: boolean) => {
			toggleHovered = hover;
		}
	};
};