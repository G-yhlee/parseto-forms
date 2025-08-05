import type { LoginDTO, AuthResponseDTO, RegisterDTO, PasswordResetDTO } from '../dto/AuthDTO';

/**
 * Authentication Data Access Object interface
 */
export interface AuthDAO {
  login(credentials: LoginDTO, collection?: string): Promise<AuthResponseDTO>;
  logout(): Promise<void>;
  register(data: RegisterDTO, collection?: string): Promise<AuthResponseDTO>;
  refresh(): Promise<AuthResponseDTO>;
  requestPasswordReset(data: PasswordResetDTO, collection?: string): Promise<boolean>;
  confirmPasswordReset(token: string, password: string, passwordConfirm: string): Promise<boolean>;
  isAuthenticated(): boolean;
  getCurrentUser(): AuthResponseDTO['record'] | null;
}