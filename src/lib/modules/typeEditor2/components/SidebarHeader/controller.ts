import { createSidebarHeaderState, type SidebarHeaderProps } from './state.svelte';
import { Database } from 'lucide-svelte';

export const genSidebarHeaderDefs = (props: SidebarHeaderProps = {}) => {
	const state = createSidebarHeaderState();
	
	// Default values
	const defaultProps = {
		title: 'Type Editor',
		subtitle: '',
		icon: Database,
		iconSize: 20,
		...props
	};

	return {
		datas: {
			title: () => defaultProps.title,
			subtitle: () => defaultProps.subtitle,
			icon: () => defaultProps.icon,
			iconSize: () => defaultProps.iconSize
		},

		states: {
			hovered: () => state.hovered
		},

		actions: {
			onMouseEnter: () => {
				state.setHovered(true);
			},
			
			onMouseLeave: () => {
				state.setHovered(false);
			}
		}
	};
};