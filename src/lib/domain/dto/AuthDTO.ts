/**
 * Authentication request DTO
 */
export interface LoginDTO {
	identity: string;
	password: string;
}

/**
 * Authentication response DTO
 */
export interface AuthResponseDTO {
	token: string;
	record: {
		id: string;
		email: string;
		verified: boolean;
		[key: string]: any;
	};
}

/**
 * User registration DTO
 */
export interface RegisterDTO {
	email: string;
	password: string;
	passwordConfirm: string;
	name?: string;
}

/**
 * Password reset request DTO
 */
export interface PasswordResetDTO {
	email: string;
}
