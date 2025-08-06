import { createCollectionItemState, type CollectionItemProps } from './state.svelte';
import { ChevronDown, ChevronRight, Database, FileText, Users } from 'lucide-svelte';

export const genCollectionItemDefs = (props: CollectionItemProps) => {
	const state = createCollectionItemState();
	
	// Helper functions
	const getCollectionIcon = (type: string) => {
		switch (type) {
			case 'auth':
				return Users;
			case 'base':
				return Database;
			case 'view':
				return FileText;
			default:
				return Database;
		}
	};

	return {
		datas: {
			// Collection data
			collection: () => props.collection,
			collectionIcon: () => getCollectionIcon(props.collection.type),
			
			// States from props
			isSelected: () => props.isSelected || false,
			isPinned: () => props.isPinned || false,
			isExpanded: () => props.isExpanded || false,
			
			// Icons
			ChevronDown: () => ChevronDown,
			ChevronRight: () => ChevronRight,
			
			// Pin display
			pinIcon: () => props.isPinned ? '📌' : '📍',
			pinTitle: () => props.isPinned ? 'Unpin collection' : 'Pin collection'
		},

		states: {
			// Interaction states
			hovered: () => state.hovered,
			pinHovered: () => state.pinHovered,
			toggleHovered: () => state.toggleHovered
		},

		actions: {
			// Main collection actions
			handleSelect: () => {
				if (props.onSelect) {
					props.onSelect(props.collection);
				}
			},
			
			handleTogglePin: (event: Event) => {
				if (props.onTogglePin) {
					props.onTogglePin(event, props.collection.id);
				}
			},
			
			handleToggleRecords: () => {
				if (props.onToggleRecords) {
					props.onToggleRecords(props.collection);
				}
			},
			
			// Hover actions
			onMouseEnter: () => {
				state.setHovered(true);
			},
			
			onMouseLeave: () => {
				state.setHovered(false);
			},
			
			onPinMouseEnter: () => {
				state.setPinHovered(true);
			},
			
			onPinMouseLeave: () => {
				state.setPinHovered(false);
			},
			
			onToggleMouseEnter: () => {
				state.setToggleHovered(true);
			},
			
			onToggleMouseLeave: () => {
				state.setToggleHovered(false);
			}
		}
	};
};