export interface SidebarHeaderProps {
	title?: string;
	subtitle?: string;
	icon?: any;
	iconSize?: number;
}

export const createSidebarHeaderState = () => {
	// 헤더는 주로 정적이므로 많은 상태가 필요하지 않음
	let hovered = $state(false);
	
	return {
		// States
		get hovered() { return hovered; },
		
		// Actions
		setHovered: (hover: boolean) => {
			hovered = hover;
		}
	};
};