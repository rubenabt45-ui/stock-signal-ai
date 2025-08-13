
import { authService, AuthResponse } from '@/services/auth.service';

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, fullName?: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<AuthResponse>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  updatePassword: (password: string) => Promise<AuthResponse>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<AuthResponse>;
}

export const createAuthActions = (): AuthActions => ({
  signIn: authService.signIn,
  signUp: authService.signUp,
  signOut: authService.signOut,
  resendConfirmation: authService.resendConfirmation,
  resetPassword: authService.resetPassword,
  updatePassword: authService.updatePassword,
  signInWithOAuth: authService.signInWithOAuth,
});
