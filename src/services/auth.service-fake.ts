// Fake auth service for frontend-only mode
import { fakeClient } from '@/lib/fakeClient';

export interface AuthResponse {
  error: any;
}

export const authService = {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const result = await fakeClient.auth.signIn(email, password);
    return { error: result.error };
  },

  async signUp(email: string, password: string, fullName?: string): Promise<AuthResponse> {
    const result = await fakeClient.auth.signUp(email, password, fullName);
    return { error: result.error };
  },

  async resendConfirmation(_email: string): Promise<AuthResponse> {
    return { error: null };
  },

  async resetPassword(email: string): Promise<AuthResponse> {
    const result = await fakeClient.auth.resetPassword(email);
    return { error: result.error };
  },

  async updatePassword(password: string): Promise<AuthResponse> {
    const result = await fakeClient.auth.updatePassword(password);
    return { error: result.error };
  },

  async signInWithOAuth(_provider: 'google' | 'github'): Promise<AuthResponse> {
    return { error: null };
  },

  async signOut(): Promise<void> {
    await fakeClient.auth.signOut();
  },
};
